# Cửa hàng giày trực tuyến (Bài Tập Cá Nhân 02, 04 & 05)

### 👤 Thông tin sinh viên:
| MSSV | Họ và Tên |
|------|-----------|
| 23110359 | VÕ VĂN TÚ |

Dự án cá nhân xây dựng website cửa hàng bán giày trực tuyến **TuShoes**, bao gồm Backend API bảo mật và Frontend giao diện hiện đại với lazy loading & carousel.

--- 

## 🚀 Tính năng nổi bật

### Chức năng xác thực (Bài Tập 02)
- **Đăng ký tài khoản**: Validation + Rate Limiting + OTP kích hoạt qua Email
- **Đăng nhập (Login)**: JWT Token + Phân quyền User/Admin
- **Quên mật khẩu & Đặt lại mật khẩu**: OTP qua Nodemailer
- **Chỉnh sửa hồ sơ cá nhân**: Whitelist field bảo vệ dữ liệu

### Chức năng cửa hàng (Bài Tập 04)
- **Trang chủ bán hàng**: Hero Banner, danh mục, khuyến mãi, sản phẩm mới, bán chạy nhất
- **Trang chi tiết sản phẩm**: Swiper hình ảnh, thông tin tồn kho, chọn size/màu, tăng/giảm số lượng, sản phẩm tương tự
- **Tìm kiếm & Lọc**: Lọc theo danh mục, thương hiệu, khoảng giá, kích cỡ + Sắp xếp + Phân trang

### Chức năng nâng cao (Bài Tập 05)
- **Trang danh mục SP**: Hiển thị tất cả SP theo danh mục, sử dụng **Infinite Scroll (Lazy Loading)** với IntersectionObserver tự load thêm khi cuộn xuống cuối trang
- **Top 10 bán chạy nhất**: Carousel phân trang ngang (← →) hiển thị 10 SP có soldCount cao nhất
- **Top 10 xem nhiều nhất**: Carousel phân trang ngang (← →) hiển thị 10 SP có viewCount cao nhất. viewCount tự tăng mỗi lần xem chi tiết SP

---

## 📡 API Endpoints

### Auth APIs
| Method | Endpoint | Mô tả | Security |
|--------|----------|-------|----------|
| `POST` | `/api/auth/register` | Đăng ký người dùng | Rate Limit + Validation |
| `POST` | `/api/auth/verify-otp` | Xác nhận mã OTP | - |
| `POST` | `/api/auth/resend-otp` | Gửi lại mã OTP | Rate Limit |
| `POST` | `/api/auth/login` | Đăng nhập tài khoản | Rate Limit + Validation |
| `POST` | `/api/auth/forgot-password` | Quên mật khẩu | Rate Limit + Validation |
| `POST` | `/api/auth/reset-password` | Đặt lại mật khẩu | Validation |
| `GET`  | `/api/user/profile`  | Xem hồ sơ người dùng | JWT + Role: User |
| `PUT`  | `/api/user/profile`  | Cập nhật hồ sơ | JWT + Role: User |

### Product & Category APIs (Bài Tập 04)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/products` | Danh sách SP (filter, search, pagination) | Public |
| `GET` | `/api/products/featured` | SP nổi bật | Public |
| `GET` | `/api/products/new-arrivals` | SP mới nhất | Public |
| `GET` | `/api/products/best-sellers` | SP bán chạy nhất | Public |
| `GET` | `/api/products/:slug` | Chi tiết sản phẩm | Public |
| `GET` | `/api/products/:id/related` | SP tương tự | Public |
| `GET` | `/api/categories` | Danh sách danh mục | Public |

### Product APIs mới (Bài Tập 05)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/products/category/:slug` | SP theo danh mục (phân trang) | Public |
| `GET` | `/api/products/top-sellers` | Top 10 SP bán chạy nhất | Public |
| `GET` | `/api/products/top-viewed` | Top 10 SP xem nhiều nhất | Public |

---

## 🛠 Công nghệ sử dụng

