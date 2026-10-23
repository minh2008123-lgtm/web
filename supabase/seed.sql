-- ============================================================================
-- LINGUAQUEST — GIAI ĐOẠN 3: SEED DATA CHO SUPABASE POSTGRESQL
-- Chạy file này sau khi đã chạy supabase/schema.sql
-- ============================================================================

-- 1. SEED COURSES
insert into public.courses (id, title, description, level, thumbnail, total_lessons, sort_order)
values
  ('course-a1', 'A1 - Beginner Foundation', 'Nền tảng cơ bản cho người mới bắt đầu. Học các cấu trúc câu đơn giản, từ vựng thông dụng và giao tiếp hàng ngày.', 'A1', 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)', 8, 1),
  ('course-a2', 'A2 - Elementary Communication', 'Phát triển khả năng giao tiếp cơ bản. Mở rộng từ vựng theo chủ đề du lịch, công việc, truyền thông và cấu trúc câu quá khứ/tương lai.', 'A2', 'linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)', 4, 2),
  ('course-b1', 'B1 - Intermediate Fluency', 'Nâng cao khả năng sử dụng tiếng Anh độc lập. Thoải mái giao tiếp, đọc hiểu bài báo và viết đoạn văn nghị luận.', 'B1', 'linear-gradient(135deg, #10B981 0%, #059669 100%)', 4, 3),
  ('course-b2', 'B2 - Upper Intermediate Academic & Pro', 'Đạt trình độ thành thạo học thuật và chuyên nghiệp. Phân tích bài đọc chuyên sâu, thuyết trình rõ ràng và viết bài luận hoàn chỉnh.', 'B2', 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', 4, 4)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  total_lessons = excluded.total_lessons;

-- 2. SEED LESSONS
insert into public.lessons (id, course_id, title, description, skill, lesson_type, duration_minutes, xp_reward, sort_order)
values
  ('lesson-a1-1', 'course-a1', 'Greetings & Introductions', 'Học cách chào hỏi, hỏi thăm và giới thiệu bản thân tự nhiên', 'speaking', 'speaking', 10, 30, 1),
  ('lesson-a1-2', 'course-a1', 'Numbers, Time & Counting', 'Cách nghe và phân biệt số đếm -teen / -ty, giờ giấc và giá tiền', 'listening', 'listening', 8, 25, 2),
  ('lesson-a1-3', 'course-a1', 'Daily Routines & Habits', 'Đọc hiểu lịch trình hàng ngày của sinh viên quốc tế', 'reading', 'reading', 12, 35, 3),
  ('lesson-a1-4', 'course-a1', 'Simple Present Tense', 'Cấu trúc, cách chia động từ và đặt câu với thì hiện tại đơn', 'writing', 'writing', 15, 40, 4),
  ('lesson-a1-5', 'course-a1', 'Family & Relationships', 'Từ vựng và cấu trúc miêu tả các thành viên trong gia đình', 'vocabulary', 'flashcard', 10, 30, 5),
  ('lesson-a1-6', 'course-a1', 'At the Coffee Shop & Restaurant', 'Nghe hội thoại gọi đồ uống, món ăn và thanh toán tại nhà hàng', 'listening', 'listening', 12, 35, 6),
  ('lesson-a1-7', 'course-a1', 'Asking for Directions', 'Thực hành nói hỏi đường và chỉ đường trong thành phố', 'speaking', 'speaking', 10, 30, 7),
  ('lesson-a1-8', 'course-a1', 'Present Continuous in Action', 'Mô tả hành động đang diễn ra ngay lúc nói', 'writing', 'writing', 15, 40, 8),
  ('lesson-a2-1', 'course-a2', 'Past Tense & Memorable Trips', 'Kể lại chuyến đi đáng nhớ bằng thì quá khứ đơn (Past Simple)', 'writing', 'writing', 15, 40, 1),
  ('lesson-a2-2', 'course-a2', 'Future Plans & Career Goals', 'Diễn đạt dự định tương lai với be going to và will', 'speaking', 'speaking', 12, 35, 2),
  ('lesson-a2-3', 'course-a2', 'Digital Media & Smart Learning', 'Đọc hiểu bài viết về thói quen sử dụng công nghệ khi học ngoại ngữ', 'reading', 'reading', 15, 45, 3),
  ('lesson-a2-4', 'course-a2', 'Airport & Hotel Check-in', 'Luyện nghe thông báo sân bay và làm thủ tục nhận phòng khách sạn', 'listening', 'listening', 12, 35, 4),
  ('lesson-b1-1', 'course-b1', 'Remote Work & Productivity', 'Nghe buổi thảo luận nhóm về hiệu suất làm việc từ xa', 'listening', 'listening', 15, 50, 1),
  ('lesson-b1-2', 'course-b1', 'Job Interview Preparation', 'Luyện trả lời phỏng vấn về điểm mạnh và kinh nghiệm cá nhân', 'speaking', 'speaking', 15, 50, 2),
  ('lesson-b1-3', 'course-b1', 'The Science of Habit Formation', 'Đọc hiểu khoa học thần kinh đằng sau việc hình thành thói quen mới', 'reading', 'reading', 18, 55, 3),
  ('lesson-b1-4', 'course-b1', 'Opinion Paragraph: Online vs Offline Classes', 'Viết đoạn văn nêu quan điểm cá nhân có luận điểm và dẫn chứng', 'writing', 'writing', 20, 60, 4),
  ('lesson-b2-1', 'course-b2', 'Sustainable Urban Development', 'Đọc hiểu học thuật về quy hoạch đô thị xanh và năng lượng tái tạo', 'reading', 'reading', 20, 70, 1),
  ('lesson-b2-2', 'course-b2', 'Academic Lecture: Cognitive Biases', 'Nghe bài giảng đại học về thiên kiến nhận thức trong ra quyết định', 'listening', 'listening', 18, 65, 2),
  ('lesson-b2-3', 'course-b2', 'Persuasive Pitching & Debate', 'Thực hành trình bày quan điểm phản biện với cấu trúc học thuật', 'speaking', 'speaking', 18, 65, 3),
  ('lesson-b2-4', 'course-b2', 'Argumentative Essay: AI in Education', 'Viết bài luận 200-250 từ phân tích tác động của AI đối với giáo dục đại học', 'writing', 'writing', 25, 80, 4)
on conflict (id) do nothing;

-- 3. SEED EXERCISES & QUESTIONS
insert into public.exercises (id, lesson_id, title, exercise_type, sort_order)
values
  ('ex-group-a1-1', 'lesson-a1-1', 'Greetings & Introductions Quiz', 'multiple-choice', 1),
  ('ex-group-a1-2', 'lesson-a1-2', 'Numbers & Counting Quiz', 'listening', 1),
  ('ex-group-a1-3', 'lesson-a1-3', 'Daily Routines Quiz', 'reading', 1),
  ('ex-group-a1-4', 'lesson-a1-4', 'Simple Present Tense Quiz', 'writing', 1)
on conflict (id) do nothing;

insert into public.questions (id, exercise_id, lesson_id, question_type, question_text, prompt_hint, audio_text, correct_answer, word_bank, explanation, sort_order)
values
  ('ex-a1-1-1', 'ex-group-a1-1', 'lesson-a1-1', 'multiple-choice', 'Bạn sẽ nói gì khi gặp giảng viên hoặc đồng nghiệp vào buổi sáng?', null, 'Good morning, Professor! How are you doing today?', null, '[]'::jsonb, '"Good morning!" dùng để chào từ sáng sớm đến 12 giờ trưa.', 1),
  ('ex-a1-1-2', 'ex-group-a1-1', 'lesson-a1-1', 'fill-blank', 'Điền động từ to be thích hợp vào chỗ trống: "Hello! My name ___ Minh and I am a university student."', 'Chủ ngữ "My name" là ngôi thứ 3 số ít', null, 'is', '[]'::jsonb, '"My name" tương đương đại từ "It" (số ít), nên động từ to be ở hiện tại đơn là "is".', 2),
  ('ex-a1-1-3', 'ex-group-a1-1', 'lesson-a1-1', 'sentence-order', 'Sắp xếp các từ sau để tạo thành câu hỏi lịch sự khi mới làm quen:', null, null, 'What is your full name', '["What", "is", "your", "full", "name"]'::jsonb, 'Cấu trúc câu hỏi với từ để hỏi Wh-: What + is + tính từ sở hữu (your) + danh từ (full name)?', 3),
  ('ex-a1-2-1', 'ex-group-a1-2', 'lesson-a1-2', 'multiple-choice', 'Nghe âm thanh và chọn số đúng được nhắc đến trong câu:', null, 'The train to London departs from platform fifteen at nine thirty.', null, '[]'::jsonb, '"Fifteen" nhấn trọng âm ở âm tiết thứ 2 là số 15, khác với "Fifty" là 50.', 1),
  ('ex-a1-2-2', 'ex-group-a1-2', 'lesson-a1-2', 'fill-blank', 'Viết bằng chữ tiếng Anh của số 40 (chú ý chính tả không có chữ u):', 'Bắt đầu bằng chữ f...', null, 'forty', '[]'::jsonb, 'Số 40 viết đúng chính tả là "forty" (không có chữ "u").', 2)
on conflict (id) do nothing;

insert into public.options (question_id, option_key, option_text, is_correct, sort_order)
values
  ('ex-a1-1-1', 'a', 'Good morning!', true, 1),
  ('ex-a1-1-1', 'b', 'Good night!', false, 2),
  ('ex-a1-1-1', 'c', 'See you tomorrow!', false, 3),
  ('ex-a1-1-1', 'd', 'Sweet dreams!', false, 4),
  ('ex-a1-2-1', 'a', 'Platform 50', false, 1),
  ('ex-a1-2-1', 'b', 'Platform 15', true, 2),
  ('ex-a1-2-1', 'c', 'Platform 5', false, 3),
  ('ex-a1-2-1', 'd', 'Platform 55', false, 4);

-- 4. SEED VOCABULARY
insert into public.vocabulary (id, word, phonetic, part_of_speech, level, topic, meaning, example, example_meaning)
values
  ('vocab-1', 'accomplish', '/əˈkʌmplɪʃ/', 'v', 'B1', 'Goals & Success', 'hoàn thành, đạt được (mục tiêu)', 'Consistent daily practice helps you accomplish your language goals.', 'Thực hành đều đặn mỗi ngày giúp bạn hoàn thành mục tiêu ngôn ngữ của mình.'),
  ('vocab-2', 'adventure', '/ədˈventʃər/', 'n', 'A2', 'Travel & Culture', 'cuộc phiêu lưu, hành trình khám phá', 'Studying abroad is an unforgettable adventure for university students.', 'Du học là một hành trình khám phá khó quên đối với sinh viên đại học.'),
  ('vocab-3', 'brilliant', '/ˈbrɪljənt/', 'adj', 'A2', 'Communication', 'xuất sắc, tuyệt vời, thông minh', 'She gave a brilliant presentation in English this morning.', 'Sáng nay cô ấy đã có một bài thuyết trình bằng tiếng Anh xuất sắc.'),
  ('vocab-4', 'challenge', '/ˈtʃælɪndʒ/', 'n', 'A2', 'Goals & Success', 'thử thách, thách thức', 'Speaking fluently is a big challenge, but I enjoy the process.', 'Nói lưu loát là một thử thách lớn, nhưng tôi yêu thích quá trình đó.'),
  ('vocab-5', 'curious', '/ˈkjʊriəs/', 'adj', 'A2', 'Education', 'tò mò, ham học hỏi', 'Curious learners always ask questions when reading new articles.', 'Những người học ham tìm tòi luôn đặt câu hỏi khi đọc các bài viết mới.'),
  ('vocab-6', 'determine', '/dɪˈtɜːrmɪn/', 'v', 'B1', 'Goals & Success', 'quyết định, xác định, kiên quyết', 'Your daily habits determine your long-term progress.', 'Thói quen hàng ngày của bạn quyết định sự tiến bộ dài hạn của bạn.'),
  ('vocab-7', 'efficient', '/ɪˈfɪʃənt/', 'adj', 'B1', 'Workplace', 'hiệu quả, năng suất cao', 'Spaced repetition is the most efficient method to memorize vocabulary.', 'Lặp lại ngắt quãng là phương pháp hiệu quả nhất để ghi nhớ từ vựng.'),
  ('vocab-8', 'fundamental', '/ˌfʌndəˈmentl/', 'adj', 'B2', 'Education', 'cơ bản, cốt lõi, nền tảng', 'Listening comprehension is fundamental to natural communication.', 'Nghe hiểu là nền tảng cốt lõi của việc giao tiếp tự nhiên.'),
  ('vocab-9', 'gradually', '/ˈɡrædʒuəli/', 'adv', 'B1', 'Education', 'từ từ, dần dần từng bước', 'My pronunciation is gradually improving thanks to voice recording.', 'Phát âm của tôi đang dần cải thiện nhờ việc thu âm giọng nói.'),
  ('vocab-10', 'improve', '/ɪmˈpruːv/', 'v', 'A1', 'Education', 'cải thiện, nâng cao, tiến bộ', 'Reading short stories helps improve your vocabulary naturally.', 'Đọc truyện ngắn giúp cải thiện vốn từ vựng của bạn một cách tự nhiên.')
on conflict (id) do nothing;

-- 5. SEED BADGES
insert into public.badges (id, name, description, icon)
values
  ('badge-1', 'Khởi đầu vững chắc', 'Hoàn thành bài học đầu tiên trên LinguaQuest', '🎯'),
  ('badge-2', 'Chuỗi 7 ngày lửa', 'Duy trì học tập liên tục 7 ngày không nghỉ', '🔥'),
  ('badge-3', 'Độ chính xác cao', 'Đạt điểm 90% trở lên trong một bài học', '⭐'),
  ('badge-4', 'Bậc thầy SRS', 'Ôn tập thành thạo 50 từ vựng với thuật toán SM-2', '🧠'),
  ('badge-5', 'Đôi tai nhạy bén', 'Hoàn thành 10 bài luyện nghe có transcript', '🎧'),
  ('badge-6', 'Cây bút trẻ', 'Hoàn thành và tự chấm 5 bài viết theo tiêu chí Rubric', '✍️')
on conflict (id) do nothing;
