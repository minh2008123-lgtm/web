import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Zap,
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
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { lessons, exercises } from '../data/coursesData';

export function LessonPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const lesson = lessons.find((l) => l.id === lessonId);
  const lessonExercises = exercises[lessonId || ''] || [];

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Không tìm thấy bài học</h2>
        <Button onClick={() => navigate('/courses')}>Quay lại khóa học</Button>
      </div>
    );
  }

  const currentExercise = lessonExercises[currentQuestion];
  const totalQuestions = lessonExercises.length;

  const handleSelectAnswer = (optionId: string) => {
    if (showResult) return;
    setSelectedAnswer(optionId);
  };

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;

    setAnswers((prev) => ({
      ...prev,
      [currentExercise.id]: selectedAnswer,
    }));
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setShowExplanation(false);
    setQuizComplete(false);
    setAnswers({});
  };

  const correctAnswers = Object.entries(answers).filter(([exId, ans]) => {
    const ex = lessonExercises.find((e) => e.id === exId);
    return ex?.options?.find((o) => o.id === ans)?.isCorrect;
  }).length;

  const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const xpEarned = Math.round((score / 100) * lesson.xpReward);

  // Result Screen
  if (quizComplete) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="mb-6">
            {score >= 80 ? (
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-success-500" />
              </div>
            ) : score >= 60 ? (
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">👍</span>
              </div>
            ) : (
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-4xl">💪</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {score >= 80 ? 'Xuất sắc!' : score >= 60 ? 'Tốt lắm!' : 'Cố gắng hơn nhé!'}
          </h2>

          <p className="text-gray-600 mb-6">Bạn đã hoàn thành bài: {lesson.title}</p>

          {/* Score */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-4xl font-bold text-primary-600 font-mono">{score}%</p>
              <p className="text-sm text-gray-500">Điểm số</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-bold text-success-600 font-mono">
                {correctAnswers}/{totalQuestions}
              </p>
              <p className="text-sm text-gray-500">Câu đúng</p>
            </div>
            <div className="w-px h-12 bg-gray-200" />
            <div>
              <p className="text-4xl font-bold text-accent-500 font-mono">+{xpEarned}</p>
              <p className="text-sm text-gray-500">XP nhận được</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleRetry} variant="secondary" fullWidth>
              <RotateCcw size={18} className="mr-2" />
              Làm lại
            </Button>
            <Button onClick={() => navigate('/')} fullWidth>
              <Home size={18} className="mr-2" />
              Về trang chủ
            </Button>
          </div>
        </Card>

        {/* Review Answers */}
        <Card className="mt-6">
          <h3 className="font-bold text-gray-900 mb-4">Xem lại đáp án</h3>
          <div className="space-y-4">
            {lessonExercises.map((ex, index) => {
              const userAnswer = answers[ex.id];
              const correctOption = ex.options?.find((o) => o.isCorrect);
              const isCorrect = userAnswer === correctOption?.id;

              return (
                <div
                  key={ex.id}
                  className={`p-4 rounded-lg border ${
                    isCorrect
                      ? 'border-success-200 bg-success-50'
                      : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 ${
                        isCorrect ? 'text-success-500' : 'text-red-500'
                      }`}
                    >
                      {isCorrect ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">
                        Câu {index + 1}: {ex.question}
                      </p>
                      {!isCorrect && (
                        <p className="text-sm text-success-600 mb-2">
                          ✓ Đáp án đúng: {correctOption?.text}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 italic">{ex.explanation}</p>
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

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
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
            Câu hỏi {currentQuestion + 1} trong {totalQuestions}
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
        <div className="flex items-center gap-2 mb-4">
          {lesson.skill === 'listening' && (
            <div className="p-2 bg-violet-100 rounded-lg">
              <Volume2 className="text-violet-600" size={20} />
            </div>
          )}
          {lesson.skill === 'speaking' && (
            <div className="p-2 bg-pink-100 rounded-lg">
              <Mic className="text-pink-600" size={20} />
            </div>
          )}
          {lesson.skill === 'reading' && (
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="text-blue-600" size={20} />
            </div>
          )}
          {lesson.skill === 'writing' && (
            <div className="p-2 bg-emerald-100 rounded-lg">
              <PenTool className="text-emerald-600" size={20} />
            </div>
          )}
          <Badge variant="accent">{lesson.title}</Badge>
        </div>

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {currentExercise?.question}
        </h2>

        {/* Options */}
        <div className="space-y-3">
          {currentExercise?.options?.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const isCorrect = option.isCorrect;
            const showCorrect = showResult && isCorrect;
            const showIncorrect = showResult && isSelected && !isCorrect;

            return (
              <button
                key={option.id}
                onClick={() => handleSelectAnswer(option.id)}
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
                  {showCorrect ? (
                    <CheckCircle size={16} />
                  ) : showIncorrect ? (
                    <AlertCircle size={16} />
                  ) : (
                    option.id.toUpperCase()
                  )}
                </div>
                <span className="flex-1 font-medium text-gray-900">{option.text}</span>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showResult && currentExercise?.explanation && (
          <div className="mt-6 p-4 bg-primary-50 rounded-xl border border-primary-100">
            <div className="flex items-start gap-3">
              <Lightbulb className="text-primary-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-primary-800 mb-1">Giải thích</p>
                <p className="text-primary-700">{currentExercise.explanation}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end">
          {!showResult ? (
            <Button onClick={handleCheckAnswer} disabled={!selectedAnswer}>
              Kiểm tra đáp án
            </Button>
          ) : (
            <Button onClick={handleNextQuestion}>
              {currentQuestion < totalQuestions - 1 ? (
                <>
                  Tiếp theo
                  <ChevronRight size={18} className="ml-1" />
                </>
              ) : (
                'Xem kết quả'
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
