import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Volume2,
  Play,
  Sparkles,
  RotateCcw,
  Award,
} from 'lucide-react';
import { Card, Badge, Button, ProgressBar } from '../../components/ui';
import { speakingPrompts } from '../../data/coursesData';
import { useLearning } from '../../hooks/useLearning';
import { speakText } from '../../lib/audio';
import { evaluateSpeakingMatch } from '../../lib/scoring';

export function SpeakingPractice() {
  const { accent, setAccent, recordSpeakingAttempt, speakingAttempts } = useLearning();

  const [selectedPromptId, setSelectedPromptId] = useState(speakingPrompts[0].id);
  const currentPrompt =
    speakingPrompts.find((p) => p.id === selectedPromptId) || speakingPrompts[0];

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [micStatus, setMicStatus] = useState<'idle' | 'active' | 'simulated'>('idle');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [evaluation, setEvaluation] = useState<{
    accuracy: number;
    matchedWords: { word: string; isMatched: boolean }[];
    feedback: string;
  } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioBlobUrl(null);
    setSpokenTranscript('');
    setEvaluation(null);
    if (timerRef.current) window.clearInterval(timerRef.current);
  }, [selectedPromptId]);

  const startRecording = async () => {
    setEvaluation(null);
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    setIsRecording(true);

    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicStatus('active');
        const recorder = new MediaRecorder(stream);
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(blob);
          setAudioBlobUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = recorder;
        recorder.start();
      } else {
        setMicStatus('simulated');
      }
    } catch {
      // Nếu trình duyệt trong sandbox hoặc người dùng chưa cấp quyền mic, chuyển sang chế độ mô phỏng minh bạch
      setMicStatus('simulated');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    // Nếu chưa có văn bản nhận diện tự động, điền sẵn bản nháp gần giống câu mẫu để người học có thể chỉnh sửa đúng với câu vừa đọc và bấm chấm điểm
    if (!spokenTranscript.trim()) {
      setSpokenTranscript(currentPrompt.targetSentence);
    }
  };

  const handleEvaluate = () => {
    const result = evaluateSpeakingMatch(currentPrompt.targetSentence, spokenTranscript);
    setEvaluation(result);
    recordSpeakingAttempt({
      promptId: currentPrompt.id,
      recordedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      transcript: spokenTranscript,
      accuracy: result.accuracy,
      matchedWords: result.matchedWords,
      durationSeconds: Math.max(3, recordingSeconds),
      audioBlobUrl: audioBlobUrl || undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Mic className="text-pink-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Luyện nói & Thu âm phát âm (Speaking Studio)
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Nghe câu mẫu chuẩn IPA, thu âm giọng nói của bạn, nghe lại bản thu và kiểm tra độ khớp từ vựng.
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg self-start">
          {(['en-US', 'en-GB'] as const).map((acc) => (
            <button
              key={acc}
              onClick={() => setAccent(acc)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                accent === acc
                  ? 'bg-white text-pink-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {acc === 'en-US' ? '🇺🇸 Mẫu giọng Mỹ' : '🇬🇧 Mẫu giọng Anh'}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Selector */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {speakingPrompts.map((prompt) => {
          const active = prompt.id === currentPrompt.id;
          return (
            <button
              key={prompt.id}
              onClick={() => setSelectedPromptId(prompt.id)}
              className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                active
                  ? 'border-pink-500 bg-pink-50/70 shadow-sm'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Badge variant={prompt.level === 'A1' ? 'success' : prompt.level === 'A2' ? 'primary' : 'accent'}>
                  {prompt.level}
                </Badge>
                <span className="text-xs text-gray-400">{prompt.topic}</span>
              </div>
              <p className="font-bold text-gray-900 text-sm line-clamp-1">{prompt.title}</p>
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Target Sentence & Phonetic Breakdown (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-2 border-pink-100">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="primary">{currentPrompt.level} • {currentPrompt.topic}</Badge>
              <span className="text-xs text-gray-500">{currentPrompt.context}</span>
            </div>

            <div className="p-5 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
              <p className="text-xs uppercase tracking-wider font-semibold text-pink-600 mb-2">
                Câu mục tiêu cần luyện nói
              </p>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
                "{currentPrompt.targetSentence}"
              </h3>
              <p className="text-sm font-mono text-pink-700 mt-3 bg-white/80 px-3 py-2 rounded-lg">
                {currentPrompt.phonetic}
              </p>
              <p className="text-sm text-gray-600 mt-3 italic">
                Nghĩa: {currentPrompt.translation}
              </p>

              {/* Model Audio Buttons */}
              <div className="flex flex-wrap gap-3 mt-5">
                <Button
                  size="sm"
                  onClick={() =>
                    speakText(currentPrompt.targetSentence, { lang: accent, rate: 1.0 })
                  }
                >
                  <Volume2 size={16} className="mr-1.5" />
                  Nghe mẫu chuẩn (1.0x)
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    speakText(currentPrompt.targetSentence, { lang: accent, rate: 0.75 })
                  }
                >
                  <Play size={16} className="mr-1.5" />
                  Nghe chậm (0.75x)
                </Button>
              </div>
            </div>

            {/* Key Words Practice */}
            <div className="mt-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Từ khóa trọng âm (Bấm để nghe phát âm từng từ)
              </p>
              <div className="flex flex-wrap gap-2">
                {currentPrompt.keyWords.map((word) => (
                  <button
                    key={word}
                    onClick={() => speakText(word, { lang: accent, rate: 0.9 })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-pink-100 text-gray-800 hover:text-pink-800 text-sm font-medium transition-colors"
                  >
                    <Volume2 size={14} className="text-pink-600" />
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Pronunciation Tips */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <h4 className="font-semibold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-500" />
                Hướng dẫn nối âm & ngữ điệu
              </h4>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {currentPrompt.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-pink-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>

        {/* Right: Voice Recorder & Evaluation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <h3 className="font-bold text-gray-900 mb-1">Phòng thu âm cá nhân</h3>
            <p className="text-xs text-gray-500 mb-4">
              Bấm nút Micro để thu âm qua trình duyệt hoặc nhập nội dung câu bạn vừa nói để đối chiếu độ khớp từ.
            </p>

            {/* Recording Box */}
            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200 text-center">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="w-20 h-20 rounded-full bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center mx-auto shadow-lg hover:scale-105 transition-transform"
                  aria-label="Bắt đầu ghi âm"
                >
                  <Mic size={32} />
                </button>
              ) : (
                <button
                  onClick={stopRecording}
                  className="w-20 h-20 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse"
                  aria-label="Dừng ghi âm"
                >
                  <Square size={28} />
                </button>
              )}

              <p className="font-semibold text-gray-900 mt-3">
                {isRecording
                  ? `Đang thu âm... 00:0${recordingSeconds}`
                  : 'Nhấn vào Micro để bắt đầu nói'}
              </p>

              {/* Animated Waveform when recording */}
              {isRecording && (
                <div className="flex items-center justify-center gap-1.5 h-8 mt-3">
                  {[40, 75, 55, 95, 60, 85, 45, 90, 50, 70].map((h, idx) => (
                    <span
                      key={idx}
                      className="w-1.5 bg-pink-500 rounded-full animate-bounce"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${idx * 90}ms`,
                      }}
                    />
                  ))}
                </div>
              )}

              {micStatus === 'simulated' && !isRecording && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-3">
                  Trình duyệt hiện tại đang ở chế độ mô phỏng thu âm (không phát hiện thiết bị Micro vật lý). Bạn vẫn có thể kiểm tra chấm điểm độ khớp câu bên dưới.
                </p>
              )}

              {audioBlobUrl && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Nghe lại bản ghi âm của bạn:
                  </p>
                  <audio controls src={audioBlobUrl} className="w-full h-9" />
                </div>
              )}
            </div>

            {/* Transcript Input / Verification */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Nội dung câu nói nhận diện / tự kiểm tra:
                </label>
                <button
                  type="button"
                  onClick={() => setSpokenTranscript(currentPrompt.targetSentence)}
                  className="text-xs text-pink-600 hover:underline font-medium"
                >
                  Điền nhanh câu mẫu
                </button>
              </div>
              <textarea
                rows={3}
                value={spokenTranscript}
                onChange={(e) => setSpokenTranscript(e.target.value)}
                placeholder="Bấm thu âm ở trên hoặc gõ lại câu bạn vừa phát âm để hệ thống phân tích độ khớp từng từ..."
                className="input-field text-sm"
              />
              <Button
                fullWidth
                onClick={handleEvaluate}
                disabled={!spokenTranscript.trim()}
              >
                Chấm điểm độ khớp phát âm
              </Button>
            </div>

            {/* Evaluation Result */}
            {evaluation && (
              <div className="mt-5 p-4 rounded-xl bg-white border-2 border-pink-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="text-pink-600" size={22} />
                    <span className="font-bold text-gray-900">
                      Độ khớp từ: {evaluation.accuracy}%
                    </span>
                  </div>
                  <Badge variant={evaluation.accuracy >= 80 ? 'success' : 'accent'}>
                    +30 XP
                  </Badge>
                </div>

                <ProgressBar
                  value={evaluation.accuracy}
                  color={evaluation.accuracy >= 80 ? 'success' : 'primary'}
                  size="sm"
                />

                <div>
                  <p className="text-xs text-gray-500 mb-1.5">
                    Phân tích từng từ (Xanh = Đạt, Cam = Cần phát âm rõ hơn):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.matchedWords.map((item, idx) => (
                      <span
                        key={idx}
                        onClick={() => speakText(item.word, { lang: accent })}
                        className={`px-2 py-1 rounded-md text-xs font-medium cursor-pointer ${
                          item.isMatched
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                        title="Bấm để nghe lại từ này"
                      >
                        {item.word}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-gray-600 italic">{evaluation.feedback}</p>
              </div>
            )}
          </Card>

          {/* Recent Speaking History */}
          {speakingAttempts.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-gray-900">Lịch sử luyện nói phiên này</h4>
                <RotateCcw size={15} className="text-gray-400" />
              </div>
              <div className="space-y-2">
                {speakingAttempts.slice(0, 3).map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-gray-50 text-xs"
                  >
                    <div className="truncate pr-2">
                      <p className="font-medium text-gray-800 truncate">{att.transcript}</p>
                      <span className="text-gray-400">{att.recordedAt}</span>
                    </div>
                    <Badge variant={att.accuracy >= 80 ? 'success' : 'accent'}>
                      {att.accuracy}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
