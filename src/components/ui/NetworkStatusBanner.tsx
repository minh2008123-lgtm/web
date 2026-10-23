import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const NetworkStatusBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`px-4 py-2 text-xs font-medium flex items-center justify-center gap-2 transition-colors ${
        !isOnline
          ? 'bg-amber-600 text-white'
          : 'bg-emerald-600 text-white'
      }`}
    >
      {!isOnline ? (
        <>
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>
            Mất kết nối Internet. Tiến độ học và bản nháp của bạn vẫn đang được lưu an toàn trên thiết bị và sẽ đồng bộ khi có mạng trở lại.
          </span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Đã khôi phục kết nối mạng! Dữ liệu đã sẵn sàng đồng bộ với Supabase.</span>
        </>
      )}
    </div>
  );
};