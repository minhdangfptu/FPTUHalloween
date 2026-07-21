---
name: connect-fe-be
description: "Kết nối frontend React với backend Node.js, xử lý API, loading/error state, JWT và dịch response. Dùng khi người dùng yêu cầu nối hoặc debug luồng frontend-backend."
---

# ============================================================
# SKILL: Connect Frontend-Backend
# File: .agent/skills/connect-fe-be/SKILL.md
# Mục đích: Nối API Node.js sang React, xử lý loading/error state, JWT
# ============================================================
# Dự án dùng JavaScript (KHÔNG dùng TypeScript).
# Backend trả message tiếng Anh → Frontend dịch qua translateResponse.js.
# ============================================================

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Quy trình kết nối FE-BE 5 bước](#2-quy-trình-kết-nối-fe-be-5-bước)
3. [Backend API Design](#3-backend-api-design)
4. [Frontend API Service Layer](#4-frontend-api-service-layer)
5. [JWT Token Management](#5-jwt-token-management)
6. [Error Handling: translateResponse + 401/403/500](#6-error-handling-translateresponse--401403500)
7. [Loading & Optimistic Updates](#7-loading--optimistic-updates)
8. [Format báo cáo integration](#8-format-báo-cáo-integration)

---

## 1. TỔNG QUAN

### Mục tiêu:
- Thiết kế API endpoint nhất quán giữa BE và FE
- Quản lý JWT token (access/refresh) đúng cách
- Xử lý error response (401 → logout, 403 → forbidden, 500 → server error)
- Tránh prop-drilling bằng proper state management

### Flow kết nối FE-BE:

```
React (Frontend)          Axios Instance          Express (Backend)
     │                         │                        │
     │──── GET /api/events ───▶│                        │
     │                         │──── GET /api/events ──▶│
     │                         │                        │
     │                         │◀─── 200 OK ───────────│
     │◀─── Promise<Response> ──│                        │
     │                         │                        │
     │  useState → UI Update                            │
```

### Nguyên tắc i18n:

```
Backend:  Trả message HOÀN TOÀN BẰNG TIẾNG ANH
          → "User not found", "Email already exists", "Created successfully"

Frontend: Dùng translateResponse() để dịch sang tiếng Việt
          → "Không tìm thấy người dùng.", "Email đã được sử dụng.", "Tạo thành công."

File tham chiếu: frontend/src/utils/translateResponse.js
```

---

## 2. QUY TRÌNH KẾT NỐI FE-BE 5 BƯỚC

### Bước 1: Backend — Thiết kế API contract

```
1. Định nghĩa request/response shape
2. Viết Controller + Service (tuân theo .agent/rules/backend.md)
3. Validate request bằng middleware
4. Test endpoint bằng Postman/curl
5. Đảm bảo status code đúng (200, 201, 400, 401, 403, 404, 500)
```

### Bước 2: Backend — Response format chuẩn (tiếng Anh)

```javascript
// backend/src/middleware/errorHandler.js

// Success response:
{
  "success": true,
  "data": { ... },
  "message": "Created successfully"
}

// Success với pagination:
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}

// Error response (tiếng Anh — Frontend sẽ dịch):
{
  "success": false,
  "message": "Email already exists",
  "errors": [
    { "field": "email", "message": "Email already exists" }
  ]
}
```

### Bước 3: Frontend — Tạo Axios instance (có interceptor)

```javascript
// frontend/src/services/api/axiosInstance.js
// Xem: Section 5 JWT Token Management
```

### Bước 4: Frontend — Tạo API service file

```javascript
// frontend/src/services/api/eventApi.js
// Xem: Section 4 Frontend API Service Layer
```

### Bước 5: Frontend — Sử dụng trong Component với translateResponse

```javascript
// frontend/src/pages/EventListPage.jsx
import { translateError } from '../utils/translateResponse';

const fetchEvents = async () => {
  try {
    const result = await eventApi.getAll({ page: 1, limit: 20 });
    setEvents(result.data);
  } catch (err) {
    const message = translateError(err); // Dịch EN → VI
    setError(message);
  }
};
```

---

## 3. BACKEND API DESIGN

### 3.1. RESTful naming convention

| HTTP Method | Endpoint                  | Mô tả                    | Status |
|------------|---------------------------|--------------------------|--------|
| GET       | `/api/events`             | Lấy danh sách sự kiện    | 200    |
| GET       | `/api/events/:id`         | Lấy 1 sự kiện            | 200    |
| POST      | `/api/events`             | Tạo sự kiện mới          | 201    |
| PUT       | `/api/events/:id`         | Cập nhật sự kiện         | 200    |
| DELETE    | `/api/events/:id`         | Xóa sự kiện              | 200    |
| POST      | `/api/events/:id/register`| Đăng ký tham gia         | 200    |

### 3.2. Status codes chuẩn

```javascript
// Success codes
200 OK              // GET, PUT, DELETE thành công
201 Created         // POST tạo mới thành công

// Client error codes
400 Bad Request     // Validation failed, malformed request
401 Unauthorized    // Không có token, token hết hạn
403 Forbidden       // Có token nhưng không có quyền
404 Not Found       // Resource không tồn tại
409 Conflict        // Duplicate resource (email đã tồn tại)

// Server error codes
500 Internal Server Error // Lỗi server (không tiết lộ stack trace)
503 Service Unavailable // Server đang bảo trì
```

### 3.3. Backend Controller — Response format chuẩn (tiếng Anh)

```javascript
// backend/src/controllers/eventController.js
const catchAsync = require('../utils/catchAsync');
const EventService = require('../services/eventService');

const getAllEvents = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;

  const result = await EventService.getAllEvents({
    page: Number(page),
    limit: Number(limit),
    status,
  });

  return res.status(200).json({
    success: true,
    data: result.events,
    pagination: result.pagination,
  });
});

const getEventById = catchAsync(async (req, res) => {
  const event = await EventService.getEventById(req.params.id);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found',
    });
  }

  return res.status(200).json({
    success: true,
    data: event,
  });
});

const createEvent = catchAsync(async (req, res) => {
  const event = await EventService.createEvent(req.body);

  return res.status(201).json({
    success: true,
    data: event,
    message: 'Created successfully',
  });
});

const deleteEvent = catchAsync(async (req, res) => {
  await EventService.deleteEvent(req.params.id, req.user.id);

  return res.status(200).json({
    success: true,
    message: 'Deleted successfully',
  });
});

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  deleteEvent,
};
```

---

## 4. FRONTEND API SERVICE LAYER

### 4.1. Axios Instance (đã setup interceptor)

```javascript
// frontend/src/services/api/axiosInstance.js
// Xem: Section 5 JWT Token Management
// Bao gồm:
// - Request interceptor: gắn Bearer token
// - Response interceptor: xử lý 401 refresh, 403 forbidden
```

### 4.2. API Service file pattern (JavaScript)

```javascript
// frontend/src/services/api/eventApi.js
import api from './axiosInstance';

export const eventApi = {
  getAll: (params) =>
    api.get('/events', { params }).then(res => res.data),

  getById: (id) =>
    api.get(`/events/${id}`).then(res => res.data),

  getMyEvents: () =>
    api.get('/events/my').then(res => res.data),

  create: (data) =>
    api.post('/events', data),

  update: (id, data) =>
    api.put(`/events/${id}`, data),

  delete: (id) =>
    api.delete(`/events/${id}`),

  register: (eventId) =>
    api.post(`/events/${eventId}/register`).then(res => res.data),
};
```

### 4.3. Auth API service (JavaScript)

```javascript
// frontend/src/services/api/authApi.js
import api from './axiosInstance';

export const authApi = {
  login: (data) =>
    api.post('/auth/login', data).then(res => {
      const { accessToken, refreshToken, user } = res.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return res.data;
    }),

  register: (data) =>
    api.post('/auth/register', data),

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return api.post('/auth/logout');
  },

  getMe: () =>
    api.get('/auth/me').then(res => res.data),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
};
```

---

## 5. JWT TOKEN MANAGEMENT

### 5.1. Token Storage Strategy

```javascript
// ✅ AN TOÀN
// Access token: localStorage (cần truy cập nhanh, thời gian ngắn)
// Refresh token: httpOnly cookie (server-set, JS không đọc được)

// ❌ KÉM AN TOÀN
// Access token: sessionStorage (mất khi close tab)
// Refresh token: localStorage (bị XSS đọc)
```

### 5.2. Axios Interceptor cho 401/403 (JavaScript)

```javascript
// frontend/src/services/api/axiosInstance.js
import axios from 'axios';
import { authApi } from './authApi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: gắn token
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

// Response interceptor: xử lý 401/403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // === 401: Token hết hạn → Thử refresh ===
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refreshToken }
          );

          localStorage.setItem('accessToken', data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch {
          authApi.logout();
          window.location.href = '/login';
        }
      } else {
        authApi.logout();
        window.location.href = '/login';
      }
    }

    // === 403: Không có quyền ===
    if (status === 403) {
      console.error('You do not have permission to perform this action.');
    }

    // === Network Error ===
    if (!error.response) {
      console.error('Network error. Please check your connection.');
    }

    return Promise.reject(error);
  }
);

export default api;
```

### 5.3. Protected Route — Redirect khi chưa login

```jsx
// frontend/src/components/ProtectedRoute.jsx
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

### 5.4. Redirect về trang trước sau khi login

```jsx
// frontend/src/pages/LoginPage.jsx
const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (credentials) => {
    await authApi.login(credentials);
    navigate(from, { replace: true });
  };

  return <LoginForm onSubmit={handleLogin} />;
};
```

---

## 6. ERROR HANDLING: translateResponse + 401/403/500

### 6.1. Sử dụng translateResponse (BẮT BUỘC)

> **Lưu ý:** Backend trả message tiếng Anh. LUÔN dùng `translateResponse()` để dịch sang tiếng Việt TRƯỚC KHI hiển thị cho user.

```javascript
// frontend/src/utils/translateResponse.js
// File này chứa bảng dịch: English → Tiếng Việt
// Thêm message mới vào bảng dịch khi backend trả thêm message mới.
```

### 6.2. Error handling trong Component

```jsx
// frontend/src/pages/EventListPage.jsx
import { useState, useEffect } from 'react';
import { eventApi } from '../services/api/eventApi';
import { translateError } from '../utils/translateResponse';
import EventCard from '../components/EventCard';
import ErrorState from '../components/ErrorState';
import EventListSkeleton from '../components/skeleton/EventListSkeleton';
import EmptyState from '../components/EmptyState';

const EventListPage = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await eventApi.getAll({ page: 1, limit: 20 });
      setEvents(result.data);
    } catch (err) {
      // ✅ Dịch lỗi từ tiếng Anh → tiếng Việt
      const message = translateError(err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading) return <EventListSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchEvents} />;
  if (events.length === 0) return <EmptyState title="Khong co su kien nao" />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event._id} event={event} />
      ))}
    </div>
  );
};
```

### 6.3. Backend error response format (tiếng Anh)

```javascript
// backend/src/middleware/errorHandler.js
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Validation error
class ValidationError extends Error {
  constructor(errors) {
    super('Validation failed');
    this.statusCode = 400;
    this.errors = errors;
  }
}

