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
  Sparkles,
  Brain,
} from 'lucide-react';
import { ProgressBar, Card, Badge, CardLink } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { badges } from '../data/userData';

export function Dashboard() {
  const {
    user,
    stats,
    courses,
    lessons,
    dailyTasks,
    dueVocabulary,
    recommendations,
  } = useLearning();

  const activeCourse = courses[0];
  const continueLesson = lessons.find((l) => !l.isCompleted) || lessons[0];
  const completedTasks = dailyTasks.filter((t) => t.isCompleted).length;

  const skillCards = [
    {
      icon: Headphones,
      label: 'Nghe',
      progress: stats.skillsProgress.listening,
      accuracy: stats.skillAccuracy?.listening || 82,
      bgClass: 'bg-violet-50',
      textClass: 'text-violet-600',
      path: '/listening',
    },
    {
      icon: Mic,
      label: 'Nói',
      progress: stats.skillsProgress.speaking,
      accuracy: stats.skillAccuracy?.speaking || 68,
      bgClass: 'bg-pink-50',
      textClass: 'text-pink-600',
      path: '/speaking',
    },
    {
      icon: FileText,
      label: 'Đọc',
      progress: stats.skillsProgress.reading,
      accuracy: stats.skillAccuracy?.reading || 86,
      bgClass: 'bg-blue-50',
      textClass: 'text-blue-600',
      path: '/reading',
    },
    {
      icon: PenTool,
      label: 'Viết',
      progress: stats.skillsProgress.writing,
      accuracy: stats.skillAccuracy?.writing || 75,
      bgClass: 'bg-emerald-50',
      textClass: 'text-emerald-600',
      path: '/writing',
    },
    {
      icon: Book,
      label: 'Từ vựng',
      progress: stats.skillsProgress.vocabulary,
      accuracy: stats.skillAccuracy?.vocabulary || 88,
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-600',
      path: '/vocabulary',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-primary-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full text-xs font-medium bg-white/20 mb-2">
              Giai đoạn 2 • Chức năng học tập tương tác
            </span>
            <h2 className="text-2xl font-bold mb-1">
              Chào mừng trở lại, {user.fullName}! 👋
            </h2>
            <p className="text-primary-100 text-sm">
              Bạn có {dueVocabulary.length} thẻ từ vựng đến hạn ôn tập SM-2 hôm nay.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Flame className="text-orange-300" size={20} />
              <span className="font-bold">{user.streak} ngày</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Zap className="text-yellow-300" size={20} />
              <span className="font-bold">{stats.totalXP.toLocaleString()} XP</span>
            </div>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="mt-6 bg-white/10 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-primary-100">
              Hoàn thành nhiệm vụ hằng ngày
            </span>
            <span className="text-sm font-medium">
              {completedTasks}/{dailyTasks.length} nhiệm vụ
            </span>
          </div>
          <ProgressBar
            value={completedTasks}
            max={dailyTasks.length}
            color="accent"
            size="md"
          />
        </div>
      </div>

      {/* Adaptive Recommendations Section (Phase 2 Core Feature) */}
      <Card className="border-2 border-primary-100 bg-gradient-to-r from-indigo-50/60 via-white to-violet-50/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary-100 text-primary-700">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">
                Đề xuất học tập cá nhân hóa (Adaptive Recommendations)
              </h3>
              <p className="text-xs text-gray-500">
                Tự động phân tích dựa trên kỹ năng yếu nhất, lịch sử điểm số và chu kỳ nhớ từ vựng SM-2
              </p>
            </div>
          </div>
          <Link
            to="/review"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100"
          >
            <Brain size={15} />
            Ôn tập SRS ({dueVocabulary.length} từ)
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
            <Link
              key={rec.id}
              to={rec.targetPath}
              className="flex flex-col justify-between p-4 rounded-xl bg-white border border-gray-200 hover:border-primary-400 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant={
                      rec.priority === 'high'
                        ? 'error'
                        : rec.priority === 'medium'
                        ? 'accent'
                        : 'primary'
                    }
                  >
                    {rec.priority === 'high'
                      ? 'Ưu tiên cao'
                      : rec.priority === 'medium'
                      ? 'Khuyến nghị'
                      : 'Lộ trình'}
                  </Badge>
                  <span className="text-xs font-mono text-primary-600 font-semibold">
                    +{rec.xpReward} XP • {rec.estimatedMinutes}p
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 text-sm mb-1.5">{rec.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{rec.reason}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                <span>Bắt đầu ngay</span>
                <ChevronRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-primary-50 rounded-xl">
            <BookOpen className="text-primary-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.lessonsCompleted}</p>
            <p className="text-sm text-gray-500">Bài đã học</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-success-50 rounded-xl">
            <Target className="text-success-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
            <p className="text-sm text-gray-500">Độ chính xác</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-50 rounded-xl">
            <Clock className="text-amber-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(stats.totalPracticeTime / 60)}h {stats.totalPracticeTime % 60}p
            </p>
            <p className="text-sm text-gray-500">Thời gian luyện</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Trophy className="text-purple-600" size={24} />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">Lv.{stats.level}</p>
            <p className="text-sm text-gray-500">{stats.vocabularyLearned} từ vựng</p>
          </div>
        </Card>
      </div>

      {/* Skills Overview */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">Theo dõi tiến độ 4 Kỹ năng & Từ vựng</h3>
            <p className="text-xs text-gray-500">
              Bấm vào từng thẻ kỹ năng để mở phòng luyện tập chuyên biệt
            </p>
          </div>
          <Link
            to="/stats"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem phân tích
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {skillCards.map((skill) => (
            <CardLink key={skill.path} to={skill.path} className="text-center p-4">
              <div className={`inline-flex p-3 rounded-xl ${skill.bgClass} mb-3`}>
                <skill.icon className={skill.textClass} size={24} />
              </div>
              <p className="font-bold text-gray-900">{skill.label}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Chính xác: {skill.accuracy}%
              </p>
              <ProgressBar
                value={skill.progress}
                size="sm"
                color="gradient"
                className="mt-2"
              />
              <p className="text-xs font-semibold text-primary-600 mt-1">
                Tiến độ: {skill.progress}%
              </p>
            </CardLink>
          ))}
        </div>
      </Card>

      {/* Continue Learning & Daily Tasks */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Khóa học đang theo dõi</h3>
            <Link
              to="/courses"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Tất cả khóa học
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0"
              style={{ background: activeCourse.thumbnail }}
            >
              {activeCourse.level}
            </div>
            <div className="flex-1">
              <Badge variant="primary">{activeCourse.level}</Badge>
              <h4 className="font-semibold text-gray-900 mt-1">{activeCourse.title}</h4>
              <p className="text-xs text-gray-500 mt-1">
                Hoàn thành {activeCourse.completedLessons}/{activeCourse.totalLessons} bài học
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
              className="mt-5 flex items-center justify-center gap-2 w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Làm bài tập: {continueLesson.title}
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
            {dailyTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${
                  task.isCompleted ? 'bg-success-50' : 'bg-gray-50'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.isCompleted
                      ? 'bg-success-500 border-success-500 text-white'
                      : 'border-gray-300'
                  }`}
                >
                  {task.isCompleted && <span className="text-xs font-bold">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      task.isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.description}</p>
                </div>
                <Badge variant={task.isCompleted ? 'success' : 'accent'}>
                  +{task.xpReward} XP
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly XP & Badges */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Biểu đồ XP trong tuần</h3>
            <TrendingUp className="text-success-500" size={20} />
          </div>

          <div className="flex items-end justify-between h-32 gap-2 pt-4">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => {
              const xp = stats.weeklyXP[index] || 100;
              const maxXP = Math.max(...stats.weeklyXP, 300);
              const height = (xp / maxXP) * 100;

              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-gray-500">{xp}</span>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      index === 6 ? 'bg-primary-600' : 'bg-primary-200'
                    }`}
                    style={{ height: `${Math.max(height, 12)}%` }}
                  />
                  <span className="text-xs text-gray-500 font-medium">{day}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Huy hiệu đạt được</h3>
            <Link
              to="/achievements"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-2.5 rounded-xl text-center ${
                  badge.unlockedAt ? 'bg-amber-50/70 border border-amber-200' : 'bg-gray-100 opacity-50'
                }`}
              >
                <span className="text-2xl mb-1">{badge.icon}</span>
                <span className="text-[11px] font-medium text-gray-700 line-clamp-2">
                  {badge.name}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
