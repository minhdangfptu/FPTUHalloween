# ============================================================
# LUẬT BACKEND — Node.js / Express
# Phiên bản: 1.1.0 | Áp dụng cho: backend/
# ============================================================
# BẮT BUỘC tuân thủ mọi quy tắc trong file này khi viết backend.
#
# 📌 LƯU Ý QUAN TRỌNG — NGÔN NGỮ PHẢN HỒI API:
# Backend trả về message HOÀN TOÀN BẰNG TIẾNG ANH.
# Frontend (React) sẽ dịch sang tiếng Việt qua
# `frontend/src/utils/translateResponse.js`.
# KHÔNG viết message tiếng Việt trong backend code.
# ============================================================

---

## 1. KIẾN TRÚC MVC+Service (BẮT BUỘC)

### 1.1. Luồng xử lý request bắt buộc:

```
HTTP Request
    │
    ▼
Router (route + HTTP method)
    │
    ▼
Controller  ←── Nhận req/res, gọi service, trả response
    │
    ▼
Service     ←── Business logic, gọi Model, xử lý data
    │
    ▼
Model       ←── Mongoose Schema, tương tác MongoDB
    │
    ▼
Response (tiếng Anh)
```

### 1.2. Controller — CHỉ xử lý I/O, KHÔNG chứa logic nghiệp vụ:

> **Lưu ý:** Dùng **functional style** (named arrow function exports). Mỗi handler là một named export rõ ràng.

```javascript
// ✅ ĐÚNG — Functional Controller + Functional Service
// backend/src/controllers/userController.js
const { getUserById, createUser } = require('../services/userService');
const catchAsync = require('../utils/catchAsync');

// GET /api/users/:id
const getUserByIdHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  const user = await getUserById(id);
  return res.status(200).json({ success: true, data: user });
});

// POST /api/users
const createUserHandler = catchAsync(async (req, res) => {
  const userData = req.body;
  const newUser = await createUser(userData);
  return res.status(201).json({ success: true, data: newUser });
});

module.exports = { getUserById: getUserByIdHandler, createUser: createUserHandler };
```

```javascript
// ❌ SAI — Controller chứa business logic trong function
const getUserById = async (req, res) => {
  const user = await User.findById(req.params.id); // ❌ Logic trong controller
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json(user);
};
```

---

### 1.3. Service — Chứa toàn bộ business logic:

```javascript
// backend/src/services/userService.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const AppError = require('../utils/AppError');

// === READ ===
const getUserById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError('Invalid user ID format', 400);
  }

  const user = await User.findById(id).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

// === CREATE ===
const createUser = async (userData) => {
  const existingUser = await User.findOne({ email: userData.email }).lean();
  if (existingUser) {
    throw new AppError('Email already exists', 409);
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });

  return newUser.toObject();
};

module.exports = { getUserById, createUser };
```

---

### 1.4. Router — Định nghĩa route và gắn middleware:

```javascript
// backend/src/routes/userRoute.js
const express = require('express');
const router = express.Router();
const { getUserById: getUserByIdHandler, createUser: createUserHandler } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');
const { validateBody } = require('../middleware/validator');
const userValidation = require('../validations/userValidation');

router.get(
  '/:id',
  authMiddleware,
  getUserByIdHandler
);

router.post(
  '/',
  validateBody(userValidation.createSchema),
  createUserHandler
);

module.exports = router;
```

---

## 2. ASYNC/AWAIT (BẮT BUỘC)

### 2.1. Mọi hàm tương tác MongoDB phải dùng async/await:

```javascript
// ✅ ĐÚNG
async function getAllUsers() {
  const users = await User.find({ role: 'user' }).lean();
  return users;
}

// ❌ SAI — Dùng callback hoặc .then() không nhất quán
function getAllUsers() {
  return User.find({ role: 'user' }).then(users => users);
}
```

### 2.2. Xử lý lỗi trong async function:

```javascript
// ✅ ĐÚNG — Dùng catchAsync wrapper trong functional controller
const getUser = catchAsync(async (req, res) => {
  const user = await UserService.getUser(req.params.id);
  return res.json({ success: true, data: user });
});

// ❌ SAI — Không bắt lỗi, để unhandled rejection
const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  return res.json(user); // Lỗi -> crash server
};
```

---

## 3. GLOBAL ERROR HANDLER (BẮT BUỘC)

### 3.1. Middleware xử lý lỗi tập trung:

```javascript
// backend/src/middleware/errorHandler.js

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const globalErrorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;

  // KHÔNG gửi stack trace ra production
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFoundHandler, globalErrorHandler };
```

### 3.2. Áp dụng trong app.js:

```javascript
// backend/src/app.js
const express = require('express');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// ... các middleware khác ...

app.use('/api/users', require('./routes/userRoute'));

// Error handlers — PHẢI đặt ở CUỐI cùng
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
```

### 3.3. Custom Error class:

```javascript
// backend/src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

---

## 4. AUTH MIDDLEWARE (JWT — BẮT BUỘC)

### 4.1. JWT Auth Middleware:

```javascript
// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided. Authorization denied.', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please login again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired. Please login again.', 401));
    }
    next(error);
  }
};

// Middleware kiểm tra quyền (role-based)
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
```

### 4.2. Sử dụng trong route:

```javascript
// Route chỉ admin mới được truy cập
router.delete(
  '/:id',
  authMiddleware,
  requireRole('admin'),
  deleteUser
);
```

---

## 5. INPUT VALIDATION (BẮT BUỘC)

### 5.1. Validation middleware:

```javascript
// backend/src/middleware/validator.js
const { validationResult } = require('express-validator');

const validateBody = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) return next();

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  };
};

module.exports = { validateBody };
```

### 5.2. Validation schema (tiếng Anh cho message):

```javascript
// backend/src/validations/userValidation.js
const { body } = require('express-validator');

const createSchema = [
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least 1 uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least 1 number'),

  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters'),
];

module.exports = { createSchema };
```

---

## 6. CẤU TRÚC THƯ MỤC BACKEND CHUẨN

```
backend/
├── src/
│   ├── controllers/         # Functional controllers (req/res I/O)
│   ├── services/            # Business logic (Class-based)
│   ├── models/              # Mongoose Schema
│   ├── routes/              # API Routes
│   ├── middleware/          # Auth, validation, error handler
│   ├── validations/         # Validation schemas
│   ├── config/              # DB config, JWT config
│   ├── utils/               # Helpers (AppError, catchAsync, logger)
│   ├── app.js               # Express app setup
│   └── server.js            # Entry point
│
├── .env                     # Biến môi trường (KHÔNG commit)
├── .env.example             # Template biến môi trường
└── .gitignore               # Ignore .env
```

---

## 7. MÔ TẢ TRÁCH NHIỆM MỖI LỚP

| Lớp            | Trách nhiệm                                           | Cấm                                      |
|----------------|-------------------------------------------------------|------------------------------------------|
| **Router**     | Định nghĩa HTTP method + path + middleware           | Chứa logic xử lý                        |
| **Controller** | Nhận req/res, gọi Service, trả response              | Chứa business logic, query DB trực tiếp |
| **Service**    | Business logic, gọi Model, xử lý data               | Nhận req/res trực tiếp                   |
| **Model**      | Định nghĩa Schema, tương tác MongoDB                | Chứa logic nghiệp vụ                    |
| **Middleware** | Xử lý cross-cutting concerns (auth, validation)       | Chứa business logic chính                |

---

## 8. CATCH ASYNC ERROR — HELPER

```javascript
// backend/src/utils/catchAsync.js
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
```

---

## 9. RATE LIMITING (BẮT BUỘC cho endpoint public)

```javascript
// backend/src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please slow down.',
  },
});

module.exports = { authLimiter, apiLimiter };
```

---

## 10. LOGGER (KHÔNG dùng console.log trong production)

```javascript
// backend/src/config/logger.js
const logger = {
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
    }
  },
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta);
  },
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  },
};

module.exports = logger;
```

---

## TÓM TẮT — BACKEND CHECKLIST

Trước khi commit backend code, đảm bảo:

- [ ] Controller chỉ nhận req/res, gọi Service (KHÔNG chứa logic)
- [ ] Business logic nằm 100% trong Service
- [ ] Tất cả Model query dùng `.lean()` khi đọc data (xem `database.md`)
- [ ] Dùng async/await, KHÔNG dùng callback
- [ ] Global error handler được áp dụng trong app.js
- [ ] Input được validate trước khi vào Controller
- [ ] JWT auth middleware bảo vệ các route cần thiết
- [ ] KHÔNG commit `.env`, KHÔNG hardcode secret
- [ ] Password được hash bằng bcrypt trước khi lưu
- [ ] **Tất cả message tiếng Anh — Frontend sẽ dịch qua `translateResponse.js`**
