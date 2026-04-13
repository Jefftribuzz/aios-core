import { render, screen, waitFor } from '@testing-library/react';
import { ProtectedRoute } from '@/components/protected-route';

const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/students',
}));

vi.mock('@/context/auth-context', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '@/context/auth-context';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Conteúdo</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Carregando sessão...')).toBeInTheDocument();
  });

  it('redirects to login when unauthenticated', async () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Conteúdo</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith('/login?redirect=%2Fstudents');
    });
  });

  it('renders children when authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'x', name: 'x', role: 'professor' },
      token: 'token',
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <ProtectedRoute>
        <div>Conteúdo Protegido</div>
      </ProtectedRoute>
    );

    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument();
  });
});
