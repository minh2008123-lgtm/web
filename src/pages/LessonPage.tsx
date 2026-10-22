import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Volume2,
  Mic,
  FileText,
  PenTool,
  ChevronRight,
  AlertCircle,
  Lightbulb,
  Home,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { exercises } from '../data/coursesData';
import { useLearning } from '../hooks/useLearning';
import { checkExerciseAnswer } from '../lib/scoring';
import { speakText, playFeedbackTone } from '../lib/audio';

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { lessons, accent, completeLessonAttempt, recommendations } = useLearning();

  const lesson = lessons.find((l) => l.id === lessonId) || lessons[0];
  const lessonExercises = exercises[lesson.id] || exercises['lesson-a1-1'];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [orderedWords, setOrderedWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [earnedXPState, setEarnedXPState] = useState(0);
  const [startTime] = useState<number>(Date.now());

  const currentExercise = lessonExercises[currentQuestion];
  const totalQuestions = lessonExercises.length;

  const currentAnswerValue =
    currentExercise?.type === 'sentence-order'
      ? orderedWords.join(' ')
      : userInput;

  const handleCheckAnswer = () => {
    if (!currentAnswerValue.trim()) return;

    const updatedAnswers = {
      ...answers,
      [currentExercise.id]: currentAnswerValue,
    };
    setAnswers(updatedAnswers);
    setShowResult(true);

    const isRight = checkExerciseAnswer(currentExercise, currentAnswerValue);
    playFeedbackTone(isRight ? 'correct' : 'wrong');
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setUserInput('');
      setOrderedWords([]);
      setShowResult(false);
    } else {
      const correctCount = lessonExercises.filter((ex) =>
        checkExerciseAnswer(ex, answers[ex.id] || '')
      ).length;
      const finalScore =
        totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const elapsedSeconds = Math.max(15, Math.round((Date.now() - startTime) / 1000));
      const awarded = completeLessonAttempt({
        lessonId: lesson.id,
        score: finalScore,
        correctAnswers: correctCount,
        totalQuestions,
        timeSpent: elapsedSeconds,
      });
      setEarnedXPState(awarded);
      setQuizComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setUserInput('');
    setOrderedWords([]);
    setShowResult(false);
    setQuizComplete(false);
    setAnswers({});
  };

  const correctAnswersCount = lessonExercises.filter((ex) =>
    checkExerciseAnswer(ex, answers[ex.id] || '')
  ).length;
  const score =
    totalQuestions > 0 ? Math.round((correctAnswersCount / totalQuestions) * 100) : 0;

  if (quizComplete) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="text-center">
          <div className="mb-4">
            <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-success-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {score >= 80 ? 'Xuất sắc! Bạn nắm bài rất vững' : 'Hoàn thành bài học!'}
          </h2>
          <p className="text-gray-600 mb-6">Bài học: {lesson.title}</p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-3xl font-bold text-primary-600 font-mono">{score}%</p>
              <p className="text-xs text-gray-500">Điểm chính xác</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-success-600 font-mono">
                {correctAnswersCount}/{totalQuestions}
              </p>
              <p className="text-xs text-gray-500">Câu trả lời đúng</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-accent-500 font-mono">
                +{earnedXPState} XP
              </p>
              <p className="text-xs text-gray-500">Điểm kinh nghiệm</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRetry} variant="secondary" fullWidth>
              <RotateCcw size={18} className="mr-2" />
              Làm lại bài này
            </Button>
            <Button onClick={() => navigate('/')} fullWidth>
              <Home size={18} className="mr-2" />
              Về Bảng điều khiển
            </Button>
          </div>
        </Card>

        {/* Adaptive Next Step Recommendation */}
        {recommendations.length > 0 && (
          <Card className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-indigo-600" />
              <h3 className="font-bold text-gray-900 text-sm">
                Đề xuất bước tiếp theo dựa trên kết quả vừa làm
              </h3>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-semibold text-indigo-950 text-sm">
                  {recommendations[0].title}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{recommendations[0].reason}</p>
              </div>
              <Link
                to={recommendations[0].targetPath}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 self-start sm:self-center"
              >
                Học tiếp ngay →
              </Link>
            </div>
          </Card>
        )}

        {/* Detailed Answer Review */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">
            Chi tiết đáp án & Giải thích chuyên sâu
          </h3>
          <div className="space-y-4">
            {lessonExercises.map((ex, index) => {
              const userAnswer = answers[ex.id] || '';
              const isCorrect = checkExerciseAnswer(ex, userAnswer);
              const correctDisplay =
                ex.type === 'multiple-choice' || ex.type === 'true-false'
                  ? ex.options?.find((o) => o.isCorrect)?.text
                  : ex.correctAnswer?.split('|')[0];

              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-xl border ${
                    isCorrect
                      ? 'border-success-200 bg-success-50/70'
                      : 'border-red-200 bg-red-50/70'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={isCorrect ? 'text-success-600' : 'text-red-500'}>
                      {isCorrect ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm mb-1">
                        Câu {index + 1}: {ex.question}
                      </p>
                      {!isCorrect && (
                        <p className="text-xs text-emerald-700 font-semibold mb-1">
                          ✓ Đáp án đúng: {correctDisplay}
                        </p>
                      )}
                      <p className="text-xs text-gray-700 italic">{ex.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    );
  }

  const isCurrentCorrect =
    showResult && checkExerciseAnswer(currentExercise, currentAnswerValue);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock size={16} />
            <span>{lesson.duration} phút</span>
          </div>
          <Badge variant="primary">+{lesson.xpReward} XP</Badge>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">
            Câu hỏi {currentQuestion + 1} / {totalQuestions}
          </span>
          <span className="font-medium text-primary-600">
            {Math.round(((currentQuestion + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <ProgressBar
          value={currentQuestion + 1}
          max={totalQuestions}
          color="gradient"
          size="md"
        />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {lesson.skill === 'listening' && <Volume2 className="text-violet-600" size={20} />}
            {lesson.skill === 'speaking' && <Mic className="text-pink-600" size={20} />}
            {lesson.skill === 'reading' && <FileText className="text-blue-600" size={20} />}
            {lesson.skill === 'writing' && <PenTool className="text-emerald-600" size={20} />}
            <Badge variant="accent">{lesson.title}</Badge>
          </div>
          <Badge variant="primary">
            {currentExercise.type === 'multiple-choice'
              ? 'Trắc nghiệm'
              : currentExercise.type === 'fill-blank'
              ? 'Điền từ'
              : currentExercise.type === 'sentence-order'
              ? 'Sắp xếp câu'
              : 'Đúng / Sai'}
          </Badge>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {currentExercise.question}
        </h2>

        {currentExercise.audioText && (
          <button
            type="button"
            onClick={() => speakText(currentExercise.audioText || '', { lang: accent })}
            className="mb-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 font-medium text-sm transition-colors"
          >
            <Volume2 size={18} />
            Nghe câu phát âm mẫu
          </button>
        )}

        {/* 1. Multiple Choice & True/False */}
        {(currentExercise.type === 'multiple-choice' ||
          currentExercise.type === 'true-false') && (
          <div className="space-y-3">
            {currentExercise.options?.map((option) => {
              const isSelected = userInput === option.id;
              const showCorrect = showResult && option.isCorrect;
              const showIncorrect = showResult && isSelected && !option.isCorrect;

              return (
                <button
                  key={option.id}
                  onClick={() => !showResult && setUserInput(option.id)}
                  disabled={showResult}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    showCorrect
                      ? 'border-success-500 bg-success-50'
                      : showIncorrect
                      ? 'border-red-500 bg-red-50'
                      : isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-medium text-sm ${
                      showCorrect
                        ? 'border-success-500 bg-success-500 text-white'
                        : showIncorrect
                        ? 'border-red-500 bg-red-500 text-white'
                        : isSelected
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-gray-300 text-gray-500'
                    }`}
                  >
                    {option.id.toUpperCase().slice(0, 1)}
                  </div>
                  <span className="flex-1 font-medium text-gray-900">{option.text}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Fill in the Blank */}
        {currentExercise.type === 'fill-blank' && (
          <div className="space-y-3">
            {currentExercise.promptHint && (
              <p className="text-xs text-gray-500 italic">
                💡 Gợi ý: {currentExercise.promptHint}
              </p>
            )}
            <input
              type="text"
              disabled={showResult}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Nhập đáp án tiếng Anh của bạn..."
              className="input-field text-base"
            />
            {showResult && !isCurrentCorrect && (
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Đáp án đúng: {currentExercise.correctAnswer?.split('|')[0]}
              </p>
            )}
          </div>
        )}

        {/* 3. Sentence Ordering */}
        {currentExercise.type === 'sentence-order' && (
          <div className="space-y-4">
            <div className="min-h-[60px] p-4 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex flex-wrap gap-2 items-center">
              {orderedWords.length === 0 ? (
                <span className="text-sm text-gray-400">
                  Bấm vào các từ bên dưới theo đúng thứ tự câu...
                </span>
              ) : (
                orderedWords.map((word, idx) => (
                  <button
                    key={`${word}-${idx}`}
                    type="button"
                    disabled={showResult}
                    onClick={() =>
                      setOrderedWords((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-sm font-medium shadow-sm"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {currentExercise.wordBank?.map((word, idx) => {
                const isUsed = orderedWords.includes(word);
                return (
                  <button
                    key={`${word}-${idx}`}
                    type="button"
                    disabled={showResult || isUsed}
                    onClick={() => setOrderedWords((prev) => [...prev, word])}
                    className={`px-3.5 py-2 rounded-lg border text-sm font-medium transition-all ${
                      isUsed
                        ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                        : 'bg-white text-gray-800 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>

            {showResult && !isCurrentCorrect && (
              <p className="text-sm font-semibold text-emerald-700">
                ✓ Câu đúng: "{currentExercise.correctAnswer}"
              </p>
            )}
          </div>
        )}

        {/* Explanation Box */}
        {showResult && (
          <div
            className={`mt-6 p-4 rounded-xl border ${
              isCurrentCorrect
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <Lightbulb className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-bold text-gray-900 text-sm mb-1">
                  {isCurrentCorrect ? 'Chính xác!' : 'Giải thích đáp án:'}
                </p>
                <p className="text-sm text-gray-700">{currentExercise.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          {!showResult ? (
            <Button onClick={handleCheckAnswer} disabled={!currentAnswerValue.trim()}>
              Kiểm tra đáp án
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Câu tiếp theo
                  <ChevronRight size={18} className="ml-1" />
                </>
              ) : (
                'Hoàn thành & Nhận XP'
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
