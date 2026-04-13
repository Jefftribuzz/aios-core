import { PrismaClient } from '@prisma/client';
import { validateBeltColor } from '../utils/validation';
import { HttpError } from '../middleware/error';

const prisma = new PrismaClient();

export interface CreateGradeRequest {
  beltColor: string;
  promotionDate: string;
  notes?: string;
}

export interface UpdateGradeRequest {
  beltColor?: string;
  promotionDate?: string;
  notes?: string;
}

/**
 * Get student grade history (belt progression)
 */
export async function getStudentGrades(studentId: string) {
  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new HttpError(404, 'STUDENT_NOT_FOUND', 'Aluno não encontrado');
  }

  const grades = await prisma.grade.findMany({
    where: { studentId },
    include: {
      promotedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { promotionDate: 'desc' },
  });

  return grades;
}

/**
 * Get grade by ID
 */
export async function getGradeById(id: string) {
  const grade = await prisma.grade.findUnique({
    where: { id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      promotedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!grade) {
    throw new HttpError(404, 'GRADE_NOT_FOUND', 'Registro de faixa não encontrado');
  }

  return grade;
}

/**
 * Create grade/belt promotion
 */
export async function createGrade(
  studentId: string,
  req: CreateGradeRequest,
  promotedById: string
) {
  const { beltColor, promotionDate, notes } = req;

  // Validate required fields
  if (!beltColor || !promotionDate) {
    throw new HttpError(
      400,
      'MISSING_FIELDS',
      'Faixa (beltColor) e data de promoção são obrigatórios'
    );
  }

  // Validate belt color
  const beltValidation = validateBeltColor(beltColor);
  if (!beltValidation.valid) {
    throw new HttpError(400, 'INVALID_BELT', beltValidation.error || 'Faixa inválida');
  }

  // Verify student exists
  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new HttpError(404, 'STUDENT_NOT_FOUND', 'Aluno não encontrado');
  }

  // Validate promotion date is not in future
  const promotionDateObj = new Date(promotionDate);
  if (promotionDateObj > new Date()) {
    throw new HttpError(
      400,
      'FUTURE_DATE',
      'Data de promoção não pode ser no futuro'
    );
  }

  // Check for duplicate promotion on same date
  const existing = await prisma.grade.findFirst({
    where: {
      studentId,
      beltColor,
      promotionDate: promotionDateObj,
    },
  });

  if (existing) {
    throw new HttpError(
      409,
      'DUPLICATE_GRADE',
      'Já existe promoção registrada para esta faixa nesta data'
    );
  }

  const grade = await prisma.grade.create({
    data: {
      studentId,
      beltColor,
      promotionDate: promotionDateObj,
      notes,
      promotedById,
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      promotedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return grade;
}

/**
 * Update grade
 */
export async function updateGrade(
  id: string,
  req: UpdateGradeRequest
) {
  // Verify exists
  await getGradeById(id);

  if (req.beltColor) {
    const beltValidation = validateBeltColor(req.beltColor);
    if (!beltValidation.valid) {
      throw new HttpError(400, 'INVALID_BELT', beltValidation.error || 'Faixa inválida');
    }
  }

  if (req.promotionDate) {
    const promotionDateObj = new Date(req.promotionDate);
    if (promotionDateObj > new Date()) {
      throw new HttpError(
        400,
        'FUTURE_DATE',
        'Data de promoção não pode ser no futuro'
      );
    }
  }

  const grade = await prisma.grade.update({
    where: { id },
    data: {
      ...(req.beltColor && { beltColor: req.beltColor }),
      ...(req.promotionDate && { promotionDate: new Date(req.promotionDate) }),
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
      promotedBy: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return grade;
}

/**
 * Delete grade
 */
export async function deleteGrade(id: string) {
  await getGradeById(id);

  const grade = await prisma.grade.delete({
    where: { id },
  });

  return grade;
}

/**
 * Get grade statistics for reporting
 */
export async function getGradeStatistics() {
  const stats = await prisma.grade.groupBy({
    by: ['beltColor'],
    _count: {
      id: true,
    },
    orderBy: {
      beltColor: 'asc',
    },
  });

  return stats;
}
