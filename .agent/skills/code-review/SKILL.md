# ============================================================
# SKILL: Code Review
# File: .agent/skills/code-review/SKILL.md
# Mục đích: Săm soi code, tìm bug, bắt lỗi bảo mật & hiệu năng
# ============================================================

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Quy trình Code Review 6 bước](#2-quy-trình-code-review-6-bước)
3. [Checklist bảo mật](#3-checklist-bảo-mật)
4. [Checklist hiệu năng](#4-checklist-hiệu-năng)
5. [Checklist logic nghiệp vụ](#5-checklist-logic-nghiệp-vụ)
6. [Các lỗi thường gặp & cách phát hiện](#6-các-lỗi-thường-gặp--cách-phát-hiện)
7. [Format báo cáo review](#7-format-báo-cáo-review)

---

## 1. TỔNG QUAN

### Mục tiêu:
- Tìm bug tiềm ẩn trước khi deploy
- Phát hiện lỗ hổng bảo mật (SQL/NoSQL Injection, XSS, rò rỉ secret)
- Đảm bảo tuân thủ DRY, SOLID, convention
- Tối ưu hiệu năng (N+1 query, memory leak, blocking code)

### Phạm vi review:
- Backend: Controller, Service, Model, Middleware, Route
- Frontend: Component, Hook, API call, State management
- Database: Schema, Index, Query

---

## 2. QUY TRÌNH CODE REVIEW 6 BƯỚC

### Bước 1: Đọc & hiểu ngữ cảnh

```
1. Đọc file quy tắc liên quan (.agent/rules/backend.md, database.md, frontend.md)
2. Hiểu flow chính của tính năng
3. Xác định entry point (route/API endpoint)
4. Trace data flow từ request → response
```

### Bước 2: Kiểm tra kiến trúc & cấu trúc

```
✓ Controller có chứa business logic không? (Vi phạm MVC)
✓ Service có gọi req/res trực tiếp không?
✓ Model có chứa logic nghiệp vụ không?
✓ Tên file, biến, hàm có đúng convention không?
```

### Bước 3: Kiểm tra bảo mật (Xem Section 3)

### Bước 4: Kiểm tra hiệu năng (Xem Section 4)

### Bước 5: Kiểm tra logic nghiệp vụ (Xem Section 5)

### Bước 6: Viết báo cáo (Xem Section 7)

---

## 3. CHECKLIST BẢO MẬT

### 3.1. Authentication & Authorization

```typescript
// ❌ NGUY HIỂM — Route không có auth middleware
router.get('/api/users'); // Ai cũng truy cập được!

// ✅ AN TOÀN
router.get('/api/users', authMiddleware, UserController.getAll);

// ❌ NGUY HIỂM — Hardcode secret
const token = jwt.sign(data, 'my-super-secret-key');

// ✅ AN TOÀN
const token = jwt.sign(data, process.env.JWT_SECRET);
```

**Checklist Auth:**
- [ ] Route quan trọng có `authMiddleware` không?
- [ ] JWT secret lấy từ `process.env` không?
- [ ] Có kiểm tra quyền (role-based access) không?
- [ ] Token có hết hạn (expiration) không?

---

### 3.2. SQL / NoSQL Injection

```typescript
// ❌ NGUY HIỂM — NoSQL Injection
// backend/src/services/userService.js
async findUser(email) {
  // User input được đưa thẳng vào query KHÔNG escape
  const query = { email: eval(`"${email}"`) };
  return User.find(query).lean();
}

// ✅ AN TOÀN — Dùng parameterized query của Mongoose
async findUser(email) {
  return User.findOne({ email }).lean();
}

// ❌ NGUY HIỂM — RegExp DoS (ReDoS)
async searchUser(name) {
  // User control regex → có thể gây ReDoS
  return User.find({ name: new RegExp(name, 'i') }).lean();
}

// ✅ AN TOÀN — Giới hạn regex
async searchUser(name) {
  // Chỉ tìm prefix, an toàn hơn
  return User.find({ name: new RegExp(`^${name}`, 'i') }).lean();
}
```

**Checklist Injection:**
- [ ] Input từ user có được validate/escape không?
- [ ] Có dùng `eval()`, `Function()` với user input không?
- [ ] RegExp được tạo từ user input có bị giới hạn không?

---

### 3.3. Password & Sensitive Data

```typescript
// ❌ NGUY HIỂM — Hash không đủ mạnh
const hash = await bcrypt.hash(password, 4); // 4 rounds — quá yếu!

// ✅ AN TOÀN
const hash = await bcrypt.hash(password, 12); // 12 rounds — đủ mạnh

// ❌ NGUY HIỂM — Trả về password
return res.json({ user, password: user.password });

// ✅ AN TOÀN — Không bao giờ trả password
const { password, ...userWithoutPassword } = user;
return res.json({ user: userWithoutPassword });
```

**Checklist Password:**
- [ ] Password được hash bằng bcrypt với salt >= 10 không?
- [ ] API response có trả về password không?
- [ ] Password được filter bằng `.select('-password')` khi đọc không?
- [ ] Có confirm password (so sánh 2 lần nhập) không?

---

### 3.4. Information Disclosure

```typescript
// ❌ NGUY HIỂM — Gửi stack trace ra production
res.status(500).json({ error: error.stack });

// ❌ NGUY HIỂM — Ghi secret ra console
console.log('JWT_SECRET:', process.env.JWT_SECRET);

// ✅ AN TOÀN
res.status(500).json({ error: 'Internal Server Error' }); // Production
console.log('API called:', req.path); // Chỉ log path, không secret
```

**Checklist Disclosure:**
- [ ] Production error response có stack trace không?
- [ ] Console log có in secret/API key/JWT không?
- [ ] Error message có tiết lộ internal path/config không?

---

### 3.5. API Rate Limiting

```typescript
// ❌ NGUY HIỂM — Không giới hạn request rate
router.post('/api/auth/login', UserController.login); // Ai cũng brute force được!

// ✅ AN TOÀN
router.post('/api/auth/login', authLimiter, UserController.login);
```

**Checklist Rate Limiting:**
- [ ] Endpoint login/register có `authLimiter` không?
- [ ] API rate limiter được áp dụng cho endpoint public không?

---

## 4. CHECKLIST HIỆU NĂNG

### 4.1. N+1 Query Problem

```typescript
// ❌ NGUY HIỂM — N+1 query: 1 query cho events + N queries cho từng creator
// backend/src/services/eventService.js
async getEvents() {
  const events = await Event.find().lean();
  const enrichedEvents = await Promise.all(
    events.map(async (event) => {
      const creator = await User.findById(event.creatorId).lean(); // N queries!
      return { ...event, creator };
    })
  );
  return enrichedEvents;
}
// Result: 1 + N queries (N+1 problem!)

// ✅ TỐI ƯU — Chỉ 2 queries với populate
async getEvents() {
  const events = await Event.find()
    .populate('creator', 'fullName email avatar')  // 1 query join
    .lean();
  return events;
}
// Result: 2 queries (1 cho events, 1 cho users)
```

**Phát hiện N+1:**
```bash
# Tìm tất cả findById/findById trong vòng lặp
rg "forEach|map.*await.*find|find.*async" --type js
```

**Checklist N+1:**
- [ ] Có `.map(async ...)` chứa `.find()` / `.findOne()` / `.findById()` bên trong không?
- [ ] Có dùng `.populate()` thay vì query thủ công trong vòng lặp không?
- [ ] Dùng `Promise.all()` với array of queries thay vì sequential query trong loop không?

---

### 4.2. Missing Index

```typescript
// ❌ CHẬM — Truy vấn không có index
// Tìm user theo email: Collection scan toàn bộ!
const user = await User.findOne({ email: 'test@example.com' }).lean();

// ✅ NHANH — Có index
// Schema đã khai báo: email: { type: String, index: true }
// → MongoDB dùng index → O(log N) thay vì O(N)
```

**Checklist Index:**
- [ ] Field thường xuyên truy vấn (`where`, `sort`, `findOne`) có index không?
- [ ] Field unique (`unique: true`) có index tự động — đã kiểm tra chưa?
- [ ] Compound query có compound index phù hợp không?

---

### 4.3. Missing .lean() — Mongoose Document overhead

```typescript
// ❌ CHẬM — Dùng Mongoose Document khi chỉ đọc
const users = await User.find({ role: 'user' });
// → Trả về Mongoose Document (có method, hooks) → chậm hơn

// ✅ NHANH — Dùng .lean() khi chỉ đọc
const users = await User.find({ role: 'user' }).lean();
// → Trả về plain JS object → nhanh hơn 2-3 lần
```

**Checklist .lean():**
- [ ] Tất cả query CHỈ ĐỌC (find, findOne, findById) có `.lean()` không?
- [ ] Query cần cập nhật (save, update) thì KHÔNG dùng `.lean()` — đúng không?

---

### 4.4. Missing Pagination / Limit

```typescript
// ❌ NGUY HIỂM — Lấy toàn bộ data
const events = await Event.find().lean();
// → Nếu có 1 triệu events → crash memory!

// ✅ AN TOÀN — Có limit & pagination
const PAGE_SIZE = 20;
const events = await Event.find({ status: 'open' })
  .skip((page - 1) * PAGE_SIZE)
  .limit(PAGE_SIZE)
  .lean();
```

**Checklist Pagination:**
- [ ] API trả về danh sách có pagination không?
- [ ] Có `.limit()` để giới hạn kết quả không?
- [ ] Có `.skip()` cho phân trang không?

---

### 4.5. Unnecessary Large Select

```typescript
// ❌ LÃNG PHÍ — Select quá nhiều field
const users = await User.find().select('+password +internalNote +__v').lean();

// ✅ TỐI ƯU — Chỉ select field cần thiết
const users = await User.find()
  .select('fullName email avatar role')
  .lean();
// → Giảm bandwidth, tăng tốc response
```

---

## 5. CHECKLIST LOGIC NGHIỆP VỤ

### 5.1. Thiếu Null/Undefined Check

```typescript
// ❌ NGUY HIỂM — Không check null
const user = await User.findById(id).lean();
const email = user.email.toLowerCase(); // Crash nếu user = null

// ✅ AN TOÀN
const user = await User.findById(id).lean();
if (!user) throw new AppError('User not found', 404);
const email = user.email.toLowerCase();
```

**Checklist Null Check:**
- [ ] Query `findById`, `findOne` có kiểm tra `null` / `undefined` không?
- [ ] Object property access có safe check (`?.`) không?
- [ ] API trả response có check data tồn tại trước khi dùng không?

---

### 5.2. Race Condition

```typescript
// ❌ NGUY HIỂM — Race condition trong concurrent requests
// Hai request cùng lúc tạo user với email giống nhau
const existing = await User.findOne({ email }).lean();
if (!existing) {
  await User.create({ email, ... }); // Cả hai đều pass check → duplicate!
}

// ✅ AN TOÀN — Dùng unique constraint + try/catch
try {
  const user = await User.create({ email, ... });
  return user;
} catch (error) {
  if (error.code === 11000) {
    throw new AppError('Email already exists', 409);
  }
  throw error;
}
```

---

### 5.3. Validation

```typescript
// ❌ NGUY HIỂM — Không validate input
const { email, age } = req.body;
await User.create({ email, age }); // Email format gì cũng chấp nhận!

// ✅ AN TOÀN — Validate trước khi xử lý
// Dùng express-validator hoặc Joi/Zod
const [errors] = await Promise.all([
  validationResult(req).promise,
]);

if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
```

**Checklist Validation:**
- [ ] Input từ client có được validate về type, format, range không?
- [ ] Validation error trả về message rõ ràng không?
- [ ] Validate ở middleware trước khi vào controller không?

---

## 6. CÁC LỖI THƯỜNG GẶP & CÁCH PHÁT HIỆN

### 6.1. Memory Leak

```typescript
// ❌ NGUY HIỂM — Không unsubscribe event listener
window.addEventListener('resize', handleResize);
// → Mỗi lần component mount lại → thêm listener mới!

// ✅ AN TOÀN — Cleanup trong useEffect return
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

**Tìm bằng command:**
```bash
# Tìm useEffect không có cleanup
rg "useEffect.*\{.*addEventListener|setInterval|setTimeout" --type tsx
```

---

### 6.2. Unused Variable / Import

```typescript
// ❌ THỪA
const { data, loading, error, refetch } = useApi(fetchUser);
// → `refetch` không dùng

// ✅ ĐỦ
const { data, loading, error } = useApi(fetchUser);
```

**Tìm bằng command:**
```bash
# TypeScript: tsc --noUnusedLocals
# ESLint: no-unused-vars
```

---

### 6.3. Sync vs Async

```typescript
// ❌ SAI — Async trong sync context
function getUser(id) {
  User.findById(id).lean(); // Không await! Trả về Promise
  // → Luôn trả về undefined
}

// ✅ ĐÚNG
async function getUser(id) {
  return await User.findById(id).lean();
}
```

---

## 7. FORMAT BÁO CÁO REVIEW

Sau khi review xong, báo cáo theo format sau:

```markdown
## 🔍 Code Review Report

### File: `backend/src/services/userService.js`

#### 🔴 Bug Nghiêm trọng (Phải fix trước khi merge)

| # | Vị trí | Mô tả | Cách fix |
|---|--------|--------|---------|
| 1 | Line 45 | N+1 query — `forEach` gọi `User.findById()` | Dùng `.populate()` |
| 2 | Line 67 | Trả về password trong API response | Thêm `.select('-password')` |
| 3 | Line 89 | NoSQL injection — eval() với user input | Dùng parameterized query |

#### 🟡 Cải thiện (Khuyến khích fix)

| # | Vị trí | Mô tả | Đề xuất |
|---|--------|--------|---------|
| 1 | Line 23 | Thiếu `.lean()` khi chỉ đọc | Thêm `.lean()` |
| 2 | Line 55 | Email field không có index | Thêm `index: true` |
| 3 | Line 71 | Magic number `100` | Đặt thành `MAX_USERS = 100` |

#### 🟢 Tốt (Giữ nguyên)

- Line 12: Pre-save hook hash password đúng cách ✓
- Line 34: Validation middleware được sử dụng ✓
- Line 78: Dùng async/await nhất quán ✓

### Tổng kết

- 🔴 Bug nghiêm trọng: 3
- 🟡 Cần cải thiện: 3
- ✅ Đạt: 4

**Hành động:** Yêu cầu fix toàn bộ bug 🔴 trước khi merge.
```

---

## CÁCH SỬ DỤNG SKILL NÀY

### Khi nào gọi skill:
- User gõ: `"review code"`, `"check code"`, `"tìm bug"`, `"kiểm tra bảo mật"`
- Trước khi merge PR
- Sau khi viết xong tính năng quan trọng

### Cách thực hiện:
1. Đọc toàn bộ skill (file này)
2. Xác định phạm vi review (file nào, module nào)
3. Chạy 6 bước review
4. Viết báo cáo theo format Section 7
5. Đề xuất cách fix cho từng lỗi
