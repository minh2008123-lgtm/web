import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserStats,
  Course,
  Lesson,
  Vocabulary,
  DailyTask,
  AttemptResult,
  WritingDraft,
  SpeakingAttempt,
  SkillType,
  SRSRating,
  LearningRecommendation,
  XPTransaction,
  XPSourceType,
} from '../types';
import {
  courses as initialCourses,
  lessons as initialLessons,
  vocabularyList as initialVocab,
} from '../data/coursesData';
import {
  currentUser as initialUser,
  demoAccounts,
  userStats as initialStats,
  createDefaultStats,
  dailyTasks as initialTasks,
  initialAttempts,
  initialWritingDrafts,
  initialXPTransactions,
} from '../data/userData';
import { calculateSM2, getDueVocabulary } from '../lib/srs';
import { VoiceAccent, playFeedbackTone } from '../lib/audio';
import {
  loadPersistedState,
  savePersistedState,
  clearPersistedState,
  getStoredAccounts,
  saveStoredAccount,
  findStoredAccount,
} from '../services/storageService';
import { generateRecommendations } from '../services/recommendationService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  fetchUserLearningDataFromSupabase,
  syncLessonAttemptToSupabase,
  syncVocabularyReviewToSupabase,
  syncWritingDraftToSupabase,
} from '../services/supabaseDataService';

interface LearningContextValue {
  user: User;
  isAuthenticated: boolean;
  isSupabaseConnected: boolean;
  stats: UserStats;
  courses: Course[];
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  dueVocabulary: Vocabulary[];
  dailyTasks: DailyTask[];
  attempts: AttemptResult[];
  xpTransactions: XPTransaction[];
  writingDrafts: WritingDraft[];
  speakingAttempts: SpeakingAttempt[];
  recommendations: LearningRecommendation[];
  accent: VoiceAccent;
  speechRate: number;
  notification: string | null;
  setAccent: (accent: VoiceAccent) => void;
  setSpeechRate: (rate: number) => void;
  clearNotification: () => void;
  notify: (msg: string) => void;
  signIn: (email: string, password?: string) => Promise<{ ok: boolean; message: string }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ ok: boolean; message: string }>;
  signOut: () => Promise<void>;
  switchDemoUser: (userId: string) => void;
  completeLessonAttempt: (params: {
    lessonId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
  }) => { xpEarned: number; duplicatePrevented: boolean };
  recordSkillPractice: (skill: SkillType, accuracyScore: number, xpBonus: number, title: string) => void;
  reviewVocabularyCard: (vocabId: string, rating: SRSRating) => void;
  addCustomVocabulary: (newWord: Omit<Vocabulary, 'id' | 'mastery' | 'repetitions' | 'easeFactor' | 'interval'>) => void;
  toggleFavoriteVocabulary: (vocabId: string) => void;
  saveWritingDraft: (draft: Omit<WritingDraft, 'updatedAt'>) => WritingDraft;
  deleteWritingDraft: (draftId: string) => void;
  recordSpeakingAttempt: (attempt: SpeakingAttempt) => void;
  updateUserProfile: (patch: Partial<User>) => void;
  resetDemoState: () => void;
}

