import request from 'supertest';
import type { PrismaClient } from '@prisma/client';
import type { Express } from 'express';

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://corvos:corvos_secure_pass_2026@localhost:5432/corvos_bjj_dev';

let app: Express;
let prisma: PrismaClient;
let professorToken: string;
let professorRefreshToken: string;
let createdStudentId: string;
let createdPaymentId: string;
let createdGradeId: string;

const professorCreds = {
  email: 'professor@corvosbjj.com',
  password: 'professor123456',
};

beforeAll(async () => {
  process.env.DATABASE_URL = DATABASE_URL;
  const serverModule = await import('../../server');
  const prismaModule = await import('@prisma/client');

  app = serverModule.default;
  const PrismaClientCtor = prismaModule.PrismaClient;
  prisma = new PrismaClientCtor();

  const professorLogin = await request(app).post('/auth/login').send(professorCreds);
  expect(professorLogin.status).toBe(200);
  professorToken = professorLogin.body.token as string;
  professorRefreshToken = professorLogin.body.refreshToken as string;

  // Create a student for payment/grade scenarios
  const uniqueEmail = `integration-${Date.now()}@example.com`;
  const studentRes = await request(app)
    .post('/students')
    .set('Authorization', `Bearer ${professorToken}`)
    .send({
      name: 'Aluno Integração',
      email: uniqueEmail,
      phone: '11900001111',
      dateOfBirth: '2000-01-01',
      status: 'ativo',
    });

  expect(studentRes.status).toBe(201);
  createdStudentId = studentRes.body.id as string;
});

afterAll(async () => {
  // Cleanup created data
  if (createdGradeId) {
    await prisma.grade.deleteMany({ where: { id: createdGradeId } });
  }

  if (createdPaymentId) {
    await prisma.payment.deleteMany({ where: { id: createdPaymentId } });
  }

  if (createdStudentId) {
    await prisma.student.deleteMany({ where: { id: createdStudentId } });
  }

  await prisma.$disconnect();
});

describe('Auth negative scenarios', () => {
  it('rejects refresh when session is invalidated', async () => {
    // Invalidate the stored refresh token
    await prisma.session.deleteMany({ where: { refreshToken: professorRefreshToken } });

    const res = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: professorRefreshToken });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('INVALID_REFRESH');
  });

  it('rejects reset-password with invalid token', async () => {
    const res = await request(app)
      .put('/auth/reset-password')
      .send({ token: 'invalid-token', newPassword: 'TempPass123A' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_TOKEN');
  });
});

describe('Student routes', () => {
  it('lists students with pagination', async () => {
    const res = await request(app)
      .get('/students?page=1&limit=5')
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('gets student by id', async () => {
    const res = await request(app)
      .get(`/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdStudentId);
  });

  it('rejects student creation with invalid status', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        name: 'Aluno Status Inválido',
        email: `invalid-status-${Date.now()}@example.com`,
        status: 'weird',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('creates a student successfully', async () => {
    const res = await request(app)
      .post('/students')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        name: 'Aluno Feliz',
        email: `happy-${Date.now()}@example.com`,
        phone: '11911112222',
        dateOfBirth: '2001-02-02',
        status: 'ativo',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();

    // Cleanup the extra student
    await prisma.student.deleteMany({ where: { id: res.body.id as string } });
  });

  it('updates a student successfully', async () => {
    const res = await request(app)
      .put(`/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        name: 'Aluno Integração Editado',
        status: 'inativo',
      });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Aluno Integração Editado');
    expect(res.body.status).toBe('inativo');
  });
});

describe('Payment routes', () => {
  it('lists payments with filters', async () => {
    const res = await request(app)
      .get('/payments?page=1&limit=5&status=pendente')
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination).toBeDefined();
  });

  it('rejects payment creation with amount <= 0', async () => {
    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        studentId: createdStudentId,
        amount: 0,
        dueDate: '2024-05-10',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('creates a payment successfully', async () => {
    const res = await request(app)
      .post('/payments')
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        studentId: createdStudentId,
        amount: 200,
        dueDate: '2024-05-10',
        status: 'pendente',
        referenceMonth: '2024-05',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.studentId).toBe(createdStudentId);

    createdPaymentId = res.body.id as string;
  });

  it('gets payment by id', async () => {
    const res = await request(app)
      .get(`/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdPaymentId);
  });

  it('updates payment status successfully', async () => {
    const res = await request(app)
      .put(`/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        status: 'pago',
        paymentMethod: 'pix',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('pago');
  });

  it('lists student payments', async () => {
    const res = await request(app)
      .get(`/payments/student/${createdStudentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Grade routes', () => {
  it('rejects grade creation with invalid belt', async () => {
    const res = await request(app)
      .post(`/grades/student/${createdStudentId}/create`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        beltColor: 'pink',
        promotionDate: '2024-06-01',
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('INVALID_BODY');
  });

  it('creates a grade successfully', async () => {
    const res = await request(app)
      .post(`/grades/student/${createdStudentId}/create`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        beltColor: 'azul',
        promotionDate: '2024-06-01',
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();
    expect(res.body.studentId).toBe(createdStudentId);

    createdGradeId = res.body.id as string;
  });

  it('gets grade by id', async () => {
    const res = await request(app)
      .get(`/grades/${createdGradeId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdGradeId);
  });

  it('lists grades by student', async () => {
    const res = await request(app)
      .get(`/grades/student/${createdStudentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('updates a grade successfully', async () => {
    const res = await request(app)
      .put(`/grades/${createdGradeId}`)
      .set('Authorization', `Bearer ${professorToken}`)
      .send({
        notes: 'Atualizado em teste',
      });

    expect(res.status).toBe(200);
    expect(res.body.notes).toBe('Atualizado em teste');
  });

  it('returns grade distribution stats', async () => {
    const res = await request(app)
      .get('/grades/stats/distribution')
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe('Delete routes', () => {
  it('deletes grade successfully', async () => {
    const res = await request(app)
      .delete(`/grades/${createdGradeId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    createdGradeId = '';
  });

  it('deletes payment successfully', async () => {
    const res = await request(app)
      .delete(`/payments/${createdPaymentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    createdPaymentId = '';
  });

  it('deletes student successfully', async () => {
    const res = await request(app)
      .delete(`/students/${createdStudentId}`)
      .set('Authorization', `Bearer ${professorToken}`);

    expect(res.status).toBe(200);
    createdStudentId = '';
  });
});