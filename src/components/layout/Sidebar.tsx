import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  Home,
  Map,
  BookOpen,
  Headphones,
  Mic,
  FileText,
  PenTool,
  Book,
  Repeat,
  Trophy,
  BarChart3,
  User,
  Settings,
  Menu,
  X,
  Flame,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: Home, label: 'Trang chủ', color: 'text-primary-600' },
  { path: '/learning-path', icon: Map, label: 'Lộ trình', color: 'text-purple-600' },
  { path: '/courses', icon: BookOpen, label: 'Khóa học', color: 'text-blue-600' },
];

const skillItems = [
  { path: '/listening', icon: Headphones, label: 'Luyện nghe', color: 'text-violet-600' },
  { path: '/speaking', icon: Mic, label: 'Luyện nói', color: 'text-pink-600' },
  { path: '/reading', icon: FileText, label: 'Luyện đọc', color: 'text-blue-600' },
  { path: '/writing', icon: PenTool, label: 'Luyện viết', color: 'text-emerald-600' },
];

const practiceItems = [
  { path: '/vocabulary', icon: Book, label: 'Từ vựng', color: 'text-amber-600' },
  { path: '/flashcards', icon: Repeat, label: 'Flashcards', color: 'text-orange-600' },
  { path: '/review', icon: BarChart3, label: 'Ôn tập', color: 'text-cyan-600' },
];

const otherItems = [
  { path: '/achievements', icon: Trophy, label: 'Thành tích', color: 'text-yellow-600' },
  { path: '/stats', icon: BarChart3, label: 'Thống kê', color: 'text-indigo-600' },
  { path: '/profile', icon: User, label: 'Hồ sơ', color: 'text-gray-600' },
  { path: '/settings', icon: Settings, label: 'Cài đặt', color: 'text-gray-600' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation();

  const NavItem = ({ path, icon: Icon, label, color }: { path: string; icon: any; label: string; color: string }) => (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
          isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`
      }
    >
      <Icon size={20} className={color} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">LQ</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">LinguaQuest</h1>
                <div className="flex items-center gap-1 text-xs text-orange-500">
                  <Flame size={12} />
                  <span className="font-medium">7 day streak</span>
                </div>
              </div>
            </div>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
            {/* Main */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Chính
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </div>

            {/* Skills */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Kỹ năng
              </h3>
              <div className="space-y-1">
                {skillItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </div>

            {/* Practice */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Luyện tập
              </h3>
              <div className="space-y-1">
                {practiceItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </div>

            {/* Other */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Khác
              </h3>
              <div className="space-y-1">
                {otherItems.map((item) => (
                  <NavItem key={item.path} {...item} />
                ))}
              </div>
            </div>
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=nguyenvana"
                alt="Avatar"
                className="w-10 h-10 rounded-full bg-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">Nguyễn Văn A</p>
                <p className="text-sm text-gray-500">Level 12</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="fixed bottom-4 left-4 z-30 lg:hidden w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary-700 transition-colors"
      >
        <Menu size={24} />
      </button>
    </>
  );
}
