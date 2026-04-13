'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { useGrades } from '@/hooks/use-grades';
import { createGrade, deleteGrade, updateGrade } from '@/services/grades';
import { getStudents } from '@/services/students';
import { validateGradePayload } from '@/utils/form-validation';
import type { BeltColor, CreateGradePayload, Grade, Student } from '@/types';

interface ApiErrorResponse {
  message?: string;
}

const BELT_OPTIONS: Array<{ value: BeltColor; label: string }> = [
  { value: 'branca', label: 'Branca' },
  { value: 'azul', label: 'Azul' },
  { value: 'roxa', label: 'Roxa' },
  { value: 'marrom', label: 'Marrom' },
  { value: 'preta', label: 'Preta' },
];

export default function GradesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState('');

  const { grades, isLoading, error, refetch } = useGrades(selectedStudentId);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeGradeId, setActiveGradeId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateGradePayload>({
    beltColor: 'branca',
    promotionDate: '',
    notes: '',
  });

  useEffect(() => {
    const loadStudents = async () => {
      setStudentsLoading(true);
      setStudentsError(null);

      try {
        const response = await getStudents({ page: 1, limit: 100 });
        setStudents(response.data);
        if (response.data.length > 0) {
          setSelectedStudentId(response.data[0].id);
        }
      } catch {
        setStudentsError('Não foi possível carregar alunos para graduações.');
      } finally {
        setStudentsLoading(false);
      }
    };

    loadStudents();
  }, []);

  const handleCreateGrade = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedStudentId) {
      return;
    }

    const createPayload: CreateGradePayload = {
      beltColor: formData.beltColor,
      promotionDate: formData.promotionDate,
      notes: formData.notes?.trim() || undefined,
    };

    const validationError = validateGradePayload(createPayload);
    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await createGrade(selectedStudentId, createPayload);

      setIsCreateOpen(false);
      setFormData({ beltColor: 'branca', promotionDate: '', notes: '' });
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível criar graduação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (grade: Grade) => {
    setSubmitError(null);
    setActiveGradeId(grade.id);
    setFormData({
      beltColor: grade.beltColor,
      promotionDate: grade.promotionDate.slice(0, 10),
      notes: grade.notes || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdateGrade = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeGradeId) {
      return;
    }

    const validationError = validateGradePayload({
      beltColor: formData.beltColor,
      promotionDate: formData.promotionDate,
      notes: formData.notes,
    });

    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await updateGrade(activeGradeId, {
        beltColor: formData.beltColor,
        promotionDate: formData.promotionDate,
        notes: formData.notes?.trim() || undefined,
      });

      setIsEditOpen(false);
      setActiveGradeId(null);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível atualizar graduação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGrade = async (grade: Grade) => {
    const confirmed = window.confirm(`Excluir graduação ${grade.beltColor}?`);
    if (!confirmed) {
      return;
    }

    setActiveGradeId(grade.id);
    setSubmitError(null);

    try {
      await deleteGrade(grade.id);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível excluir graduação.');
    } finally {
      setActiveGradeId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Graduações</h1>
        <p className="mt-1 text-sm text-zinc-600">CRUD de graduações por aluno integrado ao backend.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <select
          value={selectedStudentId}
          onChange={(event) => setSelectedStudentId(event.target.value)}
          disabled={studentsLoading || students.length === 0}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          {students.length === 0 ? <option value="">Sem alunos</option> : null}
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={refetch}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
        >
          Atualizar
        </button>

        <button
          type="button"
          onClick={() => {
            setSubmitError(null);
            setIsCreateOpen(true);
          }}
          className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Nova graduação
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-zinc-100 text-left text-zinc-700">
            <tr>
              <th className="px-3 py-2 font-medium">Faixa</th>
              <th className="px-3 py-2 font-medium">Data de promoção</th>
              <th className="px-3 py-2 font-medium">Observações</th>
              <th className="px-3 py-2 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-zinc-500">
                  Carregando graduações...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : grades.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-zinc-500">
                  Nenhuma graduação encontrada para o aluno selecionado.
                </td>
              </tr>
            ) : (
              grades.map((grade) => (
                <tr key={grade.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2 capitalize">{grade.beltColor}</td>
                  <td className="px-3 py-2">{new Date(grade.promotionDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3 py-2">{grade.notes || '-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(grade)}
                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs hover:bg-zinc-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGrade(grade)}
                        disabled={activeGradeId === grade.id}
                        className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activeGradeId === grade.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {studentsError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{studentsError}</p>
      ) : null}

      {submitError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
      ) : null}

      {(isCreateOpen || isEditOpen) ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{isEditOpen ? 'Editar graduação' : 'Nova graduação'}</h2>
                <p className="text-sm text-zinc-600">Informe faixa e data de promoção.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setIsEditOpen(false);
                  setActiveGradeId(null);
                }}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={isEditOpen ? handleUpdateGrade : handleCreateGrade}>
              <div className="space-y-1">
                <label htmlFor="grade-belt" className="text-sm font-medium text-zinc-700">
                  Faixa
                </label>
                <select
                  id="grade-belt"
                  value={formData.beltColor}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, beltColor: event.target.value as BeltColor }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                >
                  {BELT_OPTIONS.map((belt) => (
                    <option key={belt.value} value={belt.value}>
                      {belt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="grade-date" className="text-sm font-medium text-zinc-700">
                  Data de promoção
                </label>
                <input
                  id="grade-date"
                  type="date"
                  value={formData.promotionDate}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, promotionDate: event.target.value }))
                  }
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="grade-notes" className="text-sm font-medium text-zinc-700">
                  Observações
                </label>
                <textarea
                  id="grade-notes"
                  value={formData.notes}
                  onChange={(event) => setFormData((prev) => ({ ...prev, notes: event.target.value }))}
                  rows={3}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setIsEditOpen(false);
                    setActiveGradeId(null);
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedStudentId}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Salvando...' : isEditOpen ? 'Salvar alterações' : 'Salvar graduação'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
