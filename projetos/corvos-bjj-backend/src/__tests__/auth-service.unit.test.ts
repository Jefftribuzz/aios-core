import { HttpError } from '../middleware/error';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  session: {
    create: jest.fn(),
    findFirst: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

const mockComparePassword = jest.fn();
const mockHashPassword = jest.fn();
const mockGenerateAccessToken = jest.fn();
const mockGenerateRefreshToken = jest.fn();
const mockGeneratePasswordResetToken = jest.fn();
const mockVerifyToken = jest.fn();
const mockVerifyPasswordResetToken = jest.fn();
const mockValidateEmail = jest.fn();
const mockValidatePassword = jest.fn();
const mockSendMail = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('../utils/password', () => ({
  comparePassword: (...args: unknown[]) => mockComparePassword(...args),
  hashPassword: (...args: unknown[]) => mockHashPassword(...args),
}));

jest.mock('../utils/jwt', () => ({
  generateAccessToken: (...args: unknown[]) => mockGenerateAccessToken(...args),
  generateRefreshToken: (...args: unknown[]) => mockGenerateRefreshToken(...args),
  generatePasswordResetToken: (...args: unknown[]) => mockGeneratePasswordResetToken(...args),
  verifyToken: (...args: unknown[]) => mockVerifyToken(...args),
  verifyPasswordResetToken: (...args: unknown[]) => mockVerifyPasswordResetToken(...args),
}));

jest.mock('../utils/validation', () => ({
  validateEmail: (...args: unknown[]) => mockValidateEmail(...args),
  validatePassword: (...args: unknown[]) => mockValidatePassword(...args),
}));

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {
    createTransport: jest.fn(() => ({
      sendMail: (...args: unknown[]) => mockSendMail(...args),
    })),
  },
}));

import * as authService from '../services/auth-service';

