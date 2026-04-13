const mockPrisma = {
  student: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

const mockValidateEmail = jest.fn();
const mockValidatePhone = jest.fn();
const mockValidateStudentStatus = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('../utils/validation', () => ({
  validateEmail: (...args: unknown[]) => mockValidateEmail(...args),
  validatePhone: (...args: unknown[]) => mockValidatePhone(...args),
  validateStudentStatus: (...args: unknown[]) => mockValidateStudentStatus(...args),
}));

import * as studentService from '../services/student-service';

describe('student-service unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateEmail.mockReturnValue({ valid: true });
    mockValidatePhone.mockReturnValue({ valid: true });
    mockValidateStudentStatus.mockReturnValue({ valid: true });
    mockPrisma.student.findMany.mockResolvedValue([]);
    mockPrisma.student.count.mockResolvedValue(0);
  });

  it('listStudents falha com status inválido', async () => {
    mockValidateStudentStatus.mockReturnValue({ valid: false, error: 'status inválido' });

    await expect(studentService.listStudents({ status: 'x' })).rejects.toMatchObject({
      code: 'INVALID_STATUS',
    });
  });

  it('listStudents retorna paginação', async () => {
    mockPrisma.student.findMany.mockResolvedValue([{ id: 's1' }]);
    mockPrisma.student.count.mockResolvedValue(1);

    const result = await studentService.listStudents({ page: 1, limit: 10, search: 'al' });

    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('getStudentById falha quando não encontra', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(studentService.getStudentById('s404')).rejects.toMatchObject({ code: 'STUDENT_NOT_FOUND' });
  });

  it('createStudent falha com campos obrigatórios ausentes', async () => {
    await expect(studentService.createStudent({ name: '', email: '' }, 'u1')).rejects.toMatchObject({
      code: 'MISSING_FIELDS',
    });
  });

  it('createStudent falha com email inválido', async () => {
    mockValidateEmail.mockReturnValue({ valid: false, error: 'email ruim' });

    await expect(studentService.createStudent({ name: 'Aluno', email: 'x' }, 'u1')).rejects.toMatchObject({
      code: 'INVALID_EMAIL',
    });
  });

  it('createStudent falha com telefone inválido', async () => {
    mockValidatePhone.mockReturnValue({ valid: false, error: 'telefone ruim' });

    await expect(
      studentService.createStudent({ name: 'Aluno', email: 'a@mail.com', phone: 'x' }, 'u1')
    ).rejects.toMatchObject({ code: 'INVALID_PHONE' });
  });

  it('createStudent falha com status inválido', async () => {
    mockValidateStudentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(
      studentService.createStudent({ name: 'Aluno', email: 'a@mail.com', status: 'x' }, 'u1')
    ).rejects.toMatchObject({ code: 'INVALID_STATUS' });
  });

  it('createStudent falha com email duplicado', async () => {
    mockPrisma.student.findFirst.mockResolvedValue({ id: 's1' });

    await expect(
      studentService.createStudent({ name: 'Aluno', email: 'a@mail.com' }, 'u1')
    ).rejects.toMatchObject({ code: 'EMAIL_ALREADY_EXISTS' });
  });

  it('createStudent cria aluno com sucesso', async () => {
    mockPrisma.student.findFirst.mockResolvedValue(null);
    mockPrisma.student.create.mockResolvedValue({ id: 's2', name: 'Aluno' });

    const result = await studentService.createStudent({ name: 'Aluno', email: 'a@mail.com' }, 'u1');

    expect(result.id).toBe('s2');
  });

  it('updateStudent falha com email inválido', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockValidateEmail.mockReturnValue({ valid: false, error: 'email ruim' });

    await expect(studentService.updateStudent('s1', { email: 'x' })).rejects.toMatchObject({
      code: 'INVALID_EMAIL',
    });
  });

  it('updateStudent falha com email duplicado', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.student.findFirst.mockResolvedValue({ id: 's2' });

    await expect(studentService.updateStudent('s1', { email: 'a@mail.com' })).rejects.toMatchObject({
      code: 'EMAIL_ALREADY_EXISTS',
    });
  });

  it('updateStudent falha com telefone inválido', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.student.findFirst.mockResolvedValue(null);
    mockValidatePhone.mockReturnValue({ valid: false, error: 'telefone ruim' });

    await expect(studentService.updateStudent('s1', { phone: 'x' })).rejects.toMatchObject({
      code: 'INVALID_PHONE',
    });
  });

  it('updateStudent falha com status inválido', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockValidateStudentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(studentService.updateStudent('s1', { status: 'x' })).rejects.toMatchObject({
      code: 'INVALID_STATUS',
    });
  });

  it('updateStudent atualiza com sucesso', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.student.findFirst.mockResolvedValue(null);
    mockPrisma.student.update.mockResolvedValue({ id: 's1', name: 'Novo' });

    const result = await studentService.updateStudent('s1', { name: 'Novo' });

    expect(result.name).toBe('Novo');
  });

  it('deleteStudent remove via soft delete', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.student.update.mockResolvedValue({ id: 's1' });

    const result = await studentService.deleteStudent('s1');

    expect(result.id).toBe('s1');
    expect(mockPrisma.student.update).toHaveBeenCalled();
  });
});
