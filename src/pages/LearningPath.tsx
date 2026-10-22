import { Link } from 'react-router-dom';
import {
  CheckCircle,
  PlayCircle,
  ChevronRight,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
  Zap,
  Flame,
} from 'lucide-react';
import { ProgressBar, Card, Badge } from '../components/ui';
import { useLearning } from '../hooks/useLearning';

export function LearningPath() {
  const { courses, lessons, stats } = useLearning();

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Lộ trình học tiếng Anh chuẩn CEFR (A1 → B2)
        </h2>
        <p className="text-gray-600 text-sm">
          Từng bước chinh phục 4 kỹ năng Nghe, Nói, Đọc, Viết với lộ trình cá nhân hóa
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">Cấp độ hiện tại của bạn</p>
            <p className="text-3xl font-bold">Level {stats.level}</p>
            <p className="text-primary-100 mt-1 text-sm">
              {stats.totalXP.toLocaleString()} XP tích lũy • Đã hoàn thành {stats.lessonsCompleted} bài học
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Flame className="text-orange-300" />
                <span>{stats.streak}</span>
              </div>
              <p className="text-primary-100 text-xs">Ngày Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Zap className="text-yellow-300" />
                <span>{stats.accuracy}%</span>
              </div>
              <p className="text-primary-100 text-xs">Độ chính xác</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Roadmap Nodes */}
      <div className="space-y-6">
        {courses.map((course) => {
          const courseLessons = lessons.filter((l) => l.courseId === course.id);
          const completed = courseLessons.filter((l) => l.isCompleted).length;
          const total = courseLessons.length || course.totalLessons;
          const progress = Math.round((completed / total) * 100);
          const isCompleted = progress === 100;

          return (
            <Card key={course.id}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex md:flex-col items-center gap-3">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                    style={{ background: course.thumbnail }}
                  >
                    {isCompleted ? <CheckCircle size={30} /> : course.level}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                    <Badge variant={completed > 0 ? 'primary' : 'accent'}>
                      {isCompleted ? 'Hoàn thành' : completed > 0 ? 'Đang học' : 'Sẵn sàng mở'}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {course.skills.map((skill) => (
                      <div
                        key={skill.type}
                        className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                      >
                        {skill.type === 'listening' && <Headphones size={16} className="text-violet-600" />}
                        {skill.type === 'speaking' && <Mic size={16} className="text-pink-600" />}
                        {skill.type === 'reading' && <FileText size={16} className="text-blue-600" />}
                        {skill.type === 'writing' && <PenTool size={16} className="text-emerald-600" />}
                        {skill.type === 'vocabulary' && <Book size={16} className="text-amber-600" />}
                        <span className="text-xs font-medium text-gray-700">
                          {skill.name}: {skill.progress}%
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">
                          {completed}/{total} bài học
                        </span>
                        <span className="font-semibold text-gray-700">{progress}%</span>
                      </div>
                      <ProgressBar value={completed} max={total} size="sm" />
                    </div>

                    <Link
                      to={`/courses/${course.id}`}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 text-sm"
                    >
                      <PlayCircle size={18} />
                      Vào lộ trình {course.level}
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
