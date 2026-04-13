import { renderHook, waitFor } from '@testing-library/react';
import { usePayments } from '@/hooks/use-payments';
import { getPayments } from '@/services/payments';

vi.mock('@/services/payments', () => ({
  getPayments: vi.fn(),
}));

describe('usePayments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads payments successfully', async () => {
    vi.mocked(getPayments).mockResolvedValueOnce({
      data: [
        {
          id: 'p1',
          studentId: 's1',
          amount: 150,
          paymentDate: null,
          dueDate: '2026-03-10',
          status: 'pendente',
          paymentMethod: null,
          referenceMonth: '2026-03',
          notes: null,
          createdAt: '2026-03-01',
          student: {
            id: 's1',
            name: 'João',
            email: 'joao@email.com',
          },
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });

    const { result } = renderHook(() => usePayments());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.payments).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('handles fetch error', async () => {
    vi.mocked(getPayments).mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => usePayments());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.payments).toHaveLength(0);
    expect(result.current.error).toContain('Não foi possível carregar pagamentos');
  });
});
