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
  targetLevel?: CEFRLevel;
  dailyGoalMinutes?: number;
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

// Skills
export type SkillType = 'listening' | 'speaking' | 'reading' | 'writing' | 'vocabulary';

export interface Skill {
  type: SkillType;
  name: string;
  icon: string;
  color: string;
  progress: number;
}

// Course & Learning
export interface Course {
  id: string;
  title: string;
  description: string;
  level: CEFRLevel;
  thumbnail: string;
  totalLessons: number;
  completedLessons: number;
  skills: Skill[];
}

export type ExerciseQuestionType =
  | 'multiple-choice'
  | 'fill-blank'
  | 'true-false'
  | 'sentence-order';

export type ExerciseType =
  | 'multiple-choice'
  | 'listening'
  | 'speaking'
  | 'reading'
  | 'writing'
  | 'flashcard';

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
  bestScore?: number;
}

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseQuestionType;
  question: string;
  promptHint?: string;
  audioText?: string;
  options?: Option[];
  correctAnswer?: string;
  wordBank?: string[];
  explanation: string;
  evidenceParagraph?: number;
}

// 1. Listening Module Types
export interface TranscriptLine {
  id: string;
  speaker: string;
  role?: string;
  startTime: number; // seconds
  endTime: number;   // seconds
  text: string;
  translation: string;
  highlightWords?: { word: string; phonetic: string; meaning: string }[];
}

export interface ListeningTrack {
  id: string;
  lessonId: string;
  title: string;
  level: CEFRLevel;
  topic: string;
  duration: number; // seconds
  situation: string;
  transcript: TranscriptLine[];
  exercises: Exercise[];
}

// 2. Speaking Module Types
export interface SpeakingPrompt {
  id: string;
  lessonId: string;
  title: string;
  level: CEFRLevel;
  topic: string;
  context: string;
  targetSentence: string;
  phonetic: string;
  translation: string;
  tips: string[];
  keyWords: string[];
}

export interface SpeakingAttempt {
  promptId: string;
  recordedAt: string;
  transcript: string;
  accuracy: number;
  matchedWords: { word: string; isMatched: boolean }[];
  durationSeconds: number;
  audioBlobUrl?: string;
}

// 3. Reading Module Types
export interface ReadingGlossaryItem {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
}

export interface ReadingParagraph {
  id: number;
  text: string;
  translation: string;
}

export interface ReadingPassage {
  id: string;
  lessonId: string;
  title: string;
  level: CEFRLevel;
  topic: string;
  readingTime: number; // minutes
  wordCount: number;
  paragraphs: ReadingParagraph[];
  glossary: ReadingGlossaryItem[];
  questions: Exercise[];
}

// 4. Writing Module Types
export interface WritingRubricCriterion {
  id: string;
  name: string;
  description: string;
  maxScore: number;
}

export interface WritingPrompt {
  id: string;
  lessonId: string;
  title: string;
  level: CEFRLevel;
  category: 'email' | 'paragraph' | 'essay' | 'story';
  prompt: string;
  minWords: number;
  maxWords: number;
  outlineSuggestions: string[];
  usefulPhrases: { phrase: string; meaning: string; usage: string }[];
  modelAnswer: string;
  modelAnalysis: string;
  rubric: WritingRubricCriterion[];
}

export interface WritingDraft {
  id: string;
  promptId: string;
  title: string;
  content: string;
  wordCount: number;
  updatedAt: string;
  status: 'draft' | 'submitted';
  rubricScores?: Record<string, number>;
  objectiveScore?: number;
  totalScore?: number;
  notes?: string;
}

// 5. Vocabulary & Spaced Repetition (SM-2)
export type MasteryLevel = 'new' | 'learning' | 'reviewing' | 'mastered';

export type SRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export interface Vocabulary {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: 'n' | 'v' | 'adj' | 'adv' | 'phrase';
  level: CEFRLevel;
  topic: string;
  meaning: string;
  example: string;
  exampleMeaning: string;
  mastery: MasteryLevel;
  // SM-2 fields
  repetitions: number;
  easeFactor: number;
  interval: number; // in days
  nextReview?: string; // ISO date YYYY-MM-DD
  lastReviewed?: string;
  isFavorite?: boolean;
}

// 6. Progress, Gamification & Recommendations
export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'lesson' | 'practice' | 'vocabulary' | 'streak';
  xpReward: number;
  isCompleted: boolean;
  progress: number;
  target: number;
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
  progress: number;
  target: number;
}

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
  skillAccuracy: Record<SkillType, number>;
}

export interface AttemptResult {
  id: string;
  lessonId: string;
  lessonTitle: string;
  skill: SkillType;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  xpEarned: number;
  timeSpent: number; // seconds
  completedAt: string;
}

export interface DailyActivity {
  date: string;
  xpEarned: number;
  lessonsCompleted: number;
  practiceTime: number;
  streak: number;
}

export interface LearningRecommendation {
  id: string;
  title: string;
  reason: string;
  skill: SkillType;
  priority: 'high' | 'medium' | 'normal';
  targetPath: string;
  xpReward: number;
  estimatedMinutes: number;
}
