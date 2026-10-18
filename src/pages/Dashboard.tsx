import { Link } from 'react-router-dom';
import {
  Flame,
  Zap,
  BookOpen,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
  Trophy,
  Clock,
  Target,
  ChevronRight,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';
import { ProgressBar, Card, Badge, CardLink } from '../components/ui';
import { courses, lessons } from '../data/coursesData';
import { dailyTasks, recentActivities, badges, userStats } from '../data/userData';

export function Dashboard() {
  const activeCourse = courses[0];
  const continueLesson = lessons.find((l) => !l.isCompleted);
  const recentLessons = lessons.filter((l) => l.isCompleted).slice(0, 3);

  const skillCards = [
    { icon: Headphones, label: 'Nghe', progress: 65, color: 'violet', path: '/listening' },
    { icon: Mic, label: 'Nói', progress: 42, color: 'pink', path: '/speaking' },
    { icon: FileText, label: 'Đọc', progress: 78, color: 'blue', path: '/reading' },
    { icon: PenTool, label: 'Viết', progress: 55, color: 'emerald', path: '/writing' },
    { icon: Book, label: 'Từ vựng', progress: 82, color: 'amber', path: '/vocabulary' },
  ];

  const completedTasks = dailyTasks.filter((t) => t.isCompleted).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Chào buổi sáng, Nguyễn Văn A! 👋</h2>
            <p className="text-primary-100">Hãy tiếp tục hành trình học tiếng Anh của bạn hôm nay</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Flame className="text-orange-300" size={20} />
              <span className="font-bold">7 ngày</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Zap className="text-yellow-300" size={20} />
              <span className="font-bold">2,450 XP</span>
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="mt-6 bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-100">Tiến độ hôm nay</span>
            <span className="text-sm font-medium">{completedTasks}/{dailyTasks.length} nhiệm vụ</span>
          </div>
          <ProgressBar
            value={completedTasks}
            max={dailyTasks.length}
            color="accent"
            size="md"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-50 rounded-xl">
            <BookOpen className="text-primary-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">28</p>
            <p className="text-sm text-gray-500">Bài học</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-success-50 rounded-xl">
            <Target className="text-success-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">78%</p>
            <p className="text-sm text-gray-500">Accuracy</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Clock className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">7h</p>
            <p className="text-sm text-gray-500">Thời gian</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Trophy className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-sm text-gray-500">Level</p>
          </div>
        </Card>
      </div>

      {/* Continue Learning */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Course */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Tiếp tục học</h3>
            <Link to="/courses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="flex gap-4">
            <img
              src={activeCourse.thumbnail}
              alt={activeCourse.title}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <Badge variant="primary">{activeCourse.level}</Badge>
              <h4 className="font-semibold text-gray-900 mt-2">{activeCourse.title}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {activeCourse.completedLessons}/{activeCourse.totalLessons} bài học
              </p>
              <ProgressBar
                value={activeCourse.completedLessons}
                max={activeCourse.totalLessons}
                size="sm"
                className="mt-2"
              />
            </div>
          </div>

          {continueLesson && (
            <Link
              to={`/lesson/${continueLesson.id}`}
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Tiếp tục: {continueLesson.title}
              <ChevronRight size={18} />
            </Link>
          )}
        </Card>

        {/* Daily Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Nhiệm vụ hôm nay</h3>
            <Calendar className="text-gray-400" size={20} />
          </div>

          <div className="space-y-3">
            {dailyTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  task.isCompleted ? 'bg-success-50' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    task.isCompleted
                      ? 'bg-success-500 border-success-500'
                      : 'border-gray-300'
                  }`}
                >
                  {task.isCompleted && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                    {task.title}
                  </p>
                </div>
                <Badge variant={task.isCompleted ? 'success' : 'accent'}>
                  +{task.xpReward} XP
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Skills Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Kỹ năng</h3>
          <Link to="/learning-path" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            Chi tiết
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {skillCards.map((skill) => (
            <CardLink
              key={skill.path}
              to={skill.path}
              className="text-center p-4"
            >
              <div className={`inline-flex p-3 rounded-xl bg-${skill.color}-50 mb-3`}>
                <skill.icon className={`text-${skill.color}-600`} size={24} />
              </div>
              <p className="font-medium text-gray-900 mb-2">{skill.label}</p>
              <ProgressBar
                value={skill.progress}
                size="sm"
                color="gradient"
                className="mt-2"
              />
              <p className="text-xs text-gray-500 mt-1">{skill.progress}%</p>
            </CardLink>
          ))}
        </div>
      </Card>

      {/* Recent Activity & Badges */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Weekly XP Chart */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">XP tuần này</h3>
            <TrendingUp className="text-success-500" size={20} />
          </div>

          <div className="flex items-end justify-between h-32 gap-2">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
              const xp = userStats.weeklyXP[index];
              const maxXP = Math.max(...userStats.weeklyXP);
              const height = (xp / maxXP) * 100;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      index === 6 ? 'bg-primary-500' : 'bg-primary-200'
                    }`}
                    style={{ height: `${Math.max(height, 10)}%` }}
                  />
                  <span className="text-xs text-gray-500">{day}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tổng tuần này</p>
              <p className="text-xl font-bold text-gray-900">
                {userStats.weeklyXP.reduce((a, b) => a + b, 0).toLocaleString()} XP
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Trung bình</p>
              <p className="text-xl font-bold text-gray-900">
                {Math.round(userStats.weeklyXP.reduce((a, b) => a + b, 0) / 7)} XP
              </p>
            </div>
          </div>
        </Card>

        {/* Badges */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Huy hiệu của bạn</h3>
            <Link to="/achievements" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-2 rounded-lg ${
                  badge.unlockedAt ? 'bg-gray-50' : 'bg-gray-100 opacity-50'
                }`}
                title={badge.name}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-xs text-gray-500 text-center leading-tight">
                  {badge.name.length > 8 ? badge.name.slice(0, 8) + '...' : badge.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Bạn đã đạt</span>
              <span className="font-medium text-gray-900">
                {badges.filter((b) => b.unlockedAt).length}/{badges.length} huy hiệu
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
