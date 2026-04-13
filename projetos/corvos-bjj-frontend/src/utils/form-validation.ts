import type { CreateGradePayload, CreatePaymentPayload, CreateStudentPayload } from '@/types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFERENCE_MONTH_REGEX = /^\d{4}-\d{2}$/;

export function validateStudentPayload(payload: CreateStudentPayload) {
  if (!payload.name?.trim()) {
    return 'Nome é obrigatório.';
  }

  if (!payload.email?.trim()) {
    return 'E-mail é obrigatório.';
  }

  if (!EMAIL_REGEX.test(payload.email.trim())) {
    return 'E-mail inválido.';
  }

  return null;
}

export function validatePaymentPayload(payload: CreatePaymentPayload) {
  if (!payload.studentId) {
    return 'Aluno é obrigatório.';
  }

  if (!payload.amount || payload.amount <= 0) {
    return 'Valor deve ser maior que zero.';
  }

  if (!payload.dueDate) {
    return 'Data de vencimento é obrigatória.';
  }

  if (payload.referenceMonth && !REFERENCE_MONTH_REGEX.test(payload.referenceMonth)) {
    return 'Referência deve estar no formato YYYY-MM.';
  }

  return null;
}

export function validateGradePayload(payload: CreateGradePayload) {
  if (!payload.beltColor) {
    return 'Faixa é obrigatória.';
  }

  if (!payload.promotionDate) {
    return 'Data de promoção é obrigatória.';
  }

  const selectedDate = new Date(payload.promotionDate);
  const today = new Date();
  if (selectedDate > today) {
    return 'Data de promoção não pode ser no futuro.';
  }

  return null;
}
