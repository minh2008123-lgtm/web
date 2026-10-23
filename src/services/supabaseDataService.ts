import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Course,
  Lesson,
  Vocabulary,
  WritingDraft,
  XPTransaction,
  AttemptResult,
  User,
} from '../types';

/**
 * Tải danh sách khóa học, bài học và tiến độ từ Supabase PostgreSQL (nếu đã cấu hình .env)
 */
export async function fetchUserLearningDataFromSupabase(userId: string): Promise<{
  profile?: Partial<User>;
  lessonProgressMap?: Record<string, { isCompleted: boolean; bestScore: number; xpClaimed: number }>;
  userVocabMap?: Record<
    string,
    {
      mastery: Vocabulary['mastery'];
      repetitions: number;
      easeFactor: number;
      interval: number;
      nextReview?: string;
      isFavorite?: boolean;
    }
  >;
  attempts?: AttemptResult[];
  xpTransactions?: XPTransaction[];
  writingDrafts?: WritingDraft[];
} | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const [profileRes, progressRes, vocabRes, attemptsRes, xpRes, writingRes] =
      await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('lesson_progress').select('*').eq('user_id', userId),
        supabase.from('user_vocabulary').select('*').eq('user_id', userId),
        supabase
          .from('attempts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(25),
        supabase
          .from('xp_transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(30),
        supabase
          .from('writing_submissions')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false }),
      ]);

    const lessonProgressMap: Record<
      string,
      { isCompleted: boolean; bestScore: number; xpClaimed: number }
    > = {};
    (progressRes.data || []).forEach((row: any) => {
      lessonProgressMap[row.lesson_id] = {
        isCompleted: row.is_completed,
        bestScore: row.best_score,
        xpClaimed: row.xp_claimed || 0,
      };
    });

    const userVocabMap: Record<string, any> = {};
    (vocabRes.data || []).forEach((row: any) => {
      userVocabMap[row.vocabulary_id] = {
        mastery: row.mastery,
        repetitions: row.repetitions,
        easeFactor: Number(row.ease_factor),
        interval: row.interval_days,
        nextReview: row.next_review_date,
        isFavorite: row.is_favorite,
      };
    });

    const attempts: AttemptResult[] = (attemptsRes.data || []).map((r: any) => ({
      id: r.id,
      lessonId: r.lesson_id,
      lessonTitle: r.lesson_id,
      skill: r.skill,
      score: r.score,
      correctAnswers: r.correct_answers,
      totalQuestions: r.total_questions,
      xpEarned: r.xp_awarded,
      duplicatePrevented: r.xp_awarded === 0,
      timeSpent: r.time_spent_seconds,
      completedAt: (r.created_at || '').split('T')[0],
    }));

    const xpTransactions: XPTransaction[] = (xpRes.data || []).map((r: any) => ({
      id: r.id,
      userId: r.user_id,
      sourceType: r.source_type,
      sourceId: r.source_id,
      idempotencyKey: r.idempotency_key,
      xpAmount: r.xp_amount,
      note: r.note || '',
      createdAt: new Date(r.created_at).toLocaleString('vi-VN'),
    }));

    const writingDrafts: WritingDraft[] = (writingRes.data || []).map((r: any) => ({
      id: r.id,
      promptId: r.prompt_id,
      title: r.title,
      content: r.content,
      wordCount: r.word_count,
      status: r.status,
      rubricScores: r.rubric_scores,
      objectiveScore: r.objective_score,
      totalScore: r.total_score,
      updatedAt: new Date(r.updated_at).toLocaleString('vi-VN'),
    }));

    const p = profileRes.data;
    return {
      profile: p
        ? {
            id: p.id,
            email: p.email,
            fullName: p.full_name,
            level: p.level,
            xp: p.total_xp,
            streak: p.streak,
            targetLevel: p.target_level,
            dailyGoalMinutes: p.daily_goal_minutes,
          }
        : undefined,
      lessonProgressMap,
      userVocabMap,
      attempts,
      xpTransactions,
      writingDrafts,
    };
  } catch {
    return null;
  }
}

/**
 * Gọi RPC submit_lesson_attempt trên Supabase để lưu kết quả và chống cộng XP trùng lặp
 */
