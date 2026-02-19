import { 
  Prayer, 
  Meditation, 
  Meal, 
  DailyTask, 
  Plan,
  Objective,
  Duration
} from '@/types';

// Mock data - Content library
const mockPrayers: Prayer[] = [
  {
    id: '1',
    title: 'Oração de Cura Interior',
    text: 'Senhor, cure minhas feridas emocionais e físicas. Toco em Tua compaixão para receber restauração completa.',
    type: 'cura',
    duration_minutes: 5,
  },
  {
    id: '2',
    title: 'Oração de Sabedoria',
    text: 'Concede-me sabedoria para entender Teus caminhos. Ilumina meu discernimento com Tua verdade.',
    type: 'sabedoria',
    duration_minutes: 7,
  },
  {
    id: '3',
    title: 'Oração de Libertação',
    text: 'Liberte-me de tudo que me prende. Rompo com correntes visíveis e invisíveis em nome de Jesus.',
    type: 'libertacao',
    duration_minutes: 8,
  },
  {
    id: '4',
    title: 'Oração de Dedicação',
    text: 'Dedico meu coração, mente e corpo a Ti. Que meu jejum seja agradável aos Teus olhos.',
    type: 'dedicacao',
    duration_minutes: 5,
  },
];

const mockMeditations: Meditation[] = [
  {
    id: 'm1',
    title: 'Respiração Guiada - Iniciante',
    description: 'Meditação de respiração lenta para iniciantes. Focue em cada respiração.',
    audio_url: 'https://example.com/breathing-1.mp3',
    duration_minutes: 5,
    type: 'guided',
  },
  {
    id: 'm2',
    title: 'Meditação da Manhã',
    description: 'Inicie seu dia com paz e propósito',
    audio_url: 'https://example.com/morning.mp3',
    duration_minutes: 10,
    type: 'guided',
  },
  {
    id: 'm3',
    title: 'Silêncio Sagrado',
    description: 'Repouso em silêncio com Deus',
    audio_url: null,
    duration_minutes: 12,
    type: 'silence',
  },
];

const mockMeals: Meal[] = [
  {
    id: 'meal1',
    title: 'Caldo de Osso',
    ingredients: 'Ossos de frango, água, sal, ervas',
    prep_time_minutes: 120,
    calories: 100,
    restrictions: '',
  },
  {
    id: 'meal2',
    title: 'Sopa de Legumes Leve',
    ingredients: 'Cenoura, abóbora, cebola, sal',
    prep_time_minutes: 20,
    calories: 80,
    restrictions: 'vegan',
  },
  {
    id: 'meal3',
    title: 'Chá de Gengibre com Mel',
    ingredients: 'Gengibre fresco, mel natural, água morna',
    prep_time_minutes: 5,
    calories: 40,
    restrictions: '',
  },
];

// Generate daily tasks for a plan
export function generateMockDailyTasks(
  objective: Objective,
  duration: Duration,
): DailyTask[] {
  const tasks: DailyTask[] = [];
  
  for (let day = 1; day <= duration; day++) {
    const progressionFactor = 0.4 + (day / duration) * 0.5;
    
    // Select prayer by objective
    const prayer = mockPrayers.find(p => p.type === objective) || mockPrayers[0];
    
    // Select meditation based on progression
    let meditation: Meditation;
    if (progressionFactor < 0.5) {
      meditation = mockMeditations[0]; // Easy
    } else if (progressionFactor < 0.7) {
      meditation = mockMeditations[1]; // Medium
    } else {
      meditation = mockMeditations[2]; // Deep
    }
    
    // Select meal (round-robin)
    const meal = mockMeals[day % mockMeals.length];
    
    // Create note
    const progressPercent = Math.round((day / duration) * 100);
    let notes = `Dia ${day} de ${duration} (${progressPercent}%)`;
    if (day === 1) {
      notes = `🌅 Dia 1 - Inicie sua jornada de ${duration} dias em busca de ${objective}`;
    } else if (day === duration) {
      notes = `🏆 Último dia - ${progressPercent}% completo! Celebre sua vitória!`;
    } else if (day === Math.ceil(duration / 2)) {
      notes = `💪 Meio do caminho - ${progressPercent}% completo! Força!`;
    }
    
    tasks.push({
      id: `task-${day}`,
      day_number: day,
      notes,
      prayer,
      meditation,
      meal,
    });
  }
  
  return tasks;
}

// Mock user storage
const mockStorageKey = 'mock_sejum_user';
const mockPlanStorageKey = 'mock_sejum_plan';

export function getMockUser() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(mockStorageKey);
  return stored ? JSON.parse(stored) : null;
}

export function setMockUser(user: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(mockStorageKey, JSON.stringify(user));
}

export function getMockUserPlan() {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(mockPlanStorageKey);
  return stored ? JSON.parse(stored) : null;
}

export function setMockUserPlan(plan: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(mockPlanStorageKey, JSON.stringify(plan));
}
