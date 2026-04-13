import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as studentService from '../services/student-service';
import { authMiddleware, requireProfessor } from '../middleware/auth';
import { emailSchema, phoneSchema } from '../utils/validation';
import { HttpError } from '../middleware/error';

const router = Router();

const statusEnum = z.enum(['ativo', 'inativo', 'parado']);
const idSchema = z.string().min(1, 'ID inválido');
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Data inválida');

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: statusEnum.optional(),
  search: z.string().trim().min(1).optional(),
});

const createStudentSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: emailSchema,
  phone: phoneSchema,
  dateOfBirth: dateSchema.optional(),
  status: statusEnum.optional(),
});

const updateStudentSchema = createStudentSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  'Pelo menos um campo deve ser informado'
);

const parseBody = <T>(schema: z.ZodSchema<T>, body: unknown): T => {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new HttpError(400, 'INVALID_BODY', 'Dados inválidos', result.error.flatten());
  }
  return result.data;
};

const parseParams = <T>(schema: z.ZodSchema<T>, params: unknown): T => {
  const result = schema.safeParse(params);
  if (!result.success) {
    throw new HttpError(400, 'INVALID_PARAMS', 'Parâmetros inválidos', result.error.flatten());
  }
  return result.data;
};

/**
 * GET /students
 * List all students with pagination and filters
 */
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = parseBody(listQuerySchema, req.query);

    const result = await studentService.listStudents(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /students/:id
 * Get student by ID with related data
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const student = await studentService.getStudentById(id);
    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /students
 * Create new student
 */
router.post('/', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, dateOfBirth, status } = parseBody(createStudentSchema, req.body);

    const student = await studentService.createStudent(
      {
        name,
        email,
        phone,
        dateOfBirth,
        status,
      },
      req.user?.userId || ''
    );

    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /students/:id
 * Update student
 */
router.put('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const { name, email, phone, dateOfBirth, status } = parseBody(updateStudentSchema, req.body);

    const student = await studentService.updateStudent(id, {
      name,
      email,
      phone,
      dateOfBirth,
      status,
    });

    res.status(200).json(student);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /students/:id
 * Delete student (soft delete)
 */
router.delete('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const student = await studentService.deleteStudent(id);
    res.status(200).json({
      message: 'Aluno removido com sucesso',
      student,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
