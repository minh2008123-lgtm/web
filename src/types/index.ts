// User & Auth
export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  level: number;
  xp: number;
  streak: number;
  joinedAt: string;
}

// Course & Learning
export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  skills: Skill[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  skill: SkillType;
  type: ExerciseType;
  duration: number; // minutes
  xpReward: number;
  isCompleted: boolean;
  order: number;
}

export interface CourseProgress {
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
  lastActivity: string;
}

// Skills
export type SkillType = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary';

export interface Skill {
  type: SkillType;
  name: string;
  icon: string;
  color: string;
  progress: number;
}

// Exercises
export type ExerciseType = 'multiple-choice' | 'listening' | 'speaking' | 'reading' | 'writing' | 'flashcard';

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  question: string;
  audioUrl?: string;
  imageUrl?: string;
  options?: Option[];
  correctAnswer?: string | string[];
  explanation?: string;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

// Vocabulary
export interface Vocabulary {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  audioUrl?: string;
  mastery: 'new' | 'learning' | 'reviewing' | 'mastered';
  nextReview?: string;
}

// Progress & Gamification
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'vocabulary' | 'streak';
  xpReward: number;
  isCompleted: boolean;
  progress?: number;
  target?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

// Stats
export interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  longestStreak: number;
  lessonsCompleted: number;
  totalPracticeTime: number; // minutes
  vocabularyLearned: number;
  accuracy: number;
  weeklyXP: number[];
  skillsProgress: Record<SkillType, number>;
}

export interface AttemptResult {
  lessonId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeSpent: number; // seconds
  completedAt: string;
}

// Daily Activity
export interface DailyActivity {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  practiceTime: number;
  streak: number;
}
