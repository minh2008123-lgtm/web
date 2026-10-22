import { useState } from 'react';
import {
  Repeat,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RotateCcw,
  Star,
} from 'lucide-react';
import { Card, Badge, ProgressBar } from '../../components/ui';
import { useLearning } from '../../hooks/useLearning';
import { speakText } from '../../lib/audio';
import { getIntervalPreview } from '../../lib/srs';
import { SRSRating, CEFRLevel } from '../../types';

export function FlashcardDeck() {
  const {
    vocabulary,
    accent,
    reviewVocabularyCard,
    toggleFavoriteVocabulary,
  } = useLearning();

  const [levelFilter, setLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewedInSession, setReviewedInSession] = useState(0);

  const deck = vocabulary.filter(
    (v) => levelFilter === 'ALL' || v.level === levelFilter
  );

  const currentCard = deck[currentIndex] || deck[0];

  const handleRateCard = (rating: SRSRating) => {
    if (!currentCard) return;
    reviewVocabularyCard(currentCard.id, rating);
    setReviewedInSession((prev) => prev + 1);
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Repeat className="text-orange-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Flashcards 3D & Đánh giá trí nhớ SM-2
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Lật thẻ để xem phiên âm IPA, nghĩa tiếng Việt, câu ví dụ và chọn mức độ nhớ để thuật toán SM-2 tính ngày ôn tiếp theo.
          </p>
        </div>

        {/* Filter by CEFR */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl self-start">
          {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => {
                setLevelFilter(lvl);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                levelFilter === lvl
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      {currentCard ? (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Session Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>
                Thẻ {currentIndex + 1} / {deck.length} ({currentCard.topic})
              </span>
              <span className="font-semibold text-orange-600">
                Đã đánh giá phiên này: {reviewedInSession} thẻ
              </span>
            </div>
            <ProgressBar
              value={currentIndex + 1}
              max={deck.length}
              color="accent"
              size="sm"
            />
          </Card>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none"
          >
            {!isFlipped ? (
              <Card className="min-h-[320px] flex flex-col justify-between border-2 border-orange-100 hover:border-orange-300 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="accent">{currentCard.level}</Badge>
                    <Badge variant="primary">{currentCard.partOfSpeech}</Badge>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavoriteVocabulary(currentCard.id);
                    }}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Star
                      size={20}
                      className={
                        currentCard.isFavorite
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                </div>

                <div className="text-center my-8">
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {currentCard.word}
                  </h3>
                  <p className="text-lg font-mono text-gray-500 mb-5">
                    {currentCard.phonetic}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(currentCard.word, { lang: accent });
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-700 hover:bg-orange-100 font-medium text-sm transition-colors"
                  >
                    <Volume2 size={18} />
                    Phát âm ({accent === 'en-US' ? 'US' : 'UK'})
                  </button>
                </div>

                <div className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <RotateCcw size={14} />
                  <span>Nhấn vào thẻ để lật xem nghĩa tiếng Việt & câu ví dụ</span>
                </div>
              </Card>
            ) : (
              <Card className="min-h-[320px] flex flex-col justify-between bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    Mặt sau • Nghĩa & Ngữ cảnh
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    EF: {currentCard.easeFactor} • Lặp: {currentCard.repetitions} lần
                  </span>
                </div>

                <div className="text-center my-4">
                  <p className="text-sm font-semibold text-gray-500">
                    {currentCard.word} ({currentCard.phonetic})
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 mb-4">
                    {currentCard.meaning}
                  </h3>

                  <div className="bg-white/90 p-4 rounded-xl border border-orange-100 text-left max-w-lg mx-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-orange-700 flex items-center gap-1">
                        <Sparkles size={13} /> Câu ví dụ thực tế
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(currentCard.example, { lang: accent });
                        }}
                        className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                      >
                        <Volume2 size={14} /> Nghe câu
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      "{currentCard.example}"
                    </p>
                    <p className="text-xs text-gray-500 italic mt-1">
                      → {currentCard.exampleMeaning}
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs text-orange-700 font-medium">
                  Hãy chọn mức độ nhớ bên dưới để lên lịch ôn tập SM-2
                </p>
              </Card>
            )}
          </div>

          {/* SM-2 Rating Controls */}
          <Card>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-3">
              Đánh giá mức độ nhớ của bạn (Thuật toán Spaced Repetition SM-2)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                onClick={() => handleRateCard(1)}
                className="p-3 rounded-xl border-2 border-red-200 bg-red-50 hover:bg-red-100 text-center transition-colors"
              >
                <p className="font-bold text-red-700 text-sm">1. Quên (Again)</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {getIntervalPreview(currentCard, 1)}
                </p>
              </button>

              <button
                onClick={() => handleRateCard(2)}
                className="p-3 rounded-xl border-2 border-amber-200 bg-amber-50 hover:bg-amber-100 text-center transition-colors"
              >
                <p className="font-bold text-amber-800 text-sm">2. Khó (Hard)</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  {getIntervalPreview(currentCard, 2)}
                </p>
              </button>

              <button
                onClick={() => handleRateCard(3)}
                className="p-3 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-center transition-colors"
              >
                <p className="font-bold text-blue-800 text-sm">3. Tốt (Good)</p>
                <p className="text-xs text-blue-700 mt-0.5">
                  {getIntervalPreview(currentCard, 3)}
                </p>
              </button>

              <button
                onClick={() => handleRateCard(4)}
                className="p-3 rounded-xl border-2 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-center transition-colors"
              >
                <p className="font-bold text-emerald-800 text-sm">4. Dễ (Easy)</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  {getIntervalPreview(currentCard, 4)}
                </p>
              </button>
            </div>

            {/* Manual Prev/Next */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : deck.length - 1));
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={18} /> Thẻ trước
              </button>
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="text-orange-600 font-medium hover:underline"
              >
                {isFlipped ? 'Lật về mặt trước' : 'Lật xem đáp án'}
              </button>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex((prev) => (prev < deck.length - 1 ? prev + 1 : 0));
                }}
                className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
              >
                Thẻ tiếp <ChevronRight size={18} />
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500">Không có thẻ từ vựng nào ở cấp độ này.</p>
        </Card>
      )}
    </div>
  );
}
