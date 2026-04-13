import type {
  CreateStudentPayload,
  Student,
  StudentsListQuery,
  StudentsListResponse,
  UpdateStudentPayload,
} from '@/types';
import http from '@/utils/http';

export async function getStudents(query: StudentsListQuery = {}) {
  const response = await http.get<StudentsListResponse>('/students', {
    params: query,
  });

  return response.data;
}

export async function createStudent(payload: CreateStudentPayload) {
  const response = await http.post<Student>('/students', payload);
  return response.data;
}

export async function updateStudent(studentId: string, payload: UpdateStudentPayload) {
  const response = await http.put<Student>(`/students/${studentId}`, payload);
  return response.data;
}

export async function deleteStudent(studentId: string) {
  await http.delete(`/students/${studentId}`);
}
