import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as paymentService from '../services/payment-service';
import { authMiddleware, requireProfessor } from '../middleware/auth';
import { HttpError } from '../middleware/error';

const router = Router();

const idSchema = z.string().min(1, 'ID inválido');
const statusEnum = z.enum(['pago', 'pendente', 'atrasado']);
const dateSchema = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Data inválida');
const referenceMonthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, 'referenceMonth deve estar no formato YYYY-MM')
  .optional();

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: statusEnum.optional(),
  startDate: dateSchema.optional(),
  endDate: dateSchema.optional(),
  studentId: idSchema.optional(),
});

const createPaymentSchema = z.object({
  studentId: idSchema,
  amount: z.coerce.number().positive('amount deve ser maior que zero'),
  dueDate: dateSchema,
  paymentDate: dateSchema.optional(),
  paymentMethod: z.string().min(1).optional(),
  status: statusEnum.optional(),
  referenceMonth: referenceMonthSchema,
  notes: z.string().optional(),
});

const updatePaymentSchema = createPaymentSchema
  .omit({ studentId: true, referenceMonth: true, dueDate: true, amount: true })
  .extend({
    amount: z.coerce.number().positive('amount deve ser maior que zero').optional(),
    dueDate: dateSchema.optional(),
  })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), 'Pelo menos um campo deve ser informado');

const studentPaymentsQuerySchema = z.object({
  status: statusEnum.optional(),
  month: referenceMonthSchema,
});

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
 * GET /payments
 * List all payments with filtering
 */
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = parseBody(listQuerySchema, req.query);

    const result = await paymentService.listPayments(query);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /payments/:id
 * Get payment by ID
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const payment = await paymentService.getPaymentById(id);
    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /payments
 * Create new payment
 */
router.post('/', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId, amount, dueDate, paymentDate, paymentMethod, status, referenceMonth, notes } =
      parseBody(createPaymentSchema, req.body);

    const payment = await paymentService.createPayment(
      {
        studentId,
        amount,
        dueDate,
        paymentDate,
        paymentMethod,
        status,
        referenceMonth,
        notes,
      },
      req.user?.userId || ''
    );

    res.status(201).json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /payments/:id
 * Update payment
 */
router.put('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const { amount, dueDate, paymentDate, paymentMethod, status, notes } = parseBody(updatePaymentSchema, req.body);

    const payment = await paymentService.updatePayment(id, {
      amount,
      dueDate,
      paymentDate,
      paymentMethod,
      status,
      notes,
    });

    res.status(200).json(payment);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /payments/:id
 * Delete payment
 */
router.delete('/:id', authMiddleware, requireProfessor, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = parseParams(z.object({ id: idSchema }), req.params);
    const payment = await paymentService.deletePayment(id);
    res.status(200).json({
      message: 'Pagamento removido com sucesso',
      payment,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /students/:studentId/payments
 * Get payments for a specific student
 */
router.get('/student/:studentId', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = parseParams(z.object({ studentId: idSchema }), req.params);
    const { status, month } = parseBody(studentPaymentsQuerySchema, req.query);

    const payments = await paymentService.getStudentPayments(studentId, {
      status: status as string,
      month: month as string,
    });

    res.status(200).json({
      data: payments,
      studentId,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
