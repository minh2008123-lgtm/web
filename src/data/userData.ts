import { User, UserStats, DailyTask, Badge, Achievement, DailyActivity } from '../types';

export const currentUser: User = {
  id: 'user-001',
  email: 'nguyen.van.a@email.com',
  fullName: 'Nguyễn Văn A',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana',
  level: 12,
  xp: 2450,
  streak: 7,
  joinedAt: '2024-01-15',
};

export const userStats: UserStats = {
  totalXP: 2450,
  level: 12,
  streak: 7,
  longestStreak: 14,
  lessonsCompleted: 28,
  totalPracticeTime: 420,
  vocabularyLearned: 156,
  accuracy: 78,
  weeklyXP: [120, 180, 90, 210, 150, 200, 280],
  skillsProgress: {
    listening: 65,
    speaking: 42,
    reading: 78,
    writing: 55,
    vocabulary: 82,
  },
};

export const dailyTasks: DailyTask[] = [
  {
    id: 'task-1',
    title: 'Hoàn thành 1 bài học',
    description: 'Học và làm bài tập trong ngày',
    type: 'lesson',
    xpReward: 50,
    isCompleted: true,
    progress: 1,
    target: 1,
  },
  {
    id: 'task-2',
    title: 'Luyện tập 15 phút',
    description: 'Thực hành kỹ năng bất kỳ',
    type: 'practice',
    xpReward: 30,
    isCompleted: false,
    progress: 10,
    target: 15,
  },
  {
    id: 'task-3',
    title: 'Học 5 từ mới',
    description: 'Thêm từ mới vào bộ từ vựng',
    type: 'vocabulary',
    xpReward: 25,
    isCompleted: false,
    progress: 3,
    target: 5,
  },
  {
    id: 'task-4',
    title: 'Giữ streak 7 ngày',
    description: 'Đăng nhập và học mỗi ngày',
    type: 'streak',
    xpReward: 100,
    isCompleted: false,
    progress: 7,
    target: 7,
  },
];

export const badges: Badge[] = [
  {
    id: 'badge-1',
    name: 'Người mới bắt đầu',
    description: 'Hoàn thành bài học đầu tiên',
    icon: '🎯',
    unlockedAt: '2024-01-16',
  },
  {
    id: 'badge-2',
    name: 'Streak 7 ngày',
    description: 'Học liên tục 7 ngày',
    icon: '🔥',
    unlockedAt: '2024-01-22',
  },
  {
    id: 'badge-3',
    name: 'Học giỏi',
    description: 'Đạt accuracy trên 90%',
    icon: '⭐',
    unlockedAt: '2024-02-01',
  },
  {
    id: 'badge-4',
    name: 'Người yêu từ vựng',
    description: 'Học 100 từ mới',
    icon: '📚',
  },
  {
    id: 'badge-5',
    name: 'Bậc thầy nghe',
    description: 'Hoàn thành 20 bài luyện nghe',
    icon: '🎧',
  },
];

export const achievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Chiến binh streak',
    description: 'Duy trì streak 30 ngày',
    icon: '🏆',
    xpReward: 500,
    progress: 7,
    target: 30,
  },
  {
    id: 'ach-2',
    title: 'Hoàn thành A2',
    description: 'Kết thúc lộ trình A2',
    icon: '🎓',
    xpReward: 1000,
    progress: 45,
    target: 100,
  },
  {
    id: 'ach-3',
    title: 'Top 10%',
    description: 'Đạt top 10% XP tuần này',
    icon: '💎',
    xpReward: 200,
  },
];

export const recentActivities: DailyActivity[] = [
  { date: '2024-02-18', xpEarned: 280, lessonsCompleted: 2, practiceTime: 45, streak: 7 },
  { date: '2024-02-17', xpEarned: 200, lessonsCompleted: 1, practiceTime: 30, streak: 6 },
  { date: '2024-02-16', xpEarned: 150, lessonsCompleted: 1, practiceTime: 25, streak: 5 },
  { date: '2024-02-15', xpEarned: 210, lessonsCompleted: 2, practiceTime: 40, streak: 4 },
  { date: '2024-02-14', xpEarned: 90, lessonsCompleted: 1, practiceTime: 20, streak: 3 },
  { date: '2024-02-13', xpEarned: 180, lessonsCompleted: 1, practiceTime: 35, streak: 2 },
  { date: '2024-02-12', xpEarned: 120, lessonsCompleted: 1, practiceTime: 30, streak: 1 },
];
