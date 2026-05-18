import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import CategoryPage from './pages/CategoryPage';
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
      <Route path="/product/:slug" element={<ProtectedRoute><ProductDetailPage /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
      <Route path="/category/:slug" element={<ProtectedRoute><CategoryPage /></ProtectedRoute>} />
      <Route path="/user/profile" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

      {/* Placeholder for forgot-password */}
      <Route path="/forgot-password" element={<div className="min-h-screen flex items-center justify-center text-gray-400">Trang Quên mật khẩu</div>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
