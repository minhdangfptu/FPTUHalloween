# ============================================================
# LUẬT CODE QUALITY
# Phiên bản: 1.1.0 | Áp dụng cho: TOÀN BỘ dự án
# ============================================================
# BẮT BUỘC tuân thủ mọi quy tắc trong file này.
# Dự án dùng JavaScript (KHÔNG dùng TypeScript).
# Cả backend và frontend đều dùng FUNCTIONAL style — KHÔNG dùng class.
# ============================================================

---

## 1. NAMING CONVENTION (BẮT BUỘC)

### 1.1. Tổng quan:

| Loại                  | Quy tắc      | Ví dụ                     |
|-----------------------|-------------|---------------------------|
| Biến / Hàm / Method   | camelCase   | `getUserById`, `isActive` |
| Component / Hook      | PascalCase  | `UserProfileCard`, `useAuth` |
| Service / Utility     | camelCase   | `userService`, `formatDate` |
| Constant (global)      | UPPER_SNAKE | `MAX_RETRY_COUNT`         |
| File name             | kebab-case  | `user-service.js`, `login-page.jsx` |
| Folder name           | kebab-case  | `api-helpers`, `auth-middleware` |
| CSS/Tailwind class    | kebab-case  | `bg-orange-500`, `mt-4`   |
| Database collection   | PascalCase  | `User`, `Event`, `Ticket`  |
| Environment variables | UPPER_SNAKE | `JWT_SECRET`, `DB_URI`     |

### 1.2. Biến (Variables):

```javascript
// ✅ ĐÚNG
const userId = '123';
const isAuthenticated = true;
const maxRetries = 3;
const userList = [];
const eventData = {};

// ❌ SAI
const user_id = '123';       // KHÔNG dùng snake_case
const is_authenticated = true;
const MaxRetries = 3;        // Biến thường không viết hoa
```

### 1.3. Hàm (Functions):

```javascript
// ✅ ĐÚNG — Verb + Noun, camelCase
function getUserById(id) { ... }
function calculateTotal(items) { ... }
function isValidEmail(email) { ... }
async function fetchEvents(page) { ... }

// ❌ SAI
function GetUserById(id) { ... }      // PascalCase cho hàm
function user_by_id(id) { ... }       // snake_case
function data() { ... }               // Không mô tả
```

### 1.4. Component / Hook:

```jsx
// ✅ ĐÚNG — Functional Component: PascalCase, tên file: kebab-case
// File: user-profile-card.jsx
const UserProfileCard = ({ userId }) => { ... };
export default UserProfileCard;

// File: event-list.jsx
const EventList = ({ events }) => { ... };
export default EventList;

// ✅ Hook: camelCase, bắt đầu bằng "use"
// File: use-auth.js
const useAuth = () => { ... };
export default useAuth;

// ❌ SAI
const userProfileCard = ({ userId }) => { ... };  // camelCase cho component
const Event_list = ({ events }) => { ... };        // snake_case
const UserService = ({ id }) => { ... };           // Component không phải class
```

### 1.5. File naming:

```
✅ ĐÚNG — kebab-case
├── user-service.js
├── auth-middleware.js
├── login-page.jsx
├── event-card.jsx
├── use-auth.js

❌ SAI — KHÔNG dùng PascalCase hay camelCase cho file
├── UserService.js         ❌
├── userService.js        ❌
├── authMiddleware.js     ❌
```

---

## 2. NGUYÊN TẮC DRY (Don't Repeat Yourself)

### 2.1. Trích xuất code trùng lặp:

```javascript
// ❌ SAI — Code trùng lặp
const createEvent = async (req, res) => {
  try {
    const event = await eventService.create(req.body);
    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await eventService.update(req.params.id, req.body);
    return res.status(200).json({ success: true, data: event });
  } catch (error) {
    next(error);
  }
};

// ✅ ĐÚNG — Tách catchAsync helper
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// ✅ Dùng catchAsync — KHÔNG trùng lặp try/catch
const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.create(req.body);
  return res.status(201).json({ success: true, data: event });
});

const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.update(req.params.id, req.body);
  return res.status(200).json({ success: true, data: event });
});
```

### 2.2. Trích xuất constant:

```javascript
// ❌ SAI — Magic numbers
if (user.role === 'admin' && user.permissions.length > 3) {
  setTimeout(() => redirect('/admin'), 3000);
}

// ✅ ĐÚNG — Named constants
const ADMIN_ROLE = 'admin';
const MIN_PERMISSIONS = 3;
const REDIRECT_DELAY_MS = 3000;

if (user.role === ADMIN_ROLE && user.permissions.length >= MIN_PERMISSIONS) {
  setTimeout(() => redirect('/admin'), REDIRECT_DELAY_MS);
}
```

### 2.3. Trích xuất validation logic:

