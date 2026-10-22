import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle,
  ChevronRight,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
} from 'lucide-react';
import { ProgressBar, Card, Badge } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { CEFRLevel } from '../types';

export function Courses() {
  const { courses, lessons } = useLearning();
  const [selectedLevel, setSelectedLevel] = useState<'ALL' | CEFRLevel>('ALL');

  const filteredCourses = courses.filter(
    (c) => selectedLevel === 'ALL' || c.level === selectedLevel
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Danh sách Khóa học CEFR</h2>
          <p className="text-gray-600 mt-1">
            Chọn cấp độ từ A1 đến B2 để rèn luyện toàn diện 4 kỹ năng
          </p>
        </div>
        <div className="flex items-center gap-2">
          {(['ALL', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedLevel === lvl
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {lvl === 'ALL' ? 'Tất cả' : lvl}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const courseLessons = lessons.filter((l) => l.courseId === course.id);
          const completedCount = courseLessons.filter((l) => l.isCompleted).length;
          const totalCount = courseLessons.length || course.totalLessons;
          const progress = Math.round((completedCount / totalCount) * 100);

          return (
            <Card key={course.id} className="overflow-hidden flex flex-col justify-between">
              <div>
                <div
                  className="relative h-32 -mx-6 -mt-6 mb-4 p-6 flex flex-col justify-end text-white"
                  style={{ background: course.thumbnail }}
                >
                  <Badge variant="accent" className="self-start mb-1">
                    Chuẩn CEFR {course.level}
                  </Badge>
                  <h3 className="text-xl font-bold">{course.title}</h3>
                </div>

                <p className="text-gray-600 text-sm mb-4">{course.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {course.skills.map((skill) => (
                    <div
                      key={skill.type}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg text-xs"
                    >
                      {skill.type === 'listening' && <Headphones size={14} className="text-violet-600" />}
                      {skill.type === 'speaking' && <Mic size={14} className="text-pink-600" />}
                      {skill.type === 'reading' && <FileText size={14} className="text-blue-600" />}
                      {skill.type === 'writing' && <PenTool size={14} className="text-emerald-600" />}
                      {skill.type === 'vocabulary' && <Book size={14} className="text-amber-600" />}
                      <span className="text-gray-700 font-medium">{skill.name}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">
                      {completedCount}/{totalCount} bài học
                    </span>
                    <span className="font-medium text-gray-700">{progress}%</span>
                  </div>
                  <ProgressBar value={completedCount} max={totalCount} color="primary" />
                </div>

                <div className="space-y-2 mb-5">
                  {courseLessons.slice(0, 4).map((lesson) => (
                    <Link
                      key={lesson.id}
                      to={`/lesson/${lesson.id}`}
                      className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
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
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {lesson.title}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>{lesson.duration}p</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to={`/courses/${course.id}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                Xem toàn bộ bài học {course.level}
                <ChevronRight size={18} />
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