const LearningContext = createContext<LearningContextValue | undefined>(undefined);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(
    () =>
      loadPersistedState({
        user: initialUser,
        isAuthenticated: true,
        stats: initialStats,
        courses: initialCourses,
        lessons: initialLessons,
        vocabulary: initialVocab,
        dailyTasks: initialTasks,
        attempts: initialAttempts,
        xpTransactions: initialXPTransactions,
        writingDrafts: initialWritingDrafts,
        speakingAttempts: [] as SpeakingAttempt[],
        accent: 'en-US' as VoiceAccent,
        speechRate: 1.0,
      }),
    []
  );

  // Chuẩn hóa Level và XP: Level luôn = Math.max(1, Math.floor(XP / 200) + 1). Mặc định tài khoản mới luôn là Level 1 (0 XP)
  const initialXP = persisted.stats?.totalXP ?? persisted.user?.xp ?? 0;
  const initialCalculatedLevel = Math.max(1, Math.floor(initialXP / 200) + 1);

  const [user, setUser] = useState<User>(() => ({
    ...persisted.user,
    xp: initialXP,
    level: initialCalculatedLevel,
  }));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(persisted.isAuthenticated);
  const [stats, setStats] = useState<UserStats>(() => ({
    ...persisted.stats,
    totalXP: initialXP,
    level: initialCalculatedLevel,
  }));
  const [courses, setCourses] = useState<Course[]>(persisted.courses);
  const [lessons, setLessons] = useState<Lesson[]>(persisted.lessons);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>(persisted.vocabulary);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(persisted.dailyTasks);
  const [attempts, setAttempts] = useState<AttemptResult[]>(persisted.attempts);
  const [xpTransactions, setXpTransactions] = useState<XPTransaction[]>(
    persisted.xpTransactions || initialXPTransactions
  );
  const [writingDrafts, setWritingDrafts] = useState<WritingDraft[]>(persisted.writingDrafts);
  const [speakingAttempts, setSpeakingAttempts] = useState<SpeakingAttempt[]>(
    persisted.speakingAttempts
  );
  const [accent, setAccent] = useState<VoiceAccent>(persisted.accent);
  const [speechRate, setSpeechRate] = useState<number>(persisted.speechRate);
  const [notification, setNotification] = useState<string | null>(null);

  // Lắng nghe phiên đăng nhập Supabase Auth nếu đã cấu hình .env
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setIsAuthenticated(true);
        const remote = await fetchUserLearningDataFromSupabase(session.user.id);
        if (remote?.profile) {
          setUser((prev) => ({
            ...prev,
            ...remote.profile,
            id: session.user.id,
            email: session.user.email || prev.email,
          }));
        }
        if (remote?.attempts && remote.attempts.length > 0) setAttempts(remote.attempts);
        if (remote?.xpTransactions && remote.xpTransactions.length > 0) {
          setXpTransactions(remote.xpTransactions);
        }
        if (remote?.writingDrafts && remote.writingDrafts.length > 0) {
          setWritingDrafts(remote.writingDrafts);
        }
      }
    });
  }, []);

  useEffect(() => {
    savePersistedState({
      user,
      isAuthenticated,
      stats,
      courses,
      lessons,
      vocabulary,
      dailyTasks,
      attempts,
      xpTransactions,
      writingDrafts,
      speakingAttempts,
      accent,
      speechRate,
    });

    if (user.email && isAuthenticated) {
      saveStoredAccount({
        user,
        stats,
      });
    }
  }, [
    user,
    isAuthenticated,
    stats,
    courses,
    lessons,
    vocabulary,
    dailyTasks,
    attempts,
    xpTransactions,
    writingDrafts,
    speakingAttempts,
    accent,
    speechRate,
  ]);

  const notify = (msg: string) => setNotification(msg);
  const clearNotification = () => setNotification(null);

  const dueVocabulary = useMemo(() => getDueVocabulary(vocabulary), [vocabulary]);

  const recommendations = useMemo(
    () => generateRecommendations(lessons, stats, vocabulary, attempts),
    [lessons, stats, vocabulary, attempts]
  );

  /**
   * Ghi sổ cái XP với khóa chống trùng lặp (idempotencyKey)
   */
  const recordXPTransaction = (
    sourceType: XPSourceType,
    sourceId: string,
    idempotencyKey: string,
    xpAmount: number,
    note: string
  ): boolean => {
    if (xpAmount <= 0) return false;
    const alreadyExists = xpTransactions.some(
      (tx) => tx.userId === user.id && tx.idempotencyKey === idempotencyKey
    );
    if (alreadyExists) {
      return false;
    }

    const newTx: XPTransaction = {
      id: `xptx-${Date.now()}`,
      userId: user.id,
      sourceType,
      sourceId,
      idempotencyKey,
      xpAmount,
      note,
      createdAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };
    setXpTransactions((prev) => [newTx, ...prev]);
    return true;
  };

  const awardXPAndProgress = (
    xpEarned: number,
    skill: SkillType,
    accuracyScore: number,
    incrementLessonCount = false
  ) => {
    const newTotalXP = stats.totalXP + xpEarned;
    const newLevel = Math.max(1, Math.floor(newTotalXP / 200) + 1);

    setUser((prev) => ({
      ...prev,
      xp: newTotalXP,
      level: newLevel,
    }));

    setStats((prev) => {
      const currentSkillProg = prev.skillsProgress[skill] || 0;
      const currentSkillAcc = prev.skillAccuracy?.[skill] || 75;
      const updatedSkillProg = Math.min(
        100,
        currentSkillProg + (xpEarned > 0 ? Math.max(2, Math.round(accuracyScore / 20)) : 0)
      );
      const updatedSkillAcc = Math.round(currentSkillAcc * 0.7 + accuracyScore * 0.3);
      const updatedWeekly = [...prev.weeklyXP];
      updatedWeekly[6] = (updatedWeekly[6] || 280) + xpEarned;

      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        lessonsCompleted: incrementLessonCount
          ? prev.lessonsCompleted + 1
          : prev.lessonsCompleted,
        totalPracticeTime: prev.totalPracticeTime + 5,
        accuracy: Math.round(prev.accuracy * 0.85 + accuracyScore * 0.15),
        weeklyXP: updatedWeekly,
        skillsProgress: {
          ...prev.skillsProgress,
          [skill]: updatedSkillProg,
        },
        skillAccuracy: {
          ...(prev.skillAccuracy || {
            listening: 80,
            speaking: 68,
            reading: 85,
            writing: 75,
            vocabulary: 88,
          }),
          [skill]: updatedSkillAcc,
        },
      };
    });
  };

  const signIn = async (
    email: string,
    password?: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { ok: false, message: 'Vui lòng nhập địa chỉ email hợp lệ.' };
    }
    if (!password || password.trim().length === 0) {
      return { ok: false, message: 'Vui lòng nhập mật khẩu.' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) {
        return { ok: false, message: `Lỗi đăng nhập: ${error.message}` };
      }
      if (data.user) {
        setIsAuthenticated(true);
        const remote = await fetchUserLearningDataFromSupabase(data.user.id);
        const remoteXP = remote?.profile?.xp || 0;
        const remoteLevel = Math.max(1, Math.floor(remoteXP / 200) + 1);
        const loggedUser: User = {
          id: data.user.id,
          email: data.user.email || cleanEmail,
          fullName:
            (data.user.user_metadata?.full_name as string) ||
            cleanEmail.split('@')[0],
          level: remoteLevel,
          xp: remoteXP,
          streak: remote?.profile?.streak || 1,
          joinedAt: new Date().toISOString().split('T')[0],
          targetLevel: (remote?.profile?.targetLevel as any) || 'B1',
          dailyGoalMinutes: 20,
        };
        setUser(loggedUser);
        setStats((prev) => ({
          ...prev,
          totalXP: remoteXP,
          level: remoteLevel,
          streak: loggedUser.streak,
        }));
        notify(`Chào mừng ${loggedUser.fullName} quay trở lại!`);
        return { ok: true, message: 'Đăng nhập thành công!' };
      }
    }

    // 1. Kiểm tra tài khoản đã đăng ký trong bộ nhớ ứng dụng
    const matchedAccount = findStoredAccount(cleanEmail);
    if (matchedAccount) {
      if (matchedAccount.password && matchedAccount.password !== password) {
        return { ok: false, message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại!' };
      }
      const accUser = matchedAccount.user;
      const computedLvl = Math.max(1, Math.floor((accUser.xp || 0) / 200) + 1);
      const accStats = matchedAccount.stats
        ? { ...matchedAccount.stats, level: computedLvl, totalXP: accUser.xp }
        : createDefaultStats(computedLvl, accUser.xp || 0);

      setUser({ ...accUser, level: computedLvl });
      setStats(accStats);
      setIsAuthenticated(true);
      notify(`Đăng nhập thành công! Chào mừng ${accUser.fullName} trở lại.`);
      return { ok: true, message: 'Đăng nhập thành công!' };
    }

    // 2. Kiểm tra tài khoản mẫu mặc định
    const matchedDemo = demoAccounts.find(
      (acc) => acc.email.toLowerCase() === cleanEmail.toLowerCase()
    );
    if (matchedDemo) {
      const demoStats = createDefaultStats(matchedDemo.level, matchedDemo.xp);
      setUser(matchedDemo);
      setStats(demoStats);
      setIsAuthenticated(true);
      notify(`Đã đăng nhập tài khoản: ${matchedDemo.fullName}`);
      return { ok: true, message: 'Đăng nhập thành công!' };
    }

    // 3. NẾU TÀI KHOẢN CHƯA ĐĂNG KÝ -> TỪ CHỐI ĐĂNG NHẬP!
    return {
      ok: false,
      message: 'Tài khoản chưa được đăng ký trong hệ thống. Vui lòng chọn tab "Đăng ký tài khoản" để tạo tài khoản mới!',
    };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = email.trim();
    const cleanName = fullName.trim();
    if (!cleanEmail.includes('@') || password.length < 6 || !cleanName) {
      return {
        ok: false,
        message: 'Vui lòng nhập đầy đủ Họ tên, Email hợp lệ và mật khẩu từ 6 ký tự trở lên.',
      };
    }

    // Kiểm tra xem email đã được đăng ký hay chưa
    const existing =
      findStoredAccount(cleanEmail) ||
      demoAccounts.find((a) => a.email.toLowerCase() === cleanEmail.toLowerCase());
    if (existing) {
      return {
        ok: false,
        message: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.',
      };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: { full_name: cleanName },
        },
      });
      if (error) {
        return { ok: false, message: `Lỗi đăng ký: ${error.message}` };
      }
      if (data.user) {
        const newUser: User = {
          id: data.user.id,
          email: cleanEmail,
          fullName: cleanName,
          level: 1,
          xp: 0,
          streak: 1,
          joinedAt: new Date().toISOString().split('T')[0],
          targetLevel: 'B1',
          dailyGoalMinutes: 20,
        };
        const newStats = createDefaultStats(1, 0);
        saveStoredAccount({ user: newUser, password, stats: newStats });
        setUser(newUser);
        setStats(newStats);
        setIsAuthenticated(true);
        notify(`Chào mừng học viên mới ${cleanName}! Bạn bắt đầu tại Level 1.`);
        return { ok: true, message: 'Đăng ký tài khoản thành công! Bạn bắt đầu tại Level 1.' };
      }
    }

    // Tài khoản mới luôn bắt đầu từ Level 1 và 0 XP
    const createdUser: User = {
      id: `user-${Date.now()}`,
      email: cleanEmail,
      fullName: cleanName,
      level: 1,
      xp: 0,
      streak: 1,
      joinedAt: new Date().toISOString().split('T')[0],
      targetLevel: 'B1',
      dailyGoalMinutes: 20,
    };
    const newStats = createDefaultStats(1, 0);

    saveStoredAccount({
      user: createdUser,
      password,
      stats: newStats,
    });

    setUser(createdUser);
    setStats(newStats);
    setIsAuthenticated(true);
    notify(`Chào mừng học viên mới ${createdUser.fullName}! Bạn bắt đầu tại Level 1.`);
    return { ok: true, message: 'Đăng ký tài khoản thành công! Bạn bắt đầu tại Level 1.' };
  };

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setIsAuthenticated(false);
    const guestUser: User = {
      id: 'guest',
      email: '',
      fullName: 'Khách',
      level: 1,
      xp: 0,
      streak: 1,
      joinedAt: new Date().toISOString().split('T')[0],
      targetLevel: 'B1',
      dailyGoalMinutes: 20,
    };
    setUser(guestUser);
    setStats(createDefaultStats(1, 0));
    notify('Đã đăng xuất khỏi tài khoản.');
  };

  const switchDemoUser = (userId: string) => {
    const found = demoAccounts.find((a) => a.id === userId);
    if (!found) return;
    setUser(found);
    setIsAuthenticated(true);
    setStats((prev) => ({
      ...prev,
      totalXP: found.xp,
      level: found.level,
      streak: found.streak,
    }));
    notify(`Đã chuyển sang tài khoản: ${found.fullName}`);
  };

  /**
   * Hoàn thành bài học kèm cơ chế CHỐNG CỘNG XP TRÙNG LẶP (Anti-Duplicate XP)
   */
  const completeLessonAttempt = ({
    lessonId,
    score,
    correctAnswers,
    totalQuestions,
    timeSpent,
  }: {
    lessonId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
  }): { xpEarned: number; duplicatePrevented: boolean } => {
    const targetLesson = lessons.find((l) => l.id === lessonId);
    if (!targetLesson) return { xpEarned: 0, duplicatePrevented: false };

    const targetXP = Math.max(5, Math.round((score / 100) * targetLesson.xpReward));
    const wasAlreadyCompleted = targetLesson.isCompleted;
    const prevBestScore = targetLesson.bestScore || 0;
    const prevXPClaimed =
      targetLesson.xpClaimed ??
      (wasAlreadyCompleted
        ? Math.round((prevBestScore / 100) * targetLesson.xpReward)
        : 0);

    let xpDelta = 0;
    let duplicatePrevented = false;
    let idemKey = `lesson_first:${lessonId}`;

    if (!wasAlreadyCompleted) {
      xpDelta = targetXP;
      idemKey = `lesson_first:${lessonId}`;
    } else if (targetXP > prevXPClaimed) {
      xpDelta = targetXP - prevXPClaimed;
      idemKey = `lesson_improve:${lessonId}:score_${score}`;
    } else {
      xpDelta = 0;
      duplicatePrevented = true;
    }

    if (xpDelta > 0) {
      const recorded = recordXPTransaction(
        wasAlreadyCompleted ? 'lesson_improvement' : 'lesson_complete',
        lessonId,
        idemKey,
        xpDelta,
        wasAlreadyCompleted
          ? `Cải thiện điểm kỷ lục bài ${targetLesson.title} (${prevBestScore}% → ${score}%)`
          : `Hoàn thành lần đầu bài ${targetLesson.title} (${score}%)`
      );
      if (!recorded) {
        xpDelta = 0;
        duplicatePrevented = true;
      }
    }

    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              isCompleted: true,
              bestScore: Math.max(l.bestScore || 0, score),
              xpClaimed: Math.max(prevXPClaimed, targetXP),
              attemptsCount: (l.attemptsCount || 0) + 1,
            }
          : l
      )
    );

    if (!wasAlreadyCompleted) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === targetLesson.courseId
            ? {
                ...c,
                completedLessons: Math.min(c.totalLessons, c.completedLessons + 1),
              }
            : c
        )
      );
    }

    const newAttempt: AttemptResult = {
      id: `att-${Date.now()}`,
      lessonId,
      lessonTitle: targetLesson.title,
      skill: targetLesson.skill,
      score,
      correctAnswers,
      totalQuestions,
      xpEarned: xpDelta,
      duplicatePrevented,
      timeSpent,
      completedAt: new Date().toISOString().split('T')[0],
    };

    setAttempts((prev) => [newAttempt, ...prev]);

    setDailyTasks((prev) =>
      prev.map((t) =>
        t.type === 'lesson'
          ? { ...t, progress: Math.min(t.target, t.progress + 1), isCompleted: true }
          : t
      )
    );

    awardXPAndProgress(xpDelta, targetLesson.skill, score, !wasAlreadyCompleted);
    playFeedbackTone('complete');

    // Đồng bộ ngầm với Supabase RPC nếu đã kết nối
    void syncLessonAttemptToSupabase({
      lessonId,
      skill: targetLesson.skill,
      score,
      correctAnswers,
      totalQuestions,
      timeSpent,
      xpReward: targetLesson.xpReward,
    });

    if (duplicatePrevented) {
      notify(
        `Đã lưu lượt làm lại "${targetLesson.title}" (${score}%). Không cộng lặp XP vì bạn đã nhận đủ XP ở kỷ lục trước (${prevBestScore}%).`
      );
    } else {
      notify(`Hoàn thành "${targetLesson.title}"! Nhận +${xpDelta} XP`);
    }

    return { xpEarned: xpDelta, duplicatePrevented };
  };

  const recordSkillPractice = (
    skill: SkillType,
    accuracyScore: number,
    xpBonus: number,
    title: string
  ) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const idemKey = `skill_practice:${skill}:${title}:${todayStr}`;
    const granted = recordXPTransaction(
      'skill_practice',
      `practice-${skill}`,
      idemKey,
      xpBonus,
      `Thực hành kỹ năng: ${title} (${accuracyScore}%)`
    );

    const actualXP = granted ? xpBonus : 0;

    const newAttempt: AttemptResult = {
      id: `att-${Date.now()}`,
      lessonId: `practice-${skill}`,
      lessonTitle: title,
      skill,
      score: accuracyScore,
      correctAnswers: Math.round(accuracyScore / 20),
      totalQuestions: 5,
      xpEarned: actualXP,
      duplicatePrevented: !granted,
      timeSpent: 300,
      completedAt: todayStr,
    };
    setAttempts((prev) => [newAttempt, ...prev]);

    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === 'task-2' && (skill === 'listening' || skill === 'speaking')) {
          return { ...t, progress: 1, isCompleted: true };
        }
        if (t.id === 'task-4' && skill === 'writing') {
          return { ...t, progress: 1, isCompleted: true };
        }
        return t;
      })
    );

    awardXPAndProgress(actualXP, skill, accuracyScore, false);
    playFeedbackTone('complete');
    notify(
      granted
        ? `Hoàn thành ${title}! +${actualXP} XP`
        : `Đã cập nhật điểm luyện tập ${title} (${accuracyScore}%). XP bài này đã được nhận trong hôm nay.`
    );
  };

  const reviewVocabularyCard = (vocabId: string, rating: SRSRating) => {
    let updatedItem: Vocabulary | null = null;
    setVocabulary((prev) =>
      prev.map((item) => {
        if (item.id !== vocabId) return item;
        updatedItem = calculateSM2(item, rating);
        return updatedItem;
      })
    );

    if (updatedItem) {
      void syncVocabularyReviewToSupabase(user.id, updatedItem);
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const rawXP = rating >= 3 ? 10 : 5;
    const idemKey = `srs:${vocabId}:${todayStr}`;
    const granted = recordXPTransaction(
      'srs_review',
      vocabId,
      idemKey,
      rawXP,
      `Ôn tập thẻ SM-2 (${vocabId}) mức ${rating}/4`
    );

    awardXPAndProgress(granted ? rawXP : 0, 'vocabulary', rating * 25, false);

    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === 'task-3') {
          const nextProg = Math.min(t.target, t.progress + 1);
          return { ...t, progress: nextProg, isCompleted: nextProg >= t.target };
        }
        return t;
      })
    );

    playFeedbackTone(rating >= 3 ? 'correct' : 'info');
  };

  const addCustomVocabulary = (
    newWord: Omit<Vocabulary, 'id' | 'mastery' | 'repetitions' | 'easeFactor' | 'interval'>
  ) => {
    const created: Vocabulary = {
      ...newWord,
      id: `vocab-${Date.now()}`,
      mastery: 'new',
      repetitions: 0,
      easeFactor: 2.5,
      interval: 0,
      nextReview: new Date().toISOString().split('T')[0],
    };
    setVocabulary((prev) => [created, ...prev]);
    setStats((prev) => ({ ...prev, vocabularyLearned: prev.vocabularyLearned + 1 }));
    notify(`Đã thêm từ vựng mới: "${newWord.word}"`);
  };

  const toggleFavoriteVocabulary = (vocabId: string) => {
    setVocabulary((prev) =>
      prev.map((v) => (v.id === vocabId ? { ...v, isFavorite: !v.isFavorite } : v))
    );
  };

  const saveWritingDraft = (draft: Omit<WritingDraft, 'updatedAt'>): WritingDraft => {
    const nowStr = new Date().toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const fullDraft: WritingDraft = {
      ...draft,
      updatedAt: nowStr,
    };

    setWritingDrafts((prev) => {
      const exists = prev.some((d) => d.id === fullDraft.id);
      if (exists) {
        return prev.map((d) => (d.id === fullDraft.id ? fullDraft : d));
      }
      return [fullDraft, ...prev];
    });

    void syncWritingDraftToSupabase(user.id, fullDraft);

    if (draft.status === 'submitted') {
      recordSkillPractice('writing', draft.totalScore || 85, 45, draft.title);
    } else {
      notify(`Đã lưu bản nháp "${draft.title}"!`);
    }

    return fullDraft;
  };

  const deleteWritingDraft = (draftId: string) => {
    setWritingDrafts((prev) => prev.filter((d) => d.id !== draftId));
    notify('Đã xóa bản nháp bài viết');
  };

  const recordSpeakingAttempt = (attempt: SpeakingAttempt) => {
    setSpeakingAttempts((prev) => [attempt, ...prev]);
    recordSkillPractice(
      'speaking',
      attempt.accuracy,
      30,
      `Speaking: ${attempt.promptId}`
    );
  };

  const updateUserProfile = (patch: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...patch }));
    notify('Đã cập nhật thông tin cá nhân!');
  };

  const resetDemoState = () => {
    clearPersistedState();
    setUser(initialUser);
    setIsAuthenticated(true);
    setStats(initialStats);
    setCourses(initialCourses);
    setLessons(initialLessons);
    setVocabulary(initialVocab);
    setDailyTasks(initialTasks);
    setAttempts(initialAttempts);
    setXpTransactions(initialXPTransactions);
    setWritingDrafts(initialWritingDrafts);
    setSpeakingAttempts([]);
    notify('Đã đặt lại dữ liệu học tập về trạng thái mặc định!');
  };

  return (
    <LearningContext.Provider
      value={{
        user,
        isAuthenticated,
        isSupabaseConnected: isSupabaseConfigured,
        stats,
        courses,
        lessons,
        vocabulary,
        dueVocabulary,
        dailyTasks,
        attempts,
        xpTransactions,
        writingDrafts,
        speakingAttempts,
        recommendations,
        accent,
        speechRate,
        notification,
        setAccent,
        setSpeechRate,
        clearNotification,
        notify,
        signIn,
        signUp,
        signOut,
        switchDemoUser,
        completeLessonAttempt,
        recordSkillPractice,
        reviewVocabularyCard,
        addCustomVocabulary,
        toggleFavoriteVocabulary,
        saveWritingDraft,
        deleteWritingDraft,
        recordSpeakingAttempt,
        updateUserProfile,
        resetDemoState,
      }}
    >
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const ctx = useContext(LearningContext);
  if (!ctx) {
    throw new Error('useLearning must be used inside LearningProvider');
  }
  return ctx;
}
