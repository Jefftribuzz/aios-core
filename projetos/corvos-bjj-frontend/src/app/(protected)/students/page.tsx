'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { useStudents } from '@/hooks/use-students';
import { createStudent, deleteStudent, updateStudent } from '@/services/students';
import { validateStudentPayload } from '@/utils/form-validation';
import type { CreateStudentPayload, Student, StudentStatus, UpdateStudentPayload } from '@/types';

interface ApiErrorResponse {
  message?: string;
}

export default function StudentsPage() {
  const {
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
    refetch,
    hasPreviousPage,
    hasNextPage,
  } = useStudents();

  const [searchInput, setSearchInput] = useState(search);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateStudentPayload>({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    status: 'ativo',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== search) {
        setPage(1);
        setSearch(searchInput);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, searchInput, setPage, setSearch]);

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const createPayload: CreateStudentPayload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone?.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      status: formData.status,
    };

    const validationError = validateStudentPayload(createPayload);
    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await createStudent(createPayload);

      setIsCreateOpen(false);
      setPage(1);
      setFormData({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        status: 'ativo',
      });

      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível criar o aluno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (student: Student) => {
    setSubmitError(null);
    setActiveStudentId(student.id);
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      status: student.status,
      dateOfBirth: '',
    });
    setIsEditOpen(true);
  };

  const handleUpdateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeStudentId) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: UpdateStudentPayload = {
      name: formData.name?.trim(),
      email: formData.email?.trim(),
      phone: formData.phone?.trim() || undefined,
      dateOfBirth: formData.dateOfBirth || undefined,
      status: formData.status,
    };

    const validationError = validateStudentPayload({
      name: payload.name || '',
      email: payload.email || '',
      phone: payload.phone,
      dateOfBirth: payload.dateOfBirth,
      status: payload.status,
    });

    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await updateStudent(activeStudentId, payload);
      setIsEditOpen(false);
      setActiveStudentId(null);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível atualizar o aluno.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    const confirmed = window.confirm(`Excluir aluno ${student.name}?`);
    if (!confirmed) {
      return;
    }

    setActiveStudentId(student.id);
    setSubmitError(null);

    try {
      await deleteStudent(student.id);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível excluir o aluno.');
    } finally {
      setActiveStudentId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Alunos</h1>
        <p className="mt-1 text-sm text-zinc-600">Listagem integrada com o backend (`GET /students`).</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_180px_auto_auto]">
        <input
          type="text"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Buscar por nome ou email"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        />

        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as 'all' | 'ativo' | 'inativo' | 'parado');
          }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          <option value="all">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="parado">Parado</option>
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
          Novo aluno
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-zinc-100 text-left text-zinc-700">
            <tr>
              <th className="px-3 py-2 font-medium">Nome</th>
              <th className="px-3 py-2 font-medium">E-mail</th>
              <th className="px-3 py-2 font-medium">Telefone</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Início</th>
              <th className="px-3 py-2 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                  Carregando alunos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-zinc-500">
                  Nenhum aluno encontrado para os filtros atuais.
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2">{student.name}</td>
                  <td className="px-3 py-2">{student.email}</td>
                  <td className="px-3 py-2">{student.phone || '-'}</td>
                  <td className="px-3 py-2 capitalize">{student.status}</td>
                  <td className="px-3 py-2">{new Date(student.startDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(student)}
                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs hover:bg-zinc-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={activeStudentId === student.id}
                        className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activeStudentId === student.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {submitError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      ) : null}

      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600">
          Página {Math.max(1, pagination.page)} de {Math.max(1, pagination.pages)} • Total: {pagination.total}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!hasPreviousPage}
            onClick={() => setPage(page - 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>
          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => setPage(page + 1)}
            className="rounded-md border border-zinc-300 px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Novo aluno</h2>
                <p className="text-sm text-zinc-600">Preencha os dados básicos para cadastro.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleCreateStudent}>
              <div className="space-y-1">
                <label htmlFor="student-name" className="text-sm font-medium text-zinc-700">
                  Nome
                </label>
                <input
                  id="student-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="student-email" className="text-sm font-medium text-zinc-700">
                  E-mail
                </label>
                <input
                  id="student-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="student-phone" className="text-sm font-medium text-zinc-700">
                    Telefone
                  </label>
                  <input
                    id="student-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="11999999999"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="student-status" className="text-sm font-medium text-zinc-700">
                    Status
                  </label>
                  <select
                    id="student-status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: event.target.value as StudentStatus,
                      }))
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="parado">Parado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="student-dob" className="text-sm font-medium text-zinc-700">
                  Data de nascimento
                </label>
                <input
                  id="student-dob"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, dateOfBirth: event.target.value }))
                  }
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar aluno'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {isEditOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Editar aluno</h2>
                <p className="text-sm text-zinc-600">Atualize os dados do aluno selecionado.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setActiveStudentId(null);
                }}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleUpdateStudent}>
              <div className="space-y-1">
                <label htmlFor="edit-student-name" className="text-sm font-medium text-zinc-700">
                  Nome
                </label>
                <input
                  id="edit-student-name"
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-student-email" className="text-sm font-medium text-zinc-700">
                  E-mail
                </label>
                <input
                  id="edit-student-email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="edit-student-phone" className="text-sm font-medium text-zinc-700">
                    Telefone
                  </label>
                  <input
                    id="edit-student-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                    placeholder="11999999999"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-student-status" className="text-sm font-medium text-zinc-700">
                    Status
                  </label>
                  <select
                    id="edit-student-status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        status: event.target.value as StudentStatus,
                      }))
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="parado">Parado</option>
                  </select>
                </div>
              </div>

              {submitError ? <p className="text-sm text-red-600">{submitError}</p> : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(false);
                    setActiveStudentId(null);
                  }}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
