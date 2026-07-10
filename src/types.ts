export interface Lesson {
  id: string;
  title: string;
  content: string; // Markdown or formatted text
  bullets: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface CourseModule {
  id: string;
  title: string;
  shortDescription: string;
  category: 'foundations' | 'pension' | 'tfsa' | 'rrsp' | 'compounding';
  lessons: Lesson[];
  quiz: QuizQuestion[];
  xpReward: number;
  badgeId?: string;
}

export interface UserBadge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji or Lucide icon name
  unlockedAt?: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  level: number;
  completedModules: string[]; // List of module IDs
  completedLessons: string[]; // List of lesson IDs (module_id:lesson_id)
  unlockedBadges: string[]; // List of badge IDs
  dailyChallengeDone: boolean;
  score: number;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface SimplifiedTaxEstimate {
  salary: number;
  contribution: number;
  estimatedRefund: number;
  marginalRate: number;
}
