'use client';

import { useCallback, useEffect, useState } from 'react';
import { getStudentGrades } from '@/services/grades';
import type { Grade } from '@/types';

export function useGrades(studentId: string) {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    if (!studentId) {
      setGrades([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getStudentGrades(studentId);
      setGrades(response.data);
    } catch {
      setError('Não foi possível carregar graduações do aluno.');
      setGrades([]);
    } finally {
      setIsLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return {
    grades,
    isLoading,
    error,
    refetch: fetchGrades,
  };
}
