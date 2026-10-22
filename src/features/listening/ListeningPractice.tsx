import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Eye,
  EyeOff,
  Languages,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Sparkles,
  PlusCircle,
  Headphones,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../../components/ui';
import { listeningTracks } from '../../data/coursesData';
import { useLearning } from '../../hooks/useLearning';
import { speakText, stopSpeaking, playFeedbackTone } from '../../lib/audio';
import { checkExerciseAnswer } from '../../lib/scoring';

export function ListeningPractice() {
  const { accent, setAccent, speechRate, setSpeechRate, recordSkillPractice, addCustomVocabulary } =
    useLearning();

  const [selectedTrackId, setSelectedTrackId] = useState(listeningTracks[0].id);
  const currentTrack =
    listeningTracks.find((t) => t.id === selectedTrackId) || listeningTracks[0];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedWordPopup, setSelectedWordPopup] = useState<{
    word: string;
    phonetic: string;
    meaning: string;
  } | null>(null);

  // State cho bài tập nghe hiểu
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset khi đổi bài nghe
    stopSpeaking();
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveLineIndex(0);
    setUserAnswers({});
    setSubmitted(false);
    setSelectedWordPopup(null);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [selectedTrackId]);

  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 0.5 * speechRate;
        if (next >= currentTrack.duration) {
          setIsPlaying(false);
          stopSpeaking();
          return currentTrack.duration;
        }
        const lineIdx = currentTrack.transcript.findIndex(
          (l) => next >= l.startTime && next < l.endTime
        );
        if (lineIdx !== -1 && lineIdx !== activeLineIndex) {
          setActiveLineIndex(lineIdx);
          speakText(currentTrack.transcript[lineIdx].text, {
            lang: accent,
            rate: speechRate,
          });
        }
        return next;
      });
    }, 500);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack, speechRate, accent, activeLineIndex]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeaking();
    } else {
      const startTime = currentTime >= currentTrack.duration ? 0 : currentTime;
      setCurrentTime(startTime);
      const idx =
        currentTrack.transcript.findIndex(
          (l) => startTime >= l.startTime && startTime < l.endTime
        ) || 0;
      const validIdx = idx >= 0 ? idx : 0;
      setActiveLineIndex(validIdx);
      setIsPlaying(true);
      speakText(currentTrack.transcript[validIdx].text, {
        lang: accent,
        rate: speechRate,
      });
    }
  };

  const handlePlayLine = (index: number) => {
    const line = currentTrack.transcript[index];
    if (!line) return;
    setActiveLineIndex(index);
    setCurrentTime(line.startTime);
    setIsPlaying(false);
    speakText(line.text, {
      lang: accent,
      rate: speechRate,
    });
  };

  const handleRestart = () => {
    stopSpeaking();
    setIsPlaying(false);
    setCurrentTime(0);
    setActiveLineIndex(0);
  };

  const handleSubmitExercises = () => {
    setSubmitted(true);
    const total = currentTrack.exercises.length;
    const correct = currentTrack.exercises.filter((ex) =>
      checkExerciseAnswer(ex, userAnswers[ex.id] || '')
    ).length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    playFeedbackTone(score >= 70 ? 'correct' : 'info');
    recordSkillPractice('listening', score, 35, `Nghe: ${currentTrack.title}`);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const correctCount = currentTrack.exercises.filter((ex) =>
    checkExerciseAnswer(ex, userAnswers[ex.id] || '')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header & Track Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Headphones className="text-violet-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Luyện nghe tương tác (Audio & Transcript)
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Nghe hội thoại theo ngữ cảnh thực tế, bấm vào từng câu để nghe lại và làm bài tập kiểm tra độ hiểu.
          </p>
        </div>

        {/* Accent & Speed Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['en-US', 'en-GB'] as const).map((acc) => (
              <button
                key={acc}
                onClick={() => setAccent(acc)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  accent === acc
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {acc === 'en-US' ? '🇺🇸 Giọng Mỹ (US)' : '🇬🇧 Giọng Anh (UK)'}
              </button>
            ))}
          </div>

          <div className="flex bg-gray-100 p-1 rounded-lg">
            {[0.75, 1.0, 1.25].map((rate) => (
              <button
                key={rate}
                onClick={() => setSpeechRate(rate)}
                className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  speechRate === rate
                    ? 'bg-white text-violet-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {rate}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track Tabs */}
      <div className="grid sm:grid-cols-3 gap-4">
        {listeningTracks.map((track) => {
          const isSelected = track.id === currentTrack.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrackId(track.id)}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-violet-600 bg-violet-50/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant={track.level === 'A1' ? 'success' : track.level === 'A2' ? 'primary' : 'accent'}>
                  {track.level}
                </Badge>
                <span className="text-xs text-gray-500">{formatTime(track.duration)}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{track.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{track.topic}</p>
            </button>
          );
        })}
      </div>

      {/* Audio Player Card */}
      <Card className="bg-gradient-to-r from-violet-600 to-indigo-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 mb-2">
              {currentTrack.level} • {currentTrack.topic}
            </span>
            <h3 className="text-xl font-bold">{currentTrack.title}</h3>
            <p className="text-violet-100 text-sm mt-1">{currentTrack.situation}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTogglePlay}
              className="w-14 h-14 rounded-full bg-white text-violet-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
              aria-label={isPlaying ? 'Tạm dừng' : 'Phát bài nghe'}
            >
              {isPlaying ? <Pause size={26} /> : <Play size={26} className="ml-0.5" />}
            </button>
            <button
              onClick={handleRestart}
              className="p-3 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors"
              title="Phát lại từ đầu"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Timeline Scrubbing */}
        <div className="space-y-2">
          <input
            type="range"
            min={0}
            max={currentTrack.duration}
            step={1}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              const idx = currentTrack.transcript.findIndex(
                (l) => val >= l.startTime && val < l.endTime
              );
              if (idx !== -1) setActiveLineIndex(idx);
            }}
            className="w-full accent-amber-400 cursor-pointer h-2 rounded-lg"
          />
          <div className="flex justify-between text-xs text-violet-200 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>
              Đang phát câu {activeLineIndex + 1}/{currentTrack.transcript.length}
            </span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>
      </Card>

      {/* Main Two-Column Area: Transcript & Exercises */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Interactive Transcript (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-bold text-gray-900">Transcript Hội Thoại Tương Tác</h3>
                <p className="text-xs text-gray-500">
                  Bấm vào bất kỳ lời thoại nào để phát âm riêng câu đó
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    showTranslation
                      ? 'bg-violet-100 text-violet-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Languages size={14} />
                  {showTranslation ? 'Hiện dịch nghĩa' : 'Ẩn dịch nghĩa'}
                </button>
                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
                  {showTranscript ? 'Chế độ nghe mù' : 'Hiện Transcript'}
                </button>
              </div>
            </div>

            {selectedWordPopup && (
              <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{selectedWordPopup.word}</span>
                    <span className="text-xs font-mono text-gray-500">
                      {selectedWordPopup.phonetic}
                    </span>
                    <button
                      onClick={() => speakText(selectedWordPopup.word, { lang: accent })}
                      className="p-1 rounded-full hover:bg-amber-100 text-amber-700"
                    >
                      <Volume2 size={14} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 mt-0.5">{selectedWordPopup.meaning}</p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    addCustomVocabulary({
                      word: selectedWordPopup.word,
                      phonetic: selectedWordPopup.phonetic,
                      partOfSpeech: 'phrase',
                      level: currentTrack.level,
                      topic: currentTrack.topic,
                      meaning: selectedWordPopup.meaning,
                      example: currentTrack.transcript[activeLineIndex]?.text || '',
                      exampleMeaning:
                        currentTrack.transcript[activeLineIndex]?.translation || '',
                    });
                    setSelectedWordPopup(null);
                  }}
                >
                  <PlusCircle size={14} className="mr-1" />
                  Lưu từ
                </Button>
              </div>
            )}

            {showTranscript ? (
              <div className="space-y-3">
                {currentTrack.transcript.map((line, index) => {
                  const isActive = index === activeLineIndex;
                  return (
                    <div
                      key={line.id}
                      onClick={() => handlePlayLine(index)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-violet-500 bg-violet-50/80 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-violet-700">
                            {line.speaker}
                          </span>
                          {line.role && (
                            <span className="text-xs text-gray-400">({line.role})</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400">
                            {formatTime(line.startTime)}
                          </span>
                          <Volume2
                            size={15}
                            className={isActive ? 'text-violet-600' : 'text-gray-400'}
                          />
                        </div>
                      </div>

                      <p className="text-gray-900 font-medium text-sm leading-relaxed">
                        {line.text}
                      </p>

                      {showTranslation && (
                        <p className="text-xs text-gray-500 mt-1.5 italic">
                          {line.translation}
                        </p>
                      )}

                      {line.highlightWords && line.highlightWords.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {line.highlightWords.map((hw) => (
                            <button
                              key={hw.word}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedWordPopup(hw);
                                speakText(hw.word, { lang: accent });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                            >
                              <Sparkles size={11} />
                              {hw.word}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <EyeOff className="mx-auto text-gray-400 mb-2" size={32} />
                <p className="font-medium text-gray-700">Đang bật chế độ Nghe Mù (Blind Listening)</p>
                <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
                  Hãy tập trung nghe âm thanh và trả lời các câu hỏi bên phải trước khi bật lại transcript để đối chiếu.
                </p>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setShowTranscript(true)}
                >
                  Hiện lại Transcript
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Right: Comprehension Questions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Bài tập Nghe hiểu</h3>
              <Badge variant="primary">{currentTrack.exercises.length} câu hỏi</Badge>
            </div>

            {submitted && (
              <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-emerald-900">
                      Kết quả: {correctCount}/{currentTrack.exercises.length} câu đúng
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Đã cộng +35 XP và cập nhật tiến độ kỹ năng Nghe!
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSubmitted(false);
                      setUserAnswers({});
                    }}
                  >
                    Làm lại
                  </Button>
                </div>
                <ProgressBar
                  value={correctCount}
                  max={currentTrack.exercises.length}
                  color="success"
                  size="sm"
                  className="mt-2"
                />
              </div>
            )}

            <div className="space-y-5">
              {currentTrack.exercises.map((ex, idx) => {
                const userAns = userAnswers[ex.id] || '';
                const isCorrect = submitted && checkExerciseAnswer(ex, userAns);

                return (
                  <div
                    key={ex.id}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200/80 space-y-3"
                  >
                    <p className="font-semibold text-sm text-gray-900">
                      Câu {idx + 1}: {ex.question}
                    </p>

                    {(ex.type === 'multiple-choice' || ex.type === 'true-false') && (
                      <div className="space-y-2">
                        {ex.options?.map((opt) => {
                          const selected = userAns === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              disabled={submitted}
                              onClick={() =>
                                setUserAnswers((prev) => ({ ...prev, [ex.id]: opt.id }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-lg border text-sm transition-all flex items-center justify-between ${
                                submitted && opt.isCorrect
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium'
                                  : submitted && selected && !opt.isCorrect
                                  ? 'border-red-400 bg-red-50 text-red-800'
                                  : selected
                                  ? 'border-violet-600 bg-violet-50 text-violet-900 font-medium'
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

                    {ex.type === 'fill-blank' && (
                      <div className="space-y-1.5">
                        {ex.promptHint && (
                          <p className="text-xs text-gray-500 italic">Gợi ý: {ex.promptHint}</p>
                        )}
                        <input
                          type="text"
                          disabled={submitted}
                          placeholder="Nhập từ còn thiếu..."
                          value={userAns}
                          onChange={(e) =>
                            setUserAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))
                          }
                          className={`input-field text-sm bg-white ${
                            submitted
                              ? isCorrect
                                ? 'border-emerald-500 bg-emerald-50'
                                : 'border-red-400 bg-red-50'
                              : ''
                          }`}
                        />
                        {submitted && !isCorrect && (
                          <p className="text-xs text-emerald-700 font-medium">
                            ✓ Đáp án đúng: {ex.correctAnswer?.split('|')[0]}
                          </p>
                        )}
                      </div>
                    )}

                    {submitted && (
                      <div className="pt-2 border-t border-gray-200/70 flex items-start gap-2 text-xs text-gray-700">
                        <Lightbulb size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{ex.explanation}</span>
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
                onClick={handleSubmitExercises}
                disabled={Object.keys(userAnswers).length === 0}
              >
                Chấm điểm & Xem giải thích
              </Button>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
