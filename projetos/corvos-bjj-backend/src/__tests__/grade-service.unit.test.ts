const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  grade: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    groupBy: jest.fn(),
  },
};

const mockValidateBeltColor = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('../utils/validation', () => ({
  validateBeltColor: (...args: unknown[]) => mockValidateBeltColor(...args),
}));

import * as gradeService from '../services/grade-service';

describe('grade-service unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidateBeltColor.mockReturnValue({ valid: true });
  });

  it('getStudentGrades falha sem aluno', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(gradeService.getStudentGrades('s404')).rejects.toMatchObject({
      code: 'STUDENT_NOT_FOUND',
    });
  });

  it('getGradeById falha sem grade', async () => {
    mockPrisma.grade.findUnique.mockResolvedValue(null);

    await expect(gradeService.getGradeById('g404')).rejects.toMatchObject({
      code: 'GRADE_NOT_FOUND',
    });
  });

  it('createGrade falha com campos obrigatórios', async () => {
    await expect(
      gradeService.createGrade('s1', { beltColor: '', promotionDate: '' }, 'u1')
    ).rejects.toMatchObject({ code: 'MISSING_FIELDS' });
  });

  it('createGrade falha com faixa inválida', async () => {
    mockValidateBeltColor.mockReturnValue({ valid: false, error: 'faixa ruim' });

    await expect(
      gradeService.createGrade('s1', { beltColor: 'x', promotionDate: '2024-01-01' }, 'u1')
    ).rejects.toMatchObject({ code: 'INVALID_BELT' });
  });

  it('createGrade falha sem aluno', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(
      gradeService.createGrade('s1', { beltColor: 'azul', promotionDate: '2024-01-01' }, 'u1')
    ).rejects.toMatchObject({ code: 'STUDENT_NOT_FOUND' });
  });

  it('createGrade falha com data futura', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    const future = new Date();
    future.setDate(future.getDate() + 5);

    await expect(
      gradeService.createGrade('s1', { beltColor: 'azul', promotionDate: future.toISOString() }, 'u1')
    ).rejects.toMatchObject({ code: 'FUTURE_DATE' });
  });

  it('createGrade falha com duplicidade', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.grade.findFirst.mockResolvedValue({ id: 'g1' });

    await expect(
      gradeService.createGrade('s1', { beltColor: 'azul', promotionDate: '2024-01-01' }, 'u1')
    ).rejects.toMatchObject({ code: 'DUPLICATE_GRADE' });
  });

  it('createGrade cria com sucesso', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.grade.findFirst.mockResolvedValue(null);
    mockPrisma.grade.create.mockResolvedValue({ id: 'g2' });

    const result = await gradeService.createGrade('s1', { beltColor: 'azul', promotionDate: '2024-01-01' }, 'u1');

    expect(result.id).toBe('g2');
  });

  it('updateGrade falha com faixa inválida', async () => {
    mockPrisma.grade.findUnique.mockResolvedValue({ id: 'g1' });
    mockValidateBeltColor.mockReturnValue({ valid: false, error: 'faixa ruim' });

    await expect(gradeService.updateGrade('g1', { beltColor: 'x' })).rejects.toMatchObject({
      code: 'INVALID_BELT',
    });
  });

  it('updateGrade falha com data futura', async () => {
    mockPrisma.grade.findUnique.mockResolvedValue({ id: 'g1' });
    const future = new Date();
    future.setDate(future.getDate() + 3);

    await expect(gradeService.updateGrade('g1', { promotionDate: future.toISOString() })).rejects.toMatchObject({
      code: 'FUTURE_DATE',
    });
  });

  it('updateGrade atualiza com sucesso', async () => {
    mockPrisma.grade.findUnique.mockResolvedValue({ id: 'g1' });
    mockPrisma.grade.update.mockResolvedValue({ id: 'g1', notes: 'ok' });

    const result = await gradeService.updateGrade('g1', { notes: 'ok' });

    expect(result.notes).toBe('ok');
  });

  it('deleteGrade remove com sucesso', async () => {
    mockPrisma.grade.findUnique.mockResolvedValue({ id: 'g1' });
    mockPrisma.grade.delete.mockResolvedValue({ id: 'g1' });

    const result = await gradeService.deleteGrade('g1');

    expect(result.id).toBe('g1');
  });

  it('getGradeStatistics retorna agregação', async () => {
    mockPrisma.grade.groupBy.mockResolvedValue([{ beltColor: 'azul', _count: { id: 10 } }]);

    const result = await gradeService.getGradeStatistics();

    expect(result[0].beltColor).toBe('azul');
  });
});
