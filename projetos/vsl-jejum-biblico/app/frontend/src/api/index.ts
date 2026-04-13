import axios from 'axios';
import { AuthResponse, PlanResponse, Objective, Duration, Plan } from '@/types';
import {
  generateMockDailyTasks,
  getMockUser,
  setMockUser,
  getMockUserPlan,
  setMockUserPlan,
} from './mocks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      // Mock registration
      const mockUser = {
        id: 'mock-user-' + Date.now(),
        email,
        created_at: new Date().toISOString(),
      };
      const mockToken = 'mock-token-' + Date.now();
      setMockUser(mockUser);
      return { user: mockUser, token: mockToken };
    }
    const response = await apiClient.post<AuthResponse>('/auth/register', {
      email,
      password,
    });
    return response.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    if (USE_MOCKS) {
      const mockUser = {
        id: 'mock-user-' + email,
        email,
        created_at: new Date().toISOString(),
      };
      const mockToken = 'mock-token-' + Date.now();
      setMockUser(mockUser);
      return { user: mockUser, token: mockToken };
    }
    const response = await apiClient.post<AuthResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
};

// Plans API
export const plansAPI = {
  create: async (
    objective: Objective,
    duration: Duration,
    restrictions: string[] = [],
    start_date: string,
  ): Promise<PlanResponse> => {
    if (USE_MOCKS) {
      // Mock plan creation
      const dailyTasks = generateMockDailyTasks(objective, duration);
      const plan: Plan = {
        id: 'mock-plan-' + Date.now(),
        user_id: getMockUser()?.id || 'mock-user',
        objective,
        duration,
        start_date,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const mockPlan = { plan, daily_tasks: dailyTasks };
      setMockUserPlan(mockPlan);
      return mockPlan;
    }
    const response = await apiClient.post<PlanResponse>('/plans', {
      objective,
      duration,
      restrictions,
      start_date,
    });
    return response.data;
  },

  getById: async (planId: string): Promise<PlanResponse> => {
    if (USE_MOCKS) {
      const mockPlan = getMockUserPlan();
      if (mockPlan && mockPlan.plan.id === planId) {
        return mockPlan;
      }
      throw new Error('Plan not found');
    }
    const response = await apiClient.get<PlanResponse>(`/plans/${planId}`);
    return response.data;
  },

  getAll: async (limit: number = 10, offset: number = 0) => {
    if (USE_MOCKS) {
      const mockPlan = getMockUserPlan();
      return {
        plans: mockPlan ? [mockPlan.plan] : [],
        pagination: { limit, offset, total: mockPlan ? 1 : 0 },
      };
    }
    const response = await apiClient.get('/plans', {
      params: { limit, offset },
    });
    return response.data;
  },

  updateStatus: async (planId: string, status: string) => {
    if (USE_MOCKS) {
      const mockPlan = getMockUserPlan();
      if (mockPlan && mockPlan.plan.id === planId) {
        mockPlan.plan.status = status;
        mockPlan.plan.updated_at = new Date().toISOString();
        setMockUserPlan(mockPlan);
        return { plan: mockPlan.plan };
      }
      throw new Error('Plan not found');
    }
    const response = await apiClient.patch(`/plans/${planId}`, { status });
    return response.data;
  },
};

// Content API
export const contentAPI = {
  getPrayers: async (type?: string) => {
    if (USE_MOCKS) {
      const response = await import('./mocks');
      const prayers = response.mockPrayers || [];
      return {
        prayers: type ? prayers.filter((p) => p.type === type) : prayers,
      };
    }
    const params = type ? { type } : {};
    const response = await apiClient.get('/content/prayers', { params });
    return response.data;
  },

  getMeditations: async (duration?: number) => {
    if (USE_MOCKS) {
      // Return all mocks for now
      const response = await import('./mocks');
      return { meditations: response.mockMeditations || [] };
    }
    const params = duration ? { duration } : {};
    const response = await apiClient.get('/content/meditations', { params });
    return response.data;
  },

  getMeals: async (restrictions?: string) => {
    if (USE_MOCKS) {
      const response = await import('./mocks');
      return { meals: response.mockMeals || [] };
    }
    const params = restrictions ? { restrictions } : {};
    const response = await apiClient.get('/content/meals', { params });
    return response.data;
  },
};

export default apiClient;
