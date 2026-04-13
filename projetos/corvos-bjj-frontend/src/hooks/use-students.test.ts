import { renderHook, waitFor } from '@testing-library/react';
import { useStudents } from '@/hooks/use-students';
import { getStudents } from '@/services/students';

vi.mock('@/services/students', () => ({
  getStudents: vi.fn(),
}));

describe('useStudents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads students successfully', async () => {
    vi.mocked(getStudents).mockResolvedValueOnce({
      data: [
        {
          id: 's1',
          name: 'João',
          email: 'joao@email.com',
          phone: '11999999999',
          status: 'ativo',
          startDate: '2026-03-01',
          createdAt: '2026-03-01',
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        pages: 1,
      },
    });

    const { result } = renderHook(() => useStudents());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.students).toHaveLength(1);
    expect(result.current.error).toBeNull();
    expect(result.current.hasNextPage).toBe(false);
  });

  it('handles fetch error', async () => {
    vi.mocked(getStudents).mockRejectedValueOnce(new Error('boom'));

    const { result } = renderHook(() => useStudents());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.students).toHaveLength(0);
    expect(result.current.error).toContain('Não foi possível carregar alunos');
  });
});
