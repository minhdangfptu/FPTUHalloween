# ============================================================
# LUẬT FRONTEND — React
# Phiên bản: 1.1.0 | Áp dụng cho: frontend/
# ============================================================
# BẮT BUỘC tuân thủ mọi quy tắc trong file này khi viết React.
# Dự án dùng JavaScript (KHÔNG dùng TypeScript).
#
# 📌 LƯU Ý TRANSLATION:
# Backend trả về message tiếng Anh.
# Dùng `frontend/src/utils/translateResponse.js` để dịch sang tiếng Việt
# TRƯỚC KHI hiển thị cho user.
# ============================================================

---

## 1. COMPONENT — FUNCTIONAL COMPONENT (BẮT BUỘC)

### 1.1. Chỉ dùng Functional Component, KHÔNG dùng Class Component:

```jsx
// ✅ ĐÚNG — Functional Component với Hook
// frontend/src/components/UserCard.jsx
import React, { useState, useEffect } from 'react';

const UserCard = ({ userId, onSelect }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  const fetchUser = async (id) => {
    try {
      setIsLoading(true);
      const data = await userApi.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <SkeletonLoader />;
  if (!user) return <EmptyState message="User not found" />;

  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.fullName} />
      <h3>{user.fullName}</h3>
      <p>{user.email}</p>
      <button onClick={() => onSelect?.(userId)}>Select</button>
    </div>
  );
};

export default UserCard;
```

```jsx
// ❌ SAI — Class Component (đã lỗi thời)
class UserCard extends React.Component {
  state = { user: null, loading: true };

  async componentDidMount() {
    const user = await userApi.getUserById(this.props.userId);
    this.setState({ user, loading: false });
  }

  render() {
    if (this.state.loading) return <SkeletonLoader />;
    return <div>{this.state.user?.fullName}</div>;
  }
}
```

---

## 2. CUSTOM HOOKS (KHUYẾN KHÍCH)

### 2.1. Tách logic ra Custom Hook khi dùng lại từ 2 lần trở lên:

```jsx
// frontend/src/hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api/authApi';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const userData = await authApi.getMe();
        setUser(userData);
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setIsLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    const response = await authApi.login({ email, password });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setUser(userData);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
};

export default useAuth;
```

### 2.2. Custom Hook cho API calls với loading/error state:

```jsx
// frontend/src/hooks/useApi.js
import { useState, useCallback } from 'react';

const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error('Unknown error');
      setError(errorObj);
      options.onError?.(errorObj);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { data, isLoading, error, execute, reset };
};

export default useApi;
```

---

## 3. AXIOS INSTANCE — GẮN JWT TOKEN (BẮT BUỘC)

### 3.1. Tạo Axios instance với Interceptor:

```jsx
// frontend/src/services/api/axiosInstance.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor: Gắn JWT Token ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor: Xử lý 401/403 ---
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 Unauthorized: Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.accessToken);
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // 403 Forbidden: Không có quyền
    if (error.response?.status === 403) {
      console.error('[403 Forbidden] You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 3.2. Tạo API service file cho từng module:

```jsx
// frontend/src/services/api/authApi.js
import api from './axiosInstance';

