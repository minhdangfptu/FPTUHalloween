# ============================================================
# WORKFLOW: Debug
# File: .agent/workflows/debug.md
# Mục đích: Quy trình xử lý bug/lỗi một cách có hệ thống
# ============================================================
# Áp dụng KHI: User gặp bug, lỗi, crash, unexpected behavior
# ============================================================

---

## MỤC LỤC

1. [Tổng quan workflow](#1-tổng-quan-workflow)
2. [Bước 1: Gather Evidence](#2-bước-1-gather-evidence)
3. [Bước 2: Reproduce & Isolate](#3-bước-2-reproduce--isolate)
4. [Bước 3: Root Cause Analysis](#4-bước-3-root-cause-analysis)
5. [Bước 4: Fix & Test](#5-bước-4-fix--test)
6. [Bước 5: Prevent Recurrence](#6-bước-5-prevent-recurrence)
7. [Cheat sheet lỗi thường gặp](#7-cheat-sheet-lỗi-thường-gặp)

---

## 1. TỔNG QUAN WORKFLOW

### Debug Framework:

```
┌─────────────────────────────────────────┐
│  Bước 1: GATHER EVIDENCE               │
│  Thu thập thông tin: error message,     │
│  stack trace, logs, môi trường          │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Bước 2: REPRODUCE & ISOLATE           │
│  Tái tạo lỗi, xác định scope,           │
│  phân tách biến số                      │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Bước 3: ROOT CAUSE ANALYSIS           │
│  Trace logic, tìm nguyên nhân gốc,      │
│  so sánh với working state              │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Bước 4: FIX & TEST                    │
│  Áp dụng fix, test từng case,          │
│  verify không break features khác        │
└──────────────────┬──────────────────────┘
                   ▼
┌─────────────────────────────────────────┐
│  Bước 5: PREVENT RECURRENCE            │
│  Thêm test, update documentation,       │
│  bắt lỗi tương tự                     │
└─────────────────────────────────────────┘
```

### Nguyên tắc vàng:

```
1. KHÔNG đoán — luôn có evidence trước khi kết luận
2. Chia để trị — tách bug thành từng phần nhỏ
3. Sửa 1 lần, sửa đúng — không sửa tắt
4. Test sau fix — đảm bảo không break gì khác
```

---

## 2. BƯỚC 1: GATHER EVIDENCE

### Mục tiêu: Thu thập TẤT CẢ thông tin về lỗi trước khi đoán nguyên nhân

### 2.1. Câu hỏi cần trả lời:

```
□ Lỗi xảy ra ở đâu? (Frontend / Backend / Database / Network)
□ Lỗi xảy ra khi nào? (Lần đầu / Sau action cụ thể / Intermittently)
□ Ai gặp lỗi? (Tất cả user / Chỉ user cụ thể / Chỉ production)
□ Lỗi có reproducible không? (Luôn luôn / Đôi khi / Không bao giờ tái tạo được)
□ Có error message không? (Có → đọc / Không → cần enable logging)
```

### 2.2. Nguồn evidence:

| Nguồn | Cách thu thập |
|--------|--------------|
| **Browser Console** | F12 → Console tab → lọc Error (đỏ) |
| **Network Tab** | F12 → Network tab → filter failed requests (đỏ) |
| **Server Logs** | Terminal chạy server → output |
| **MongoDB Logs** | MongoDB log file hoặc Atlas dashboard |
| **Postman Response** | Copy request + response khi gọi API |

### 2.3. Evidence checklist:

```markdown
## Evidence Collection

### Error Type: [FRONTEND / BACKEND / DATABASE]

### Error Message:
```
[Copy chính xác error message từ console/log]
```

### Stack Trace:
```
[Copy stack trace đầy đủ]
```

### Environment:
- Browser: [Chrome/Firefox/Safari] + Version
- OS: [Windows/macOS/Linux] + Version
- Node.js: [Version]
- MongoDB: [Version / Atlas URL]

### Steps to Reproduce:
1. [Bước 1]
2. [Bước 2]
3. [Bước 3]

### Expected Behavior:
[Chuyện gì NÊN xảy ra]

### Actual Behavior:
[Chuyện gì THỰC SỰ xảy ra]
```

---

## 3. BƯỚC 2: REPRODUCE & ISOLATE

### Mục tiêu: Tái tạo lỗi và thu hẹp phạm vi

### 3.1. Reproduce:

```
LUÔN LUÔN tái tạo được lỗi TRƯỚC KHI sửa.
Nếu không reproduce được → cần thêm logging để hiểu flow.
```

```bash
# Reproduce API bằng curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpass"}'

# Response:
# {"success":false,"message":"Invalid email or password"}
```

```bash
# Reproduce với verbose output
curl -v -X GET http://localhost:5000/api/events
# → Xem headers, timing, redirect
```

### 3.2. Isolate — Thu hẹp phạm vi:

```
❓ Lỗi ở layer nào?
│
├─ Frontend (React)?
│   ├─ UI render sai?
│   ├─ State sai?
│   └─ API call sai?
│
├─ Backend (Express)?
│   ├─ Controller xử lý sai?
│   ├─ Service logic sai?
│   └─ Validation reject?
│
└─ Database (MongoDB)?
    ├─ Query trả sai?
    ├─ Index không dùng được?
    └─ Permission issue?
```

### 3.3. Isolation technique — Binary search:

```
1. Check midpoint: Lỗi ở BE hay FE?
   → Gọi API bằng Postman → Nếu BE trả đúng → Lỗi ở FE
   
2. Check midpoint: Lỗi ở Controller hay Service?
   → Log trong Controller → Nếu data đúng → Lỗi ở Service
   
3. Check midpoint: Lỗi ở query hay logic?
   → Log query result → Nếu data đúng từ DB → Lỗi ở logic
```

### 3.4. Checklist Isolate:

```
□ Đã tái tạo được lỗi bằng Postman/curl?
□ Đã xác định được lỗi ở layer nào (FE / BE / DB)?
□ Đã xác định được file/c函数 cụ thể gây lỗi?
□ Đã thu hẹp được điều kiện gây lỗi?
□ Đã loại trừ được những phần KHÔNG gây lỗi?
```

---

## 4. BƯỚC 3: ROOT CAUSE ANALYSIS

### Mục tiêu: Tìm NGUYÊN NHÂN GỐC, không phải triệu chứng

### 4.1. Technique: 5 Whys

```
Problem: API trả 500 khi tạo user

Why 1: Controller throw error
→ Why? Service.throw(AppError('Email đã tồn tại', 409))
→ Why? User.findOne({ email }).lean() trả về document
→ Why? Email đã tồn tại trong DB
→ Why? User đã đăng ký trước đó

Root Cause: Duplicate email → AppError được throw nhưng 
            Error Handler không catch → 500 thay vì 409

Fix: Đảm bảo error handler catch AppError và trả 409
```

### 4.2. Technique: Compare with Working State

```bash
# So sánh với commit trước đó
git log --oneline -10
git diff abc123..def456 --stat

# Check commit nào gây ra bug
git bisect start
git bisect bad HEAD
git bisect good abc123  # commit được biết là working
git bisect run npm test
```

### 4.3. Common patterns:

```
┌─────────────────────────────────────────┬──────────────────────────────────┐
│ SYMPTOM                                │ ROOT CAUSE                       │
├─────────────────────────────────────────┼──────────────────────────────────┤
│ 500 Internal Server Error               │ Error không được catch           │
│                                         │ → Bọc try/catch hoặc dùng       │
│                                         │   catchAsync                    │
├─────────────────────────────────────────┼──────────────────────────────────┤
│ 401 Unauthorized dù đã login            │ Token hết hạn / không gắn       │
│                                         │ → Check interceptor, check       │
│                                         │   localStorage                   │
├─────────────────────────────────────────┼──────────────────────────────────┤
│ React component re-render infinity       │ setState trong useEffect        │
│                                         │ không có dependency đúng        │
│                                         │ → Thêm dependency array         │
├─────────────────────────────────────────┼──────────────────────────────────┤
│ Data không hiển thị                     │ .lean() trả v�ng plain object    │
│                                         │ → Dùng populate() hoặc query    │
│                                         │   thủ công                      │
├─────────────────────────────────────────┼──────────────────────────────────┤
│ Password không hash                     │ Pre-save hook không chạy        │
│                                         │ → Check this.isModified()       │
│                                         │   trong pre('save')             │
└─────────────────────────────────────────┴──────────────────────────────────┘
```

### 4.4. Checklist Root Cause:

```
□ Đã tìm được nguyên nhân GỐC (root cause)?
□ Đã xác nhận bằng evidence (log, console, test)?
□ Đã loại trừ triệu chứng (symptom)?
□ Có thể mô tả root cause trong 1 câu?
□ Fix nguyên nhân gốc sẽ KHẮC PHỤC hoàn toàn vấn đề?
```

---

## 5. BƯỚC 4: FIX & TEST

### Mục tiêu: Sửa đúng, sửa đủ, không gây hại

### 5.1. Fix strategy:

```
1. Sửa ít nhất có thể — không over-engineer
2. Fix root cause, không fix symptom
3. Không sửa những thứ không liên quan
4. Viết test để prevent regression
```

### 5.2. Ví dụ fix:

```javascript
// ❌ SAI — Fix symptom (data = null)
async getUser(req, res) {
  const user = await UserService.getUser(req.params.id);
  // Symptom: user = null → fix bằng cách gán default
  const safeUser = user || { name: 'Unknown' };
  return res.json(safeUser);
}

// ✅ ĐÚNG — Fix root cause (thiếu null check trong Service)
```

```typescript
// ❌ SAI — Fix symptom (re-render infinity)
useEffect(() => {
  setData(fetchData()); // KHÔNG BAO GIỜ setState trong useEffect không có deps
}, []); // [] không fix được, cần dependency đúng

// ✅ ĐÚNG — Fix root cause
useEffect(() => {
  fetchData().then(data => setData(data));
}, [userId]); // Thêm dependency đúng
```

### 5.3. Test after fix:

```bash
# 1. Manual test: Reproduce bug scenario
# → Bug KHÔNG còn xảy ra

# 2. API test bằng curl/Postman
curl -X GET http://localhost:5000/api/events
# → 200 OK + data

# 3. Regression test: Check features liên quan
# → Features khác KHÔNG bị break

# 4. Unit test (nếu có)
npm test
# → Tất cả test pass

# 5. Edge case test
# → Null/undefined
# → Empty array
# → Very large input
# → Concurrent requests
```

### 5.4. Checklist Fix:

```
□ Fix giải quyết ROOT CAUSE, không phải symptom?
□ Fix là MINIMUM change (không over-engineer)?
□ Đã test manual — bug không còn?
□ Đã test API bằng Postman/curl?
□ Đã test regression — features khác không break?
□ Đã test edge cases (null, empty, large input)?
□ Code tuân thủ DRY/SOLID (không copy-paste fix)?
```

---

## 6. BƯỚC 5: PREVENT RECURRENCE

### Mục tiêu: Đảm bảo bug không tái xuất hiện

### 6.1. Thêm unit test:

```typescript
// backend/tests/unit/userService.test.ts

describe('UserService', () => {
  describe('getUserById', () => {
    it('should throw AppError when user not found', async () => {
      // Setup: không có user với id này
      const mockUserId = '000000000000000000000000';

      // Act & Assert
      await expect(UserService.getUserById(mockUserId))
        .rejects
        .toThrow('User not found');
    });

    it('should throw AppError for invalid ObjectId format', async () => {
      await expect(UserService.getUserById('invalid-id'))
        .rejects
        .toThrow('Invalid user ID format');
    });
  });
});
```

### 6.2. Thêm defensive check:

```javascript
// Sau khi fix, thêm check phòng ngừa
// backend/src/services/userService.js

async getUserById(id) {
  // ✅ Thêm validate ObjectId format (prevent crash)
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError('Invalid user ID format', 400);
  }

  const user = await User.findById(id).lean();

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}
```

### 6.3. Cập nhật documentation:

```markdown
// backend/src/services/userService.js

/**
 * Lấy thông tin user theo ID.
 * 
 * @param {string} id - MongoDB ObjectId của user
 * @returns {Promise<User>} User document (không có password)
 * @throws {AppError} 400 - Invalid ObjectId format
 * @throws {AppError} 404 - User not found
 * 
 * @example
 * const user = await UserService.getUserById('665a1b2c3d4e5f6a7b8c9d0e');
 */
```

### 6.4. Checklist Prevent Recurrence:

```
□ Đã thêm unit test cho bug case?
□ Đã thêm defensive check để prevent future crash?
□ Đã cập nhật JSDoc/comment nếu cần?
□ Đã commit với message mô tả bug đã fix?
□ Đã chạy full test suite để đảm bảo không break gì?
□ Đã thông báo team về bug + fix (nếu cần)?
```

---

## 7. CHEAT SHEET LỖI THƯỜNG GẶP

### 7.1. Backend Errors

| Lỗi | Dấu hiệu | Root Cause | Fix |
|------|-----------|-----------|-----|
| `CastError: ObjectId` | 500 khi truyền `:id` | Invalid ObjectId format | Validate trong Service + middleware |
| `ValidationError` | 500 khi tạo doc | Required field bị thiếu | Thêm required validation |
| `MongoServerError` duplicate key | 500 khi tạo doc | Unique field trùng | Try/catch + check error.code === 11000 |
| `TypeError: Cannot read property` | 500 crash | Null/undefined access | Null check trước khi access |
| `jwt.verify` fail | 401 | Token hết hạn / sai secret | Refresh token / check secret |
| `UnhandledPromiseRejection` | Server crash | Async error không catch | Bọc try/catch hoặc catchAsync |
| `MongooseError: Operation ... buffering timeout` | Connection fail | MongoDB connection lost | Reconnect logic |

### 7.2. Frontend Errors

| Lỗi | Dấu hiệu | Root Cause | Fix |
|------|-----------|-----------|-----|
| `Maximum update depth exceeded` | Browser hang | useEffect dependency loop | Fix dependency array |
| `Cannot read property of undefined` | Component crash | Data chưa load xong | Conditional rendering |
| `401` sau khi login | Redirect loop | Token không lưu / interceptor sai | Check localStorage / interceptor |
| `CORS` error | API call fail | Server không cho phép origin | Enable CORS middleware |
| `Objects are not valid as a React child` | Render crash | Render object thay vì string | `.map()` / `{{}}` |
| State reset sau navigation | Data mất | Component unmount | Dùng context/store |

### 7.3. Database Errors

| Lỗi | Dấu hiệu | Root Cause | Fix |
|------|-----------|-----------|-----|
| Slow query > 1s | API chậm | Thiếu index | Thêm index cho field thường truy vấn |
| `E11000 duplicate key` | Tạo doc fail | Unique constraint violation | Check trước hoặc try/catch |
| `Cursor not found` | Query fail | Cursor timeout (large dataset) | Dùng `.batchSize()` hoặc `.lean()` |
| `no such collection` | App crash | Collection chưa tạo | Chạy migration / seed |

### 7.4. Quick Debug Commands

```bash
# Backend: Xem logs realtime
npm run dev 2>&1 | grep -i error

# Backend: Test API với verbose
curl -v http://localhost:5000/api/events

# MongoDB: Kiểm tra indexes
db.users.getIndexes()

# MongoDB: Explain query (xem có dùng index không)
db.users.find({ email: "test@example.com" }).explain()

# Frontend: Console log trong browser
# F12 → Console → Type: console.log('DEBUG:', data)

# React DevTools: Kiểm tra component tree + state
# Install React DevTools extension

# Git: Xem thay đổi gần đây
git diff HEAD~5 --name-only
```

---

## DEBUG REPORT TEMPLATE

```markdown
## 🐛 Debug Report

### Issue: [Mô tả ngắn gọi]

### Severity: [P1-Critical / P2-High / P3-Medium / P4-Low]

### Status: [Open / In Progress / Fixed / Won't Fix]

---

### Evidence
**Error Message:**
```
[Copy exact error]
```

**Stack Trace:**
```
[Copy stack trace]
```

**Steps to Reproduce:**
1. ...
2. ...
3. ...

---

### Root Cause
[Mô tả nguyên nhân gốc trong 1-2 câu]

---

### Fix Applied
```[language]
[Paste fix code]
```

---

### Test After Fix
- [ ] Manual test: [PASS/FAIL]
- [ ] API test: [PASS/FAIL]
- [ ] Regression test: [PASS/FAIL]
- [ ] Edge cases: [PASS/FAIL]

---

### Prevention
- [ ] Added unit test: [Yes/No]
- [ ] Added defensive check: [Yes/No]
- [ ] Updated documentation: [Yes/No]
- [ ] Commit: [hash + message]
```
