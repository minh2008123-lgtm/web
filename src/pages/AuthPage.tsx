import { useState } from 'react';
import {
  Database,
  ShieldCheck,
  LogIn,
  UserPlus,
  LogOut,
  Users,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
import { Card, Badge, Button } from '../components/ui';
import { useLearning } from '../hooks/useLearning';
import { demoAccounts } from '../data/userData';
import { SUPABASE_TABLES_SPEC } from '../services/supabaseDataService';
import { hasForbiddenServiceRoleKey } from '../lib/supabase';

export function AuthPage() {
  const {
    user,
    isAuthenticated,
    isSupabaseConnected,
    xpTransactions,
    signIn,
    signUp,
    signOut,
    switchDemoUser,
  } = useLearning();

  const [tab, setTab] = useState<'login' | 'register' | 'database'>('login');
  const [email, setEmail] = useState('nguyen.van.a@student.edu.vn');
  const [password, setPassword] = useState('LinguaQuest123!');
  const [fullName, setFullName] = useState('Lê Hoàng Nam');
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'login') {
      const res = await signIn(email, password);
      setStatusMsg({ ok: res.ok, text: res.message });
    } else if (tab === 'register') {
      const res = await signUp(email, password, fullName);
      setStatusMsg({ ok: res.ok, text: res.message });
    }
  };

  const handleCopyEnvExample = () => {
    const text = `VITE_SUPABASE_URL=https://your-project-id.supabase.co\nVITE_SUPABASE_ANON_KEY=your-public-anon-key-here`;
    try {
      navigator.clipboard.writeText(text);
    } catch {
      // fallback
    }
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="text-primary-600" size={26} />
            <h2 className="text-2xl font-bold text-gray-900">
              Xác thực Tài khoản & Quản trị Supabase (Giai đoạn 3)
            </h2>
          </div>
          <p className="text-gray-600 mt-1">
            Đăng ký, đăng nhập, chuyển đổi tài khoản kiểm thử RLS và theo dõi sổ cái chống cộng XP trùng lặp (<code>xp_transactions</code>).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={isSupabaseConnected ? 'success' : 'accent'} size="md">
            {isSupabaseConnected
              ? '🟢 Đã kết nối Supabase Cloud'
              : '🟡 Chế độ Local Emulator (Chưa điền .env)'}
          </Badge>
        </div>
      </div>

      {hasForbiddenServiceRoleKey && (
        <Card className="border-2 border-red-400 bg-red-50">
          <div className="flex items-start gap-3 text-red-900">
            <AlertTriangle className="text-red-600 flex-shrink-0" size={22} />
            <div className="text-sm">
              <p className="font-bold">Cảnh báo bảo mật nghiêm trọng!</p>
              <p>
                Phát hiện khóa <code>service_role</code> trong biến môi trường Frontend. Hệ thống đã tự động khóa kết nối để bảo vệ Row Level Security (RLS). Chỉ sử dụng <code>anon</code> public key cho <code>VITE_SUPABASE_ANON_KEY</code>!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Mode Switch Tabs */}
      <div className="flex flex-wrap gap-2 bg-gray-100 p-1.5 rounded-xl w-fit">
        <button
          onClick={() => {
            setTab('login');
            setStatusMsg(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            tab === 'login' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'
          }`}
        >
          <LogIn size={15} /> Đăng nhập
        </button>
        <button
          onClick={() => {
            setTab('register');
            setStatusMsg(null);
          }}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            tab === 'register' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'
          }`}
        >
          <UserPlus size={15} /> Đăng ký tài khoản
        </button>
        <button
          onClick={() => setTab('database')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
            tab === 'database' ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-600'
          }`}
        >
          <ShieldCheck size={15} /> Cấu trúc 16 Bảng & RLS Policies
        </button>
      </div>

      {tab !== 'database' ? (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left: Auth Form & Session Card (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">
                  {tab === 'login'
                    ? 'Đăng nhập vào LinguaQuest'
                    : 'Tạo tài khoản Học viên mới'}
                </h3>
                {isAuthenticated && (
                  <Badge variant="success">Đang đăng nhập: {user.fullName}</Badge>
                )}
              </div>

              {statusMsg && (
                <div
                  className={`mb-4 p-3 rounded-xl text-xs font-medium border ${
                    statusMsg.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border-red-200 text-red-800'
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {tab === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Họ và tên đầy đủ
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên của bạn..."
                      className="input-field text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email học viên
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-field text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Mật khẩu (tối thiểu 6 ký tự)
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field text-sm"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button type="submit" fullWidth>
                    {tab === 'login' ? (
                      <>
                        <LogIn size={16} className="mr-1.5" /> Đăng nhập
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} className="mr-1.5" /> Đăng ký ngay
                      </>
                    )}
                  </Button>

                  {isAuthenticated && (
                    <Button type="button" variant="danger" onClick={signOut}>
                      <LogOut size={16} className="mr-1.5" /> Đăng xuất
                    </Button>
                  )}
                </div>
              </form>

              {/* Multi-account quick switcher */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-primary-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Chuyển nhanh tài khoản mẫu (Kiểm thử nhiều User)
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-2.5">
                  {demoAccounts.map((acc) => {
                    const isCurrent = user.email === acc.email && isAuthenticated;
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => switchDemoUser(acc.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isCurrent
                            ? 'border-primary-600 bg-primary-50/70'
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-gray-900">
                            {acc.fullName}
                          </span>
                          <Badge variant={isCurrent ? 'success' : 'primary'} size="sm">
                            Lv.{acc.level}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                          {acc.email}
                        </p>
                        <p className="text-[11px] font-mono text-primary-700 mt-1">
                          {acc.xp.toLocaleString()} XP • Streak {acc.streak} ngày
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Security & .env Setup Guide */}
            <Card className="bg-slate-900 text-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <KeyRound size={18} className="text-amber-400" />
                  <h4 className="font-bold text-sm">
                    Cấu hình biến môi trường (.env.local / Vercel)
                  </h4>
                </div>
                <button
                  onClick={handleCopyEnvExample}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-amber-300"
                >
                  {copiedEnv ? <Check size={13} /> : <Copy size={13} />}
                  {copiedEnv ? 'Đã chép' : 'Sao chép'}
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Chỉ sử dụng khóa công khai <code>anon</code> ở Frontend. Tuyệt đối không đưa <code>service_role</code> key vào mã nguồn client.
              </p>
              <pre className="text-xs font-mono bg-slate-950 p-3 rounded-lg text-emerald-400 overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
              </pre>
            </Card>
          </div>

          {/* Right: Anti-Duplicate XP Ledger (xp_transactions) (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">
                    Sổ cái Giao dịch XP (Bảng <code>xp_transactions</code>)
                  </h3>
                  <p className="text-xs text-gray-500">
                    Mỗi giao dịch có <code>idempotency_key</code> duy nhất để chống cộng XP trùng lặp khi làm lại cùng một bài học
                  </p>
                </div>
                <Badge variant="primary">{xpTransactions.length} bản ghi</Badge>
              </div>

              <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
                {xpTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                        <span className="font-semibold text-xs text-gray-900">
                          {tx.note}
                        </span>
                      </div>
                      <p className="text-[11px] font-mono text-gray-500 mt-1 truncate">
                        Key: {tx.idempotencyKey}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{tx.createdAt}</p>
                    </div>
                    <Badge variant="success" className="flex-shrink-0 font-mono">
                      +{tx.xpAmount} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Database Schema & RLS Overview Tab */
        <Card>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Thiết kế 16 Bảng Cơ sở dữ liệu PostgreSQL & Chính sách RLS
              </h3>
              <p className="text-xs text-gray-500">
                Toàn bộ định nghĩa DDL, khóa ngoại, chỉ mục và hàm RPC nằm trong file <code>supabase/schema.sql</code> và <code>supabase/seed.sql</code>
              </p>
            </div>
            <Badge variant="success">16/16 Bảng bật RLS</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs text-gray-500 uppercase">
                  <th className="py-3 px-3">Tên bảng (Table)</th>
                  <th className="py-3 px-3">Chính sách Bảo mật (RLS Policy)</th>
                  <th className="py-3 px-3">Vai trò & Ràng buộc dữ liệu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {SUPABASE_TABLES_SPEC.map((tbl) => (
                  <tr key={tbl.name} className="hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-primary-700 text-xs">
                      public.{tbl.name}
                    </td>
                    <td className="py-2.5 px-3">
                      <Badge
                        variant={tbl.rls.includes('auth.uid()') ? 'primary' : 'success'}
                        size="sm"
                      >
                        {tbl.rls}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-gray-700">{tbl.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
