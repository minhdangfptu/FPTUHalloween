# ============================================================
# WORKFLOW: Scaffolding Feature
# File: .agent/workflows/scaffold-feature.md
# Mục đích: Quy trình 5 bước để tạo một tính năng mới
# ============================================================
# Áp dụng KHI: User yêu cầu tạo tính năng mới (feature request)
# ============================================================

---

## MỤC LỤC

1. [Tổng quan workflow](#1-tổng-quan-workflow)
2. [Bước 1: Define Model](#2-bước-1-define-model)
3. [Bước 2: Viết Service](#3-bước-2-viết-service)
4. [Bước 3: Tạo Controller & Route](#4-bước-3-tạo-controller--route)
5. [Bước 4: Viết UI Component](#5-bước-4-viết-ui-component)
6. [Bước 5: Ghép API & Test](#6-bước-5-ghép-api--test)
7. [Checklist tổng kết](#7-checklist-tổng-kết)

---

## 1. TỔNG QUAN WORKFLOW

### Sơ đồ luồng:

```
User yêu cầu tính năng mới
    │
    ▼
Bước 1: Define Model (Database)
    │  ┌─ Schema thiết kế
    │  ├─ Index
    │  ├─ Pre-save hooks
    │  └─ Relationships (ObjectId)
    ▼
Bước 2: Viết Service (Business Logic)
    │  ├─ CRUD operations
    │  ├─ Validation
    │  ├─ Error handling
    │  └─ Pagination
    ▼
Bước 3: Controller & Route (API Layer)
    │  ├─ Controller: nhận req/res, gọi Service
    │  ├─ Validation middleware
    │  ├─ Auth middleware
    │  └─ Route: define HTTP method + path
    ▼
Bước 4: UI Component (Frontend)
    │  ├─ Page component
    │  ├─ Reusable components
    │  ├─ Custom hooks
    │  └─ State management
    ▼
Bước 5: Ghép API & Test
    │  ├─ Axios API service
    │  ├─ Loading/Error states
    │  ├─ JWT interceptor
    │  └─ E2E test
    ▼
✅ Tính năng hoàn chỉnh
```

### Chuẩn bị trước khi bắt đầu:
1. Đọc `.agent/rules/backend.md` — hiểu kiến trúc MVC+Service
2. Đọc `.agent/rules/database.md` — hiểu Mongoose conventions
3. Đọc `.agent/rules/frontend.md` — hiểu React conventions
4. Đọc `.agent/skills/connect-fe-be/SKILL.md` — hiểu cách kết nối FE-BE

---

## 2. BƯỚC 1: DEFINE MODEL

### Mục tiêu: Thiết kế MongoDB Schema cho tính năng

### 2.1. Xác định requirements:

```
1. Tính năng cần những data gì?
2. Data nào lưu trong DB, data nào tính toán runtime?
3. Relationship với collection nào khác?
4. Field nào cần index?
5. Field nào là sensitive (cần hide)?
```

### 2.2. Tạo Model file:

```javascript
// backend/src/models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,            // ✅ Index: thường xuyên truy vấn theo user
    },
    type: {
      type: String,
      enum: ['event_reminder', 'event_update', 'new_comment', 'system'],
      required: true,
      index: true,            // ✅ Index: lọc theo type
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Title không quá 200 ký tự'],
    },
    message: {
      type: String,
      required: true,
      maxlength: [1000, 'Message không quá 1000 ký tự'],
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,            // ✅ Index: lọc notification chưa đọc
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,         // ✅ BẮT BUỘC: timestamps: true
  }
);

// Compound index: lọc notification chưa đọc của 1 user
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
```

### 2.3. Checklist Model:

```
□ Schema có timestamps: true
□ Field required có message trong array
□ Enum có message mô tả khi invalid
□ Reference dùng ObjectId + ref
□ Field thường truy vấn có index
□ Field nhạy cảm (password) không có trong schema
□ Pre-save hook hash password (nếu là User model)
□ Virtual field cho computed properties (nếu cần)
□ toJSON virtuals enabled (nếu dùng virtual)
```

---

## 3. BƯỚC 2: VIẾT SERVICE

### Mục tiêu: Viết Business Logic trong Service layer

### 3.1. Tạo Service file:

```javascript
// backend/src/services/notificationService.js
const Notification = require('../models/Notification');
const AppError = require('../utils/AppError');

// === READ ===
const getNotificationsByUser = async (userId, { page = 1, limit = 20, isRead } = {}) => {
  const query = { user: userId };
  if (isRead !== undefined) {
    query.isRead = isRead;
  }

  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find(query)
      .populate('relatedEvent', 'title date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(query),
  ]);

  return {
    notifications,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

// === CREATE ===
const createNotification = async (data) => {
  const notification = await Notification.create(data);
  return notification.toObject();
};

// === UPDATE ===
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  ).lean();

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  return notification;
};

const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { user: userId, isRead: false },
    { isRead: true }
  );
  return { modifiedCount: result.modifiedCount };
};

// === DELETE ===
const deleteNotification = async (notificationId, userId) => {
  const result = await Notification.deleteOne({
    _id: notificationId,
    user: userId,
  });

  if (result.deletedCount === 0) {
    throw new AppError('Notification not found', 404);
  }
};

// === COUNT (unread) ===
const getUnreadCount = async (userId) => {
  return Notification.countDocuments({ user: userId, isRead: false });
};

module.exports = {
  getNotificationsByUser,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
```

### 3.2. Checklist Service:

```
□ Tên hàm: verb + noun (getNotificationsByUser, createNotification)
□ Dùng .lean() khi chỉ đọc
□ Có pagination (.skip, .limit) khi trả danh sách
□ Query có điều kiện userId (bảo mật: user chỉ truy cập data của mình)
□ Throw AppError với message rõ ràng + statusCode khi lỗi
□ Dùng .populate() thay vì query thủ công trong loop
□ KHÔNG nhận req/res (chỉ nhận data)
□ KHÔNG gửi response trực tiếp
```

---

## 4. BƯỚC 3: TẠO CONTROLLER & ROUTE

### Mục tiêu: Tạo API endpoint cho tính năng

### 4.1. Tạo Controller:

```javascript
// backend/src/controllers/notificationController.js
const catchAsync = require('../utils/catchAsync');
const notificationService = require('../services/notificationService');

// GET /api/notifications
const getMyNotifications = catchAsync(async (req, res) => {
  const { page = 1, limit = 20, isRead } = req.query;

  const result = await notificationService.getNotificationsByUser(
    req.user.id,
    {
      page: Number(page),
      limit: Number(limit),
      isRead: isRead === 'true' ? true : isRead === 'false' ? false : undefined,
    }
  );

  return res.status(200).json({
    success: true,
    data: result.notifications,
    pagination: result.pagination,
  });
});

// GET /api/notifications/unread-count
const getUnreadCount = catchAsync(async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id);
  return res.status(200).json({ success: true, data: { count } });
});

// PATCH /api/notifications/:id/read
const markAsRead = catchAsync(async (req, res) => {
  const notification = await notificationService.markAsRead(
    req.params.id,
    req.user.id
  );
  return res.status(200).json({ success: true, data: notification });
});

// PATCH /api/notifications/read-all
const markAllAsRead = catchAsync(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id);
  return res.status(200).json({
    success: true,
    message: `Marked ${result.modifiedCount} notifications as read`,
  });
});

// DELETE /api/notifications/:id
const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user.id);
  return res.status(200).json({ success: true, message: 'Notification deleted successfully' });
});

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
```

### 4.2. Tạo Route:

```javascript
// backend/src/routes/notificationRoute.js
const express = require('express');
const router = express.Router();
const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require('../controllers/notificationController');
const { authMiddleware } = require('../middleware/auth');

// Áp dụng auth cho tất cả route
router.use(authMiddleware);

// GET /api/notifications
router.get('/', getMyNotifications);

// GET /api/notifications/unread-count
router.get('/unread-count', getUnreadCount);

// PATCH /api/notifications/read-all
router.patch('/read-all', markAllAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', deleteNotification);

module.exports = router;
```

### 4.3. Đăng ký route trong app.js:

```javascript
// backend/src/app.js
const notificationRoute = require('./routes/notificationRoute');

// ...
app.use('/api/notifications', notificationRoute);
```

### 4.4. Checklist Controller & Route:

```
□ Controller dùng catchAsync wrapper
□ Controller chỉ nhận req/res, gọi Service, KHÔNG có logic nghiệp vụ
□ Route có authMiddleware (trừ route public)
□ HTTP method đúng (GET=đọc, POST=tạo, PUT/PATCH=cập nhật, DELETE=xóa)
□ Status code đúng (200=OK, 201=Created, 400=Bad Request, 401=Unauthorized)
□ Route được đăng ký trong app.js
□ Parameter validation (`:id` có format ObjectId hợp lệ)
```

---

## 5. BƯỚC 4: VIẾT UI COMPONENT

### Mục tiêu: Tạo giao diện React cho tính năng

### 5.1. Tạo API service (Frontend):

```typescript
// frontend/src/services/api/notificationApi.ts
import api from './axiosInstance';
import type { Notification, PaginatedResponse } from '../../types/notification';

export const notificationApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    isRead?: boolean;
  }): Promise<PaginatedResponse<Notification>> =>
    api.get<PaginatedResponse<Notification>>('/notifications', { params })
      .then(res => res.data),

  getUnreadCount: (): Promise<{ data: { count: number } }> =>
    api.get('/notifications/unread-count'),

  markAsRead: (id: string): Promise<Notification> =>
    api.patch<Notification>(`/notifications/${id}/read`).then(res => res.data),

  markAllAsRead: (): Promise<void> =>
    api.patch('/notifications/read-all'),

  delete: (id: string): Promise<void> =>
    api.delete(`/notifications/${id}`),
};
```

### 5.2. Tạo Custom Hook:

```typescript
// frontend/src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import { notificationApi } from '../services/api/notificationApi';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await notificationApi.getAll({ limit: 50 });
      setNotifications(result.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const result = await notificationApi.getUnreadCount();
      setUnreadCount(result.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications(prev =>
      prev.map(n => n._id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));

    try {
      await notificationApi.markAsRead(id);
    } catch (err) {
      // Rollback
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: false } : n)
      );
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const previous = notifications;
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await notificationApi.markAllAsRead();
    } catch (err) {
      setNotifications(previous);
      fetchUnreadCount();
    }
  }, [notifications, fetchUnreadCount]);

  const deleteNotification = useCallback(async (id: string) => {
    const deleted = notifications.find(n => n._id === id);
    setNotifications(prev => prev.filter(n => n._id !== id));
    if (deleted && !deleted.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await notificationApi.delete(id);
    } catch (err) {
      if (deleted) {
        setNotifications(prev => [deleted, ...prev]);
        if (!deleted.isRead) fetchUnreadCount();
      }
    }
  }, [notifications, fetchUnreadCount]);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
  }, [fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
```

### 5.3. Tạo Component:

```tsx
// frontend/src/pages/NotificationsPage.tsx
import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/NotificationItem';
import NotificationSkeleton from '../components/skeleton/NotificationSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  if (isLoading) return <NotificationSkeleton />;
  if (error) return <ErrorState message={error} onRetry={fetchNotifications} />;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Thông báo</h1>
          {unreadCount > 0 && (
            <p className="text-gray-500 text-sm">
              {unreadCount} thông báo chưa đọc
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-orange-500 hover:underline"
          >
            Đánh dấu tất cả đã đọc
          </button>
        )}
      </div>

      {/* Notification List */}
      {notifications.length === 0 ? (
        <EmptyState
          title="Không có thông báo nào"
          description="Bạn sẽ nhận được thông báo khi có cập nhật mới"
        />
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
```

### 5.4. Checklist UI:

```
□ Có API service layer (axios instance với interceptor)
□ Có custom hook cho logic nghiệp vụ
□ Có loading state (Skeleton) khi fetch data
□ Có error state với retry button
□ Có empty state khi không có data
□ Dùng functional component (KHÔNG class component)
□ Responsive layout (mobile-first với sm:/md:/lg:)
□ TypeScript types cho tất cả props/state
□ Optimistic update cho action (mark as read, delete)
```

---

## 6. BƯỚC 5: GHÉP API & TEST

### 6.1. Ghép API (Connect FE-BE):

```
□ Backend API test bằng Postman/curl
□ Frontend API service gọi đúng endpoint
□ Axios interceptor gắn JWT token
□ Axios interceptor xử lý 401 → refresh token
□ 403 → hiện thông báo "Không có quyền"
□ Loading state hiển thị khi gọi API
□ Error state hiển thị khi API fail
□ Success: hiện toast notification
□ Redirect sau action thành công (nếu cần)
```

### 6.2. Test cases:

```markdown
## Test Cases: Notification Feature

### API Tests
- [ ] GET /api/notifications → 200 + danh sách notification
- [ ] GET /api/notifications → 401 khi không có token
- [ ] GET /api/notifications?isRead=false → chỉ notification chưa đọc
- [ ] PATCH /api/notifications/:id/read → 200 + notification đã đọc
- [ ] PATCH /api/notifications/read-all → 200 + tất cả đã đọc
- [ ] DELETE /api/notifications/:id → 200 + xóa thành công
- [ ] DELETE /api/notifications/:id → 404 khi không tồn tại
- [ ] DELETE /api/notifications/:id của user khác → 404 (bảo mật)

### UI Tests
- [ ] Hiển thị Skeleton khi đang load
- [ ] Hiển thị Error + Retry khi API fail
- [ ] Hiển thị Empty State khi không có notification
- [ ] Click "Đánh dấu đã đọc" → optimistic update ngay lập tức
- [ ] Unread badge cập nhật sau khi đọc
- [ ] Responsive trên mobile/tablet/desktop
- [ ] 401 → redirect về login
```

---

## 7. CHECKLIST TỔNG KẾT

### Trước khi commit feature:

#### Model (Bước 1):
- [ ] Schema có `timestamps: true`
- [ ] Reference dùng `ObjectId` + `ref`
- [ ] Index cho field thường truy vấn
- [ ] Enum validation với message

#### Service (Bước 2):
- [ ] Dùng `.lean()` khi chỉ đọc
- [ ] Pagination với `.skip()` + `.limit()`
- [ ] User chỉ truy cập data của mình (`userId` filter)
- [ ] Throw `AppError` với statusCode khi lỗi

#### Controller & Route (Bước 3):
- [ ] Dùng `catchAsync` wrapper
- [ ] Chỉ nhận req/res, gọi Service
- [ ] Auth middleware cho route cần bảo vệ
- [ ] HTTP method + status code đúng

#### UI Component (Bước 4):
- [ ] Functional Component (không class)
- [ ] Custom hook cho logic nghiệp vụ
- [ ] Loading/Error/Empty states
- [ ] Responsive với Tailwind breakpoints

#### Integration (Bước 5):
- [ ] API test thành công
- [ ] JWT interceptor hoạt động
- [ ] 401/403/500 error handling
- [ ] Optimistic update cho action
- [ ] TypeScript types đầy đủ

### Checklist chung:
- [ ] Không `console.log` thừa (xem `pre-deploy.md`)
- [ ] Không hardcode secret (dùng `.env`)
- [ ] Code tuân thủ DRY, SOLID
- [ ] Naming convention đúng
- [ ] Commit message theo Conventional Commits
