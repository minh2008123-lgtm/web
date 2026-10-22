import { Trophy, Award, CheckCircle } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { badges, achievements } from '../data/userData';
import { useLearning } from '../hooks/useLearning';

export function Achievements() {
  const { stats } = useLearning();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Thành tích & Huy hiệu</h2>
          <p className="text-gray-600 mt-1">
            Theo dõi các cột mốc học tập và phần thưởng XP của bạn
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 text-amber-800 font-bold">
          <Trophy size={20} className="text-amber-500" />
          <span>{stats.totalXP.toLocaleString()} XP</span>
        </div>
      </div>

      {/* Achievements Progress */}
      <div className="grid md:grid-cols-3 gap-4">
        {achievements.map((ach) => (
          <Card key={ach.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <span className="text-3xl">{ach.icon}</span>
              <Badge variant="accent">+{ach.xpReward} XP</Badge>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{ach.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{ach.description}</p>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Tiến độ</span>
                <span className="font-semibold text-gray-800">
                  {ach.progress}/{ach.target}
                </span>
              </div>
              <ProgressBar value={ach.progress} max={ach.target} size="sm" />
            </div>
          </Card>
        ))}
      </div>

      {/* Badges */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Award size={20} className="text-primary-600" />
          <h3 className="font-bold text-gray-900">Bộ sưu tập Huy hiệu</h3>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                b.unlockedAt
                  ? 'border-amber-200 bg-amber-50/50'
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <span className="text-3xl">{b.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900 text-sm">{b.name}</p>
                  {b.unlockedAt && <CheckCircle size={15} className="text-emerald-600" />}
                </div>
                <p className="text-xs text-gray-600 mt-1">{b.description}</p>
                <p className="text-[11px] text-gray-400 mt-1.5">
                  {b.unlockedAt ? `Đã mở khóa: ${b.unlockedAt}` : 'Chưa mở khóa'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
