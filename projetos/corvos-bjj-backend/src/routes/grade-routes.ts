import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as gradeService from '../services/grade-service';
import { authMiddleware, requireProfessor } from '../middleware/auth';
import { HttpError } from '../middleware/error';

const idSchema = z.string().min(1, 'ID inválido');
const beltEnum = z.enum(['branca', 'azul', 'roxa', 'marrom', 'preta']);
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Data inválida');

const createGradeSchema = z.object({
  beltColor: beltEnum,
  promotionDate: dateSchema,
  notes: z.string().optional(),
});

const updateGradeSchema = createGradeSchema.partial().refine(
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

const router = Router();

/**
 * GET /grades/:id
 * Get grade by ID
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const grade = await gradeService.getGradeById(id);
    res.status(200).json(grade);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /grades/student/:studentId
 * Get grade history for a student
 */
router.get('/student/:studentId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = parseParams(z.object({ studentId: idSchema }), req.params);
    const grades = await gradeService.getStudentGrades(studentId);
    res.status(200).json({
      data: grades,
      studentId,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /students/:studentId/grades
 * Create grade/promotion for student
 */
router.post('/student/:studentId/create', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = parseParams(z.object({ studentId: idSchema }), req.params);
    const { beltColor, promotionDate, notes } = parseBody(createGradeSchema, req.body);

    const grade = await gradeService.createGrade(
      studentId,
      {
        beltColor,
        promotionDate,
        notes,
      },
      req.user?.userId || ''
    );

    res.status(201).json(grade);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /grades/:id
 * Update grade
 */
router.put('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const { beltColor, promotionDate, notes } = parseBody(updateGradeSchema, req.body);

    const grade = await gradeService.updateGrade(id, {
      beltColor,
      promotionDate,
      notes,
    });

    res.status(200).json(grade);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /grades/:id
 * Delete grade
 */
router.delete('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const grade = await gradeService.deleteGrade(id);
    res.status(200).json({
      message: 'Registro de faixa removido com sucesso',
      grade,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /grades/stats
 * Get grade statistics
 */
router.get('/stats/distribution', authMiddleware, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await gradeService.getGradeStatistics();
    res.status(200).json({
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
