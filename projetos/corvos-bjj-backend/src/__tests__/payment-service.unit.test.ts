const mockPrisma = {
  student: {
    findUnique: jest.fn(),
  },
  payment: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockValidatePaymentStatus = jest.fn();

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

jest.mock('../utils/validation', () => ({
  validatePaymentStatus: (...args: unknown[]) => mockValidatePaymentStatus(...args),
}));

import * as paymentService from '../services/payment-service';

describe('payment-service unit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockValidatePaymentStatus.mockReturnValue({ valid: true });
    mockPrisma.payment.findMany.mockResolvedValue([]);
    mockPrisma.payment.count.mockResolvedValue(0);
  });

  it('getStudentPayments falha sem aluno', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(paymentService.getStudentPayments('s404')).rejects.toMatchObject({
      code: 'STUDENT_NOT_FOUND',
    });
  });

  it('getStudentPayments falha com status inválido', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockValidatePaymentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(paymentService.getStudentPayments('s1', { status: 'x' })).rejects.toMatchObject({
      code: 'INVALID_STATUS',
    });
  });

  it('listPayments falha com status inválido', async () => {
    mockValidatePaymentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(paymentService.listPayments({ status: 'x' })).rejects.toMatchObject({
      code: 'INVALID_STATUS',
    });
  });

  it('listPayments retorna paginação', async () => {
    mockPrisma.payment.findMany.mockResolvedValue([{ id: 'p1' }]);
    mockPrisma.payment.count.mockResolvedValue(1);

    const result = await paymentService.listPayments({ page: 1, limit: 20 });

    expect(result.data).toHaveLength(1);
    expect(result.pagination.total).toBe(1);
  });

  it('getPaymentById falha sem pagamento', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue(null);

    await expect(paymentService.getPaymentById('p404')).rejects.toMatchObject({
      code: 'PAYMENT_NOT_FOUND',
    });
  });

  it('createPayment falha com campos obrigatórios', async () => {
    await expect(
      paymentService.createPayment({ studentId: '', amount: 0, dueDate: '' }, 'u1')
    ).rejects.toMatchObject({ code: 'MISSING_FIELDS' });
  });

  it('createPayment falha com amount inválido', async () => {
    await expect(
      paymentService.createPayment({ studentId: 's1', amount: -1, dueDate: '2024-01-01' }, 'u1')
    ).rejects.toMatchObject({ code: 'INVALID_AMOUNT' });
  });

  it('createPayment falha sem aluno', async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(
      paymentService.createPayment({ studentId: 's1', amount: 100, dueDate: '2024-01-01' }, 'u1')
    ).rejects.toMatchObject({ code: 'STUDENT_NOT_FOUND' });
  });

  it('createPayment falha com status inválido', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockValidatePaymentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(
      paymentService.createPayment({ studentId: 's1', amount: 100, dueDate: '2024-01-01', status: 'x' }, 'u1')
    ).rejects.toMatchObject({ code: 'INVALID_STATUS' });
  });

  it('createPayment falha com pagamento duplicado', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.payment.findFirst.mockResolvedValue({ id: 'p1' });

    await expect(
      paymentService.createPayment(
        { studentId: 's1', amount: 100, dueDate: '2024-01-01', referenceMonth: '2024-01' },
        'u1'
      )
    ).rejects.toMatchObject({ code: 'DUPLICATE_PAYMENT' });
  });

  it('createPayment cria com sucesso', async () => {
    mockPrisma.student.findUnique.mockResolvedValue({ id: 's1' });
    mockPrisma.payment.findFirst.mockResolvedValue(null);
    mockPrisma.payment.create.mockResolvedValue({ id: 'p2' });

    const result = await paymentService.createPayment(
      { studentId: 's1', amount: 100, dueDate: '2024-01-01', referenceMonth: '2024-01' },
      'u1'
    );

    expect(result.id).toBe('p2');
  });

  it('updatePayment falha com amount inválido', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'p1' });

    await expect(paymentService.updatePayment('p1', { amount: 0 })).rejects.toMatchObject({
      code: 'INVALID_AMOUNT',
    });
  });

  it('updatePayment falha com status inválido', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'p1' });
    mockValidatePaymentStatus.mockReturnValue({ valid: false, error: 'status ruim' });

    await expect(paymentService.updatePayment('p1', { status: 'x' })).rejects.toMatchObject({
      code: 'INVALID_STATUS',
    });
  });

  it('updatePayment atualiza com sucesso', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'p1' });
    mockPrisma.payment.update.mockResolvedValue({ id: 'p1', status: 'pago' });

    const result = await paymentService.updatePayment('p1', { status: 'pago' });

    expect(result.status).toBe('pago');
  });

  it('deletePayment remove com sucesso', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue({ id: 'p1' });
    mockPrisma.payment.delete.mockResolvedValue({ id: 'p1' });

    const result = await paymentService.deletePayment('p1');

    expect(result.id).toBe('p1');
  });
});
