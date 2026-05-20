# Cửa hàng giày trực tuyến (Bài Tập Cá Nhân 02, 04, 05 & 06)

### 👤 Thông tin sinh viên:
| MSSV | Họ và Tên |
|------|-----------|
| 23110359 | VÕ VĂN TÚ |

Dự án cá nhân xây dựng website cửa hàng bán giày trực tuyến **TuShoes**, bao gồm Backend API bảo mật và Frontend giao diện hiện đại với lazy loading & carousel.

### 📋 Yêu cầu bài tập đã hoàn thành:

| Bài Tập | Chủ đề | Nhiệm vụ đã hoàn thành |
|---------|--------|------------------------|
| **BT02** | Xác thực người dùng | Đăng ký (Validation + Rate Limit + OTP Email), Đăng nhập (JWT + Phân quyền), Quên/Đặt lại mật khẩu, Chỉnh sửa hồ sơ |
| **BT04** | Giao diện cửa hàng | Trang chủ (Hero Banner, danh mục, SP nổi bật/mới/bán chạy), Chi tiết SP (Swiper, chọn size/màu), Tìm kiếm & Lọc (danh mục, giá, thương hiệu) + Phân trang |
| **BT05** | Tính năng nâng cao | Trang danh mục SP + Infinite Scroll (IntersectionObserver), Top 10 bán chạy nhất (Carousel), Top 10 xem nhiều nhất (Carousel + viewCount) |
| **BT06** | Giỏ hàng, Thanh toán & Theo dõi đơn | Giỏ hàng CRUD (MySQL, merge trùng, check tồn kho), Thanh toán COD (form địa chỉ 4 cấp, Transaction), Theo dõi đơn hàng (6 trạng thái, Timeline, Auto-confirm 30 phút, Hủy đơn/Yêu cầu hủy) |

--- 

## 🚀 Chi tiết các tính năng nổi bật

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

### Chức năng Giỏ hàng, Thanh toán & Theo dõi đơn hàng (Bài Tập 06)
- **Giỏ hàng (Cart)**: Thêm/sửa/xóa sản phẩm trong giỏ hàng. Lưu trữ giỏ hàng trên Database (MySQL). Gộp sản phẩm trùng (cùng ID + size + màu). Kiểm tra tồn kho trước khi thêm
- **Thanh toán (Checkout)**: Đặt hàng COD (thanh toán khi nhận hàng). Form địa chỉ giao hàng tách 4 cấp (Tỉnh/Thành, Quận/Huyện, Phường/Xã, Chi tiết). Tự động điền thông tin từ hồ sơ người dùng. Validation đầy đủ phía client + server. Trừ tồn kho & tăng soldCount sử dụng Database Transaction
- **Theo dõi đơn hàng**: 6 trạng thái đơn hàng (Đơn mới → Đã xác nhận → Đang chuẩn bị → Đang giao → Đã giao → Đã hủy). Tự động xác nhận đơn sau 30 phút (setTimeout + backup khi server restart). Hủy đơn trực tiếp (status 1) hoặc gửi yêu cầu hủy đến admin (status 2-3). Thanh tiến trình (Timeline) theo dõi trực quan trạng thái đơn. Bộ lọc đơn hàng theo trạng thái + Phân trang. Xem lịch sử mua hàng

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

### Cart APIs (Bài Tập 06)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `GET` | `/api/cart` | Lấy giỏ hàng | JWT |
| `POST` | `/api/cart` | Thêm sản phẩm vào giỏ | JWT |
| `PUT` | `/api/cart/:id` | Cập nhật số lượng | JWT |
| `DELETE` | `/api/cart/:id` | Xóa 1 sản phẩm khỏi giỏ | JWT |
| `DELETE` | `/api/cart` | Xóa toàn bộ giỏ hàng | JWT |

