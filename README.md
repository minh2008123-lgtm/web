# 🚀 LinguaQuest — Giai đoạn 3: Tích hợp Supabase (PostgreSQL, Auth, RLS & Anti-Duplicate XP)

Nền tảng học tiếng Anh 4 kỹ năng (**Listening, Speaking, Reading, Writing**) tích hợp **Supabase Auth & PostgreSQL**, **Row Level Security (RLS)** và cơ chế **Chống cộng XP trùng lặp (`xp_transactions` + `idempotency_key`)**.

---

## ✨ Các hạng mục hoàn thiện trong Giai đoạn 3

1. **Thiết kế Cơ sở dữ liệu PostgreSQL (`supabase/schema.sql` & `supabase/seed.sql`)**:
   - Đầy đủ **16 bảng chuẩn hóa**: `profiles`, `courses`, `enrollments`, `lessons`, `exercises`, `questions`, `options`, `lesson_progress`, `attempts`, `vocabulary`, `user_vocabulary`, `xp_transactions`, `daily_activity`, cùng 3 bảng bổ sung `writing_submissions`, `badges`, `user_badges`.
   - Đầy đủ khóa ngoại (`FOREIGN KEY ... ON DELETE CASCADE`), ràng buộc toàn vẹn (`CHECK`, `UNIQUE`) và **10 chỉ mục (`CREATE INDEX`)** tối ưu truy vấn.
   - **Row Level Security (RLS)**: bật trên toàn bộ 16 bảng. Các bảng danh mục học liệu cho phép `SELECT` công khai; các bảng dữ liệu người dùng bắt buộc `auth.uid() = user_id` (hoặc `auth.uid() = id`).
   - **Chống cộng XP trùng lặp (Anti-Duplicate XP)**:
     - Bảng `xp_transactions` có ràng buộc `UNIQUE (user_id, idempotency_key)`.
     - Hàm PostgreSQL RPC `public.submit_lesson_attempt(...)` chỉ cộng XP đầy đủ ở lần hoàn thành đầu tiên; khi người dùng làm lại bài cũ, hệ thống chỉ cộng phần XP chênh lệch nếu vượt kỷ lục `best_score` trước đó.

2. **Tích hợp Supabase Client, Auth & Bảo mật Frontend**:
   - `src/lib/supabase.ts`: khởi tạo Supabase Client từ `VITE_SUPABASE_URL` và `VITE_SUPABASE_ANON_KEY`, tích hợp bộ kiểm tra tự động chặn việc vô tình đưa `service_role` key vào Frontend.
   - `src/pages/AuthPage.tsx` (`/auth`): hỗ trợ **Đăng nhập**, **Đăng ký**, **Đăng xuất**, **Chuyển đổi nhanh nhiều tài khoản mẫu**, xem trực tiếp **Sổ cái `xp_transactions`** và bảng **16 Bảng & RLS Policies**.
   - Tự động hoạt động mượt mà ở cả 2 chế độ: **Supabase Cloud Mode** (khi đã cấu hình `.env.local`) và **Local Emulator Mode** (khi chạy thử chưa cần tạo project Supabase).

---

## 🛠️ Hướng dẫn thiết lập Supabase & Chạy dự án

### Bước 1: Cài đặt thư viện
```bash
npm install
```

### Bước 2: Khởi tạo Database trên Supabase (Tùy chọn — Ứng dụng vẫn chạy ngay cả khi chưa cấu hình `.env.local`)
1. Tạo project mới tại [supabase.com](https://supabase.com).
2. Mở **SQL Editor** → **New Query**:
   - Dán toàn bộ nội dung file `supabase/schema.sql` và nhấn **Run** để tạo 16 bảng, Indexes, RLS Policies, Trigger và RPC Function.
   - Tiếp tục dán nội dung file `supabase/seed.sql` và nhấn **Run** để nạp dữ liệu khóa học CEFR A1–B2, câu hỏi và từ vựng.
3. Sao chép file `.env.example` thành `.env.local` và điền thông tin từ **Project Settings → API** (chỉ dùng `anon` public key, tuyệt đối không dùng `service_role` key):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

### Bước 3: Chạy dự án
```bash
npm run dev
```