// Sử dụng:
if (!email) {
  const error = new ValidationError([
    { field: 'email', message: 'Email is required' }
  ]);
  return next(error);
}
```

---

## 7. LOADING & OPTIMISTIC UPDATES

### 7.1. Loading state trong Form

```jsx
// frontend/src/pages/CreateEventPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { eventApi } from '../services/api/eventApi';
import { translateError, translateSuccess } from '../utils/translateResponse';

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await eventApi.create(data);
      const message = translateSuccess('Created successfully');
      alert(message); // "Tạo thành công."
      navigate('/dashboard');
    } catch (err) {
      const message = translateError(err);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} />
      {errors.title && <p className="text-red-500">{errors.title.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 text-white px-6 py-3 rounded-lg disabled:opacity-50"
      >
        {isSubmitting ? 'Dang tao...' : 'Tao su kien'}
      </button>
    </form>
  );
};
```

### 7.2. Optimistic Update

```jsx
// frontend/src/pages/EventDetailPage.jsx
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventApi } from '../services/api/eventApi';
import { translateError, translateSuccess } from '../utils/translateResponse';

const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);

  const handleRegister = async () => {
    const previousEvent = event;

    // Optimistic update: Cập nhật UI ngay lập tức
    setEvent(prev => prev ? {
      ...prev,
      isRegistered: true,
      participantCount: prev.participantCount + 1,
    } : null);

    try {
      await eventApi.register(eventId);
      const message = translateSuccess('Registration successful');
      alert(message); // "Đăng ký thành công."
    } catch (err) {
      // Rollback nếu API fail
      setEvent(previousEvent);
      const message = translateError(err);
      alert(message);
    }
  };

  return (
    <div>
      <h1>{event?.title}</h1>
      <p>Nguoi tham gia: {event?.participantCount}</p>
      <button onClick={handleRegister} disabled={event?.isRegistered}>
        {event?.isRegistered ? 'Da dang ky' : 'Dang ky ngay'}
      </button>
    </div>
  );
};
```

---

## 8. FORMAT BÁO CÁO INTEGRATION

```markdown
## 🔗 FE-BE Integration Report

