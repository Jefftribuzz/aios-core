import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/password';
import {
  generateAccessToken,
  generateRefreshToken,
  generatePasswordResetToken,
  verifyToken,
  verifyPasswordResetToken,
  TokenPayload,
} from '../utils/jwt';
import { validateEmail, validatePassword } from '../utils/validation';
import { HttpError } from '../middleware/error';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface RefreshResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

/**
 * Authenticate user with email and password
 */
export async function loginUser(req: LoginRequest): Promise<LoginResponse> {
  const { email, password } = req;

  // Validate email format
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new HttpError(400, 'INVALID_EMAIL', emailValidation.error || 'Email inválido');
  }

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email ou senha inválidos');
  }

  if (!user.isActive) {
    throw new HttpError(403, 'USER_INACTIVE', 'Usuário inativo');
  }

  // Check password
  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email ou senha inválidos');
  }

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token to database (optional)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken,
  };
}

/**
 * Register a new user (admin only)
 */
export async function registerUser(req: RegisterRequest): Promise<LoginResponse> {
  const { name, email, password, role = 'professor' } = req;

  // Validate email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new HttpError(400, 'INVALID_EMAIL', emailValidation.error || 'Email inválido');
  }

  // Validate password
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    throw new HttpError(
      400,
      'INVALID_PASSWORD',
      passwordValidation.error || 'Senha inválida'
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new HttpError(409, 'EMAIL_ALREADY_EXISTS', 'Email já cadastrado');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role,
    },
  });

  // Generate tokens
  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const token = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Save refresh token to database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken: refreshToken,
      expiresAt: expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
    refreshToken,
  };
}

/**
 * Refresh session using refresh token
 */
export async function refreshSession(refreshToken: string): Promise<RefreshResponse> {
  const decoded = verifyToken(refreshToken);

  if (!decoded) {
    throw new HttpError(401, 'INVALID_REFRESH', 'Refresh token inválido ou expirado');
  }

  const session = await prisma.session.findFirst({
    where: {
      refreshToken,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!session) {
    throw new HttpError(401, 'INVALID_REFRESH', 'Sessão expirada ou inválida');
  }

  const userId = session.userId || decoded.userId;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw new HttpError(401, 'INVALID_REFRESH', 'Usuário não encontrado para a sessão');
  }

  if (!user.isActive) {
    throw new HttpError(403, 'USER_INACTIVE', 'Usuário inativo');
  }

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  const newExpiry = new Date();
  newExpiry.setDate(newExpiry.getDate() + 7);

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshToken: newRefreshToken,
      expiresAt: newExpiry,
      updatedAt: new Date(),
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

/**
 * Logout user by invalidating refresh token
 */
export async function logoutUser(refreshToken: string): Promise<void> {
  await prisma.session.updateMany({
    where: { refreshToken },
    data: { expiresAt: new Date() }, // Mark as expired
  });
}

/**
 * Initiate password reset flow
 */
export async function requestPasswordReset(email: string) {
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new HttpError(400, 'INVALID_EMAIL', emailValidation.error || 'Email inválido');
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Do not reveal user existence
  if (!user) {
    return {
      message: 'Se o email existir, enviaremos instruções para resetar a senha.',
    };
  }

  if (!user.isActive) {
    throw new HttpError(403, 'USER_INACTIVE', 'Usuário inativo');
  }

  const resetToken = generatePasswordResetToken({ userId: user.id, email: user.email });

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password?token=${resetToken}`;

  // In produção, enviar email. Aqui retornamos token em ambiente de dev para facilitar QA.
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    return {
      message: 'Se o email existir, enviaremos instruções para resetar a senha.',
      resetToken,
      resetUrl,
    };
  }

  const emailFrom = process.env.EMAIL_FROM;
  const emailApiKey = process.env.EMAIL_API_KEY;
  const emailService = process.env.EMAIL_SERVICE || 'sendgrid';

  if (!emailFrom || !emailApiKey) {
    throw new HttpError(500, 'EMAIL_CONFIG_MISSING', 'Configuração de email ausente para envio de reset.');
  }

  const transporter = nodemailer.createTransport({
    service: emailService,
    auth: {
      user: 'apikey',
      pass: emailApiKey,
    },
  });

  await transporter.sendMail({
    from: emailFrom,
    to: email,
    subject: 'Reset de senha - Corvos BJJ',
    text: `Para resetar sua senha, acesse: ${resetUrl}`,
    html: `<p>Você solicitou a troca de senha.</p><p><a href="${resetUrl}">Clique aqui para resetar</a></p><p>Se não foi você, ignore este email.</p>`,
  });

  return {
    message: 'Se o email existir, enviaremos instruções para resetar a senha.',
  };
}

/**
 * Reset password using token
 */
export async function resetPassword(token: string, newPassword: string): Promise<LoginResponse> {
  const payload = verifyPasswordResetToken(token);

  if (!payload) {
    throw new HttpError(400, 'INVALID_TOKEN', 'Token inválido ou expirado');
  }

  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.valid) {
    throw new HttpError(400, 'INVALID_PASSWORD', passwordValidation.error || 'Senha inválida');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user) {
    throw new HttpError(404, 'USER_NOT_FOUND', 'Usuário não encontrado');
  }

  if (!user.isActive) {
    throw new HttpError(403, 'USER_INACTIVE', 'Usuário inativo');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: hashedPassword,
    },
  });

  // Invalidate previous sessions
  await prisma.session.deleteMany({ where: { userId: user.id } });

  const tokenPayload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt,
    },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token: accessToken,
    refreshToken,
  };
}

/**
 * Get current user by ID
 */
export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new HttpError(404, 'USER_NOT_FOUND', 'Usuário não encontrado');
  }

  return user;
}
