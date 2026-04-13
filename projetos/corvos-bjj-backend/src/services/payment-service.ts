import { Prisma, PrismaClient } from '@prisma/client';
import { validatePaymentStatus } from '../utils/validation';
import { HttpError } from '../middleware/error';

const prisma = new PrismaClient();

export interface CreatePaymentRequest {
  studentId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  status?: string;
  referenceMonth?: string;
  notes?: string;
}

export interface UpdatePaymentRequest {
  amount?: number;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: string;
  status?: string;
  notes?: string;
}

export interface ListPaymentsQuery {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  studentId?: string;
}

/**
 * Get student payment history
 */
export async function getStudentPayments(
  studentId: string,
  query?: { status?: string; month?: string }
) {
  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new HttpError(404, 'STUDENT_NOT_FOUND', 'Aluno não encontrado');
  }

  const where: Prisma.PaymentWhereInput = { studentId };

  if (query?.status) {
    const statusValidation = validatePaymentStatus(query.status);
      if (!statusValidation.valid) {
        throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
      }
    where.status = query.status;
  }

  if (query?.month) {
    where.referenceMonth = query.month;
  }

  const payments = await prisma.payment.findMany({
    where,
    orderBy: { dueDate: 'desc' },
    include: {
      recordedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return payments;
}

/**
 * Get all payments with filters and pagination
 */
export async function listPayments(query: ListPaymentsQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {};

  if (query.status) {
    const statusValidation = validatePaymentStatus(query.status);
      if (!statusValidation.valid) {
        throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
      }
    where.status = query.status;
  }

  if (query.studentId) {
    where.studentId = query.studentId;
  }

  // Date range filtering
  if (query.startDate || query.endDate) {
    where.dueDate = {};
    if (query.startDate) {
      where.dueDate.gte = new Date(query.startDate);
    }
    if (query.endDate) {
      where.dueDate.lte = new Date(query.endDate);
    }
  }

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      skip,
      take: limit,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        recordedBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { dueDate: 'desc' },
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    data: payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get payment by ID
 */
export async function getPaymentById(id: string) {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recordedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!payment) {
    throw new HttpError(404, 'PAYMENT_NOT_FOUND', 'Pagamento não encontrado');
  }

  return payment;
}

/**
 * Create payment
 */
export async function createPayment(
  req: CreatePaymentRequest,
  recordedById: string
) {
  const {
    studentId,
    amount,
    dueDate,
    paymentDate,
    paymentMethod,
    status = 'pendente',
    referenceMonth,
    notes,
  } = req;

  // Validate required fields
  if (!studentId || !amount || !dueDate) {
    throw new HttpError(400, 'MISSING_FIELDS', 'StudentId, amount e dueDate são obrigatórios');
  }

  if (amount <= 0) {
    throw new HttpError(400, 'INVALID_AMOUNT', 'Valor deve ser maior que zero');
  }

  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new HttpError(404, 'STUDENT_NOT_FOUND', 'Aluno não encontrado');
  }

  // Validate status
  const statusValidation = validatePaymentStatus(status);
    if (!statusValidation.valid) {
      throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
    }

  // Check for duplicate payment in same month
  if (referenceMonth) {
    const existing = await prisma.payment.findFirst({
      where: {
        studentId,
        referenceMonth,
      },
    });

    if (existing) {
      throw new HttpError(
        409,
        'DUPLICATE_PAYMENT',
        'Já existe pagamento registrado para este mês'
      );
    }
  }

  const payment = await prisma.payment.create({
    data: {
      studentId,
      amount,
      dueDate: new Date(dueDate),
      paymentDate: paymentDate ? new Date(paymentDate) : null,
      paymentMethod,
      status,
      referenceMonth,
      notes,
      recordedById,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recordedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return payment;
}

/**
 * Update payment
 */
export async function updatePayment(
  id: string,
  req: UpdatePaymentRequest
) {
  // Verify exists
  await getPaymentById(id);

  if (req.amount !== undefined && req.amount <= 0) {
    throw new HttpError(400, 'INVALID_AMOUNT', 'Valor deve ser maior que zero');
  }

  if (req.status) {
    const statusValidation = validatePaymentStatus(req.status);
      if (!statusValidation.valid) {
        throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
      }
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      ...(req.amount && { amount: req.amount }),
      ...(req.dueDate && { dueDate: new Date(req.dueDate) }),
      ...(req.paymentDate && { paymentDate: new Date(req.paymentDate) }),
      ...(req.paymentMethod && { paymentMethod: req.paymentMethod }),
      ...(req.status && { status: req.status }),
      ...(req.notes !== undefined && { notes: req.notes }),
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      recordedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return payment;
}

/**
 * Delete payment
 */
export async function deletePayment(id: string) {
  await getPaymentById(id);

  const payment = await prisma.payment.delete({
    where: { id },
  });

  return payment;
}
