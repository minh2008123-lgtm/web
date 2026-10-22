import {
  Lesson,
  UserStats,
  Vocabulary,
  AttemptResult,
  LearningRecommendation,
  SkillType,
} from '../types';
import { getDueVocabulary } from '../lib/srs';

const SKILL_LABELS: Record<SkillType, string> = {
  listening: 'Nghe (Listening)',
  speaking: 'Nói (Speaking)',
  reading: 'Đọc (Reading)',
  writing: 'Viết (Writing)',
  vocabulary: 'Từ vựng (Vocabulary)',
};

const SKILL_PATHS: Record<SkillType, string> = {
  listening: '/listening',
  speaking: '/speaking',
  reading: '/reading',
  writing: '/writing',
  vocabulary: '/review',
};

/**
 * Hệ thống đề xuất bài học thông minh (Adaptive Recommendation Engine)
 * Phân tích:
 * 1. Số lượng từ vựng đến hạn ôn tập theo thuật toán Spaced Repetition SM-2
 * 2. Kỹ năng đang có tiến độ hoặc độ chính xác thấp nhất
 * 3. Các bài học làm gần đây bị điểm dưới 80% cần củng cố
 * 4. Bài học tiếp theo trên lộ trình CEFR hiện tại
 */
export function generateRecommendations(
  lessons: Lesson[],
  stats: UserStats,
  vocabulary: Vocabulary[],
  attempts: AttemptResult[]
): LearningRecommendation[] {
  const recommendations: LearningRecommendation[] = [];

  // 1. Kiểm tra từ vựng đến hạn ôn tập SM-2
  const dueVocab = getDueVocabulary(vocabulary);
  if (dueVocab.length > 0) {
    recommendations.push({
      id: 'rec-srs-due',
      title: `Ôn tập ${dueVocab.length} từ vựng đến hạn (SM-2)`,
      reason: `Thuật toán lặp lại ngắt quãng phát hiện ${dueVocab.length} từ cần củng cố hôm nay để tránh quên.`,
      skill: 'vocabulary',
      priority: dueVocab.length >= 4 ? 'high' : 'medium',
      targetPath: '/review',
      xpReward: dueVocab.length * 10,
      estimatedMinutes: Math.max(5, Math.ceil(dueVocab.length * 1.5)),
    });
  }

  // 2. Tìm kỹ năng yếu nhất (dựa trên trung bình tiến độ & độ chính xác)
  const skills: SkillType[] = ['listening', 'speaking', 'reading', 'writing'];
  const sortedByWeakness = [...skills].sort((a, b) => {
    const scoreA = (stats.skillsProgress[a] || 0) * 0.6 + (stats.skillAccuracy?.[a] || 70) * 0.4;
    const scoreB = (stats.skillsProgress[b] || 0) * 0.6 + (stats.skillAccuracy?.[b] || 70) * 0.4;
    return scoreA - scoreB;
  });

  const weakestSkill = sortedByWeakness[0];
  const weakestProgress = stats.skillsProgress[weakestSkill] || 0;

  // Tìm bài học chưa hoàn thành của kỹ năng yếu nhất
  const weakestLesson = lessons.find((l) => l.skill === weakestSkill && !l.isCompleted);
  if (weakestSkill) {
    recommendations.push({
      id: `rec-weak-${weakestSkill}`,
      title: weakestLesson
        ? `Cải thiện ${SKILL_LABELS[weakestSkill]}: ${weakestLesson.title}`
        : `Luyện tập chuyên sâu ${SKILL_LABELS[weakestSkill]}`,
      reason: `Kỹ năng ${SKILL_LABELS[weakestSkill]} đang ở mức ${weakestProgress}% (thấp nhất trong 4 kỹ năng). Nên ưu tiên luyện tập để phát triển cân bằng.`,
      skill: weakestSkill,
      priority: 'high',
      targetPath: weakestLesson ? `/lesson/${weakestLesson.id}` : SKILL_PATHS[weakestSkill],
      xpReward: weakestLesson?.xpReward || 40,
      estimatedMinutes: weakestLesson?.duration || 10,
    });
  }

  // 3. Kiểm tra bài học vừa làm có điểm < 80% để đề xuất làm lại
  const lowScoreAttempt = attempts.find((a) => a.score < 80);
  if (lowScoreAttempt) {
    recommendations.push({
      id: `rec-retry-${lowScoreAttempt.lessonId}`,
      title: `Củng cố lại: ${lowScoreAttempt.lessonTitle}`,
      reason: `Lần làm gần nhất đạt ${lowScoreAttempt.score}%. Hãy ôn lại giải thích đáp án và vượt mốc 80% để nắm chắc kiến thức.`,
      skill: lowScoreAttempt.skill,
      priority: 'medium',
      targetPath: `/lesson/${lowScoreAttempt.lessonId}`,
      xpReward: 25,
      estimatedMinutes: 8,
    });
  }

  // 4. Bài học tiếp theo trên lộ trình chính
  const nextUnfinished = lessons.find(
    (l) => !l.isCompleted && l.id !== weakestLesson?.id
  );
  if (nextUnfinished) {
    recommendations.push({
      id: `rec-next-${nextUnfinished.id}`,
      title: `Tiếp tục lộ trình: ${nextUnfinished.title}`,
      reason: `Bài học kế tiếp trong khóa học hiện tại của bạn (${SKILL_LABELS[nextUnfinished.skill]}).`,
      skill: nextUnfinished.skill,
      priority: 'normal',
      targetPath: `/lesson/${nextUnfinished.id}`,
      xpReward: nextUnfinished.xpReward,
      estimatedMinutes: nextUnfinished.duration,
    });
  }

  return recommendations.slice(0, 3);
}
