import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import {
  Dashboard,
  LearningPath,
  Courses,
  LessonPage,
  Vocabulary,
} from './pages';

// Placeholder pages for remaining routes
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">Trang đang được phát triển...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="learning-path" element={<LearningPath />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:courseId" element={<PlaceholderPage title="Chi tiết khóa học" />} />
        <Route path="lesson/:lessonId" element={<LessonPage />} />
        <Route path="listening" element={<PlaceholderPage title="Luyện nghe" />} />
        <Route path="speaking" element={<PlaceholderPage title="Luyện nói" />} />
        <Route path="reading" element={<PlaceholderPage title="Luyện đọc" />} />
        <Route path="writing" element={<PlaceholderPage title="Luyện viết" />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="flashcards" element={<PlaceholderPage title="Flashcards" />} />
        <Route path="review" element={<PlaceholderPage title="Ôn tập" />} />
        <Route path="achievements" element={<PlaceholderPage title="Thành tích" />} />
        <Route path="stats" element={<PlaceholderPage title="Thống kê" />} />
        <Route path="profile" element={<PlaceholderPage title="Hồ sơ" />} />
        <Route path="settings" element={<PlaceholderPage title="Cài đặt" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
