# 🚀 LinguaQuest — Giai đoạn 2: Xây dựng Chức năng Học tập Toàn diện (4 Kỹ năng + SRS SM-2)

Nền tảng học tiếng Anh 4 kỹ năng (**Listening, Speaking, Reading, Writing**) kết hợp **Từ vựng IPA**, **Flashcards 3D**, **Thuật toán ôn tập lặp lại ngắt quãng SuperMemo SM-2** và **Hệ thống đề xuất bài học thông minh (Adaptive Recommendation Engine)**.

---

## ✨ Các chức năng đã hoàn thiện trong Giai đoạn 2

1. **Luyện Nghe tương tác (`src/features/listening/ListeningPractice.tsx`)**:
   - Trình phát âm thanh hội thoại tích hợp **Web Speech API** (tùy chỉnh giọng Mỹ `en-US` / giọng Anh `en-GB`, tốc độ `0.75x`, `1.0x`, `1.25x`, thanh thời gian tua nhanh).
   - **Interactive Transcript**: tự động tô sáng câu đang phát, nhấn vào từng lời thoại để nghe lại câu đó, bật/tắt bản dịch song ngữ, chế độ **Nghe mù (Blind Listening)**, bấm vào từ khóa gạch chân để xem phiên âm IPA + lưu trực tiếp vào bộ Flashcards SM-2.
   - Bài tập kiểm tra nghe hiểu (Multiple Choice, Điền từ, Đúng/Sai) chấm điểm tức thì kèm giải thích chi tiết.

2. **Luyện Nói & Ghi âm giọng nói (`src/features/speaking/SpeakingPractice.tsx`)**:
   - Thu âm thực tế qua trình duyệt với `navigator.mediaDevices.getUserMedia` & `MediaRecorder` (kèm biểu đồ sóng âm và trình phát nghe lại bản thu của chính mình; hỗ trợ chế độ mô phỏng minh bạch nếu thiết bị không có micro).
   - Nghe câu mẫu chuẩn (1.0x) và tốc độ chậm (0.75x), hướng dẫn trọng âm & nối âm (Phonetic Tips), chấm điểm độ khớp từng từ (Word-by-word match).

3. **Luyện Đọc chuyên sâu (`src/features/reading/ReadingPractice.tsx`)**:
   - Bài đọc phân đoạn theo chuẩn CEFR (A1–B2), bộ đếm số từ và thời gian đọc, bật/tắt dịch nghĩa từng đoạn.
   - **Từ điển ngữ cảnh (Clickable Glossary)**: tra nghĩa, từ loại, phiên âm IPA và lưu từ mới vào hàng đợi ôn tập SM-2.
   - Câu hỏi đọc hiểu đa dạng kèm nút **"Tô sáng Đoạn dẫn chứng"** giúp đối chiếu vị trí thông tin trong bài đọc.

4. **Luyện Viết & Quản lý Bản nháp (`src/features/writing/WritingPractice.tsx`)**:
   - Đề bài viết theo cấp độ CEFR kèm dàn ý gợi ý (**Outline**) và các cụm từ ăn điểm (**Useful Phrases** — bấm để chèn trực tiếp vào trình soạn thảo).
   - Bộ đếm số từ, số câu theo thời gian thực; **Lưu bản nháp (`localStorage`)**, khôi phục hoặc xóa lịch sử bản nháp.
   - Chấm điểm định lượng khách quan (độ dài, độ đa dạng từ vựng, số cụm từ gợi ý đã dùng, dấu câu/viết hoa) kết hợp **Checklist tự đánh giá theo 4 tiêu chí Rubric** và đối chiếu **Bài mẫu (Model Answer)**.

5. **Từ vựng IPA, Flashcards 3D & Thuật toán Spaced Repetition SM-2 (`src/lib/srs.ts`, `src/features/vocabulary/`)**:
   - Kho từ vựng có phiên âm IPA, từ loại, cấp độ CEFR, nghĩa tiếng Việt, câu ví dụ song ngữ, nút phát âm từ & câu ví dụ, và form thêm từ vựng cá nhân.
   - **Thuật toán SuperMemo SM-2**: tính toán chính xác `repetitions`, `easeFactor` (EF), `interval` (số ngày) và `nextReviewDate` với 4 mức đánh giá: **1. Quên (Again)**, **2. Khó (Hard)**, **3. Tốt (Good)**, **4. Dễ (Easy)**.
   - Trang **Ôn tập SM-2 (`/review`)** gồm Hàng đợi từ vựng đến hạn hôm nay và **Quiz Phản xạ Từ vựng**.

6. **Theo dõi tiến độ từng kỹ năng & Đề xuất bài học thông minh (`src/services/recommendationService.ts`)**:
   - Tự động phân tích kỹ năng có tiến độ/độ chính xác thấp nhất, bài học đạt điểm dưới 80% gần đây và số thẻ từ vựng đến hạn ôn tập SM-2 để đề xuất bài học ưu tiên trên Dashboard và sau mỗi bài tập.

---

## 📂 Cấu trúc thư mục dự án

```
lingua-quest/
├── src/
│   ├── components/
│   │   ├── layout/          # Sidebar, Header (kèm thông báo & bộ đếm SRS), Layout
│   │   └── ui/              # Card, Button, Badge, ProgressBar, StatCard
│   ├── features/
│   │   ├── listening/       # ListeningPractice (Audio + Interactive Transcript)
│   │   ├── speaking/        # SpeakingPractice (MediaRecorder + Word Match)
│   │   ├── reading/         # ReadingPractice (Segmented Passage + Glossary)
│   │   ├── writing/         # WritingPractice (Editor + Drafts + Rubric)
│   │   └── vocabulary/      # FlashcardDeck + SpacedRepetitionReview (SM-2)
│   ├── pages/               # Dashboard, LearningPath, Courses, CourseDetail, LessonPage, Vocabulary, Achievements, Stats, Profile, Settings
│   ├── hooks/               # useLearning (Context quản lý toàn bộ trạng thái học tập)
│   ├── services/            # storageService, recommendationService
│   ├── lib/                 # srs.ts (SM-2), audio.ts (Web Speech/Audio), scoring.ts
│   ├── data/                # coursesData.ts, userData.ts
│   └── types/               # index.ts (TypeScript interfaces)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🛠️ Hướng dẫn cài đặt và chạy dự án

```bash
# 1. Cài đặt dependencies
npm install

# 2. Chạy môi trường phát triển (Local Dev Server)
npm run dev

# 3. Kiểm tra build production
npm run build
```
