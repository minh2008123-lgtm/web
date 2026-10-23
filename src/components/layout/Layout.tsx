import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { NetworkStatusBanner } from '../ui/NetworkStatusBanner';

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Liên kết hỗ trợ người dùng điều hướng bằng phím Tab (Accessibility) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:rounded-xl focus:shadow-lg focus:font-medium"
      >
        Chuyển tới nội dung chính
      </a>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Thanh tự động cảnh báo khi mất mạng / có mạng lại */}
        <NetworkStatusBanner />

        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Thêm id="main-content" để khớp với thẻ <a> ở trên */}
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};