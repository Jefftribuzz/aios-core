export type Objective = 'cura' | 'sabedoria' | 'libertacao' | 'dedicacao';
export type Duration = 3 | 7 | 21 | 40;
export type PlanStatus = 'active' | 'completed' | 'abandoned';

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Plan {
  id: string;
  user_id: string;
  objective: Objective;
  duration: Duration;
  start_date: string;
  status: PlanStatus;
  created_at: string;
  updated_at: string;
}

export interface Prayer {
  id: string;
  title: string;
  text: string;
  type: Objective;
  duration_minutes: number;
}

export interface Meditation {
  id: string;
  title: string;
  description: string;
  audio_url?: string;
  duration_minutes: number;
  type: 'guided' | 'music' | 'silence';
}

export interface Meal {
  id: string;
  title: string;
  ingredients: string;
  prep_time_minutes: number;
  calories: number;
  restrictions: string;
}

export interface DailyTask {
  id: string;
  day_number: number;
  notes: string;
  completed_at?: string;
  prayer: Prayer;
  meditation: Meditation;
  meal: Meal;
}

export interface PlanResponse {
  plan: Plan;
  daily_tasks: DailyTask[];
}

export interface WizardFormData {
  objective: Objective;
  duration: Duration;
  restrictions: string[];
  start_date: string;
}
