import request from 'supertest';
import type { PrismaClient } from '@prisma/client';
import type { Express } from 'express';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://corvos:corvos_secure_pass_2026@localhost:5432/corvos_bjj_dev';

let app: Express;
let prisma: PrismaClient;
let hashPassword: (password: string) => Promise<string>;

beforeAll(async () => {
  process.env.DATABASE_URL = DATABASE_URL;
  const serverModule = await import('../../server');
  const prismaModule = await import('@prisma/client');
  const passwordUtils = await import('../../utils/password');

  app = serverModule.default;
  const PrismaClientCtor = prismaModule.PrismaClient;
  prisma = new PrismaClientCtor();
  hashPassword = passwordUtils.hashPassword;
});

const adminEmail = 'admin@corvosbjj.com';
const adminOriginalPassword = 'admin123456';

const loginAndGetTokens = async (email: string, password: string) => {
  const res = await request(app).post('/auth/login').send({ email, password });
  expect(res.status).toBe(200);
  expect(res.body.token).toBeTruthy();
  expect(res.body.refreshToken).toBeTruthy();
  return res.body.refreshToken as string;
};

describe('Auth integration', () => {
  afterAll(async () => {
    // Restore admin password to original after tests to keep seeds consistent
    const passwordHash = await hashPassword(adminOriginalPassword);
    await prisma.user.update({
      where: { email: adminEmail },
      data: { passwordHash },
    });
    await prisma.$disconnect();
  });

  it('refreshes tokens using a valid refresh token', async () => {
    const refreshToken = await loginAndGetTokens(adminEmail, adminOriginalPassword);

    const res = await request(app).post('/auth/refresh').send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.refreshToken).toBeTruthy();
    expect(res.body.user.email).toBe(adminEmail);
  });

  it('returns reset token in non-production forgot-password flow', async () => {
    const res = await request(app).post('/auth/forgot-password').send({ email: adminEmail });

    expect(res.status).toBe(200);
    expect(res.body.message).toBeTruthy();
    expect(res.body.resetToken).toBeTruthy();
  });

  it('rejects refresh without refreshToken', async () => {
    const res = await request(app).post('/auth/refresh').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('rejects forgot-password with invalid email', async () => {
    const res = await request(app).post('/auth/forgot-password').send({ email: 'invalid' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('rejects reset-password with missing fields', async () => {
    const res = await request(app).put('/auth/reset-password').send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('resets password with token and allows login with the new password', async () => {
    // Request reset token
    const forgot = await request(app)
      .post('/auth/forgot-password')
      .send({ email: adminEmail });

    expect(forgot.status).toBe(200);
    const resetToken = forgot.body.resetToken as string;
    expect(resetToken).toBeTruthy();

    const newPassword = 'TempPass123A';

    // Reset password
    const reset = await request(app)
      .put('/auth/reset-password')
      .send({ token: resetToken, newPassword });

    expect(reset.status).toBe(200);
    expect(reset.body.user.email).toBe(adminEmail);
    expect(reset.body.token).toBeTruthy();

    // Login with the new password to confirm
    const loginRes = await request(app)
      .post('/auth/login')
      .send({ email: adminEmail, password: newPassword });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();
  });
});
