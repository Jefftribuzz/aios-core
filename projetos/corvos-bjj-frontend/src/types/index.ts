export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
  refreshToken: string;
}

export type StudentStatus = 'ativo' | 'inativo' | 'parado';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: StudentStatus;
  startDate: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface StudentsListResponse {
  data: Student[];
  pagination: Pagination;
}

export interface StudentsListQuery {
  page?: number;
  limit?: number;
  status?: StudentStatus;
  search?: string;
}

export interface CreateStudentPayload {
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  status?: StudentStatus;
}

export interface UpdateStudentPayload {
  name?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  status?: StudentStatus;
}

export type PaymentStatus = 'pago' | 'pendente' | 'atrasado';

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate: string | null;
  dueDate: string;
  status: PaymentStatus;
  paymentMethod: string | null;
  referenceMonth: string | null;
  notes: string | null;
  createdAt: string;
  student: {
    id: string;
    name: string;
    email: string;
  };
}

export interface PaymentsListQuery {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
  studentId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaymentsListResponse {
  data: Payment[];
  pagination: Pagination;
}

export interface CreatePaymentPayload {
  studentId: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod?: string;
  status?: PaymentStatus;
  referenceMonth?: string;
  notes?: string;
}

export interface UpdatePaymentPayload {
  amount?: number;
  dueDate?: string;
  paymentDate?: string;
  paymentMethod?: string;
  status?: PaymentStatus;
  notes?: string;
}

export type BeltColor = 'branca' | 'azul' | 'roxa' | 'marrom' | 'preta';

export interface Grade {
  id: string;
  studentId: string;
  beltColor: BeltColor;
  promotionDate: string;
  notes: string | null;
  createdAt: string;
}

export interface GradesByStudentResponse {
  data: Grade[];
  studentId: string;
}

export interface CreateGradePayload {
  beltColor: BeltColor;
  promotionDate: string;
  notes?: string;
}

export interface UpdateGradePayload {
  beltColor?: BeltColor;
  promotionDate?: string;
  notes?: string;
}
