import { Bell, Flame, Zap, Brain, Database } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useLearning } from '../../hooks/useLearning';

const pageTitles: Record<string, string> = {
  '/': 'Trang chủ',
  '/learning-path': 'Lộ trình học CEFR',
  '/courses': 'Khóa học',
  '/listening': 'Luyện nghe (Audio & Transcript)',
  '/speaking': 'Luyện nói (Voice Studio)',
  '/reading': 'Luyện đọc (Reading & Glossary)',
  '/writing': 'Luyện viết (Writing & Drafts)',
  '/vocabulary': 'Kho từ vựng IPA',
  '/flashcards': 'Flashcards 3D',
  '/review': 'Ôn tập lặp lại ngắt quãng (SM-2)',
  '/achievements': 'Thành tích & Huy hiệu',
  '/stats': 'Thống kê tiến bộ',
  '/profile': 'Hồ sơ cá nhân',
  '/settings': 'Cài đặt',
  '/auth': 'Tài khoản & Supabase (Giai đoạn 3)',
};

export function Header() {
  const location = useLocation();
  const {
    user,
    isAuthenticated,
    isSupabaseConnected,
    stats,
    dueVocabulary,
    notification,
    clearNotification,
  } = useLearning();
  const title = pageTitles[location.pathname] || 'LinguaQuest';

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-500">
            {isAuthenticated
              ? `Học viên: ${user.fullName} • Mục tiêu CEFR ${user.targetLevel || 'B2'}`
              : 'Chưa đăng nhập — Nhấn vào nút Tài khoản để đăng nhập'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Supabase & Auth Link */}
          <Link
            to="/auth"
            className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              isSupabaseConnected
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            <Database size={14} />
            <span>{isSupabaseConnected ? 'Supabase Live' : 'Auth & DB'}</span>
          </Link>

          {/* Due SRS Shortcut */}
          <Link
            to="/review"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-xs font-semibold hover:bg-cyan-100"
          >
            <Brain size={15} />
            <span>SRS: {dueVocabulary.length} từ</span>
          </Link>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-full">
            <Flame size={17} className="text-orange-500" />
            <span className="font-semibold text-orange-600 text-sm">{user.streak}</span>
          </div>

          {/* XP */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 rounded-full">
            <Zap size={17} className="text-primary-600" />
            <span className="font-semibold text-primary-600 font-mono text-sm">
              {stats.totalXP.toLocaleString()} XP
            </span>
          </div>

          {/* Notifications */}
          <Link
            to="/review"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Thông báo ôn tập"
          >
            <Bell size={20} className="text-gray-600" />
            {dueVocabulary.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>

          {/* Avatar */}
          <Link
            to="/auth"
            className="w-9 h-9 rounded-full bg-primary-600 text-white font-bold text-sm flex items-center justify-center"
            title="Quản lý Tài khoản & Đăng nhập"
          >
            {user.fullName.slice(0, 1).toUpperCase()}
          </Link>
        </div>
      </div>

      {notification && (
        <div className="bg-emerald-600 text-white px-6 py-2 text-xs font-medium flex items-center justify-between">
          <span>✨ {notification}</span>
          <button
            onClick={clearNotification}
            className="text-white/80 hover:text-white font-bold ml-4"
          >
            Đóng ✕
          </button>
        </div>
      )}
    </header>
  );
}