### Order APIs (Bài Tập 06)
| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| `POST` | `/api/orders` | Tạo đơn hàng (Checkout) | JWT |
| `GET` | `/api/orders` | Danh sách đơn hàng của tôi | JWT |
| `GET` | `/api/orders/:id` | Chi tiết đơn hàng | JWT |
| `POST` | `/api/orders/:id/cancel` | Hủy đơn (status = 1) | JWT |
| `POST` | `/api/orders/:id/request-cancel` | Gửi yêu cầu hủy (status 2-3) | JWT |
| `GET` | `/api/orders/admin/all` | Tất cả đơn hàng (Admin) | JWT + Admin |
| `PUT` | `/api/orders/admin/:id/status` | Cập nhật trạng thái đơn | JWT + Admin |
| `PUT` | `/api/orders/admin/:id/cancel-request` | Duyệt/từ chối yêu cầu hủy | JWT + Admin |

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
│   │   │   ├── cartController.js    # [BT06] Controller giỏ hàng
│   │   │   └── orderController.js   # [BT06] Controller đơn hàng
│   │   ├── middlewares/         # JWT Auth, Role Auth, Validators
│   │   │   └── validators/
│   │   │       └── orderValidator.js # [BT06] Validate đặt hàng
│   │   ├── migrations/          # Migration tạo bảng
│   │   │   ├── create-cart.js       # [BT06] Bảng Carts
│   │   │   ├── create-order-01.js   # [BT06] Bảng Orders
│   │   │   └── create-order-02-item.js # [BT06] Bảng OrderItems
│   │   ├── models/              # User, Category, Product, ProductImage
│   │   │   ├── cart.js              # [BT06] Model Cart
│   │   │   ├── order.js            # [BT06] Model Order
│   │   │   └── orderItem.js        # [BT06] Model OrderItem
│   │   ├── routes/              # API endpoints
│   │   │   ├── cartRoutes.js        # [BT06] Routes giỏ hàng
│   │   │   └── orderRoutes.js       # [BT06] Routes đơn hàng
│   │   ├── seeders/             # Dữ liệu mẫu (5 danh mục, 20 SP)
│   │   ├── services/            # Business Logic
│   │   │   ├── cartService.js       # [BT06] Logic giỏ hàng
│   │   │   └── orderService.js      # [BT06] Logic đơn hàng + Admin
│   │   ├── utils/               # OTP, JWT helpers
│   │   │   └── autoConfirm.js       # [BT06] Tự động xác nhận đơn
│   │   └── server.js            # Entry point
│   ├── .env                     # Biến môi trường backend
│   └── package.json
│
├── frontend/                    # Frontend Source (React + Vite)
│   └── src/
│       ├── api/                 # Axios config + interceptors
│       ├── components/          # Reusable UI components
│       │   ├── AuthLayout.jsx   # Layout đăng nhập/đăng ký
│       │   ├── Navbar.jsx       # Navigation bar + search + CartIcon
│       │   ├── CartIcon.jsx         # [BT06] Icon giỏ hàng + badge
│       │   ├── OrderStatusBadge.jsx # [BT06] Thẻ trạng thái đơn hàng
│       │   ├── OrderTimeline.jsx    # [BT06] Timeline tiến trình đơn
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
│       │   ├── ProductDetailPage.jsx  # + nút thêm giỏ hàng (BT06)
│       │   ├── CategoryPage.jsx # SP theo danh mục + Infinite Scroll (BT05)
│       │   ├── SearchPage.jsx   # Tìm kiếm & lọc
│       │   ├── CartPage.jsx         # [BT06] Trang giỏ hàng
│       │   ├── CheckoutPage.jsx     # [BT06] Trang thanh toán
│       │   ├── OrderSuccessPage.jsx # [BT06] Đặt hàng thành công
│       │   ├── OrdersPage.jsx       # [BT06] Lịch sử đơn hàng
│       │   └── OrderDetailPage.jsx  # [BT06] Chi tiết đơn hàng
│       ├── store/               # Redux Toolkit
│       │   └── slices/          # authSlice, productSlice, cartSlice, orderSlice
│       └── services/            # API service layer
│           ├── cartService.js       # [BT06] API giỏ hàng
│           └── orderService.js      # [BT06] API đơn hàng
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
- **Lớp 5 (Transaction)**: Sử dụng Sequelize Transaction đảm bảo tính toàn vẹn dữ liệu khi đặt hàng

---

*Dự án được thực hiện bởi Võ Văn Tú (23110359) — Bài Tập Cá Nhân 02, 04, 05 & 06*
