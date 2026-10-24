import { useState } from 'react';
import {
  LogIn,
  UserPlus,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Sparkles,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Badge, Button } from '../components/ui';
import { useLearning } from '../hooks/useLearning';

export function AuthPage() {
  const {
    user,
    stats,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  } = useLearning();

  const navigate = useNavigate();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        const res = await signIn(email, password);
        setStatusMsg({ ok: res.ok, text: res.message });
        if (res.ok) {
          setEmail('');
          setPassword('');
        }
      } else {
        const res = await signUp(email, password, fullName);
        setStatusMsg({ ok: res.ok, text: res.message });
        if (res.ok) {
          setEmail('');
          setPassword('');
          setFullName('');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Tài khoản học viên</h2>
        <p className="text-sm text-gray-500 mt-1">
          Đăng nhập hoặc đăng ký tài khoản để lưu lại toàn bộ lộ trình học tập, kho từ vựng và bảng vàng thành tích của bạn.
        </p>
      </div>

      {/* Logged In Status Banner */}
      {isAuthenticated && (
        <Card className="bg-gradient-to-r from-primary-50 via-indigo-50 to-purple-50 border border-primary-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {user.fullName ? user.fullName.slice(0, 1).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900 text-lg">{user.fullName}</h3>
                  <Badge variant="primary" size="sm">
                    Level {stats.level}
                  </Badge>
                  <Badge variant="accent" size="sm">
                    {stats.totalXP.toLocaleString()} XP
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                <p className="text-xs text-primary-700 font-medium mt-1">
                  Mục tiêu CEFR: {user.targetLevel || 'B1'} • Chuỗi học: {user.streak} ngày liên tục
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={() => navigate('/')}
              >
                Vào học ngay <ArrowRight size={15} className="ml-1" />
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1 sm:flex-initial"
                onClick={signOut}
              >
                <LogOut size={15} className="mr-1" /> Đăng xuất
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Main Form & Benefits Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Auth Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="shadow-sm border border-gray-100">
            {/* Mode Switch Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setTab('login');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  tab === 'login'
                    ? 'bg-white text-primary-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LogIn size={16} /> Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('register');
                  setStatusMsg(null);
                }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  tab === 'register'
                    ? 'bg-white text-primary-700 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <UserPlus size={16} /> Đăng ký tài khoản
              </button>
            </div>

            {/* Notification alert */}
            {statusMsg && (
              <div
                className={`mb-5 p-3.5 rounded-xl text-sm font-medium flex items-start gap-2.5 border ${
                  statusMsg.ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                {statusMsg.ok ? (
                  <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">{statusMsg.text}</div>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Họ và tên của bạn
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ..."
                      className="input-field pl-10 text-sm"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Địa chỉ Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input-field pl-10 text-sm"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mật khẩu {tab === 'register' && '(tối thiểu 6 ký tự)'}
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="input-field pl-10 text-sm"
                    autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  />
                </div>
              </div>

              {tab === 'register' && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
                  🌱 <strong>Chào mừng bạn!</strong> Mỗi tài khoản mới đăng ký sẽ bắt đầu hành trình tại <strong>Cấp độ 1 (Level 1)</strong> với 0 XP và lộ trình học tập cá nhân hóa được kích hoạt ngay lập tức.
                </div>
              )}

              <div className="pt-2">
                <Button type="submit" fullWidth disabled={loading}>
                  {loading ? (
                    'Đang xử lý...'
                  ) : tab === 'login' ? (
                    <>
                      <LogIn size={16} className="mr-1.5" /> Đăng nhập
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-1.5" /> Tạo tài khoản mới
                    </>
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              {tab === 'login' ? (
                <p className="text-xs text-gray-500">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('register');
                      setStatusMsg(null);
                    }}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Đăng ký ngay miễn phí
                  </button>
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Đã có tài khoản học viên?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setTab('login');
                      setStatusMsg(null);
                    }}
                    className="text-primary-600 font-semibold hover:underline"
                  >
                    Đăng nhập tại đây
                  </button>
                </p>
              )}
            </div>
          </Card>
        </div>

        {/* Benefits Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="bg-gradient-to-br from-indigo-900 to-primary-900 text-white p-6 shadow-md">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-amber-400" />
              <h3 className="font-bold text-base">Trải nghiệm học tiếng Anh chuẩn quốc tế</h3>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed mb-5">
              Đồng bộ dữ liệu học tập thông minh giúp bạn duy trì thói quen và cải thiện trình độ nhanh chóng mỗi ngày.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-amber-300 flex-shrink-0">
                  <Brain size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Ghi nhớ từ vựng SM-2</h4>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    Hệ thống tự động nhắc nhở ôn tập thẻ từ vựng đúng chu kỳ nhớ khoa học.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-emerald-300 flex-shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Luyện tập 4 Kỹ năng</h4>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    Thực hành Nghe kèm audio, Nói nhận diện giọng, Đọc hiểu & Viết bài có chấm điểm.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/10 text-purple-300 flex-shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white">Thành tích & Cấp độ</h4>
                  <p className="text-[11px] text-indigo-200 mt-0.5">
                    Tích lũy điểm XP sau mỗi bài học, thăng hạng level và mở khóa huy hiệu danh giá.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-xs text-gray-900">Khám phá các khóa học</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Lộ trình CEFR từ A1 Cơ bản đến B2 Trung cấp nâng cao
                </p>
              </div>
              <Link
                to="/courses"
                className="text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Xem ngay <ArrowRight size={13} />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
