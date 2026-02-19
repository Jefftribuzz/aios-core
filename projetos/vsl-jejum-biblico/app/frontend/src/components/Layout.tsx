import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores';
import { Button } from './Button';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showBackButton = false }) => {
  const { logout } = useAuthStore();
  const user = useAuthStore((state) => state.user);

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBackButton && (
            <button onClick={() => window.history.back()} className="text-2xl">
              ←
            </button>
          )}
          <Link href="/" className="font-serif font-bold text-2xl hover:text-opacity-80">
            Escolha Jejum
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm">Olá, {user.email.split('@')[0]}</span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
              >
                Sair
              </Button>
            </>
          ) : (
            <Link href="/">
              <Button variant="secondary" size="sm">
                Entrar
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

interface LayoutProps {
  children: React.ReactNode;
  header?: boolean;
  title?: string;
  showBackButton?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  header = true,
  title,
  showBackButton,
}) => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {header && <Header title={title} showBackButton={showBackButton} />}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4">
        {children}
      </main>
      <footer className="bg-primary bg-opacity-10 text-center py-4 text-sm text-gray-600">
        © 2026 Escolha Jejum. Suporte espiritual para sua jornada.
      </footer>
    </div>
  );
};
