'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getStudents } from '@/services/students';
import type { Pagination, Student, StudentStatus } from '@/types';

type StatusFilter = StudentStatus | 'all';

const DEFAULT_PAGE_SIZE = 10;

const INITIAL_PAGINATION: Pagination = {
  page: 1,
  limit: DEFAULT_PAGE_SIZE,
  total: 0,
  pages: 0,
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination>(INITIAL_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStudents({
        page,
        limit: DEFAULT_PAGE_SIZE,
        search: search.trim() || undefined,
        status: status === 'all' ? undefined : status,
      });

      setStudents(response.data);
      setPagination(response.pagination);
    } catch {
      setError('Não foi possível carregar alunos. Tente novamente.');
      setStudents([]);
      setPagination(INITIAL_PAGINATION);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const hasPreviousPage = useMemo(() => pagination.page > 1, [pagination.page]);
  const hasNextPage = useMemo(
    () => pagination.page < Math.max(1, pagination.pages),
    [pagination.page, pagination.pages]
  );

  return {
    students,
    pagination,
    isLoading,
    error,
    search,
    status,
    page,
    setSearch,
    setStatus,
    setPage,
    refetch: fetchStudents,
    hasPreviousPage,
    hasNextPage,
  };
}
