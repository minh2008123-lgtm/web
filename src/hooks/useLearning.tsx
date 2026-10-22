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
} from '../types';
import {
  courses as initialCourses,
  lessons as initialLessons,
  vocabularyList as initialVocab,
} from '../data/coursesData';
import {
  currentUser as initialUser,
  userStats as initialStats,
  dailyTasks as initialTasks,
  initialAttempts,
  initialWritingDrafts,
} from '../data/userData';
import { calculateSM2, getDueVocabulary } from '../lib/srs';
import { VoiceAccent, playFeedbackTone } from '../lib/audio';
import { loadPersistedState, savePersistedState, clearPersistedState } from '../services/storageService';
import { generateRecommendations } from '../services/recommendationService';

interface LearningContextValue {
  user: User;
  stats: UserStats;
  courses: Course[];
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  dueVocabulary: Vocabulary[];
  dailyTasks: DailyTask[];
  attempts: AttemptResult[];
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
  completeLessonAttempt: (params: {
    lessonId: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    timeSpent: number;
  }) => number;
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
        stats: initialStats,
        courses: initialCourses,
        lessons: initialLessons,
        vocabulary: initialVocab,
        dailyTasks: initialTasks,
        attempts: initialAttempts,
        writingDrafts: initialWritingDrafts,
        speakingAttempts: [] as SpeakingAttempt[],
        accent: 'en-US' as VoiceAccent,
        speechRate: 1.0,
      }),
    []
  );

  const [user, setUser] = useState<User>(persisted.user);
  const [stats, setStats] = useState<UserStats>(persisted.stats);
  const [courses, setCourses] = useState<Course[]>(persisted.courses);
  const [lessons, setLessons] = useState<Lesson[]>(persisted.lessons);
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>(persisted.vocabulary);
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(persisted.dailyTasks);
  const [attempts, setAttempts] = useState<AttemptResult[]>(persisted.attempts);
  const [writingDrafts, setWritingDrafts] = useState<WritingDraft[]>(persisted.writingDrafts);
  const [speakingAttempts, setSpeakingAttempts] = useState<SpeakingAttempt[]>(persisted.speakingAttempts);
  const [accent, setAccent] = useState<VoiceAccent>(persisted.accent);
  const [speechRate, setSpeechRate] = useState<number>(persisted.speechRate);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    savePersistedState({
      user,
      stats,
      courses,
      lessons,
      vocabulary,
      dailyTasks,
      attempts,
      writingDrafts,
      speakingAttempts,
      accent,
      speechRate,
    });
  }, [
    user,
    stats,
    courses,
    lessons,
    vocabulary,
    dailyTasks,
    attempts,
    writingDrafts,
    speakingAttempts,
    accent,
    speechRate,
  ]);

  const notify = (msg: string) => {
    setNotification(msg);
  };

  const clearNotification = () => setNotification(null);

  const dueVocabulary = useMemo(() => getDueVocabulary(vocabulary), [vocabulary]);

  const recommendations = useMemo(
    () => generateRecommendations(lessons, stats, vocabulary, attempts),
    [lessons, stats, vocabulary, attempts]
  );

  const awardXPAndProgress = (
    xpEarned: number,
    skill: SkillType,
    accuracyScore: number,
    incrementLessonCount = false
  ) => {
    const newTotalXP = stats.totalXP + xpEarned;
    const newLevel = Math.max(12, Math.floor(newTotalXP / 200) + 1);

    setUser((prev) => ({
      ...prev,
      xp: newTotalXP,
      level: newLevel,
    }));

    setStats((prev) => {
      const currentSkillProg = prev.skillsProgress[skill] || 0;
      const currentSkillAcc = prev.skillAccuracy?.[skill] || 75;
      const updatedSkillProg = Math.min(100, currentSkillProg + Math.max(2, Math.round(accuracyScore / 20)));
      const updatedSkillAcc = Math.round(currentSkillAcc * 0.7 + accuracyScore * 0.3);
      const updatedWeekly = [...prev.weeklyXP];
      updatedWeekly[6] = (updatedWeekly[6] || 280) + xpEarned;

      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        lessonsCompleted: incrementLessonCount ? prev.lessonsCompleted + 1 : prev.lessonsCompleted,
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
  }): number => {
    const targetLesson = lessons.find((l) => l.id === lessonId);
    if (!targetLesson) return 0;

    const xpEarned = Math.max(10, Math.round((score / 100) * targetLesson.xpReward));
    const wasAlreadyCompleted = targetLesson.isCompleted;

    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? {
              ...l,
              isCompleted: true,
              bestScore: Math.max(l.bestScore || 0, score),
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
      xpEarned,
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

    awardXPAndProgress(xpEarned, targetLesson.skill, score, !wasAlreadyCompleted);
    playFeedbackTone('complete');
    notify(`Hoàn thành "${targetLesson.title}"! Nhận +${xpEarned} XP`);
    return xpEarned;
  };

  const recordSkillPractice = (
    skill: SkillType,
    accuracyScore: number,
    xpBonus: number,
    title: string
  ) => {
    const newAttempt: AttemptResult = {
      id: `att-${Date.now()}`,
      lessonId: `practice-${skill}`,
      lessonTitle: title,
      skill,
      score: accuracyScore,
      correctAnswers: Math.round(accuracyScore / 20),
      totalQuestions: 5,
      xpEarned: xpBonus,
      timeSpent: 300,
      completedAt: new Date().toISOString().split('T')[0],
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

    awardXPAndProgress(xpBonus, skill, accuracyScore, false);
    playFeedbackTone('complete');
    notify(`Hoàn thành luyện tập ${title}! +${xpBonus} XP`);
  };

  const reviewVocabularyCard = (vocabId: string, rating: SRSRating) => {
    setVocabulary((prev) =>
      prev.map((item) => {
        if (item.id !== vocabId) return item;
        return calculateSM2(item, rating);
      })
    );

    const xpGain = rating >= 3 ? 10 : 5;
    awardXPAndProgress(xpGain, 'vocabulary', rating * 25, false);

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
    notify(`Đã thêm từ "${newWord.word}" vào bộ Flashcards SM-2!`);
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

    if (draft.status === 'submitted') {
      recordSkillPractice('writing', draft.totalScore || 85, 45, draft.title);
    } else {
      notify(`Đã lưu bản nháp "${draft.title}" lúc ${nowStr}`);
    }

    return fullDraft;
  };

  const deleteWritingDraft = (draftId: string) => {
    setWritingDrafts((prev) => prev.filter((d) => d.id !== draftId));
    notify('Đã xóa bản nháp bài viết');
  };

  const recordSpeakingAttempt = (attempt: SpeakingAttempt) => {
    setSpeakingAttempts((prev) => [attempt, ...prev]);
    recordSkillPractice('speaking', attempt.accuracy, 30, 'Luyện phát âm & phản xạ nói');
  };

  const updateUserProfile = (patch: Partial<User>) => {
    setUser((prev) => ({ ...prev, ...patch }));
    notify('Đã cập nhật thông tin hồ sơ học tập!');
  };

  const resetDemoState = () => {
    clearPersistedState();
    setUser(initialUser);
    setStats(initialStats);
    setCourses(initialCourses);
    setLessons(initialLessons);
    setVocabulary(initialVocab);
    setDailyTasks(initialTasks);
    setAttempts(initialAttempts);
    setWritingDrafts(initialWritingDrafts);
    setSpeakingAttempts([]);
    notify('Đã khôi phục dữ liệu mẫu Giai đoạn 2 về trạng thái ban đầu!');
  };

  return (
    <LearningContext.Provider
      value={{
        user,
        stats,
        courses,
        lessons,
        vocabulary,
        dueVocabulary,
        dailyTasks,
        attempts,
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