### Feature: Event Registration

#### Backend API Contract ✅
| Endpoint                    | Method | Auth | Message (EN)          |
|----------------------------|--------|------|------------------------|
| `/api/events/:id`          | GET    | JWT  | ✅ OK                  |
| `/api/events/:id/register` | POST   | JWT  | "Registration successful" |

#### Frontend Integration ✅
| Component        | API call            | Loading | Error | 401→Logout |
|-----------------|---------------------|---------|-------|------------|
| EventDetailPage | `eventApi.getById`  | ✅      | ✅     | ✅          |
| RegisterButton   | `eventApi.register` | ✅      | ✅     | ✅          |

#### translateResponse Checklist ✅
| Message EN                    | Message VI                  | Trong bảng dịch? |
|-------------------------------|----------------------------|-------------------|
| Registration successful       | Đăng ký thành công.       | ✅                 |
| Event not found               | Không tìm thấy sự kiện.  | ✅                 |
| You do not have permission    | Bạn không có quyền...     | ✅                 |

#### Issues Found 🔴

| # | Vị trí                 | Mô tả                                         | Cách fix                           |
|---|------------------------|-----------------------------------------------|------------------------------------|
| 1 | `translateResponse.js` | Message "Registration successful" chưa có trong bảng dịch | Thêm vào ERROR_TRANSLATIONS |

#### Issues Fixed ✅

- [x] Axios instance có request interceptor gắn JWT token
- [x] Axios instance có response interceptor xử lý 401 → refresh token
- [x] Component có loading state (Skeleton) khi fetch data
- [x] Component có error state với retry button
- [x] translateError() được dùng để dịch lỗi EN → VI

### Kết luận
- ✅ API contract match giữa BE và FE
- ✅ Message tiếng Anh → dịch qua translateResponse
- 🚀 Sẵn sàng test end-to-end
```

---

## CÁCH SỬ DỤNG SKILL NÀY

### Khi nào gọi skill:
- User gõ: `"kết nối API"`, `"integrate FE BE"`, `"nối API"`, `"Axios"`, `"fetch API"`
- Khi bắt đầu tính năng mới (cần cả BE và FE)
- Khi debug API integration (401, 403, loading state)

### Cách thực hiện:
1. Đọc toàn bộ skill (file này)
2. Đọc backend.md và frontend.md để hiểu architecture
3. Backend trả message tiếng Anh → thêm vào translateResponse.js nếu chưa có
4. Frontend dùng `translateError(err)` để dịch trước khi hiển thị
5. Thực hiện 5 bước kết nối FE-BE
6. Viết báo cáo theo format Section 8
