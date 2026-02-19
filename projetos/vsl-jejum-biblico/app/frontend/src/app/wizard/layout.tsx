'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores';
import { Layout } from '@/components';

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return <div>Redirecting...</div>;
  }

  return (
    <Layout header title="Criar Jejum" showBackButton>
      <div className="max-w-2xl mx-auto">
        {children}
      </div>
    </Layout>
  );
}
