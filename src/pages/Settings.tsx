import { Volume2, RotateCcw, ShieldCheck } from 'lucide-react';
import { Card, Button } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { speakText } from '../lib/audio';

export function Settings() {
  const { accent, setAccent, speechRate, setSpeechRate, resetDemoState } = useLearning();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Cài đặt Hệ thống & Âm thanh</h2>
        <p className="text-gray-600 mt-1">
          Tùy chỉnh giọng đọc phát âm (US/UK), tốc độ nghe và quản lý dữ liệu cục bộ
        </p>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center gap-2">
          <Volume2 className="text-primary-600" size={20} />
          <h3 className="font-bold text-gray-900">Cấu hình Giọng đọc (Web Speech API)</h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Giọng phát âm mặc định
            </label>
            <div className="flex gap-2">
              {(['en-US', 'en-GB'] as const).map((acc) => (
                <button
                  key={acc}
                  onClick={() => setAccent(acc)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    accent === acc
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {acc === 'en-US' ? '🇺🇸 Tiếng Anh - Mỹ (US)' : '🇬🇧 Tiếng Anh - Anh (UK)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">
              Tốc độ đọc mặc định
            </label>
            <div className="flex gap-2">
              {[0.75, 1.0, 1.25].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSpeechRate(rate)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    speechRate === rate
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              speakText(
                'Welcome to LinguaQuest Phase 2! Your audio settings are working properly.',
                { lang: accent, rate: speechRate }
              )
            }
          >
            <Volume2 size={16} className="mr-1.5" /> Nghe thử cấu hình âm thanh
          </Button>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={20} />
          <h3 className="font-bold text-gray-900">Quản lý Dữ liệu Học tập (LocalStorage)</h3>
        </div>
        <p className="text-sm text-gray-600">
          Nếu bạn muốn đặt lại toàn bộ điểm XP, trạng thái bài học, chu kỳ thẻ nhớ SM-2 và bản nháp bài viết về dữ liệu mẫu ban đầu của Giai đoạn 2, hãy nhấn nút bên dưới.
        </p>
        <div>
          <Button variant="danger" onClick={resetDemoState}>
            <RotateCcw size={16} className="mr-1.5" /> Khôi phục dữ liệu mẫu ban đầu
          </Button>
        </div>
      </Card>
    </div>
  );
}
