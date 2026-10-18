import { Link } from 'react-router-dom';
import {
  CheckCircle,
  Circle,
  PlayCircle,
  Lock,
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
import { courses } from '../data/coursesData';

export function LearningPath() {
  const levelInfo = {
    A1: { name: 'Beginner', color: 'success', description: 'Nền tảng cơ bản - có thể giao tiếp đơn giản' },
    A2: { name: 'Elementary', color: 'primary', description: 'Phát triển khả năng giao tiếp cơ bản' },
    B1: { name: 'Intermediate', color: 'accent', description: 'Thoải mái giao tiếp trong nhiều tình huống' },
    B2: { name: 'Upper Intermediate', color: 'purple', description: 'Giao tiếp lưu loát, viết bài luận phức tạp' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Lộ trình học tiếng Anh</h2>
        <p className="text-gray-600">
          Từ người mới bắt đầu đến thành thạo - lộ trình được thiết kế theo chuẩn CEFR
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-primary-100 text-sm mb-1">Tiến độ tổng thể</p>
            <p className="text-3xl font-bold">Level 12</p>
            <p className="text-primary-100 mt-1">2,450 XP / 3,000 XP để lên level tiếp theo</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Flame className="text-orange-300" />
                <span>7</span>
              </div>
              <p className="text-primary-100 text-sm">Streak</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-bold">
                <Zap className="text-yellow-300" />
                <span>28</span>
              </div>
              <p className="text-primary-100 text-sm">Bài học</p>
            </div>
          </div>
        </div>
        <ProgressBar
          value={2450}
          max={3000}
          color="accent"
          size="lg"
          className="mt-4"
        />
      </Card>

      {/* Learning Path */}
      <div className="relative">
        {/* Connection line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 hidden md:block" />

        <div className="space-y-6">
          {courses.map((course, index) => {
            const info = levelInfo[course.level];
            const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
            const isUnlocked = index === 0 || courses[index - 1].completedLessons > 0;
            const isCurrent = course.completedLessons > 0 && progress < 100;
            const isCompleted = progress === 100;

            return (
              <Card
                key={course.id}
                className={`relative ${isUnlocked ? '' : 'opacity-60'}`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Status */}
                  <div className="flex md:flex-col items-center md:items-center gap-3">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        isCompleted
                          ? 'bg-success-500 text-white'
                          : isCurrent
                          ? 'bg-primary-500 text-white'
                          : isUnlocked
                          ? 'bg-gray-100 text-gray-400'
                          : 'bg-gray-100 text-gray-300'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={32} />
                      ) : isUnlocked ? (
                        <span className="text-xl font-bold">{course.level}</span>
                      ) : (
                        <Lock size={24} />
                      )}
                    </div>
                    <div className="md:hidden flex-1">
                      <Badge
                        variant={
                          isCompleted
                            ? 'success'
                            : isCurrent
                            ? 'primary'
                            : isUnlocked
                            ? 'accent'
                            : 'warning'
                        }
                      >
                        {isCompleted
                          ? 'Hoàn thành'
                          : isCurrent
                          ? 'Đang học'
                          : isUnlocked
                          ? 'Sẵn sàng'
                          : 'Khóa'}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="hidden md:flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {course.level} - {info.name}
                      </h3>
                      <Badge
                        variant={
                          isCompleted
                            ? 'success'
                            : isCurrent
                            ? 'primary'
                            : isUnlocked
                            ? 'accent'
                            : 'warning'
                        }
                      >
                        {isCompleted
                          ? 'Hoàn thành'
                          : isCurrent
                          ? 'Đang học'
                          : isUnlocked
                          ? 'Sẵn sàng'
                          : 'Khóa'}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4">{course.description}</p>

                    {/* Skills */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                      {course.skills.map((skill) => (
                        <div
                          key={skill.type}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                        >
                          <div
                            className="p-1.5 rounded-md"
                            style={{ backgroundColor: skill.color + '20' }}
                          >
                            {skill.type === 'listening' && <Headphones size={16} style={{ color: skill.color }} />}
                            {skill.type === 'speaking' && <Mic size={16} style={{ color: skill.color }} />}
                            {skill.type === 'reading' && <FileText size={16} style={{ color: skill.color }} />}
                            {skill.type === 'writing' && <PenTool size={16} style={{ color: skill.color }} />}
                            {skill.type === 'vocabulary' && <Book size={16} style={{ color: skill.color }} />}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{skill.progress}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Progress & Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-500">
                            {course.completedLessons}/{course.totalLessons} bài học
                          </span>
                          <span className="font-medium text-gray-700">{progress}%</span>
                        </div>
                        <ProgressBar
                          value={course.completedLessons}
                          max={course.totalLessons}
                          size="sm"
                          color={isCurrent ? 'primary' : 'success'}
                        />
                      </div>

                      {isUnlocked ? (
                        <Link
                          to={`/courses/${course.id}`}
                          className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-colors ${
                            isCurrent
                              ? 'bg-primary-600 text-white hover:bg-primary-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isCurrent ? (
                            <>
                              <PlayCircle size={20} />
                              Tiếp tục học
                            </>
                          ) : isCompleted ? (
                            'Ôn tập lại'
                          ) : (
                            'Bắt đầu'
                          )}
                          <ChevronRight size={18} />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 text-gray-400">
                          <Lock size={20} />
                          Mở khóa {course.level}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <Zap className="text-amber-600" size={24} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-1">Mẹo học hiệu quả</h4>
            <p className="text-gray-600 text-sm">
              Học ít nhất 15-20 phút mỗi ngày để duy trì streak và cải thiện nhanh hơn.
              Kết hợp cả 4 kỹ năng để đạt hiệu quả tốt nhất.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
