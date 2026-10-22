import { useState } from 'react';
import {
  FileText,
  Clock,
  BookOpen,
  Languages,
  Volume2,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
} from 'lucide-react';
import { Card, Badge, Button } from '../../components/ui';
import { readingPassages } from '../../data/coursesData';
import { useLearning } from '../../hooks/useLearning';
import { speakText, playFeedbackTone } from '../../lib/audio';
import { checkExerciseAnswer } from '../../lib/scoring';
import { ReadingGlossaryItem } from '../../types';

export function ReadingPractice() {
  const { accent, recordSkillPractice, addCustomVocabulary } = useLearning();

  const [selectedPassageId, setSelectedPassageId] = useState(readingPassages[0].id);
  const currentPassage =
    readingPassages.find((p) => p.id === selectedPassageId) || readingPassages[0];

  const [showTranslation, setShowTranslation] = useState(false);
  const [activeGlossary, setActiveGlossary] = useState<ReadingGlossaryItem | null>(
    currentPassage.glossary[0] || null
  );
  const [highlightedParagraph, setHighlightedParagraph] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelectPassage = (id: string) => {
    setSelectedPassageId(id);
    const found = readingPassages.find((p) => p.id === id);
    setActiveGlossary(found?.glossary[0] || null);
    setHighlightedParagraph(null);
    setUserAnswers({});
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const total = currentPassage.questions.length;
    const correct = currentPassage.questions.filter((q) =>
      checkExerciseAnswer(q, userAnswers[q.id] || '')
    ).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    playFeedbackTone(score >= 70 ? 'correct' : 'info');
    recordSkillPractice('reading', score, 40, `Đọc: ${currentPassage.title}`);
  };

  const correctCount = currentPassage.questions.filter((q) =>
    checkExerciseAnswer(q, userAnswers[q.id] || '')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Luyện đọc chuyên sâu & Tra từ thông minh
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Đọc văn bản phân đoạn theo chuẩn CEFR, tra nhanh từ vựng học thuật và trả lời câu hỏi kèm dẫn chứng đoạn văn.
          </p>
        </div>

        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors self-start ${
            showTranslation
              ? 'bg-blue-600 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Languages size={18} />
          {showTranslation ? 'Đang bật bản dịch song ngữ' : 'Bật bản dịch song ngữ'}
        </button>
      </div>

      {/* Passage Selector */}
      <div className="grid sm:grid-cols-2 gap-4">
        {readingPassages.map((passage) => {
          const active = passage.id === currentPassage.id;
          return (
            <button
              key={passage.id}
              onClick={() => handleSelectPassage(passage.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-blue-600 bg-blue-50/60 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={passage.level === 'A1' ? 'success' : 'accent'}>
                  {passage.level} • {passage.topic}
                </Badge>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {passage.readingTime} phút
                  </span>
                  <span>{passage.wordCount} từ</span>
                </div>
              </div>
              <h3 className="font-bold text-gray-900">{passage.title}</h3>
            </button>
          );
        })}
      </div>

      {/* Main Content: Reading Passage (7 cols) + Questions (5 cols) */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Article & Interactive Glossary */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div>
                <Badge variant="primary">{currentPassage.level}</Badge>
                <h3 className="text-xl font-bold text-gray-900 mt-2">
                  {currentPassage.title}
                </h3>
              </div>
              <button
                onClick={() =>
                  speakText(
                    currentPassage.paragraphs.map((p) => p.text).join(' '),
                    { lang: accent }
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-medium"
              >
                <Volume2 size={16} />
                Nghe toàn bài
              </button>
            </div>

            {/* Paragraphs */}
            <div className="space-y-5">
              {currentPassage.paragraphs.map((para) => {
                const isEvidence = highlightedParagraph === para.id;
                return (
                  <div
                    key={para.id}
                    className={`p-4 rounded-xl transition-all ${
                      isEvidence
                        ? 'bg-amber-50 border-2 border-amber-300'
                        : 'bg-gray-50/70 border border-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Đoạn {para.id}
                      </span>
                      {isEvidence && (
                        <Badge variant="accent">Đoạn chứa dẫn chứng đáp án</Badge>
                      )}
                    </div>
                    <p className="text-gray-800 leading-relaxed text-base">
                      {para.text}
                    </p>
                    {showTranslation && (
                      <p className="mt-2 pt-2 border-t border-gray-200/70 text-sm text-gray-600 italic">
                        {para.translation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Vocabulary Glossary */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-amber-500" />
                <h4 className="font-bold text-gray-900 text-sm">
                  Từ vựng trọng tâm trong bài (Bấm để tra nhanh & lưu vào SRS)
                </h4>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {currentPassage.glossary.map((item) => {
                  const selected = activeGlossary?.word === item.word;
                  return (
                    <button
                      key={item.word}
                      onClick={() => {
                        setActiveGlossary(item);
                        speakText(item.word, { lang: accent });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {item.word}
                    </button>
                  );
                })}
              </div>

              {activeGlossary && (
                <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-base">
                        {activeGlossary.word}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">
                        {activeGlossary.partOfSpeech}
                      </span>
                      <span className="text-xs font-mono text-gray-600">
                        {activeGlossary.phonetic}
                      </span>
                      <button
                        onClick={() => speakText(activeGlossary.word, { lang: accent })}
                        className="p-1 rounded-full hover:bg-blue-100 text-blue-700"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <p className="text-sm font-medium text-blue-950 mt-1">
                      Nghĩa: {activeGlossary.meaning}
                    </p>
                    <p className="text-xs text-gray-600 italic mt-1">
                      Ví dụ: "{activeGlossary.example}"
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      addCustomVocabulary({
                        word: activeGlossary.word,
                        phonetic: activeGlossary.phonetic,
                        partOfSpeech: 'n',
                        level: currentPassage.level,
                        topic: currentPassage.topic,
                        meaning: activeGlossary.meaning,
                        example: activeGlossary.example,
                        exampleMeaning: activeGlossary.meaning,
                      })
                    }
                  >
                    <PlusCircle size={15} className="mr-1.5" />
                    Lưu Flashcard
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Reading Comprehension Questions */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={18} className="text-blue-600" />
                <h3 className="font-bold text-gray-900">Câu hỏi Đọc hiểu</h3>
              </div>
              <Badge variant="primary">{currentPassage.questions.length} câu</Badge>
            </div>

            {submitted && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-900">
                      Đạt {correctCount}/{currentPassage.questions.length} câu đúng!
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Bấm vào "Xem đoạn dẫn chứng" ở từng câu để đối chiếu vị trí thông tin trong bài.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswers({});
                      setHighlightedParagraph(null);
                    }}
                  >
                    Làm lại
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {currentPassage.questions.map((q, index) => {
                const userAns = userAnswers[q.id] || '';
                const isCorrect = submitted && checkExerciseAnswer(q, userAns);

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm text-gray-900">
                        Câu {index + 1}: {q.question}
                      </p>
                      {q.evidenceParagraph && (
                        <button
                          type="button"
                          onClick={() => setHighlightedParagraph(q.evidenceParagraph || null)}
                          className="text-xs text-blue-600 hover:underline flex-shrink-0 font-medium"
                        >
                          Đoạn #{q.evidenceParagraph}
                        </button>
                      )}
                    </div>

                    {(q.type === 'multiple-choice' || q.type === 'true-false') && (
                      <div className="space-y-2">
                        {q.options?.map((opt) => {
                          const selected = userAns === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-all flex items-center justify-between ${
                                submitted && opt.isCorrect
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                                  : submitted && selected && !opt.isCorrect
                                  ? 'border-red-400 bg-red-50 text-red-800'
                                  : selected
                                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                            >
                              <span>{opt.text}</span>
                              {submitted && opt.isCorrect && (
                                <CheckCircle size={16} className="text-emerald-600" />
                              )}
                              {submitted && selected && !opt.isCorrect && (
                                <AlertCircle size={16} className="text-red-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {q.type === 'fill-blank' && (
                      <div className="space-y-1.5">
                        {q.promptHint && (
                          <p className="text-xs text-gray-500 italic">Gợi ý: {q.promptHint}</p>
                        )}
                        <input
                          type="text"
                          disabled={submitted}
                          placeholder="Điền từ thích hợp từ bài đọc..."
                          value={userAns}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))
                          }
                          className="input-field text-sm bg-white"
                        />
                        {submitted && !isCorrect && (
                          <p className="text-xs text-emerald-700 font-medium">
                            ✓ Đáp án đúng: {q.correctAnswer?.split('|')[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {submitted && (
                      <div className="pt-2 border-t border-gray-200/70 space-y-1.5 text-xs">
                        <div className="flex items-start gap-2 text-gray-700">
                          <Lightbulb size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span>{q.explanation}</span>
                        </div>
                        {q.evidenceParagraph && (
                          <button
                            type="button"
                            onClick={() => setHighlightedParagraph(q.evidenceParagraph || null)}
                            className="text-blue-600 font-medium hover:underline"
                          >
                            → Tô sáng Đoạn {q.evidenceParagraph} trong bài đọc
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!submitted && (
              <Button
                fullWidth
                className="mt-5"
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
              >
                Kiểm tra đáp án Đọc hiểu
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