export const authApi = {
  login: (data) =>
    api.post('/auth/login', data).then(res => res.data),

  register: (data) =>
    api.post('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get('/auth/me').then(res => res.data),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
};
```

```jsx
// frontend/src/services/api/eventApi.js
import api from './axiosInstance';

export const eventApi = {
  getAll: (params) =>
    api.get('/events', { params }).then(res => res.data),

  getById: (id) =>
    api.get(`/events/${id}`).then(res => res.data),

  create: (data) =>
    api.post('/events', data),

  update: (id, data) =>
    api.put(`/events/${id}`, data),

  delete: (id) =>
    api.delete(`/events/${id}`),
};
```

---

## 4. ROUTING & PROTECTED ROUTES (BẮT BUỘC)

### 4.1. Protected Route component:

```jsx
// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

### 4.2. App Router:

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useAuth from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes - User */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Protected routes - Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Layout>
                <AdminPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

---

## 5. STATE MANAGEMENT (KHUYẾN KHÍCH)

### 5.1. Zustand store cho global state:

```jsx
// frontend/src/store/useUserStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useUserStore;
```

---

## 6. ERROR HANDLING — TRANSLATE RESPONSE (BẮT BUỘC)

### 6.1. Sử dụng translateResponse trước khi hiển thị lỗi:

> **Lưu ý:** Backend trả về message tiếng Anh. LUÔN dùng `translateResponse()` để dịch sang tiếng Việt TRƯỚC KHI hiển thị cho user.

```jsx
// frontend/src/utils/translateResponse.js
// Xem chi tiết file này ở: frontend/src/utils/translateResponse.js

import { translateError } from './translateResponse';

// Trong component:
import { translateError } from '../utils/translateResponse';

const fetchData = async () => {
  try {
    const data = await eventApi.getAll();
    setEvents(data);
  } catch (error) {
    // Dịch message từ tiếng Anh → tiếng Việt
    const vietnameseMessage = translateError(error);
    setError(vietnameseMessage);
  }
};
```

---

## 7. ERROR HANDLING TRONG COMPONENT

### 7.1. Error Boundary:

```jsx
// frontend/src/components/ErrorBoundary.jsx
import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h2 className="text-2xl font-bold text-red-500 mb-2">
              Da xay ra loi!
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Loi khong xac dinh'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Tai lai trang
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 8. FORM HANDLING

### 8.1. React Hook Form:

```jsx
// frontend/src/pages/LoginPage.jsx
import { useForm } from 'react-hook-form';
import { authApi } from '../services/api/authApi';
import { translateError } from '../utils/translateResponse';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await authApi.login(data);
      window.location.href = '/dashboard';
    } catch (error) {
      // Dịch lỗi sang tiếng Việt trước khi hiển thị
      const message = translateError(error);
      alert(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-orange-500 text-white rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? 'Dang dang nhap...' : 'Dang nhap'}
      </button>
    </form>
  );
};

export default LoginPage;
```

---

## 9. LOADING STATE & SKELETON

### 9.1. Skeleton Loader:

```jsx
// frontend/src/components/SkeletonLoader.jsx
const SkeletonLoader = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded-t-lg" />
        <div className="p-4">
          <div className="bg-gray-200 h-4 w-3/4 rounded mb-2" />
          <div className="bg-gray-200 h-4 w-1/2 rounded" />
        </div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center space-x-4 animate-pulse">
            <div className="bg-gray-200 h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="bg-gray-200 h-4 w-1/3 rounded" />
              <div className="bg-gray-200 h-3 w-1/4 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />;
};

export default SkeletonLoader;
```

---

## 10. CẤU TRÚC THƯ MỤC FRONTEND CHUẨN

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   └── features/
│   │
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── DashboardPage.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useApi.js
│   │   └── useDebounce.js
│   │
│   ├── services/
│   │   └── api/
│   │       ├── axiosInstance.js     # Axios instance + JWT interceptor
│   │       ├── authApi.js
│   │       └── eventApi.js
│   │
│   ├── store/
│   │   └── useUserStore.js
│   │
│   ├── utils/
│   │   ├── translateResponse.js     # ⚠️ DỊCH TIẾNG ANH → TIẾNG VIỆT
│   │   ├── formatDate.js
│   │   └── validation.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.local
└── .gitignore
```

---

## TÓM TẮT — FRONTEND CHECKLIST

Trước khi commit frontend code, đảm bảo:

- [ ] Chỉ dùng Functional Component (KHÔNG viết Class Component mới)
- [ ] Logic dùng lại >= 2 lần → tách ra Custom Hook
- [ ] API calls dùng Axios instance đã có JWT interceptor
- [ ] Response interceptor xử lý 401 → force logout
- [ ] Route cần bảo vệ bọc trong `ProtectedRoute`
- [ ] Loading state hiển thị Skeleton, KHÔNG hiển thị spinning trống
- [ ] Error Boundary bắt lỗi React
- [ ] **LUÔN dùng `translateResponse()` để dịch lỗi tiếng Anh → tiếng Việt**
- [ ] KHÔNG commit `.env`, `.env.local`
- [ ] Dự án dùng JavaScript — KHÔNG dùng TypeScript syntax