### Backend
- **Runtime**: Node.js, Express.js (v4.x)
- **Database**: MySQL, Sequelize ORM
- **Security**: JWT, bcryptjs, express-validator, express-rate-limit
- **Email**: Nodemailer (SMTP Gmail)
- **Tooling**: Babel (ES6+), Nodemon

### Frontend
- **UI**: React.js (Vite), TailwindCSS v4
- **State**: Redux Toolkit, React Redux
- **HTTP**: Axios (interceptors JWT)
- **Routing**: React Router v7
- **UI Libraries**: Swiper.js, React Icons

---

## 📂 Cấu trúc thư mục

```text
BaiTap02_Tu/
├── backend/                     # Backend Source (Express + MySQL)
│   ├── src/
│   │   ├── config/              # Cấu hình DB
│   │   ├── controllers/         # Xử lý Request/Response
│   │   ├── middlewares/         # JWT Auth, Role Auth, Validators
│   │   ├── migrations/          # Migration tạo bảng
│   │   ├── models/              # User, Category, Product, ProductImage
│   │   ├── routes/              # API endpoints
│   │   ├── seeders/             # Dữ liệu mẫu (5 danh mục, 20 SP)
│   │   ├── services/            # Business Logic
│   │   ├── utils/               # OTP, JWT helpers
│   │   └── server.js            # Entry point
│   ├── .env                     # Biến môi trường backend
│   └── package.json
│
├── frontend/                    # Frontend Source (React + Vite)
│   └── src/
│       ├── api/                 # Axios config + interceptors
│       ├── components/          # Reusable UI components
│       │   ├── AuthLayout.jsx   # Layout đăng nhập/đăng ký
│       │   ├── Navbar.jsx       # Navigation bar + search
│       │   ├── HeroBanner.jsx   # Banner trang chủ
│       │   ├── ProductCard.jsx  # Card sản phẩm
│       │   ├── ImageGallery.jsx # Swiper gallery
│       │   ├── FilterSidebar.jsx# Bộ lọc sản phẩm
│       │   ├── Pagination.jsx   # Phân trang
│       │   ├── HorizontalCarousel.jsx  # Carousel ngang (BT05)
│       │   └── Footer.jsx       # Footer
│       ├── pages/               # Các trang
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── VerifyOtpPage.jsx
│       │   ├── HomePage.jsx     # Trang chủ + Top 10 carousel
│       │   ├── ProductDetailPage.jsx
│       │   ├── CategoryPage.jsx # SP theo danh mục + Infinite Scroll (BT05)
│       │   └── SearchPage.jsx   # Tìm kiếm & lọc
│       ├── store/               # Redux Toolkit
│       │   └── slices/          # authSlice, productSlice
│       └── services/            # API service layer
│
├── README.md
└── .gitignore
```

---

## ⚙️ Cài đặt & Chạy ứng dụng

### 1. Chuẩn bị Database
```sql
CREATE DATABASE elearning_baitap02;
```

### 2. Cấu hình biến môi trường
Tạo file `.env` tại thư mục `backend/`:
```env
PORT=8089
NODE_ENV=development
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_secret_key_here
OTP_EXPIRE_MINUTES=5
```

### 3. Cài đặt Backend
```bash
cd backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```
*Backend chạy tại `http://localhost:8089`*

### 4. Cài đặt Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend chạy tại `http://localhost:5173`*

---

## 🔒 Bảo mật (Security)

- **Lớp 1 (Rate Limiting)**: Giới hạn request chống Brute-force & DDoS
- **Lớp 2 (Authentication)**: JWT Token xác thực phiên làm việc
- **Lớp 3 (Validation)**: Kiểm tra dữ liệu đầu vào bằng express-validator
- **Lớp 4 (Authorization)**: Phân quyền User/Admin truy cập tài nguyên

---

*Dự án được thực hiện bởi Võ Văn Tú (23110359) — Bài Tập Cá Nhân 02, 04 & 05*
