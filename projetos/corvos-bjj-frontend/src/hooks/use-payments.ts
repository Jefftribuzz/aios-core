'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getPayments } from '@/services/payments';
import type { Pagination, Payment, PaymentStatus } from '@/types';

const DEFAULT_PAGE_SIZE = 10;

const INITIAL_PAGINATION: Pagination = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  pages: 0,
};

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [pagination, setPagination] = useState<Pagination>(INITIAL_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState<PaymentStatus | 'all'>('all');
  const [page, setPage] = useState(1);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getPayments({
        page,
        limit: DEFAULT_PAGE_SIZE,
        status: status === 'all' ? undefined : status,
      });

      setPayments(response.data);
      setPagination(response.pagination);
    } catch {
      setError('Não foi possível carregar pagamentos.');
      setPayments([]);
      setPagination(INITIAL_PAGINATION);
    } finally {
      setIsLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const hasPreviousPage = useMemo(() => pagination.page > 1, [pagination.page]);
  const hasNextPage = useMemo(
    () => pagination.page < Math.max(1, pagination.pages),
    [pagination.page, pagination.pages]
  );

  return {
    payments,
    pagination,
    isLoading,
    error,
    status,
    page,
    setStatus,
    setPage,
    refetch: fetchPayments,
    hasPreviousPage,
    hasNextPage,
  };
}
