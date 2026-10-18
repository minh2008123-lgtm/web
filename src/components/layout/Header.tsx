import { Bell, Search, Flame, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const pageTitles: Record<string, string> = {
  '/': 'Trang chủ',
  '/learning-path': 'Lộ trình học',
  '/courses': 'Khóa học',
  '/listening': 'Luyện nghe',
  '/speaking': 'Luyện nói',
  '/reading': 'Luyện đọc',
  '/writing': 'Luyện viết',
  '/vocabulary': 'Từ vựng',
  '/flashcards': 'Flashcards',
  '/review': 'Ôn tập',
  '/achievements': 'Thành tích',
  '/stats': 'Thống kê',
  '/profile': 'Hồ sơ',
  '/settings': 'Cài đặt',
};

export function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'LinguaQuest';

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Title */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500">Chào buổi sáng!</p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="bg-transparent outline-none w-48 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* Streak */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-orange-50 rounded-full">
            <Flame size={18} className="text-orange-500" />
            <span className="font-semibold text-orange-600">7</span>
          </div>

          {/* XP */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-primary-50 rounded-full">
            <Zap size={18} className="text-primary-600" />
            <span className="font-semibold text-primary-600 font-mono">2,450 XP</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={22} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Avatar */}
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana"
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-primary-100 cursor-pointer hover:border-primary-300 transition-colors"
          />
        </div>
      </div>
    </header>
  );
}
