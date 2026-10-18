# 🚀 Hướng dẫn Deploy LinguaQuest lên Vercel

## Yêu cầu
- GitHub repository đã kết nối Vercel
- Tên miền đã cấu hình DNS trỏ về Vercel

## Các bước thực hiện

### 1. Push code lên GitHub

```bash
# Di chuyển vào thư mục dự án
cd lingua-quest

# Khởi tạo Git (nếu chưa có)
git init

# Thêm remote origin (thay YOUR_USERNAME và YOUR_REPO bằng thông tin của bạn)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Thêm tất cả file
git add .

# Tạo commit
git commit -m "Initial commit: LinguaQuest MVP"

# Push lên GitHub
git branch -M main
git push -u origin main
```

### 2. Vercel tự động Deploy

Sau khi push lên GitHub:
- Vercel sẽ tự động nhận diện dự án React + Vite
- Tự động chạy build và deploy
- Domain của bạn sẽ trỏ đến trang web

### 3. Kiểm tra Deployment

1. Truy cập [vercel.com/dashboard](https://vercel.com/dashboard)
2. Chọn project LinguaQuest
3. Xem deployment logs
4. Kiểm tra domain đã cấu hình

## Cấu trúc dự án

```
lingua-quest/
├── src/
│   ├── components/     # UI components tái sử dụng
│   ├── pages/          # Các trang chính
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API và business logic
│   ├── types/          # TypeScript interfaces
│   ├── data/           # Dữ liệu mẫu
│   ├── lib/            # Utilities
│   └── styles/         # Global styles
├── public/             # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Phát triển Local

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build cho production
npm run build
```

## Các Giai đoạn Phát triển

- [x] **Giai đoạn 1**: Demo giao diện (Dashboard, Learning Path, Lessons, Practice)
- [ ] **Giai đoạn 2**: Chức năng học tập đầy đủ (Listening, Speaking, Reading, Writing)
- [ ] **Giai đoạn 3**: Tích hợp Supabase Backend
- [ ] **Giai đoạn 4**: Kiểm thử và tối ưu

## Môi trường Variables (Giai đoạn 3)

Khi tích hợp Supabase, thêm vào Vercel Dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Troubleshooting

### Vercel không nhận diện Vite?
Thêm `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### DNS không hoạt động?
- Kiểm tra DNS records đã trỏ đúng chưa
- Vercel cần 24-48h để propagate
- Verify tại [dnschecker.org](https://dnschecker.org)

### Lỗi Build?
```bash
# Xóa node_modules và cài lại
rm -rf node_modules package-lock.json
npm install
npm run build
```
