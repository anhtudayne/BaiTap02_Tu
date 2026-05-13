import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Placeholder — Phase 3 & 4 */}
      <Route path="/product/:slug" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Placeholder for forgot-password */}
      <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center text-gray-400">Trang Quên mật khẩu</div>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
