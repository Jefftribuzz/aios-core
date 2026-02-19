import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Escolha Jejum - Jejum Bíblico Personalizado',
  description: 'Gere planos de jejum personalizados com orações, meditações e refeições leves',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-background text-text font-sans">
        {children}
      </body>
    </html>
  );
}
