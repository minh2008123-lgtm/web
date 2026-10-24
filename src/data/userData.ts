import {
  User,
  UserStats,
  DailyTask,
  Badge,
  Achievement,
  DailyActivity,
  AttemptResult,
  WritingDraft,
  XPTransaction,
} from '../types';

export const createDefaultStats = (level = 1, totalXP = 0): UserStats => ({
  totalXP,
  level,
  streak: 1,
  longestStreak: 1,
  lessonsCompleted: 0,
  totalPracticeTime: 0,
  vocabularyLearned: 0,
  accuracy: 100,
  weeklyXP: [0, 0, 0, 0, 0, 0, totalXP],
  skillsProgress: {
    listening: 0,
    speaking: 0,
    reading: 0,
    writing: 0,
    vocabulary: 0,
  },
  skillAccuracy: {
    listening: 100,
    speaking: 100,
    reading: 100,
    writing: 100,
    vocabulary: 100,
  },
});

export const currentUser: User = {
  id: 'user-001',
  email: 'hocvien@linguaquest.vn',
  fullName: 'Học viên LinguaQuest',
  level: 1,
  xp: 0,
  streak: 1,
  joinedAt: '2026-10-24',
  targetLevel: 'B1',
  dailyGoalMinutes: 20,
};

export const demoAccounts: User[] = [
  currentUser,
];

export const userStats: UserStats = createDefaultStats(1, 0);

export const dailyTasks: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Hoàn thành 1 bài học bất kỳ',
    description: 'Làm bài tập và xem giải thích chi tiết',
    type: 'lesson',
    xpReward: 50,
    isCompleted: true,
    progress: 1,
    target: 1,
  },
  {
    id: 'task-2',
    title: 'Luyện kỹ năng Nghe hoặc Nói',
    description: 'Hoàn thành 1 bài nghe tương tác hoặc thu âm 1 câu nói',
    type: 'practice',
    xpReward: 35,
    isCompleted: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'task-3',
    title: 'Ôn tập 3 thẻ từ vựng SM-2',
    description: 'Đánh giá mức độ nhớ trong Flashcards hoặc Ôn tập',
    type: 'vocabulary',
    xpReward: 30,
    isCompleted: false,
    progress: 1,
    target: 3,
  },
  {
    id: 'task-4',
    title: 'Lưu hoặc nộp 1 bài viết',
    description: 'Thực hành viết đoạn văn/email với trình soạn thảo',
    type: 'practice',
    xpReward: 40,
    isCompleted: false,
    progress: 0,
    target: 1,
  },
];

export const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Khởi đầu vững chắc',
    description: 'Hoàn thành bài học đầu tiên trên LinguaQuest',
    icon: '🎯',
    unlockedAt: '2026-09-02',
  },
  {
    id: 'badge-2',
    name: 'Chuỗi 7 ngày lửa',
    description: 'Duy trì học tập liên tục 7 ngày không nghỉ',
    icon: '🔥',
    unlockedAt: '2026-09-08',
  },
  {
    id: 'badge-3',
    name: 'Độ chính xác cao',
    description: 'Đạt điểm 90% trở lên trong một bài học',
    icon: '⭐',
    unlockedAt: '2026-09-18',
  },
  {
    id: 'badge-4',
    name: 'Bậc thầy SRS',
    description: 'Ôn tập thành thạo 50 từ vựng với thuật toán SM-2',
    icon: '🧠',
  },
  {
    id: 'badge-5',
    name: 'Đôi tai nhạy bén',
    description: 'Hoàn thành 10 bài luyện nghe có transcript',
    icon: '🎧',
  },
  {
    id: 'badge-6',
    name: 'Cây bút trẻ',
    description: 'Hoàn thành và tự chấm 5 bài viết theo tiêu chí Rubric',
    icon: '✍️',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Chiến binh Streak 30 ngày',
    description: 'Duy trì chuỗi ngày học liên tục trong 30 ngày',
    icon: '🏆',
    xpReward: 500,
    progress: 7,
    target: 30,
  },
  {
    id: 'ach-2',
    title: 'Chinh phục CEFR A2',
    description: 'Hoàn thành toàn bộ bài học trong lộ trình A1 và A2',
    icon: '🎓',
    xpReward: 1000,
    progress: 4,
    target: 12,
  },
  {
    id: 'ach-3',
    title: 'Phát triển toàn diện 4 kỹ năng',
    description: 'Đạt tiến độ trên 70% ở cả Nghe, Nói, Đọc, Viết',
    icon: '💎',
    xpReward: 400,
    progress: 1,
    target: 4,
  },
];

