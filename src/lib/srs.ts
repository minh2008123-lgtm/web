import { Vocabulary, SRSRating, MasteryLevel } from '../types';

/**
 * Thuật toán SuperMemo SM-2 cho ôn tập lặp lại ngắt quãng (Spaced Repetition)
 * Rating:
 * 1 = Again (Quên hoàn toàn - ôn lại sau 1 ngày / trong phiên)
 * 2 = Hard (Nhớ mang máng, khó khăn)
 * 3 = Good (Nhớ đúng sau vài giây suy nghĩ)
 * 4 = Easy (Nhớ ngay lập tức, phản xạ nhanh)
 */
export function calculateSM2(
  vocab: Vocabulary,
  rating: SRSRating,
  referenceDate: Date = new Date()
): Vocabulary {
  let repetitions = vocab.repetitions || 0;
  let easeFactor = vocab.easeFactor || 2.5;
  let interval = vocab.interval || 0;

  // Quy đổi rating 1..4 sang thang chất lượng q (1..5) của SM-2
  const qualityMap: Record<SRSRating, number> = {
    1: 1, // Again
    2: 3, // Hard
    3: 4, // Good
    4: 5, // Easy
  };
  const q = qualityMap[rating];

  if (rating === 1) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = rating === 2 ? 1 : rating === 3 ? 2 : 4;
    } else if (repetitions === 1) {
      interval = rating === 2 ? 2 : rating === 3 ? 4 : 7;
    } else {
      const multiplier = rating === 2 ? 1.2 : rating === 4 ? easeFactor * 1.3 : easeFactor;
      interval = Math.max(1, Math.round(interval * multiplier));
    }
    repetitions += 1;
  }

  // Cập nhật hệ số dễ (Ease Factor), tối thiểu là 1.3
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  easeFactor = Number(easeFactor.toFixed(2));

  // Xác định trạng thái Mastery dựa trên số lần lặp và interval
  let mastery: MasteryLevel = 'learning';
  if (repetitions === 0) {
    mastery = 'learning';
  } else if (interval >= 14 && repetitions >= 3) {
    mastery = 'mastered';
  } else if (repetitions >= 2) {
    mastery = 'reviewing';
  } else {
    mastery = 'learning';
  }

  const nextDate = new Date(referenceDate);
  nextDate.setDate(nextDate.getDate() + interval);
  const nextReview = nextDate.toISOString().split('T')[0];
  const lastReviewed = referenceDate.toISOString().split('T')[0];

  return {
    ...vocab,
    repetitions,
    easeFactor,
    interval,
    mastery,
    nextReview,
    lastReviewed,
  };
}

/**
 * Xem trước khoảng thời gian ôn lại tiếp theo cho từng nút bấm (Again / Hard / Good / Easy)
 */
export function getIntervalPreview(vocab: Vocabulary, rating: SRSRating): string {
  if (rating === 1) return '< 10 phút (1 ngày)';
  const simulated = calculateSM2(vocab, rating);
  return `${simulated.interval} ngày`;
}

/**
 * Lọc danh sách từ vựng cần ôn tập hôm nay (hoặc từ mới chưa học)
 */
export function getDueVocabulary(
  vocabularyList: Vocabulary[],
  referenceDateStr?: string
): Vocabulary[] {
  const today = referenceDateStr || new Date().toISOString().split('T')[0];
  return vocabularyList.filter((item) => {
    if (item.mastery === 'new') return true;
    if (!item.nextReview) return true;
    return item.nextReview <= today;
  });
}
