import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout';
import { LearningProvider } from './hooks/useLearning';
import {
  Dashboard,
  LearningPath,
  Courses,
  CourseDetail,
  LessonPage,
  Vocabulary,
  Achievements,
  Stats,
  Profile,
  Settings,
} from './pages';
import { ListeningPractice } from './features/listening/ListeningPractice';
import { SpeakingPractice } from './features/speaking/SpeakingPractice';
import { ReadingPractice } from './features/reading/ReadingPractice';
import { WritingPractice } from './features/writing/WritingPractice';
import { FlashcardDeck } from './features/vocabulary/FlashcardDeck';
import { SpacedRepetitionReview } from './features/vocabulary/SpacedRepetitionReview';

function App() {
  return (
    <LearningProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="learning-path" element={<LearningPath />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="lesson/:lessonId" element={<LessonPage />} />
          <Route path="listening" element={<ListeningPractice />} />
          <Route path="speaking" element={<SpeakingPractice />} />
          <Route path="reading" element={<ReadingPractice />} />
          <Route path="writing" element={<WritingPractice />} />
          <Route path="vocabulary" element={<Vocabulary />} />
          <Route path="flashcards" element={<FlashcardDeck />} />
          <Route path="review" element={<SpacedRepetitionReview />} />
          <Route path="achievements" element={<Achievements />} />
          <Route path="stats" element={<Stats />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </LearningProvider>
  );
}

export default App;
