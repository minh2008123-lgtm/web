-- ============================================================================
-- LINGUAQUEST — GIAI ĐOẠN 3: SUPABASE POSTGRESQL SCHEMA, INDEXES, RLS & RPC
-- Chạy toàn bộ file này trong Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- Kích hoạt extension tạo UUID
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. BẢNG PROFILES (Liên kết 1-1 với auth.users của Supabase Auth)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default 'Học viên LinguaQuest',
  avatar_url text,
  level integer not null default 1 check (level >= 1),
  total_xp integer not null default 0 check (total_xp >= 0),
  streak integer not null default 1 check (streak >= 0),
  longest_streak integer not null default 1 check (longest_streak >= 0),
  target_level text not null default 'B2' check (target_level in ('A1', 'A2', 'B1', 'B2')),
  daily_goal_minutes integer not null default 20 check (daily_goal_minutes between 5 and 180),
  last_active_date date default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- 2. BẢNG COURSES (Danh mục khóa học chuẩn CEFR A1–B2)
-- ============================================================================
create table if not exists public.courses (
  id text primary key,
  title text not null,
  description text not null,
  level text not null check (level in ('A1', 'A2', 'B1', 'B2')),
  thumbnail text not null,
  total_lessons integer not null default 1 check (total_lessons >= 0),
  sort_order integer not null default 1,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 3. BẢNG ENROLLMENTS (Ghi danh khóa học của từng người dùng)
-- ============================================================================
create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  completed_lessons integer not null default 0 check (completed_lessons >= 0),
  progress_percent numeric(5,2) not null default 0 check (progress_percent between 0 and 100),
  enrolled_at timestamptz not null default now(),
  last_accessed_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- ============================================================================
-- 4. BẢNG LESSONS (Danh sách bài học thuộc từng khóa học)
-- ============================================================================
create table if not exists public.lessons (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  description text not null,
  skill text not null check (skill in ('listening', 'speaking', 'reading', 'writing', 'vocabulary')),
  lesson_type text not null check (lesson_type in ('multiple-choice', 'listening', 'speaking', 'reading', 'writing', 'flashcard')),
  duration_minutes integer not null default 10 check (duration_minutes > 0),
  xp_reward integer not null default 30 check (xp_reward > 0),
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 5. BẢNG EXERCISES (Nhóm bài tập trong một bài học)
-- ============================================================================
create table if not exists public.exercises (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  title text not null,
  exercise_type text not null check (exercise_type in ('multiple-choice', 'fill-blank', 'true-false', 'sentence-order', 'listening', 'speaking', 'reading', 'writing')),
  audio_url text,
  passage_text text,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 6. BẢNG QUESTIONS (Câu hỏi cụ thể trong bài tập/bài học)
-- ============================================================================
create table if not exists public.questions (
  id text primary key,
  exercise_id text not null references public.exercises(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  question_type text not null check (question_type in ('multiple-choice', 'fill-blank', 'true-false', 'sentence-order')),
  question_text text not null,
  prompt_hint text,
  audio_text text,
  correct_answer text,
  word_bank jsonb default '[]'::jsonb,
  explanation text not null,
  evidence_paragraph integer,
  sort_order integer not null default 1,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 7. BẢNG OPTIONS (Các lựa chọn đáp án cho câu hỏi trắc nghiệm / Đúng-Sai)
-- ============================================================================
create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id text not null references public.questions(id) on delete cascade,
  option_key text not null,
  option_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 1
);

-- ============================================================================
-- 8. BẢNG LESSON_PROGRESS (Tiến độ hoàn thành từng bài học của user)
-- ============================================================================
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  is_completed boolean not null default false,
  best_score integer not null default 0 check (best_score between 0 and 100),
  attempts_count integer not null default 0 check (attempts_count >= 0),
  xp_claimed integer not null default 0 check (xp_claimed >= 0),
  first_completed_at timestamptz,
  last_completed_at timestamptz default now(),
  unique (user_id, lesson_id)
);

-- ============================================================================
-- 9. BẢNG ATTEMPTS (Lịch sử từng lượt làm bài tập)
-- ============================================================================
create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  skill text not null check (skill in ('listening', 'speaking', 'reading', 'writing', 'vocabulary')),
  score integer not null check (score between 0 and 100),
  correct_answers integer not null default 0 check (correct_answers >= 0),
  total_questions integer not null default 1 check (total_questions > 0),
  xp_awarded integer not null default 0 check (xp_awarded >= 0),
  time_spent_seconds integer not null default 0 check (time_spent_seconds >= 0),
  answers_payload jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 10. BẢNG VOCABULARY (Từ điển từ vựng gốc chuẩn CEFR & IPA)
-- ============================================================================
create table if not exists public.vocabulary (
  id text primary key,
  word text not null,
  phonetic text not null,
  part_of_speech text not null default 'n',
  level text not null check (level in ('A1', 'A2', 'B1', 'B2')),
  topic text not null default 'General',
  meaning text not null,
  example text not null,
  example_meaning text not null,
  audio_url text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 11. BẢNG USER_VOCABULARY (Tiến độ ôn tập Spaced Repetition SM-2 của từng user)
-- ============================================================================
create table if not exists public.user_vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vocabulary_id text not null references public.vocabulary(id) on delete cascade,
  mastery text not null default 'new' check (mastery in ('new', 'learning', 'reviewing', 'mastered')),
  repetitions integer not null default 0 check (repetitions >= 0),
  ease_factor numeric(4,2) not null default 2.50 check (ease_factor >= 1.30),
  interval_days integer not null default 0 check (interval_days >= 0),
  next_review_date date default current_date,
  last_reviewed_date date,
  is_favorite boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (user_id, vocabulary_id)
);

-- ============================================================================
-- 12. BẢNG XP_TRANSACTIONS (Sổ cái cộng XP — Chống cộng XP trùng lặp!)
-- ============================================================================
create table if not exists public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_type text not null check (source_type in ('lesson_complete', 'lesson_improvement', 'srs_review', 'skill_practice', 'writing_submit', 'daily_task', 'achievement')),
  source_id text not null,
  idempotency_key text not null,
  xp_amount integer not null check (xp_amount > 0),
  note text,
  created_at timestamptz not null default now(),
  -- Ràng buộc UNIQUE(user_id, idempotency_key) ngăn chặn tuyệt đối việc cộng XP trùng lặp
  unique (user_id, idempotency_key)
);

-- ============================================================================
-- 13. BẢNG DAILY_ACTIVITY (Thống kê hoạt động & Streak theo từng ngày)
-- ============================================================================
create table if not exists public.daily_activity (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null default current_date,
  xp_earned integer not null default 0 check (xp_earned >= 0),
  lessons_completed integer not null default 0 check (lessons_completed >= 0),
  practice_minutes integer not null default 0 check (practice_minutes >= 0),
  streak_count integer not null default 1 check (streak_count >= 0),
  updated_at timestamptz not null default now(),
  unique (user_id, activity_date)
);

-- ============================================================================
-- 14. BẢNG BỔ SUNG: WRITING_SUBMISSIONS & BADGES / USER_BADGES
-- ============================================================================
create table if not exists public.writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  prompt_id text not null,
  title text not null,
  content text not null,
  word_count integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  rubric_scores jsonb default '{}'::jsonb,
  objective_score integer default 0,
  total_score integer default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.badges (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id text not null references public.badges(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, badge_id)
);

-- ============================================================================
-- CHỈ MỤC TỐI ƯU HÓA TRUY VẤN (INDEXES)
-- ============================================================================
create index if not exists idx_enrollments_user on public.enrollments(user_id);
create index if not exists idx_lessons_course on public.lessons(course_id, sort_order);
create index if not exists idx_questions_lesson on public.questions(lesson_id, sort_order);
create index if not exists idx_options_question on public.options(question_id, sort_order);
create index if not exists idx_lesson_progress_user on public.lesson_progress(user_id, lesson_id);
create index if not exists idx_attempts_user_created on public.attempts(user_id, created_at desc);
create index if not exists idx_user_vocab_review on public.user_vocabulary(user_id, next_review_date);
create index if not exists idx_xp_tx_user_created on public.xp_transactions(user_id, created_at desc);
create index if not exists idx_daily_activity_user_date on public.daily_activity(user_id, activity_date desc);
create index if not exists idx_writing_user on public.writing_submissions(user_id, updated_at desc);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) & POLICIES PHÂN QUYỀN CHẶT CHẼ
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.enrollments enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.vocabulary enable row level security;
alter table public.user_vocabulary enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.daily_activity enable row level security;
alter table public.writing_submissions enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- 1. Nhóm bảng Danh mục Học liệu (Ai cũng có quyền ĐỌC, không cho phép client tự sửa/xóa)
create policy "Public read courses" on public.courses for select using (true);
create policy "Public read lessons" on public.lessons for select using (true);
create policy "Public read exercises" on public.exercises for select using (true);
create policy "Public read questions" on public.questions for select using (true);
create policy "Public read options" on public.options for select using (true);
create policy "Public read vocabulary" on public.vocabulary for select using (true);
create policy "Public read badges" on public.badges for select using (true);

-- 2. Nhóm bảng Dữ liệu Cá nhân (Chỉ chính chủ auth.uid() mới được phép truy cập & cập nhật)
create policy "Users select own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage own enrollments" on public.enrollments
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own lesson_progress" on public.lesson_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own attempts" on public.attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own user_vocabulary" on public.user_vocabulary
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users read own xp_transactions" on public.xp_transactions
  for select using (auth.uid() = user_id);
create policy "Users insert own xp_transactions" on public.xp_transactions
  for insert with check (auth.uid() = user_id);

create policy "Users manage own daily_activity" on public.daily_activity
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own writing_submissions" on public.writing_submissions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage own user_badges" on public.user_badges
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================================
-- TRIGGER TỰ ĐỘNG TẠO PROFILE KHI USER ĐĂNG KÝ TÀI KHOẢN SUPABASE AUTH
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, level, total_xp, streak)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email, 'Hoc Vien'), '@', 1)),
    1,
    0,
    1
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- RPC FUNCTION: LƯU KẾT QUẢ BÀI HỌC & CHỐNG CỘNG XP TRÙNG LẶP (ANTI-DUPLICATE XP)
-- Chỉ cộng XP tối đa theo xp_reward của bài học; nếu học viên làm lại bài đã hoàn
-- thành thì chỉ cộng phần XP chênh lệch khi đạt điểm kỷ lục mới (best_score cao hơn).
-- ============================================================================
create or replace function public.submit_lesson_attempt(
  p_lesson_id text,
  p_skill text,
  p_score integer,
  p_correct_answers integer,
  p_total_questions integer,
  p_time_spent_seconds integer,
  p_xp_reward integer
)
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_prev_xp_claimed integer := 0;
  v_prev_best_score integer := 0;
  v_target_xp integer := 0;
  v_xp_delta integer := 0;
  v_idem_key text;
  v_new_total_xp integer;
  v_new_level integer;
