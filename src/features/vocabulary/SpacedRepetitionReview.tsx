import { useState, useMemo } from 'react';
import {
  Brain,
  Clock,
  CheckCircle,
  Volume2,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { useLearning } from '../../hooks/useLearning';
import { speakText } from '../../lib/audio';
import { SRSRating } from '../../types';

export function SpacedRepetitionReview() {
  const { vocabulary, dueVocabulary, accent, reviewVocabularyCard } = useLearning();

  const [mode, setMode] = useState<'srs-queue' | 'quiz'>('srs-queue');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [sessionCompletedCount, setSessionCompletedCount] = useState(0);

  const activeWord = dueVocabulary[0] || vocabulary[quizIndex % vocabulary.length];

  // Sinh 4 đáp án trắc nghiệm cho chế độ Quiz ôn tập
  const quizOptions = useMemo(() => {
    if (!activeWord) return [];
    const distractors = vocabulary
      .filter((v) => v.id !== activeWord.id)
      .slice(0, 3)
      .map((v) => ({ id: v.id, text: v.meaning, isCorrect: false }));
    const all = [
      ...distractors,
      { id: activeWord.id, text: activeWord.meaning, isCorrect: true },
    ];
    return all.sort((a, b) => a.id.localeCompare(b.id));
  }, [activeWord, vocabulary]);

  const handleCheckQuiz = () => {
    if (!selectedOption || !activeWord) return;
    setQuizChecked(true);
    const isCorrect = selectedOption === activeWord.id;
    const rating: SRSRating = isCorrect ? 3 : 1;
    reviewVocabularyCard(activeWord.id, rating);
    setSessionCompletedCount((prev) => prev + 1);
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setQuizChecked(false);
    setQuizIndex((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="text-cyan-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Trung tâm Ôn tập Lặp lại Ngắt quãng (Spaced Repetition SM-2)
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Tối ưu hóa trí nhớ dài hạn bằng cách ôn đúng những từ vựng sắp quên theo chu kỳ đường cong lãng quên Ebbinghaus.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setMode('srs-queue')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'srs-queue'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Hàng đợi đến hạn ({dueVocabulary.length})
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
              mode === 'quiz'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Quiz Phản xạ Từ vựng
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 bg-cyan-50 text-cyan-600 rounded-xl">
            <Clock size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{dueVocabulary.length}</p>
            <p className="text-xs text-gray-500">Cần ôn hôm nay</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{sessionCompletedCount}</p>
            <p className="text-xs text-gray-500">Đã ôn phiên này</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl">
            <Sparkles size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {(
                vocabulary.reduce((acc, v) => acc + (v.easeFactor || 2.5), 0) /
                vocabulary.length
              ).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">Hệ số nhớ TB (EF)</p>
          </div>
        </Card>

        <Card className="p-4 flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar size={22} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">
              {vocabulary.filter((v) => v.mastery === 'mastered').length}
            </p>
            <p className="text-xs text-gray-500">Trí nhớ dài hạn</p>
          </div>
        </Card>
      </div>

      {mode === 'quiz' && activeWord ? (
        <Card className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="primary">Quiz Phản xạ SM-2 • {activeWord.level}</Badge>
            <button
              onClick={() => speakText(activeWord.word, { lang: accent })}
              className="flex items-center gap-1.5 text-xs font-medium text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-lg"
            >
              <Volume2 size={15} /> Nghe phát âm
            </button>
          </div>

          <div className="text-center py-4">
            <h3 className="text-3xl font-bold text-gray-900">{activeWord.word}</h3>
            <p className="text-sm font-mono text-gray-500 mt-1">{activeWord.phonetic}</p>
            <p className="text-xs text-gray-500 mt-3 italic">
              Ngữ cảnh: "{activeWord.example}"
            </p>
          </div>

          <div className="space-y-2.5 mt-4">
            {quizOptions.map((opt) => {
              const isSelected = selectedOption === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={quizChecked}
                  onClick={() => setSelectedOption(opt.id)}
                  className={`w-full text-left p-3.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    quizChecked && opt.isCorrect
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                      : quizChecked && isSelected && !opt.isCorrect
                      ? 'border-red-400 bg-red-50 text-red-800'
                      : isSelected
                      ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex justify-end">
            {!quizChecked ? (
              <Button onClick={handleCheckQuiz} disabled={!selectedOption}>
                Kiểm tra & Cập nhật chu kỳ SM-2
              </Button>
            ) : (
              <Button onClick={handleNextQuiz}>Câu tiếp theo</Button>
            )}
          </div>
        </Card>
      ) : (
        /* SRS Schedule Table */
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              Lịch trình ôn tập từ vựng theo thuật toán SM-2
            </h3>
            <span className="text-xs text-gray-500">
               Bấm các nút Đánh giá nhanh để cập nhật chu kỳ nhớ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-3">Từ vựng</th>
                  <th className="py-3 px-3">Nghĩa tiếng Việt</th>
                  <th className="py-3 px-3">Chu kỳ (Interval)</th>
                  <th className="py-3 px-3">Hệ số EF</th>
                  <th className="py-3 px-3">Ngày ôn tiếp</th>
                  <th className="py-3 px-3 text-right">Đánh giá nhanh SM-2</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vocabulary.map((item) => {
                  const isDue = dueVocabulary.some((d) => d.id === item.id);
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(item.word, { lang: accent })}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-cyan-100 text-cyan-700"
                          >
                            <Volume2 size={14} />
                          </button>
                          <div>
                            <p className="font-bold text-gray-900">{item.word}</p>
                            <p className="text-xs font-mono text-gray-400">
                              {item.phonetic}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{item.meaning}</td>
                      <td className="py-3 px-3 font-mono text-xs">
                        {item.interval} ngày ({item.repetitions} lần)
                      </td>
                      <td className="py-3 px-3 font-mono text-xs">{item.easeFactor}</td>
                      <td className="py-3 px-3">
                        {isDue ? (
                          <Badge variant="warning">Đến hạn hôm nay</Badge>
                        ) : (
                          <span className="text-xs text-gray-500">{item.nextReview}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            onClick={() => {
                              reviewVocabularyCard(item.id, 1);
                              setSessionCompletedCount((c) => c + 1);
                            }}
                            className="px-2 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium"
                          >
                            Quên
                          </button>
                          <button
                            onClick={() => {
                              reviewVocabularyCard(item.id, 3);
                              setSessionCompletedCount((c) => c + 1);
                            }}
                            className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium"
                          >
                            Tốt
                          </button>
                          <button
                            onClick={() => {
                              reviewVocabularyCard(item.id, 4);
                              setSessionCompletedCount((c) => c + 1);
                            }}
                            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium"
                          >
                            Dễ
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
