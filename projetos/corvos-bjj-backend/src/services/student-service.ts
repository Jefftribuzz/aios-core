import { Prisma, PrismaClient } from '@prisma/client';
import { validateEmail, validatePhone, validateStudentStatus } from '../utils/validation';
import { HttpError } from '../middleware/error';

const prisma = new PrismaClient();

export interface CreateStudentRequest {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  status?: string;
}

export interface UpdateStudentRequest {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  status?: string;
}

export interface ListStudentsQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

/**
 * Get paginated list of students
 */
export async function listStudents(query: ListStudentsQuery) {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  const where: Prisma.StudentWhereInput = {
    deletedAt: null,
  };

  // Filter by status
  if (query.status) {
    const statusValidation = validateStudentStatus(query.status);
    if (!statusValidation.valid) {
      throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
    }
    where.status = query.status;
  }

  // Search by name or email
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        status: true,
        startDate: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.student.count({ where }),
  ]);

  return {
    data: students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Get student by ID with relationships
 */
export async function getStudentById(id: string) {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      payments: {
        orderBy: { createdAt: 'desc' },
      },
      grades: {
        orderBy: { promotionDate: 'desc' },
      },
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!student) {
    throw new HttpError(404, 'STUDENT_NOT_FOUND', 'Aluno não encontrado');
  }

  return student;
}

/**
 * Create new student
 */
export async function createStudent(
  req: CreateStudentRequest,
  createdById: string
) {
  const { name, email, phone, dateOfBirth, status = 'ativo' } = req;

  // Validate required fields
  if (!name || !email) {
    throw new HttpError(400, 'MISSING_FIELDS', 'Nome e email são obrigatórios');
  }

  // Validate email format
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    throw new HttpError(400, 'INVALID_EMAIL', emailValidation.error || 'Email inválido');
  }

  // Validate phone
  if (phone) {
    const phoneValidation = validatePhone(phone);
    if (!phoneValidation.valid) {
      throw new HttpError(400, 'INVALID_PHONE', phoneValidation.error || 'Telefone inválido');
    }
  }

  // Validate status
  const statusValidation = validateStudentStatus(status);
  if (!statusValidation.valid) {
    throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
  }

  // Check for duplicate email
  const existingStudent = await prisma.student.findFirst({
    where: {
      email,
      deletedAt: null,
    },
  });

  if (existingStudent) {
    throw new HttpError(409, 'EMAIL_ALREADY_EXISTS', 'Email já cadastrado para outro aluno');
  }

  // Create student
  const student = await prisma.student.create({
    data: {
      name,
      email,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      status,
      createdById,
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return student;
}

/**
 * Update student
 */
export async function updateStudent(
  id: string,
  req: UpdateStudentRequest
) {
  // Get student first to ensure it exists
  await getStudentById(id);

  // Validate email if provided
  if (req.email) {
    const emailValidation = validateEmail(req.email);
    if (!emailValidation.valid) {
      throw new HttpError(400, 'INVALID_EMAIL', emailValidation.error || 'Email inválido');
    }

    // Check for duplicate email
    const existing = await prisma.student.findFirst({
      where: {
        email: req.email,
        id: { not: id },
        deletedAt: null,
      },
    });

    if (existing) {
      throw new HttpError(409, 'EMAIL_ALREADY_EXISTS', 'Email já cadastrado para outro aluno');
    }
  }

  // Validate phone if provided
  if (req.phone) {
    const phoneValidation = validatePhone(req.phone);
    if (!phoneValidation.valid) {
      throw new HttpError(400, 'INVALID_PHONE', phoneValidation.error || 'Telefone inválido');
    }
  }

  // Validate status if provided
  if (req.status) {
    const statusValidation = validateStudentStatus(req.status);
    if (!statusValidation.valid) {
      throw new HttpError(400, 'INVALID_STATUS', statusValidation.error || 'Status inválido');
    }
  }

  const student = await prisma.student.update({
    where: { id },
    data: {
      ...(req.name && { name: req.name }),
      ...(req.email && { email: req.email }),
      ...(req.phone !== undefined && { phone: req.phone }),
      ...(req.dateOfBirth && { dateOfBirth: new Date(req.dateOfBirth) }),
      ...(req.status && { status: req.status }),
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return student;
}

/**
 * Delete student (soft delete)
 */
export async function deleteStudent(id: string) {
  // Check if exists
  await getStudentById(id);

  const student = await prisma.student.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return student;
}
