import type {
  CreatePaymentPayload,
  Payment,
  PaymentsListQuery,
  PaymentsListResponse,
  UpdatePaymentPayload,
} from '@/types';
import http from '@/utils/http';

export async function getPayments(query: PaymentsListQuery = {}) {
  const response = await http.get<PaymentsListResponse>('/payments', { params: query });
  return response.data;
}

export async function createPayment(payload: CreatePaymentPayload) {
  const response = await http.post<Payment>('/payments', payload);
  return response.data;
}

export async function updatePayment(paymentId: string, payload: UpdatePaymentPayload) {
  const response = await http.put<Payment>(`/payments/${paymentId}`, payload);
  return response.data;
}

export async function deletePayment(paymentId: string) {
  await http.delete(`/payments/${paymentId}`);
}