```javascript
// ❌ SAI — Validation trùng lặp
const createUser = async (req, res) => {
  if (!req.body.email || !req.body.email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).json({ error: 'Password too short' });
  }
  // ... tiếp tục
};

// ✅ ĐÚNG — Dùng validation middleware
// validations/userValidation.js
const createSchema = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

// Controller — Gọn gàng
const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  return res.status(201).json({ success: true, data: user });
});
```

---

## 3. NGUYÊN TẮC SOLID (với Functional Style)

### 3.1. Single Responsibility Principle (SRP):

```javascript
// ❌ SAI — Module làm quá nhiều việc
// userService.js — VI PHẠM SRP
const createUser = async (data) => {
  const user = await User.create(data);
  await sendGrid.send({ to: user.email, template: 'welcome' }); // Nên tách
  await logger.log(user.id, 'user_created');                    // Nên tách
};

// ✅ ĐÚNG — Mỗi function chỉ có 1 trách nhiệm
// userService.js
const createUser = async (data) => {
  return User.create(data);
};

// emailService.js
const sendWelcomeEmail = async (user) => {
  return sendGrid.send({ to: user.email, template: 'welcome' });
};

// logger.js
const logUserActivity = async (userId, action) => {
  return logger.log(userId, action);
};
```

### 3.2. Open/Closed Principle (OCP):

```javascript
// ✅ ĐÚNG — Mở rộng bằng strategy pattern (function composition),
// không sửa source code gốc

// validators/index.js — registry của các validator
const validators = {};

const registerValidator = (name, fn) => {
  validators[name] = fn;
};

const validate = (name, data) => {
  if (!validators[name]) {
    throw new Error(`Validator "${name}" not found`);
  }
  return validators[name](data);
};

// Thêm validator mới mà KHÔNG sửa code hiện có
registerValidator('email', (data) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
});

registerValidator('password', (data) => {
  return data && data.length >= 8;
});

// Sử dụng — dễ dàng thêm validator mới
validate('email', 'test@example.com'); // true
validate('password', 'weak');          // false
```

### 3.3. Liskov Substitution Principle (LSP):

```javascript
// ✅ ĐÚNG — Object có cùng shape thì thay thế được nhau (duck typing)
// Không cần kế thừa class

// User factory — tạo user object với cùng interface
const createAdminUser = () => ({
  getName: () => 'Admin',
  getEmail: () => 'admin@example.com',
  getRole: () => 'admin',
});

const createGuestUser = () => ({
  getName: () => 'Guest',
  getEmail: () => 'guest@example.com',
  getRole: () => 'guest',
});

// Hàm nhận user object có thể nhận bất kỳ object nào cùng shape
const printUserInfo = (user) => {
  console.log(user.getName(), user.getEmail(), user.getRole());
};

printUserInfo(createAdminUser()); // Hoạt động
printUserInfo(createGuestUser()); // Hoạt động
```

### 3.4. Interface Segregation Principle (ISP):

```javascript
// ❌ SAI — Module chứa quá nhiều responsibility
const userService = {
  login() { ... },
  logout() { ... },
  getProfile() { ... },
  updateProfile() { ... },
  deleteAccount() { ... },     // Guest không cần
  banUser() { ... },           // Regular user không cần
};

// ✅ ĐÚNG — Tách thành module nhỏ hơn, chỉ export cái cần
// authService.js
const login = async (email, password) => { ... };
const logout = async () => { ... };

// profileService.js
const getProfile = async (userId) => { ... };
const updateProfile = async (userId, data) => { ... };

// adminService.js
const banUser = async (userId) => { ... };
const deleteAccount = async (userId) => { ... };

// RegularUser chỉ import những gì cần
const { login, logout, getProfile } = require('./authService');
```

### 3.5. Dependency Inversion Principle (DIP):

```javascript
// ❌ SAI — Phụ thuộc vào concrete implementation
const userService = {
  async getUser(id) {
    const db = new MongoDB(); // Phụ thuộc cụ thể vào MongoDB
    return db.find({ _id: id });
  }
};

// ✅ ĐÚNG — Inject dependency qua parameter hoặc higher-order function
const createUserService = (db) => ({
  getUser: async (id) => {
    return db.find({ _id: id });
  },
  createUser: async (data) => {
    return db.create('users', data);
  },
});

// Dễ dàng thay đổi database implementation
const mongoDB = { find: ..., create: ... };
const postgresDB = { find: ..., create: ... };

const userService = createUserService(mongoDB);   // Dùng MongoDB
const userService2 = createUserService(postgresDB); // Dùng PostgreSQL
```

---

## 4. KISS (Keep It Simple, Stupid)

### 4.1. Ưu tiên code đơn giản, dễ đọc:

```javascript
// ❌ SAI — Over-engineering
const getFilteredUsers = (users) => {
  return users
    .filter((user) => user.isActive === true)
    .map((user) => {
      return {
        ...user,
        name: user.fullName,
        status: user.isActive ? 'active' : 'inactive',
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
};

// ✅ ĐÚNG — Đơn giản, rõ ràng
const getActiveUsers = (users) => users.filter(u => u.isActive);
```

### 4.2. Early return (Guard Clauses):

```javascript
// ❌ SAI — Nested if/else khó đọc
function processOrder(order) {
  if (order) {
    if (order.items.length > 0) {
      if (order.isPaid) {
        // ... xử lý
      } else {
        return { error: 'Order not paid' };
      }
    } else {
      return { error: 'No items' };
    }
  } else {
    return { error: 'Invalid order' };
  }
}

// ✅ ĐÚNG — Early return
function processOrder(order) {
  if (!order) return { error: 'Invalid order' };
  if (order.items.length === 0) return { error: 'No items' };
  if (!order.isPaid) return { error: 'Order not paid' };

  // Xử lý chính — không cần nested
  return { success: true, order };
}
```

---

## 5. COMMENT & DOCUMENTATION

### 5.1. Comment chỉ khi CẦN THIẾT:

```javascript
// ✅ ĐÚNG — Giải thích "TẠI SAO" không phải "CÁI GÌ"

// Trừ 1 ngày để lấy ngày bắt đầu (inclusive)
const startDate = new Date(endDate);
startDate.setDate(startDate.getDate() - 1);

// Regex kiểm tra strong password: 1 hoa + 1 số + tối thiểu 8 ký tự
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

// ❌ SAI — Comment thừa, không có giá trị
// Duyệt qua từng user
users.forEach(user => { ... });

// Lấy user theo id
const user = await User.findById(id);
```

### 5.2. JSDoc cho function phức tạp:

```javascript
/**
 * Tính tổng số tiền đơn hàng sau khi áp dụng giảm giá.
 *
 * @param {Array} items - Danh sách sản phẩm trong đơn hàng
 * @param {number} discountPercent - Phần trăm giảm giá (0-100)
 * @returns {number} Tổng số tiền sau giảm giá (VNĐ)
 * @throws {Error} Khi discountPercent nằm ngoài khoảng 0-100
 *
 * @example
 * const total = calculateOrderTotal([{ price: 100000, quantity: 2 }], 10);
 * // => 180000
 */
function calculateOrderTotal(items, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount must be between 0 and 100');
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return subtotal * (1 - discountPercent / 100);
}
```

---

## 6. GIT & VERSION CONTROL

### 6.1. Branch naming convention:

```
feature/<ticket-id>-<short-description>
fix/<ticket-id>-<short-description>
chore/<description>
hotfix/<ticket-id>-<short-description>
refactor/<description>

Ví dụ:
feature/HW-42-user-authentication
fix/HW-99-login-redirect-loop
chore/update-node-version
hotfix/HW-100-security-patch
```

### 6.2. Commit message rules:

```
<type>(<scope>): <subject>

[type]: Mô tả loại thay đổi
[scope]: Phạm vi thay đổi (tùy chọn)
[subject]: Mô tả ngắn gọn (50 ký tự, không dấu chấm cuối)
```

```bash
# Ví dụ commit message:
feat(auth): add JWT refresh token mechanism

- Auto-refresh token before expiration
- Store refresh token in httpOnly cookie
- Force logout on refresh token expiry

Closes #HW-42
```

---

## TÓM TẮT — CODE QUALITY CHECKLIST

Trước khi commit bất kỳ code nào:

### Naming:
- [ ] Biến / hàm: `camelCase`
- [ ] Component / Hook: `PascalCase`
- [ ] Service / Utility: `camelCase`
- [ ] File: `kebab-case`
- [ ] Constant: `UPPER_SNAKE_CASE`

### Style:
- [ ] **Functional style — KHÔNG dùng class**
- [ ] Backend: functional controller + functional service
- [ ] Frontend: functional component + custom hook

### DRY:
- [ ] Không copy-paste code
- [ ] Magic numbers được đặt tên constant
- [ ] Logic trùng lặp >= 2 lần → trích xuất

### SOLID:
- [ ] Mỗi function chỉ có 1 trách nhiệm (SRP)
- [ ] Mở rộng bằng composition/strategy, không sửa code gốc (OCP)
- [ ] Object cùng shape thay thế được nhau (LSP — duck typing)
- [ ] Module nhỏ, chỉ chứa function cần thiết (ISP)
- [ ] Inject dependency qua parameter, không hardcode (DIP)

### KISS:
- [ ] Code đơn giản, dễ hiểu
- [ ] Dùng early return thay vì nested if/else
- [ ] Không over-engineering

### Comment:
- [ ] Comment giải thích "TẠI SAO", không phải "CÁI GÌ"
- [ ] Không comment thừa, code đã tự giải thích
