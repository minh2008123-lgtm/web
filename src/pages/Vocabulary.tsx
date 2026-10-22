import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Volume2,
  Search,
  Book,
  CheckCircle,
  Clock,
  Sparkles,
  Star,
  Plus,
  Repeat,
  Brain,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { speakText } from '../lib/audio';
import { CEFRLevel, MasteryLevel } from '../types';

export function Vocabulary() {
  const {
    vocabulary,
    accent,
    setAccent,
    addCustomVocabulary,
    toggleFavoriteVocabulary,
  } = useLearning();

  const [filter, setFilter] = useState<'all' | MasteryLevel>('all');
  const [levelFilter, setLevelFilter] = useState<'ALL' | CEFRLevel>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form thêm từ mới
  const [newWord, setNewWord] = useState('');
  const [newPhonetic, setNewPhonetic] = useState('');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newExampleMeaning, setNewExampleMeaning] = useState('');
  const [newLevel, setNewLevel] = useState<CEFRLevel>('B1');

  const filteredVocab = vocabulary.filter((v) => {
    const matchesMastery = filter === 'all' || v.mastery === filter;
    const matchesLevel = levelFilter === 'ALL' || v.level === levelFilter;
    const matchesSearch =
      searchQuery === '' ||
      v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMastery && matchesLevel && matchesSearch;
  });

  const stats = {
    total: vocabulary.length,
    new: vocabulary.filter((v) => v.mastery === 'new').length,
    learning: vocabulary.filter((v) => v.mastery === 'learning').length,
    reviewing: vocabulary.filter((v) => v.mastery === 'reviewing').length,
    mastered: vocabulary.filter((v) => v.mastery === 'mastered').length,
  };

  const handleCreateWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    addCustomVocabulary({
      word: newWord.trim(),
      phonetic: newPhonetic.trim() || `/${newWord.trim().toLowerCase()}/`,
      partOfSpeech: 'n',
      level: newLevel,
      topic: 'Personal Notebook',
      meaning: newMeaning.trim(),
      example: newExample.trim() || `I am learning the word ${newWord.trim()}.`,
      exampleMeaning: newExampleMeaning.trim() || newMeaning.trim(),
    });
    setNewWord('');
    setNewPhonetic('');
    setNewMeaning('');
    setNewExample('');
    setNewExampleMeaning('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Kho Từ Vựng IPA & Ngữ Cảnh Song Ngữ
          </h2>
          <p className="text-gray-600 mt-1">
            Tra cứu phiên âm chuẩn quốc tế IPA, nghe phát âm US/UK và quản lý thẻ nhớ SM-2.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['en-US', 'en-GB'] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => setAccent(acc)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  accent === acc ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'
                }`}
              >
                {acc === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
              </button>
            ))}
          </div>

          <Link
            to="/flashcards"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-orange-50 text-orange-700 text-sm font-medium hover:bg-orange-100"
          >
            <Repeat size={16} /> Flashcards
          </Link>
          <Link
            to="/review"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-cyan-50 text-cyan-700 text-sm font-medium hover:bg-cyan-100"
          >
            <Brain size={16} /> Ôn tập SM-2
          </Link>
          <Button size="sm" onClick={() => setShowAddModal(!showAddModal)}>
            <Plus size={16} className="mr-1" /> Thêm từ mới
          </Button>
        </div>
      </div>

      {/* Add Word Modal / Collapsible Form */}
      {showAddModal && (
        <Card className="border-2 border-primary-200 bg-primary-50/40">
          <h3 className="font-bold text-gray-900 mb-3">Thêm từ vựng mới vào Sổ tay SRS</h3>
          <form onSubmit={handleCreateWord} className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Từ tiếng Anh (VD: resilient)"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              className="input-field bg-white text-sm"
            />
            <input
              type="text"
              placeholder="Phiên âm IPA (VD: /rɪˈzɪliənt/)"
              value={newPhonetic}
              onChange={(e) => setNewPhonetic(e.target.value)}
              className="input-field bg-white text-sm font-mono"
            />
            <input
              type="text"
              required
              placeholder="Nghĩa tiếng Việt (VD: kiên cường, bền bỉ)"
              value={newMeaning}
              onChange={(e) => setNewMeaning(e.target.value)}
              className="input-field bg-white text-sm"
            />
            <select
              value={newLevel}
              onChange={(e) => setNewLevel(e.target.value as CEFRLevel)}
              className="input-field bg-white text-sm"
            >
              <option value="A1">Cấp độ A1</option>
              <option value="A2">Cấp độ A2</option>
              <option value="B1">Cấp độ B1</option>
              <option value="B2">Cấp độ B2</option>
            </select>
            <input
              type="text"
              placeholder="Câu ví dụ tiếng Anh..."
              value={newExample}
              onChange={(e) => setNewExample(e.target.value)}
              className="input-field bg-white text-sm sm:col-span-2"
            />
            <div className="sm:col-span-2 flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)}>
                Hủy
              </Button>
              <Button type="submit">Lưu vào bộ từ vựng</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center p-4">
          <Book className="mx-auto mb-1.5 text-primary-600" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng số từ</p>
        </Card>
        <Card className="text-center p-4">
          <Sparkles className="mx-auto mb-1.5 text-gray-400" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.new}</p>
          <p className="text-xs text-gray-500">Từ mới</p>
        </Card>
        <Card className="text-center p-4">
          <Clock className="mx-auto mb-1.5 text-amber-500" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.learning}</p>
          <p className="text-xs text-gray-500">Đang học</p>
        </Card>
        <Card className="text-center p-4">
          <Star className="mx-auto mb-1.5 text-blue-500" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.reviewing}</p>
          <p className="text-xs text-gray-500">Đang ôn tập</p>
        </Card>
        <Card className="text-center p-4">
          <CheckCircle className="mx-auto mb-1.5 text-success-500" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.mastered}</p>
          <p className="text-xs text-gray-500">Đã thuộc lòng</p>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Tìm từ vựng, nghĩa tiếng Việt hoặc chủ đề..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(['all', 'new', 'learning', 'reviewing', 'mastered'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-2 rounded-lg font-medium text-xs transition-colors ${
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

          <div className="flex gap-1.5">
            {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setLevelFilter(lvl)}
                className={`px-2.5 py-2 rounded-lg text-xs font-semibold ${
                  levelFilter === lvl
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Vocabulary Cards Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredVocab.map((v) => (
          <Card key={v.id} className="flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900">{v.word}</h3>
                  <span className="text-sm font-mono text-gray-500">{v.phonetic}</span>
                  <Badge variant="primary" size="sm">
                    {v.partOfSpeech}
                  </Badge>
                  <Badge variant="accent" size="sm">
                    {v.level}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakText(v.word, { lang: accent })}
                    className="p-2 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100"
                    title="Nghe phát âm từ"
                  >
                    <Volume2 size={16} />
                  </button>
                  <button
                    onClick={() => toggleFavoriteVocabulary(v.id)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <Star
                      size={16}
                      className={
                        v.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }
                    />
                  </button>
                </div>
              </div>

              <p className="text-base font-semibold text-primary-800 mt-2">{v.meaning}</p>

              <div className="mt-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-800 italic">"{v.example}"</p>
                  <button
                    onClick={() => speakText(v.example, { lang: accent })}
                    className="p-1 text-gray-400 hover:text-primary-600 flex-shrink-0 ml-2"
                    title="Nghe câu ví dụ"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{v.exampleMeaning}</p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Chủ đề: {v.topic}</span>
              <span>
                Chu kỳ SM-2: {v.interval} ngày • EF {v.easeFactor}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
