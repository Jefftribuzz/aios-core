import type {
  CreateGradePayload,
  Grade,
  GradesByStudentResponse,
  UpdateGradePayload,
} from '@/types';
import http from '@/utils/http';

interface GradeDistributionItem {
  beltColor: string;
  _count: {
    id: number;
  };
}

interface GradeDistributionResponse {
  data: GradeDistributionItem[];
}

export async function getStudentGrades(studentId: string) {
  const response = await http.get<GradesByStudentResponse>(`/grades/student/${studentId}`);
  return response.data;
}

export async function createGrade(studentId: string, payload: CreateGradePayload) {
  const response = await http.post<Grade>(`/grades/student/${studentId}/create`, payload);
  return response.data;
}

export async function updateGrade(gradeId: string, payload: UpdateGradePayload) {
  const response = await http.put<Grade>(`/grades/${gradeId}`, payload);
  return response.data;
}

export async function deleteGrade(gradeId: string) {
  await http.delete(`/grades/${gradeId}`);
}

export async function getGradeDistribution() {
  const response = await http.get<GradeDistributionResponse>('/grades/stats/distribution');
  return response.data;
}
