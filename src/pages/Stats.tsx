import { BarChart3, Target, Clock, Zap, CheckCircle } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { useLearning } from '../hooks/useLearning';

export function Stats() {
  const { stats, attempts } = useLearning();

  const skillItems = [
    { key: 'listening', label: 'Nghe (Listening)', color: 'primary' as const },
    { key: 'speaking', label: 'Nói (Speaking)', color: 'accent' as const },
    { key: 'reading', label: 'Đọc (Reading)', color: 'success' as const },
    { key: 'writing', label: 'Viết (Writing)', color: 'primary' as const },
    { key: 'vocabulary', label: 'Từ vựng (Vocabulary)', color: 'success' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Thống kê Tiến độ & Lịch sử Làm bài
        </h2>
        <p className="text-gray-600 mt-1">
          Phân tích chi tiết mức độ thành thạo từng kỹ năng và kết quả các bài tập đã hoàn thành
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <Zap className="text-amber-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalXP.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Tổng XP tích lũy</p>
        </Card>
        <Card className="p-4">
          <Target className="text-emerald-600 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
          <p className="text-xs text-gray-500">Độ chính xác trung bình</p>
        </Card>
        <Card className="p-4">
          <Clock className="text-blue-600 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-900">
            {stats.totalPracticeTime} phút
          </p>
          <p className="text-xs text-gray-500">Tổng thời gian học</p>
        </Card>
        <Card className="p-4">
          <BarChart3 className="text-purple-600 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
          <p className="text-xs text-gray-500">Lượt làm bài tập</p>
        </Card>
      </div>

      {/* Skill Breakdown */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">
          So sánh Tiến độ & Độ chính xác theo từng Kỹ năng
        </h3>
        <div className="space-y-4">
          {skillItems.map((item) => {
            const prog =
              stats.skillsProgress[item.key as keyof typeof stats.skillsProgress] || 0;
            const acc =
              stats.skillAccuracy?.[item.key as keyof typeof stats.skillAccuracy] || 75;
            return (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-800">{item.label}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-gray-500">Độ chính xác: {acc}%</span>
                    <span className="font-bold text-primary-700">Tiến độ: {prog}%</span>
                  </div>
                </div>
                <ProgressBar value={prog} color={item.color} size="md" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Attempt History */}
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Lịch sử làm bài gần đây</h3>
        <div className="space-y-3">
          {attempts.map((att) => (
            <div
              key={att.id}
              className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3">
                <CheckCircle
                  size={18}
                  className={att.score >= 80 ? 'text-emerald-600' : 'text-amber-500'}
                />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{att.lessonTitle}</p>
                  <p className="text-xs text-gray-500">
                    Kỹ năng: {att.skill.toUpperCase()} • Ngày: {att.completedAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={att.score >= 80 ? 'success' : 'accent'}>
                  Điểm: {att.score}%
                </Badge>
                <Badge variant="primary">+{att.xpEarned} XP</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
