import { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Award, Save } from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { CEFRLevel } from '../types';

export function Profile() {
  const { user, stats, updateUserProfile } = useLearning();
  const [fullName, setFullName] = useState(user.fullName);
  const [targetLevel, setTargetLevel] = useState<CEFRLevel>(user.targetLevel || 'B2');
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes || 20);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      targetLevel,
      dailyGoalMinutes: dailyGoal,
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold text-3xl">
          {user.fullName.slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
            <Badge variant="primary">Level {stats.level}</Badge>
            <Badge variant="success">Mục tiêu: {targetLevel}</Badge>
          </div>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center sm:justify-start gap-2">
            <Mail size={14} /> {user.email} • <Calendar size={14} /> Tham gia: {user.joinedAt}
          </p>
        </div>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-4">
          <UserIcon size={20} className="text-primary-600" />
          <h3 className="font-bold text-gray-900">Cập nhật Hồ sơ & Mục tiêu Học tập</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Họ và tên hiển thị
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Trình độ CEFR mục tiêu
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as CEFRLevel)}
                className="input-field text-sm"
              >
                <option value="A1">A1 - Beginner</option>
                <option value="A2">A2 - Elementary</option>
                <option value="B1">B1 - Intermediate</option>
                <option value="B2">B2 - Upper Intermediate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Thời gian học mục tiêu mỗi ngày (phút)
              </label>
              <select
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="input-field text-sm"
              >
                <option value={10}>10 phút / ngày</option>
                <option value={20}>20 phút / ngày</option>
                <option value={30}>30 phút / ngày</option>
                <option value={45}>45 phút / ngày</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              <Save size={16} className="mr-1.5" /> Lưu thay đổi
            </Button>
          </div>
        </form>
      </Card>

      <Card className="bg-indigo-50/70 border border-indigo-100">
        <div className="flex items-start gap-3">
          <Award className="text-primary-600 flex-shrink-0" size={22} />
          <div className="text-xs text-indigo-900">
            <p className="font-bold text-sm">Lời khuyên học tập hằng ngày</p>
            <p className="mt-1 leading-relaxed">
              Duy trì thời gian luyện tập đều đặn từ 15-30 phút mỗi ngày và hoàn thành các thẻ ôn tập từ vựng đúng hạn để đạt kết quả tốt nhất trên con đường chinh phục chuẩn CEFR!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
