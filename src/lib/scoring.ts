import { Exercise } from '../types';

/**
 * Chuẩn hóa chuỗi để so sánh đáp án điền từ / sắp xếp câu
 */
export function normalizeAnswer(input: string): string {
  return input
    .toLowerCase()
    .replace(/[.,!?;:'"()]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Chấm điểm bài tập khách quan (Multiple Choice, True/False, Fill-in-blank, Sentence Order)
 */
export function checkExerciseAnswer(exercise: Exercise, userAnswer: string): boolean {
  if (!userAnswer) return false;

  if (exercise.type === 'multiple-choice' || exercise.type === 'true-false') {
    const correctOption = exercise.options?.find((o) => o.isCorrect);
    return correctOption?.id === userAnswer;
  }

  if (exercise.type === 'fill-blank' || exercise.type === 'sentence-order') {
    if (!exercise.correctAnswer) return false;
    const acceptedAnswers = exercise.correctAnswer.split('|').map(normalizeAnswer);
    return acceptedAnswers.includes(normalizeAnswer(userAnswer));
  }

  return false;
}

/**
 * So sánh câu người học nói/nhập với câu mẫu để chấm điểm phát âm & độ khớp từ
 */
export function evaluateSpeakingMatch(
  targetSentence: string,
  spokenText: string
): {
  accuracy: number;
  matchedWords: { word: string; isMatched: boolean }[];
  feedback: string;
} {
  const cleanTargetWords = targetSentence.split(/\s+/).filter(Boolean);
  const spokenNormalized = normalizeAnswer(spokenText).split(/\s+/).filter(Boolean);

  if (spokenNormalized.length === 0) {
    return {
      accuracy: 0,
      matchedWords: cleanTargetWords.map((w) => ({ word: w, isMatched: false })),
      feedback: 'Chưa nhận diện được câu nói. Hãy thử thu âm lại rõ hơn nhé!',
    };
  }

  let matchCount = 0;
  const matchedWords = cleanTargetWords.map((rawWord) => {
    const normWord = normalizeAnswer(rawWord);
    const isMatched = spokenNormalized.includes(normWord);
    if (isMatched) matchCount += 1;
    return { word: rawWord, isMatched };
  });

  const accuracy = Math.round((matchCount / cleanTargetWords.length) * 100);

  let feedback = '';
  if (accuracy >= 90) {
    feedback = 'Tuyệt vời! Bạn phát âm đầy đủ các từ khóa và giữ nhịp câu rất tự nhiên.';
  } else if (accuracy >= 70) {
    feedback = 'Khá tốt! Hãy chú ý phát âm rõ hơn các từ được tô màu cam ở trên.';
  } else {
    feedback = 'Hãy nghe lại câu mẫu chậm (0.75x) và tập đọc từng cụm từ trước khi ghép cả câu.';
  }

  return { accuracy, matchedWords, feedback };
}

/**
 * Đánh giá các chỉ số khách quan của bài viết (Writing)
 */
export function evaluateWritingMetrics(
  content: string,
  minWords: number,
  maxWords: number,
  usefulPhrases: string[]
): {
  wordCount: number;
  sentenceCount: number;
  paragraphCount: number;
  usedPhrases: string[];
  lengthScore: number; // trên thang 25
  vocabularyScore: number; // trên thang 25
  structureScore: number; // trên thang 25
  mechanicsScore: number; // trên thang 25
  totalObjectiveScore: number; // trên thang 100
  suggestions: string[];
} {
  const trimmed = content.trim();
  const words = trimmed ? trimmed.split(/\s+/) : [];
  const wordCount = words.length;
  const sentences = trimmed
    ? trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
    : [];
  const sentenceCount = sentences.length;
  const paragraphs = trimmed
    ? trimmed.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];
  const paragraphCount = paragraphs.length;

  const lowerContent = trimmed.toLowerCase();
  const usedPhrases = usefulPhrases.filter((p) =>
    lowerContent.includes(p.toLowerCase().replace(/\.\.\./g, '').trim())
  );

  const suggestions: string[] = [];

  // 1. Điểm độ dài (0-25)
  let lengthScore = 0;
  if (wordCount === 0) {
    lengthScore = 0;
  } else if (wordCount < minWords) {
    lengthScore = Math.round((wordCount / minWords) * 20);
    suggestions.push(`Bài viết hiện có ${wordCount} từ, cần thêm ít nhất ${minWords - wordCount} từ để đạt yêu cầu tối thiểu (${minWords} từ).`);
  } else if (wordCount <= maxWords * 1.2) {
    lengthScore = 25;
  } else {
    lengthScore = 22;
    suggestions.push(`Bài viết hơi dài (${wordCount} từ so với khuyến nghị ${maxWords} từ). Hãy cô đọng lại các ý chính.`);
  }

  // 2. Điểm từ vựng & cụm từ gợi ý (0-25)
  const uniqueWords = new Set(words.map((w) => normalizeAnswer(w))).size;
  const lexicalDiversity = wordCount > 0 ? uniqueWords / wordCount : 0;
  const phraseBonus = Math.min(12, usedPhrases.length * 4);
  const diversityPoints = wordCount >= 15 ? Math.min(13, Math.round(lexicalDiversity * 20)) : Math.min(8, wordCount);
  const vocabularyScore = Math.min(25, phraseBonus + diversityPoints);

  if (usedPhrases.length === 0 && usefulPhrases.length > 0) {
    suggestions.push('Hãy thử áp dụng ít nhất 1-2 cụm từ gợi ý (Useful Phrases) để bài viết tự nhiên và đạt điểm từ vựng cao hơn.');
  }

  // 3. Điểm bố cục & câu (0-25)
  let structureScore = 0;
  if (sentenceCount >= 3) structureScore += 15;
  else if (sentenceCount > 0) structureScore += sentenceCount * 5;

  if (paragraphCount >= 2 || minWords <= 50) structureScore += 10;
  else if (paragraphCount === 1) {
    structureScore += 5;
    suggestions.push('Nên tách bài viết thành 2-3 đoạn văn rõ ràng (Mở bài, Thân bài, Kết bài).');
  }

  // 4. Điểm hình thức & dấu câu cơ bản (0-25)
  let mechanicsScore = 0;
  if (wordCount > 0) {
    const startsWithCapital = /^[A-Z]/.test(trimmed);
    const endsWithPunctuation = /[.!?]$/.test(trimmed);
    mechanicsScore = 15 + (startsWithCapital ? 5 : 0) + (endsWithPunctuation ? 5 : 0);
    if (!startsWithCapital) suggestions.push('Nhớ viết hoa chữ cái đầu tiên của bài viết.');
    if (!endsWithPunctuation) suggestions.push('Nhớ kết thúc câu cuối cùng bằng dấu chấm (.), dấu chấm hỏi (?) hoặc dấu chấm cảm (!).');
  }

  const totalObjectiveScore = lengthScore + vocabularyScore + structureScore + mechanicsScore;

  return {
    wordCount,
    sentenceCount,
    paragraphCount,
    usedPhrases,
    lengthScore,
    vocabularyScore,
    structureScore,
    mechanicsScore,
    totalObjectiveScore,
    suggestions,
  };
}
