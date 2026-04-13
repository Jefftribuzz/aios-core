'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, usePlanStore } from '@/stores';
import { Layout } from '@/components';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const currentPlan = usePlanStore((state) => state.currentPlan);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/');
      return;
    }

    if (!currentPlan) {
      router.push('/wizard');
    }
  }, [isLoggedIn, currentPlan, router]);

  if (!isLoggedIn || !currentPlan) {
    return <div>Carregando...</div>;
  }

  return (
    <Layout header title="Seu Plano de Jejum" showBackButton>
      <div className="max-w-6xl mx-auto">
        {children}
      </div>
    </Layout>
  );
}