begin
  if v_user_id is null then
    raise exception 'Unauthorized: Bạn cần đăng nhập để lưu kết quả';
  end if;

  -- Tính số XP xứng đáng với điểm số hiện tại
  v_target_xp := greatest(5, round((p_score::numeric / 100.0) * p_xp_reward));

  -- Kiểm tra tiến độ bài học trước đó của user
  select xp_claimed, best_score
    into v_prev_xp_claimed, v_prev_best_score
    from public.lesson_progress
   where user_id = v_user_id and lesson_id = p_lesson_id;

  if not found then
    v_xp_delta := v_target_xp;
    v_idem_key := 'lesson_first:' || p_lesson_id;

    insert into public.lesson_progress (
      user_id, lesson_id, is_completed, best_score, attempts_count, xp_claimed, first_completed_at, last_completed_at
    ) values (
      v_user_id, p_lesson_id, true, p_score, 1, v_target_xp, now(), now()
    );
  else
    -- Nếu làm lại bài cũ: chỉ cộng phần XP chênh lệch nếu vượt kỷ lục điểm trước đó
    if v_target_xp > v_prev_xp_claimed then
      v_xp_delta := v_target_xp - v_prev_xp_claimed;
      v_idem_key := 'lesson_improve:' || p_lesson_id || ':score_' || p_score::text;
    else
      v_xp_delta := 0;
    end if;

    update public.lesson_progress
       set is_completed = true,
           best_score = greatest(best_score, p_score),
           attempts_count = attempts_count + 1,
           xp_claimed = greatest(xp_claimed, v_target_xp),
           last_completed_at = now()
     where user_id = v_user_id and lesson_id = p_lesson_id;
  end if;

  -- Lưu lịch sử lượt làm bài vào bảng attempts
  insert into public.attempts (
    user_id, lesson_id, skill, score, correct_answers, total_questions, xp_awarded, time_spent_seconds
  ) values (
    v_user_id, p_lesson_id, p_skill, p_score, p_correct_answers, p_total_questions, v_xp_delta, p_time_spent_seconds
  );

  -- Nếu có XP mới được cộng, ghi vào sổ cái xp_transactions với idempotency_key
  if v_xp_delta > 0 then
    insert into public.xp_transactions (
      user_id, source_type, source_id, idempotency_key, xp_amount, note
    ) values (
      v_user_id,
      case when v_prev_xp_claimed = 0 then 'lesson_complete' else 'lesson_improvement' end,
      p_lesson_id,
      v_idem_key,
      v_xp_delta,
      'Hoàn thành bài học ' || p_lesson_id || ' (' || p_score || '%)'
    )
    on conflict (user_id, idempotency_key) do nothing;

    update public.profiles
       set total_xp = total_xp + v_xp_delta,
           level = greatest(1, floor((total_xp + v_xp_delta) / 200) + 1),
           last_active_date = current_date,
           updated_at = now()
     where id = v_user_id
     returning total_xp, level into v_new_total_xp, v_new_level;

    insert into public.daily_activity (user_id, activity_date, xp_earned, lessons_completed, practice_minutes)
    values (v_user_id, current_date, v_xp_delta, 1, greatest(1, round(p_time_spent_seconds / 60.0)))
    on conflict (user_id, activity_date) do update
      set xp_earned = public.daily_activity.xp_earned + excluded.xp_earned,
          lessons_completed = public.daily_activity.lessons_completed + 1,
          practice_minutes = public.daily_activity.practice_minutes + excluded.practice_minutes,
          updated_at = now();
  end if;

  return jsonb_build_object(
    'xp_awarded', v_xp_delta,
    'duplicate_prevented', (v_xp_delta = 0),
    'best_score', greatest(v_prev_best_score, p_score)
  );
end;
$$;
