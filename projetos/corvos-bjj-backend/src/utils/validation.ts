import { z } from 'zod';

/**
 * Email validation schema
 */
export const emailSchema = z.string().email('Email inválido');

/**
 * Password validation schema - minimum 8 characters
 */
export const passwordSchema = z
  .string()
  .min(8, 'Senha deve ter no mínimo 8 caracteres');

/**
 * Phone validation schema - Brazilian format
 */
export const phoneSchema = z
  .string()
  .regex(/^\d{10,11}$/, 'Telefone inválido')
  .optional();

/**
 * Validate email
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  try {
    emailSchema.parse(email);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: 'Validação inválida' };
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string } {
  try {
    passwordSchema.parse(password);

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos uma letra maiúscula' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      return { valid: false, error: 'Senha deve conter pelo menos um número' };
    }

    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: 'Validação de senha inválida' };
  }
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  try {
    phoneSchema.parse(phone);
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.errors[0]?.message };
    }
    return { valid: false, error: 'Validação de telefone inválida' };
  }
}

/**
 * Validate belt color enum
 */
export function validateBeltColor(
  color: string
): { valid: boolean; error?: string } {
  const validBelts = ['branca', 'azul', 'roxa', 'marrom', 'preta'];
  if (validBelts.includes(color.toLowerCase())) {
    return { valid: true };
  }
  return {
    valid: false,
    error: `Faixa inválida. Opções: ${validBelts.join(', ')}`,
  };
}

/**
 * Validate payment status enum
 */
export function validatePaymentStatus(
  status: string
): { valid: boolean; error?: string } {
  const validStatuses = ['pago', 'pendente', 'atrasado'];
  if (validStatuses.includes(status.toLowerCase())) {
    return { valid: true };
  }
  return {
    valid: false,
    error: `Status inválido. Opções: ${validStatuses.join(', ')}`,
  };
}

/**
 * Validate student status enum
 */
export function validateStudentStatus(
  status: string
): { valid: boolean; error?: string } {
  const validStatuses = ['ativo', 'inativo', 'parado'];
  if (validStatuses.includes(status.toLowerCase())) {
    return { valid: true };
  }
  return {
    valid: false,
    error: `Status inválido. Opções: ${validStatuses.join(', ')}`,
  };
}
