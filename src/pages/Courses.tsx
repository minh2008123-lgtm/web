import { Link } from 'react-router-dom';
import {
  Clock,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
} from 'lucide-react';
import { ProgressBar, Card, Badge } from '../components/ui';
import { courses, lessons } from '../data/coursesData';

export function Courses() {
  const getCourseLessons = (courseId: string) => {
    return lessons.filter((l) => l.courseId === courseId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Khóa học của bạn</h2>
          <p className="text-gray-600 mt-1">Chọn cấp độ phù hợp với trình độ của bạn</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="input-field w-auto">
            <option>Tất cả cấp độ</option>
            <option>A1 - Beginner</option>
            <option>A2 - Elementary</option>
            <option>B1 - Intermediate</option>
            <option>B2 - Upper Intermediate</option>
          </select>
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {courses.map((course) => {
          const courseLessons = getCourseLessons(course.id);
          const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
          const isStarted = course.completedLessons > 0;

          return (
            <Card key={course.id} className="overflow-hidden">
              {/* Thumbnail */}
              <div className="relative h-40 -mx-6 -mt-6 mb-4">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant={course.level === 'A1' ? 'success' : course.level === 'A2' ? 'primary' : 'accent'}>
                    {course.level}
                  </Badge>
                  <h3 className="text-xl font-bold text-white mt-2">{course.title}</h3>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {course.skills.slice(0, 4).map((skill) => (
                  <div
                    key={skill.type}
                    className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg text-xs"
                  >
                    {skill.type === 'listening' && <Headphones size={14} className="text-violet-600" />}
                    {skill.type === 'speaking' && <Mic size={14} className="text-pink-600" />}
                    {skill.type === 'reading' && <FileText size={14} className="text-blue-600" />}
                    {skill.type === 'writing' && <PenTool size={14} className="text-emerald-600" />}
                    {skill.type === 'vocabulary' && <Book size={14} className="text-amber-600" />}
                    <span className="text-gray-600">{skill.name}</span>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500">
                    {course.completedLessons}/{course.totalLessons} bài học
                  </span>
                  <span className="font-medium text-gray-700">{progress}%</span>
                </div>
                <ProgressBar
                  value={course.completedLessons}
                  max={course.totalLessons}
                  color={isStarted ? 'primary' : 'accent'}
                />
              </div>

              {/* Lessons Preview */}
              {isStarted && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Bài học gần đây:</p>
                  <div className="space-y-2">
                    {courseLessons.slice(0, 3).map((lesson) => (
                      <Link
                        key={lesson.id}
                        to={`/lesson/${lesson.id}`}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          lesson.isCompleted
                            ? 'bg-success-50 hover:bg-success-100'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        {lesson.isCompleted ? (
                          <CheckCircle size={18} className="text-success-500 flex-shrink-0" />
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-2 border-gray-300 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {lesson.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock size={12} />
                          <span>{lesson.duration}p</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              <Link
                to={`/courses/${course.id}`}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${
                  isStarted
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isStarted ? 'Tiếp tục học' : 'Bắt đầu khóa học'}
                <ChevronRight size={18} />
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
