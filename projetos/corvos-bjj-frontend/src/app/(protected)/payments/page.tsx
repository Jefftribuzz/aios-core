'use client';

import { type FormEvent, useEffect, useState } from 'react';
import type { AxiosError } from 'axios';
import { usePayments } from '@/hooks/use-payments';
import { createPayment, deletePayment, updatePayment } from '@/services/payments';
import { getStudents } from '@/services/students';
import { validatePaymentPayload } from '@/utils/form-validation';
import type {
  CreatePaymentPayload,
  Payment,
  PaymentStatus,
  Student,
  UpdatePaymentPayload,
} from '@/types';

interface ApiErrorResponse {
  message?: string;
}

export default function PaymentsPage() {
  const {
    payments,
    pagination,
    isLoading,
    error,
    status,
    page,
    setStatus,
    setPage,
    refetch,
    hasPreviousPage,
    hasNextPage,
  } = usePayments();

  const [students, setStudents] = useState<Student[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentsError, setStudentsError] = useState<string | null>(null);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [activePaymentId, setActivePaymentId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePaymentPayload>({
    studentId: '',
    amount: 0,
    dueDate: '',
    paymentDate: '',
    paymentMethod: '',
    status: 'pendente',
    referenceMonth: '',
    notes: '',
  });

  useEffect(() => {
    const loadStudents = async () => {
      setStudentsLoading(true);
      setStudentsError(null);

      try {
        const response = await getStudents({ page: 1, limit: 100 });
        setStudents(response.data);
      } catch {
        setStudentsError('Não foi possível carregar alunos para o cadastro de pagamento.');
      } finally {
        setStudentsLoading(false);
      }
    };

    loadStudents();
  }, []);

  useEffect(() => {
    if (!formData.studentId && students.length > 0) {
      setFormData((prev) => ({ ...prev, studentId: students[0].id }));
    }
  }, [formData.studentId, students]);

  const handleCreatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const createPayload: CreatePaymentPayload = {
      studentId: formData.studentId,
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      paymentMethod: formData.paymentMethod?.trim() || undefined,
      status: formData.status,
      referenceMonth: formData.referenceMonth || undefined,
      notes: formData.notes?.trim() || undefined,
    };

    const validationError = validatePaymentPayload(createPayload);
    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await createPayment(createPayload);

      setIsCreateOpen(false);
      setPage(1);
      setFormData((prev) => ({
        ...prev,
        amount: 0,
        dueDate: '',
        paymentDate: '',
        paymentMethod: '',
        status: 'pendente',
        referenceMonth: '',
        notes: '',
      }));

      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível criar o pagamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (payment: Payment) => {
    setSubmitError(null);
    setActivePaymentId(payment.id);
    setFormData({
      studentId: payment.studentId,
      amount: payment.amount,
      dueDate: payment.dueDate.slice(0, 10),
      paymentDate: payment.paymentDate ? payment.paymentDate.slice(0, 10) : '',
      paymentMethod: payment.paymentMethod || '',
      status: payment.status,
      referenceMonth: payment.referenceMonth || '',
      notes: payment.notes || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdatePayment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activePaymentId) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: UpdatePaymentPayload = {
      amount: Number(formData.amount),
      dueDate: formData.dueDate,
      paymentDate: formData.paymentDate || undefined,
      paymentMethod: formData.paymentMethod?.trim() || undefined,
      status: formData.status,
      notes: formData.notes?.trim() || undefined,
    };

    const validationError = validatePaymentPayload({
      studentId: formData.studentId,
      amount: payload.amount || 0,
      dueDate: payload.dueDate || '',
      paymentDate: payload.paymentDate,
      paymentMethod: payload.paymentMethod,
      status: payload.status,
      referenceMonth: formData.referenceMonth || undefined,
      notes: payload.notes,
    });

    if (validationError) {
      setSubmitError(validationError);
      setIsSubmitting(false);
      return;
    }

    try {
      await updatePayment(activePaymentId, payload);
      setIsEditOpen(false);
      setActivePaymentId(null);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível atualizar o pagamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePayment = async (payment: Payment) => {
    const confirmed = window.confirm(`Excluir pagamento de ${payment.student.name}?`);
    if (!confirmed) {
      return;
    }

    setActivePaymentId(payment.id);
    setSubmitError(null);

    try {
      await deletePayment(payment.id);
      await refetch();
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      setSubmitError(axiosError.response?.data?.message || 'Não foi possível excluir o pagamento.');
    } finally {
      setActivePaymentId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Pagamentos</h1>
        <p className="mt-1 text-sm text-zinc-600">Listagem e criação integradas com `/payments`.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[220px_auto_auto]">
        <select
          value={status}
          onChange={(event) => {
            setPage(1);
            setStatus(event.target.value as 'all' | PaymentStatus);
          }}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
        >
          <option value="all">Todos os status</option>
          <option value="pendente">Pendente</option>
          <option value="pago">Pago</option>
          <option value="atrasado">Atrasado</option>
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
          Novo pagamento
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-zinc-200">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-zinc-100 text-left text-zinc-700">
            <tr>
              <th className="px-3 py-2 font-medium">Aluno</th>
              <th className="px-3 py-2 font-medium">Valor</th>
              <th className="px-3 py-2 font-medium">Vencimento</th>
              <th className="px-3 py-2 font-medium">Pagamento</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Método</th>
              <th className="px-3 py-2 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                  Carregando pagamentos...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-zinc-500">
                  Nenhum pagamento encontrado para os filtros atuais.
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="border-t border-zinc-200">
                  <td className="px-3 py-2">
                    <div className="font-medium">{payment.student.name}</div>
                    <div className="text-xs text-zinc-500">{payment.student.email}</div>
                  </td>
                  <td className="px-3 py-2">R$ {payment.amount.toFixed(2)}</td>
                  <td className="px-3 py-2">{new Date(payment.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-3 py-2">
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="px-3 py-2 capitalize">{payment.status}</td>
                  <td className="px-3 py-2">{payment.paymentMethod || '-'}</td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(payment)}
                        className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs hover:bg-zinc-100"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePayment(payment)}
                        disabled={activePaymentId === payment.id}
                        className="rounded-md border border-red-300 px-2.5 py-1 text-xs text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activePaymentId === payment.id ? 'Excluindo...' : 'Excluir'}
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
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
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

      {studentsError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{studentsError}</p>
      ) : null}

      {isCreateOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">Novo pagamento</h2>
                <p className="text-sm text-zinc-600">Registre um pagamento para um aluno.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleCreatePayment}>
              <div className="space-y-1">
                <label htmlFor="payment-student" className="text-sm font-medium text-zinc-700">
                  Aluno
                </label>
                <select
                  id="payment-student"
                  value={formData.studentId}
                  onChange={(event) => setFormData((prev) => ({ ...prev, studentId: event.target.value }))}
                  required
                  disabled={studentsLoading}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                >
                  {students.length === 0 ? <option value="">Sem alunos disponíveis</option> : null}
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="payment-amount" className="text-sm font-medium text-zinc-700">
                    Valor (R$)
                  </label>
                  <input
                    id="payment-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, amount: Number(event.target.value) }))
                    }
                    required
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="payment-status" className="text-sm font-medium text-zinc-700">
                    Status
                  </label>
                  <select
                    id="payment-status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, status: event.target.value as PaymentStatus }))
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="payment-due-date" className="text-sm font-medium text-zinc-700">
                    Vencimento
                  </label>
                  <input
                    id="payment-due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                    required
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="payment-date" className="text-sm font-medium text-zinc-700">
                    Data de pagamento
                  </label>
                  <input
                    id="payment-date"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, paymentDate: event.target.value }))}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="payment-method" className="text-sm font-medium text-zinc-700">
                    Método
                  </label>
                  <input
                    id="payment-method"
                    type="text"
                    value={formData.paymentMethod}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, paymentMethod: event.target.value }))
                    }
                    placeholder="pix, dinheiro, transferência..."
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="payment-reference-month" className="text-sm font-medium text-zinc-700">
                    Referência (YYYY-MM)
                  </label>
                  <input
                    id="payment-reference-month"
                    type="text"
                    value={formData.referenceMonth}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, referenceMonth: event.target.value }))
                    }
                    placeholder="2026-03"
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="payment-notes" className="text-sm font-medium text-zinc-700">
                  Observações
                </label>
                <textarea
                  id="payment-notes"
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
                  onClick={() => setIsCreateOpen(false)}
                  className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || studentsLoading || students.length === 0}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar pagamento'}
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
                <h2 className="text-lg font-semibold">Editar pagamento</h2>
                <p className="text-sm text-zinc-600">Atualize os dados do pagamento.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setActivePaymentId(null);
                }}
                className="rounded-md px-2 py-1 text-zinc-500 hover:bg-zinc-100"
              >
                ✕
              </button>
            </div>

            <form className="space-y-3" onSubmit={handleUpdatePayment}>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="edit-payment-amount" className="text-sm font-medium text-zinc-700">
                    Valor (R$)
                  </label>
                  <input
                    id="edit-payment-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.amount || ''}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, amount: Number(event.target.value) }))
                    }
                    required
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-payment-status" className="text-sm font-medium text-zinc-700">
                    Status
                  </label>
                  <select
                    id="edit-payment-status"
                    value={formData.status}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, status: event.target.value as PaymentStatus }))
                    }
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="pago">Pago</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <label htmlFor="edit-payment-due-date" className="text-sm font-medium text-zinc-700">
                    Vencimento
                  </label>
                  <input
                    id="edit-payment-due-date"
                    type="date"
                    value={formData.dueDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, dueDate: event.target.value }))}
                    required
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-payment-date" className="text-sm font-medium text-zinc-700">
                    Data de pagamento
                  </label>
                  <input
                    id="edit-payment-date"
                    type="date"
                    value={formData.paymentDate}
                    onChange={(event) => setFormData((prev) => ({ ...prev, paymentDate: event.target.value }))}
                    className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-payment-method" className="text-sm font-medium text-zinc-700">
                  Método
                </label>
                <input
                  id="edit-payment-method"
                  type="text"
                  value={formData.paymentMethod}
                  onChange={(event) => setFormData((prev) => ({ ...prev, paymentMethod: event.target.value }))}
                  className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-payment-notes" className="text-sm font-medium text-zinc-700">
                  Observações
                </label>
                <textarea
                  id="edit-payment-notes"
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
                    setIsEditOpen(false);
                    setActivePaymentId(null);
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
