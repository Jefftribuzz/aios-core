import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth-service';
import { authMiddleware } from '../middleware/auth';
import { HttpError } from '../middleware/error';
import { emailSchema, passwordSchema } from '../utils/validation';

const router = Router();

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: emailSchema,
  password: passwordSchema,
  role: z.string().optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'refreshToken é obrigatório'),
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
  newPassword: passwordSchema,
});

const parseBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body);

  if (!result.success) {
    const details = result.error.flatten();
    throw new HttpError(400, 'INVALID_BODY', 'Dados inválidos', details);
  }

  return result.data;
};

/**
 * POST /auth/login
 * Login with email and password
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = parseBody(loginSchema, req.body);

    const result = await authService.loginUser({ email, password });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/register
 * Register a new user (admin only typically)
 */
router.post('/register', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.user?.role !== 'admin') {
      throw new HttpError(
        403,
        'FORBIDDEN',
        'Apenas administradores podem registrar novos usuários'
      );
    }

    const { name, email, password, role } = parseBody(registerSchema, req.body);

    const result = await authService.registerUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/me
 * Get current authenticated user
 */
router.get('/me', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new HttpError(401, 'UNAUTHORIZED', 'Autenticação necessária');
    }

    const user = await authService.getCurrentUser(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout
 * Logout user
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = parseBody(refreshSchema, req.body);

    await authService.logoutUser(refreshToken);

    res.status(200).json({
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/refresh
 * Renew access (and refresh) tokens
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = parseBody(refreshSchema, req.body);

    const result = await authService.refreshSession(refreshToken);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/forgot-password
 * Request password reset link
 */
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = parseBody(forgotPasswordSchema, req.body);

    const result = await authService.requestPasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /auth/reset-password
 * Reset password with token
 */
router.put('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, newPassword } = parseBody(resetPasswordSchema, req.body);

    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
