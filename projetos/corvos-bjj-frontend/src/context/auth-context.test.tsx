import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/auth-context';
import http from '@/utils/http';

vi.mock('@/utils/http', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('login persists token and user', async () => {
    vi.mocked(http.post).mockResolvedValueOnce({
      data: {
        token: 'token-123',
        refreshToken: 'refresh-123',
        user: {
          id: '1',
          email: 'professor@corvosbjj.com',
          name: 'Professor',
          role: 'professor',
        },
      },
    } as never);

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.login('professor@corvosbjj.com', 'senha');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem('accessToken')).toBe('token-123');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-123');
  });

  it('logout clears session', async () => {
    localStorage.setItem('accessToken', 'token');
    localStorage.setItem('refreshToken', 'refresh');
    localStorage.setItem('user', JSON.stringify({ id: '1', email: 'x', name: 'x', role: 'professor' }));

    const { result } = renderHook(() => useAuth(), { wrapper: AuthProvider });

    await act(async () => {
      await result.current.logout();
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('refreshToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