export const initialAttempts: AttemptResult[] = [
  {
    id: 'att-1',
    lessonId: 'lesson-a1-1',
    lessonTitle: 'Greetings & Introductions',
    skill: 'speaking',
    score: 90,
    correctAnswers: 4,
    totalQuestions: 4,
    xpEarned: 27,
    timeSpent: 320,
    completedAt: '2026-10-20',
  },
  {
    id: 'att-2',
    lessonId: 'lesson-a1-2',
    lessonTitle: 'Numbers, Time & Counting',
    skill: 'listening',
    score: 85,
    correctAnswers: 2,
    totalQuestions: 3,
    xpEarned: 21,
    timeSpent: 280,
    completedAt: '2026-10-21',
  },
  {
    id: 'att-3',
    lessonId: 'lesson-a1-3',
    lessonTitle: 'Daily Routines & Habits',
    skill: 'reading',
    score: 80,
    correctAnswers: 3,
    totalQuestions: 3,
    xpEarned: 28,
    timeSpent: 410,
    completedAt: '2026-10-22',
  },
];

export const initialXPTransactions: XPTransaction[] = [
  {
    id: 'xptx-1',
    userId: 'user-001',
    sourceType: 'lesson_complete',
    sourceId: 'lesson-a1-1',
    idempotencyKey: 'lesson_first:lesson-a1-1',
    xpAmount: 27,
    note: 'Hoàn thành lần đầu bài Greetings & Introductions (90%)',
    createdAt: '20/10/2026 09:15',
  },
  {
    id: 'xptx-2',
    userId: 'user-001',
    sourceType: 'lesson_complete',
    sourceId: 'lesson-a1-2',
    idempotencyKey: 'lesson_first:lesson-a1-2',
    xpAmount: 21,
    note: 'Hoàn thành lần đầu bài Numbers, Time & Counting (85%)',
    createdAt: '21/10/2026 14:20',
  },
  {
    id: 'xptx-3',
    userId: 'user-001',
    sourceType: 'lesson_complete',
    sourceId: 'lesson-a1-3',
    idempotencyKey: 'lesson_first:lesson-a1-3',
    xpAmount: 28,
    note: 'Hoàn thành lần đầu bài Daily Routines & Habits (80%)',
    createdAt: '22/10/2026 19:45',
  },
];

export const initialWritingDrafts: WritingDraft[] = [
  {
    id: 'draft-1',
    promptId: 'write-1',
    title: 'Email gửi Alex về thói quen học tập (Bản nháp 1)',
    content:
      'Hi Alex,\n\nI usually wake up at 6:30 AM on weekdays. After breakfast, I walk to my university campus. In the afternoon, I spend time reading English articles in the library. To improve my English, I often practice flashcards every evening.',
    wordCount: 41,
    updatedAt: '2026-10-22 08:30',
    status: 'draft',
  },
];

export const recentActivities: DailyActivity[] = [
  { date: '2026-10-22', xpEarned: 280, lessonsCompleted: 2, practiceTime: 45, streak: 7 },
  { date: '2026-10-21', xpEarned: 200, lessonsCompleted: 1, practiceTime: 30, streak: 6 },
  { date: '2026-10-20', xpEarned: 150, lessonsCompleted: 1, practiceTime: 25, streak: 5 },
  { date: '2026-10-19', xpEarned: 210, lessonsCompleted: 2, practiceTime: 40, streak: 4 },
  { date: '2026-10-18', xpEarned: 90, lessonsCompleted: 1, practiceTime: 20, streak: 3 },
  { date: '2026-10-17', xpEarned: 180, lessonsCompleted: 1, practiceTime: 35, streak: 2 },
  { date: '2026-10-16', xpEarned: 120, lessonsCompleted: 1, practiceTime: 30, streak: 1 },
];
