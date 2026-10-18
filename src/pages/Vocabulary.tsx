import { useState } from 'react';
import {
  Volume2,
  Search,
  Filter,
  Book,
  CheckCircle,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../components/ui';
import { vocabularyList } from '../data/coursesData';

type FilterType = 'all' | 'new' | 'learning' | 'reviewing' | 'mastered';

export function Vocabulary() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [vocabulary, setVocabulary] = useState(vocabularyList);

  const filteredVocab = vocabulary.filter((v) => {
    const matchesFilter = filter === 'all' || v.mastery === filter;
    const matchesSearch =
      searchQuery === '' ||
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const currentVocab = filteredVocab[currentCard];

  const stats = {
    total: vocabulary.length,
    new: vocabulary.filter((v) => v.mastery === 'new').length,
    learning: vocabulary.filter((v) => v.mastery === 'learning').length,
    reviewing: vocabulary.filter((v) => v.mastery === 'reviewing').length,
    mastered: vocabulary.filter((v) => v.mastery === 'mastered').length,
  };

  const handleNext = () => {
    if (currentCard < filteredVocab.length - 1) {
      setCurrentCard(currentCard + 1);
      setFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setFlipped(false);
    }
  };

  const handlePlayAudio = (word: string) => {
    // Simulate audio playback
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };

  const getMasteryColor = (mastery: string) => {
    switch (mastery) {
      case 'new':
        return 'bg-gray-100 text-gray-600';
      case 'learning':
        return 'bg-amber-100 text-amber-700';
      case 'reviewing':
        return 'bg-blue-100 text-blue-700';
      case 'mastered':
        return 'bg-success-100 text-success-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getMasteryLabel = (mastery: string) => {
    switch (mastery) {
      case 'new':
        return 'Mới';
      case 'learning':
        return 'Đang học';
      case 'reviewing':
        return 'Ôn tập';
      case 'mastered':
        return 'Đã thuộc';
      default:
        return mastery;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <Book className="mx-auto mb-2 text-primary-600" size={24} />
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500">Tổng số</p>
        </Card>
        <Card className="text-center">
          <Sparkles className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
          <p className="text-sm text-gray-500">Từ mới</p>
        </Card>
        <Card className="text-center">
          <Clock className="mx-auto mb-2 text-amber-500" size={24} />
          <p className="text-2xl font-bold text-gray-900">{stats.learning}</p>
          <p className="text-sm text-gray-500">Đang học</p>
        </Card>
        <Card className="text-center">
          <Star className="mx-auto mb-2 text-blue-500" size={24} />
          <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
          <p className="text-sm text-gray-500">Ôn tập</p>
        </Card>
        <Card className="text-center">
          <CheckCircle className="mx-auto mb-2 text-success-500" size={24} />
          <p className="text-2xl font-bold text-gray-900">{stats.mastered}</p>
          <p className="text-sm text-gray-500">Đã thuộc</p>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'new', 'learning', 'reviewing', 'mastered'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setCurrentCard(0);
                  setFlipped(false);
                }}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all'
                  ? 'Tất cả'
                  : f === 'new'
                  ? 'Mới'
                  : f === 'learning'
                  ? 'Đang học'
                  : f === 'reviewing'
                  ? 'Ôn tập'
                  : 'Đã thuộc'}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Flashcard */}
      {currentVocab ? (
        <div className="max-w-2xl mx-auto">
          <Card className="relative overflow-hidden">
            {/* Progress */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
              <div
                className="h-full bg-primary-500 transition-all"
                style={{
                  width: `${((currentCard + 1) / filteredVocab.length) * 100}%`,
                }}
              />
            </div>

            {/* Card */}
            <div
              className="mt-4 min-h-[320px] cursor-pointer perspective-1000"
              onClick={() => setFlipped(!flipped)}
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                  flipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <Badge className={`mb-4 ${getMasteryColor(currentVocab.mastery)}`}>
                      {getMasteryLabel(currentVocab.mastery)}
                    </Badge>

                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {currentVocab.word}
                    </h2>

                    <p className="text-lg text-gray-500 mb-6 font-mono">
                      {currentVocab.phonetic}
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(currentVocab.word);
                      }}
                      className="p-3 bg-primary-50 rounded-full hover:bg-primary-100 transition-colors"
                    >
                      <Volume2 className="text-primary-600" size={24} />
                    </button>

                    <p className="mt-6 text-sm text-gray-400">Nhấn để xem nghĩa</p>
                  </div>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="h-full flex flex-col items-center justify-center p-8 bg-primary-50 rounded-xl">
                    <h3 className="text-xl font-bold text-primary-700 mb-4">Nghĩa</h3>
                    <p className="text-2xl font-semibold text-gray-900 mb-6">
                      {currentVocab.meaning}
                    </p>

                    <div className="w-full bg-white rounded-xl p-4">
                      <p className="text-sm text-gray-500 mb-1">Ví dụ</p>
                      <p className="text-gray-700 italic mb-2">{currentVocab.example}</p>
                      <p className="text-sm text-gray-500">{currentVocab.exampleMeaning}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={handlePrev}
                disabled={currentCard === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={20} />
                Trước
              </button>

              <span className="text-sm text-gray-500">
                {currentCard + 1} / {filteredVocab.length}
              </span>

              <button
                onClick={handleNext}
                disabled={currentCard === filteredVocab.length - 1}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <ChevronRight size={20} />
              </button>
            </div>
          </Card>

          {/* Vocabulary List */}
          <Card className="mt-6">
            <h3 className="font-bold text-gray-900 mb-4">Danh sách từ vựng</h3>
            <div className="space-y-2">
              {filteredVocab.map((v, index) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setCurrentCard(index);
                    setFlipped(false);
                  }}
                  className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                    index === currentCard
                      ? 'bg-primary-50 border border-primary-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="text-sm text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{v.word}</p>
                    <p className="text-sm text-gray-500">{v.meaning}</p>
                  </div>
                  <Badge className={`${getMasteryColor(v.mastery)}`} size="sm">
                    {getMasteryLabel(v.mastery)}
                  </Badge>
                </button>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy từ vựng phù hợp</p>
        </Card>
      )}

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
}