describe('auth-service unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.NODE_ENV;
    delete process.env.EMAIL_FROM;
    delete process.env.EMAIL_API_KEY;
    delete process.env.FRONTEND_URL;

    mockValidateEmail.mockReturnValue({ valid: true });
    mockValidatePassword.mockReturnValue({ valid: true });
    mockGenerateAccessToken.mockReturnValue('access-token');
    mockGenerateRefreshToken.mockReturnValue('refresh-token');
    mockGeneratePasswordResetToken.mockReturnValue('reset-token');
    mockHashPassword.mockResolvedValue('hashed-password');
    mockComparePassword.mockResolvedValue(true);
    mockVerifyToken.mockReturnValue({ userId: 'u1', email: 'user@mail.com', role: 'professor' });
    mockVerifyPasswordResetToken.mockReturnValue({ userId: 'u1', email: 'user@mail.com' });
    mockPrisma.session.create.mockResolvedValue({ id: 's1' });
    mockPrisma.session.update.mockResolvedValue({ id: 's1' });
    mockPrisma.session.updateMany.mockResolvedValue({ count: 1 });
    mockPrisma.session.deleteMany.mockResolvedValue({ count: 1 });
    mockSendMail.mockResolvedValue({ messageId: 'm1' });
  });

  it('loginUser falha com email inválido', async () => {
    mockValidateEmail.mockReturnValue({ valid: false, error: 'email ruim' });

    await expect(authService.loginUser({ email: 'x', password: '12345678' })).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_EMAIL',
    });
  });

  it('loginUser falha sem usuário', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.loginUser({ email: 'user@mail.com', password: '12345678' })).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('loginUser falha com usuário inativo', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: false,
      passwordHash: 'hash',
    });

    await expect(authService.loginUser({ email: 'user@mail.com', password: '12345678' })).rejects.toMatchObject({
      statusCode: 403,
      code: 'USER_INACTIVE',
    });
  });

  it('loginUser falha com senha inválida', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: true,
      passwordHash: 'hash',
    });
    mockComparePassword.mockResolvedValue(false);

    await expect(authService.loginUser({ email: 'user@mail.com', password: 'wrongpass' })).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_CREDENTIALS',
    });
  });

  it('loginUser retorna tokens com sucesso', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: true,
      passwordHash: 'hash',
    });

    const result = await authService.loginUser({ email: 'user@mail.com', password: '12345678' });

    expect(result.token).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(mockPrisma.session.create).toHaveBeenCalled();
  });

  it('registerUser falha com senha inválida', async () => {
    mockValidatePassword.mockReturnValue({ valid: false, error: 'senha fraca' });

    await expect(
      authService.registerUser({ name: 'User', email: 'user@mail.com', password: '123', role: 'professor' })
    ).rejects.toMatchObject({ statusCode: 400, code: 'INVALID_PASSWORD' });
  });

  it('registerUser falha com email já cadastrado', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1' });

    await expect(
      authService.registerUser({ name: 'User', email: 'user@mail.com', password: 'Strong1234', role: 'professor' })
    ).rejects.toMatchObject({ statusCode: 409, code: 'EMAIL_ALREADY_EXISTS' });
  });

  it('registerUser cria usuário e sessão com sucesso', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockResolvedValue({
      id: 'u2',
      email: 'new@mail.com',
      name: 'New User',
      role: 'professor',
    });

    const result = await authService.registerUser({
      name: 'New User',
      email: 'new@mail.com',
      password: 'Strong1234',
      role: 'professor',
    });

    expect(result.user.id).toBe('u2');
    expect(mockHashPassword).toHaveBeenCalled();
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

  it('refreshSession falha com token inválido', async () => {
    mockVerifyToken.mockReturnValue(null);

    await expect(authService.refreshSession('bad')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH',
    });
  });

  it('refreshSession falha com sessão inválida', async () => {
    mockPrisma.session.findFirst.mockResolvedValue(null);

    await expect(authService.refreshSession('refresh-token')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH',
    });
  });

  it('refreshSession falha com usuário ausente', async () => {
    mockPrisma.session.findFirst.mockResolvedValue({ id: 's1', userId: 'u1' });
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.refreshSession('refresh-token')).rejects.toMatchObject({
      statusCode: 401,
      code: 'INVALID_REFRESH',
    });
  });

  it('refreshSession falha com usuário inativo', async () => {
    mockPrisma.session.findFirst.mockResolvedValue({ id: 's1', userId: 'u1' });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: false,
    });

    await expect(authService.refreshSession('refresh-token')).rejects.toMatchObject({
      statusCode: 403,
      code: 'USER_INACTIVE',
    });
  });

  it('refreshSession renova sessão com sucesso', async () => {
    mockPrisma.session.findFirst.mockResolvedValue({ id: 's1', userId: 'u1' });
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: true,
    });

    const result = await authService.refreshSession('refresh-token');

    expect(result.token).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(mockPrisma.session.update).toHaveBeenCalled();
  });

  it('logoutUser expira sessão', async () => {
    await authService.logoutUser('refresh-token');

    expect(mockPrisma.session.updateMany).toHaveBeenCalled();
  });

  it('requestPasswordReset falha com email inválido', async () => {
    mockValidateEmail.mockReturnValue({ valid: false, error: 'email ruim' });

    await expect(authService.requestPasswordReset('x')).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_EMAIL',
    });
  });

  it('requestPasswordReset retorna mensagem neutra sem usuário', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const result = await authService.requestPasswordReset('missing@mail.com');

    expect(result.message).toContain('Se o email existir');
  });

  it('requestPasswordReset falha para usuário inativo', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      isActive: false,
    });

    await expect(authService.requestPasswordReset('user@mail.com')).rejects.toMatchObject({
      statusCode: 403,
      code: 'USER_INACTIVE',
    });
  });

  it('requestPasswordReset retorna token em dev', async () => {
    process.env.NODE_ENV = 'development';
    process.env.FRONTEND_URL = 'http://frontend.test';
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@mail.com', isActive: true });

    const result = await authService.requestPasswordReset('user@mail.com');

    expect(result.resetToken).toBe('reset-token');
    expect(result.resetUrl).toContain('http://frontend.test');
  });

  it('requestPasswordReset falha em produção sem config de email', async () => {
    process.env.NODE_ENV = 'production';
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@mail.com', isActive: true });

    await expect(authService.requestPasswordReset('user@mail.com')).rejects.toMatchObject({
      statusCode: 500,
      code: 'EMAIL_CONFIG_MISSING',
    });
  });

  it('requestPasswordReset envia email em produção quando configurado', async () => {
    process.env.NODE_ENV = 'production';
    process.env.EMAIL_FROM = 'noreply@corvos.dev';
    process.env.EMAIL_API_KEY = 'k';
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@mail.com', isActive: true });

    const result = await authService.requestPasswordReset('user@mail.com');

    expect(result.message).toContain('Se o email existir');
    expect(mockSendMail).toHaveBeenCalled();
  });

  it('resetPassword falha com token inválido', async () => {
    mockVerifyPasswordResetToken.mockReturnValue(null);

    await expect(authService.resetPassword('bad', 'Strong1234')).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_TOKEN',
    });
  });

  it('resetPassword falha com senha inválida', async () => {
    mockValidatePassword.mockReturnValue({ valid: false, error: 'senha fraca' });

    await expect(authService.resetPassword('token', '123')).rejects.toMatchObject({
      statusCode: 400,
      code: 'INVALID_PASSWORD',
    });
  });

  it('resetPassword falha com usuário inexistente', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.resetPassword('token', 'Strong1234')).rejects.toMatchObject({
      statusCode: 404,
      code: 'USER_NOT_FOUND',
    });
  });

  it('resetPassword falha com usuário inativo', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 'u1', email: 'user@mail.com', role: 'professor', isActive: false });

    await expect(authService.resetPassword('token', 'Strong1234')).rejects.toMatchObject({
      statusCode: 403,
      code: 'USER_INACTIVE',
    });
  });

  it('resetPassword redefine senha e cria nova sessão', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: true,
    });

    const result = await authService.resetPassword('token', 'Strong1234');

    expect(result.token).toBe('access-token');
    expect(mockPrisma.user.update).toHaveBeenCalled();
    expect(mockPrisma.session.deleteMany).toHaveBeenCalled();
    expect(mockPrisma.session.create).toHaveBeenCalled();
  });

  it('getCurrentUser falha quando usuário não existe', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await expect(authService.getCurrentUser('u404')).rejects.toBeInstanceOf(HttpError);
  });

  it('getCurrentUser retorna dados quando existe', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'user@mail.com',
      name: 'User',
      role: 'professor',
      isActive: true,
      createdAt: new Date(),
    });

    const result = await authService.getCurrentUser('u1');

    expect(result.id).toBe('u1');
    expect(result.email).toBe('user@mail.com');
  });
});
