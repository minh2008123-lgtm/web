import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  PlayCircle,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
} from 'lucide-react';
import { Card, Badge, ProgressBar } from '../components/ui';
import { useLearning } from '../hooks/useLearning';

export function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, lessons } = useLearning();

  const course = courses.find((c) => c.id === courseId) || courses[0];
  const courseLessons = lessons.filter((l) => l.courseId === course.id);
  const completedCount = courseLessons.filter((l) => l.isCompleted).length;

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Danh sách khóa học</span>
      </button>

      <Card
        className="text-white"
        // eslint-disable-next-line react/forbid-dom-props
      >
        <div
          className="-m-6 p-6 rounded-xl"
          style={{ background: course.thumbnail }}
        >
          <Badge variant="accent">CEFR {course.level}</Badge>
          <h2 className="text-2xl font-bold mt-2">{course.title}</h2>
          <p className="text-white/90 text-sm mt-1 max-w-2xl">{course.description}</p>
          <div className="mt-4 max-w-md">
            <div className="flex justify-between text-xs mb-1">
              <span>Tiến độ khóa học</span>
              <span>
                {completedCount}/{courseLessons.length} bài hoàn thành
              </span>
            </div>
            <ProgressBar
              value={completedCount}
              max={Math.max(1, courseLessons.length)}
              color="accent"
              size="sm"
            />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 text-lg">
          Danh sách bài học ({courseLessons.length} bài)
        </h3>

        {courseLessons.map((lesson, idx) => (
          <Card key={lesson.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                    lesson.isCompleted
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-primary-50 text-primary-700'
                  }`}
                >
                  {lesson.isCompleted ? <CheckCircle size={20} /> : idx + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-gray-900">{lesson.title}</h4>
                    <Badge variant="primary" size="sm">
                      {lesson.skill.toUpperCase()}
                    </Badge>
                    {lesson.bestScore && (
                      <Badge variant="success" size="sm">
                        Điểm cao nhất: {lesson.bestScore}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{lesson.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {lesson.duration} phút
                    </span>
                    <span>+{lesson.xpReward} XP</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {lesson.skill === 'listening' && (
                  <Link
                    to="/listening"
                    className="px-3 py-2 rounded-lg bg-violet-50 text-violet-700 text-xs font-medium hover:bg-violet-100 flex items-center gap-1"
                  >
                    <Headphones size={14} /> Phòng Nghe
                  </Link>
                )}
                {lesson.skill === 'speaking' && (
                  <Link
                    to="/speaking"
                    className="px-3 py-2 rounded-lg bg-pink-50 text-pink-700 text-xs font-medium hover:bg-pink-100 flex items-center gap-1"
                  >
                    <Mic size={14} /> Phòng Nói
                  </Link>
                )}
                {lesson.skill === 'reading' && (
                  <Link
                    to="/reading"
                    className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 flex items-center gap-1"
                  >
                    <FileText size={14} /> Phòng Đọc
                  </Link>
                )}
                {lesson.skill === 'writing' && (
                  <Link
                    to="/writing"
                    className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 flex items-center gap-1"
                  >
                    <PenTool size={14} /> Phòng Viết
                  </Link>
                )}
                {lesson.skill === 'vocabulary' && (
                  <Link
                    to="/flashcards"
                    className="px-3 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 flex items-center gap-1"
                  >
                    <Book size={14} /> Flashcards
                  </Link>
                )}

                <Link
                  to={`/lesson/${lesson.id}`}
                  className="px-4 py-2 rounded-xl bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 flex items-center gap-1.5"
                >
                  <PlayCircle size={15} />
                  {lesson.isCompleted ? 'Làm lại' : 'Làm bài tập'}
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
