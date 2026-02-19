import { create } from 'zustand';
import { User, Plan, DailyTask } from '@/types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Hydrate from localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    const user = localStorage.getItem('auth_user');
    if (token && user) {
      set({ token, user: JSON.parse(user), isLoggedIn: true });
    }
  }

  return {
    user: null,
    token: null,
    isLoggedIn: false,
    setUser: (user: User | null) => {
      set({ user });
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('auth_user', JSON.stringify(user));
        } else {
          localStorage.removeItem('auth_user');
        }
      }
    },
    setToken: (token: string | null) => {
      set({ token, isLoggedIn: !!token });
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('auth_token', token);
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    },
    logout: () => {
      set({ user: null, token: null, isLoggedIn: false });
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
  };
});

interface PlanStore {
  currentPlan: Plan | null;
  dailyTasks: DailyTask[];
  setCurrentPlan: (plan: Plan | null) => void;
  setDailyTasks: (tasks: DailyTask[]) => void;
  completeTask: (taskId: string) => void;
}

export const usePlanStore = create<PlanStore>((set) => ({
  currentPlan: null,
  dailyTasks: [],
  setCurrentPlan: (plan: Plan | null) => set({ currentPlan: plan }),
  setDailyTasks: (tasks: DailyTask[]) => set({ dailyTasks: tasks }),
  completeTask: (taskId: string) =>
    set((state) => ({
      dailyTasks: state.dailyTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed_at: new Date().toISOString() }
          : task,
      ),
    })),
}));

interface UIStore {
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  error: null,
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