export async function syncLessonAttemptToSupabase(params: {
  lessonId: string;
  skill: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  xpReward: number;
}): Promise<{ xpAwarded: number; duplicatePrevented: boolean } | null> {
  if (!isSupabaseConfigured || !supabase) return null;

  try {
    const { data, error } = await supabase.rpc('submit_lesson_attempt', {
      p_lesson_id: params.lessonId,
      p_skill: params.skill,
      p_score: params.score,
      p_correct_answers: params.correctAnswers,
      p_total_questions: params.totalQuestions,
      p_time_spent_seconds: params.timeSpent,
      p_xp_reward: params.xpReward,
    });
    if (error || !data) return null;
    return {
      xpAwarded: data.xp_awarded ?? 0,
      duplicatePrevented: Boolean(data.duplicate_prevented),
    };
  } catch {
    return null;
  }
}

/**
 * Đồng bộ trạng thái ôn tập từ vựng SM-2 lên bảng user_vocabulary
 */
export async function syncVocabularyReviewToSupabase(
  userId: string,
  vocab: Vocabulary
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('user_vocabulary').upsert(
      {
        user_id: userId,
        vocabulary_id: vocab.id,
        mastery: vocab.mastery,
        repetitions: vocab.repetitions,
        ease_factor: vocab.easeFactor,
        interval_days: vocab.interval,
        next_review_date: vocab.nextReview,
        last_reviewed_date: vocab.lastReviewed,
        is_favorite: Boolean(vocab.isFavorite),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,vocabulary_id' }
    );
  } catch {
    // ignore offline error
  }
}

/**
 * Đồng bộ bản nháp / bài nộp Writing lên bảng writing_submissions
 */
export async function syncWritingDraftToSupabase(
  userId: string,
  draft: WritingDraft
): Promise<void> {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    await supabase.from('writing_submissions').upsert({
      user_id: userId,
      prompt_id: draft.promptId,
      title: draft.title,
      content: draft.content,
      word_count: draft.wordCount,
      status: draft.status,
      rubric_scores: draft.rubricScores || {},
      objective_score: draft.objectiveScore || 0,
      total_score: draft.totalScore || 0,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // ignore
  }
}

/**
 * Danh sách 16 bảng trong thiết kế cơ sở dữ liệu Giai đoạn 3 để hiển thị kiểm tra trên UI
 */
export const SUPABASE_TABLES_SPEC = [
  { name: 'profiles', rls: 'auth.uid() = id', desc: 'Hồ sơ người dùng, level, total_xp, streak, mục tiêu CEFR' },
  { name: 'courses', rls: 'Public SELECT', desc: 'Danh mục 4 khóa học chuẩn CEFR A1–B2' },
  { name: 'enrollments', rls: 'auth.uid() = user_id', desc: 'Tiến độ ghi danh khóa học của từng học viên' },
  { name: 'lessons', rls: 'Public SELECT', desc: 'Danh sách bài học theo 4 kỹ năng & từ vựng' },
  { name: 'exercises', rls: 'Public SELECT', desc: 'Nhóm bài tập nghe, nói, đọc, viết trong từng bài học' },
  { name: 'questions', rls: 'Public SELECT', desc: 'Câu hỏi trắc nghiệm, điền từ, đúng/sai, sắp xếp câu' },
  { name: 'options', rls: 'Public SELECT', desc: 'Các phương án lựa chọn cho câu hỏi khách quan' },
  { name: 'lesson_progress', rls: 'auth.uid() = user_id', desc: 'Trạng thái hoàn thành, điểm cao nhất (best_score) và xp_claimed' },
  { name: 'attempts', rls: 'auth.uid() = user_id', desc: 'Lịch sử chi tiết từng lần làm bài tập' },
  { name: 'vocabulary', rls: 'Public SELECT', desc: 'Kho từ vựng gốc có phiên âm IPA, nghĩa Việt & câu ví dụ' },
  { name: 'user_vocabulary', rls: 'auth.uid() = user_id', desc: 'Tham số thuật toán SM-2 (repetitions, ease_factor, interval_days, next_review_date)' },
  { name: 'xp_transactions', rls: 'auth.uid() = user_id', desc: 'Sổ cái giao dịch XP với UNIQUE(user_id, idempotency_key) chống cộng XP trùng' },
  { name: 'daily_activity', rls: 'auth.uid() = user_id', desc: 'Nhật ký XP, thời gian luyện tập và streak theo từng ngày' },
  { name: 'writing_submissions', rls: 'auth.uid() = user_id', desc: 'Lưu bản nháp và bài viết đã chấm điểm Rubric' },
  { name: 'badges', rls: 'Public SELECT', desc: 'Danh mục huy hiệu game hóa' },
  { name: 'user_badges', rls: 'auth.uid() = user_id', desc: 'Huy hiệu đã mở khóa của từng học viên' },
] as const;

export type { Course, Lesson };
