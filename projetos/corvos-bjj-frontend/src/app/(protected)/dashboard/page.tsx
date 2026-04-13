'use client';

import { useEffect, useMemo, useState } from 'react';
import { getGradeDistribution } from '@/services/grades';
import { getPayments } from '@/services/payments';
import { getStudents } from '@/services/students';
import type { Payment, Student } from '@/types';

interface GradeDistributionItem {
  beltColor: string;
  _count: {
    id: number;
  };
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistributionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [studentsResponse, paymentsResponse, gradesResponse] = await Promise.all([
          getStudents({ page: 1, limit: 200 }),
          getPayments({ page: 1, limit: 200 }),
          getGradeDistribution(),
        ]);

        setStudents(studentsResponse.data);
        setPayments(paymentsResponse.data);
        setGradeDistribution(gradesResponse.data);
      } catch {
        setError('Não foi possível carregar os indicadores do dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalStudents = students.length;
    const pendingPayments = payments.filter((payment) => payment.status !== 'pago');
    const overduePayments = payments.filter((payment) => payment.status === 'atrasado');
    const paidPayments = payments.filter((payment) => payment.status === 'pago');
    const pendingAmount = pendingPayments.reduce((acc, payment) => acc + payment.amount, 0);
    const paymentRate = payments.length > 0 ? Math.round((paidPayments.length / payments.length) * 100) : 0;
    const topBelts = [...gradeDistribution]
      .sort((first, second) => second._count.id - first._count.id)
      .slice(0, 3);

    return {
      totalStudents,
      pendingCount: pendingPayments.length,
      overdueCount: overduePayments.length,
      pendingAmount,
      paymentRate,
      topBelts,
    };
  }, [gradeDistribution, payments, students]);

  if (isLoading) {
    return <div className="text-sm text-zinc-500">Carregando dashboard...</div>;
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-600">Indicadores reais de alunos, pagamentos e graduações.</p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Alunos ativos" value={String(stats.totalStudents)} />
        <KpiCard label="Pagamentos pendentes" value={String(stats.pendingCount)} />
        <KpiCard label="Pagamentos atrasados" value={String(stats.overdueCount)} />
        <KpiCard label="Valor pendente" value={`R$ ${stats.pendingAmount.toFixed(2)}`} />
        <KpiCard label="Taxa de pagamento" value={`${stats.paymentRate}%`} />
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-800">Top faixas registradas</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {stats.topBelts.length === 0 ? (
              <li className="text-zinc-500">Sem dados de graduações no momento.</li>
            ) : (
              stats.topBelts.map((belt) => (
                <li key={belt.beltColor} className="flex items-center justify-between">
                  <span className="capitalize">Faixa {belt.beltColor}</span>
                  <span className="font-medium">{belt._count.id}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-lg border border-zinc-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-zinc-800">Próximos vencimentos</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {payments.length === 0 ? (
              <li className="text-zinc-500">Sem pagamentos cadastrados.</li>
            ) : (
              payments
                .slice(0, 5)
                .map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between gap-2">
                    <span className="truncate">{payment.student.name}</span>
                    <span>{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</span>
                    <span className="font-medium">R$ {payment.amount.toFixed(2)}</span>
                  </li>
                ))
            )}
          </ul>
        </div>
      </div>
    </section>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
