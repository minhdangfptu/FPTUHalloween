# ============================================================
# LUẬT DATABASE — MongoDB / Mongoose
# Phiên bản: 1.0.0 | Áp dụng cho: backend/src/models/
# ============================================================
# BẮT BUỘC tuân thủ mọi quy tắc trong file này khi viết Model.
# ============================================================

---

## 1. SCHEMA CƠ BẢN (BẮT BUỘC)

### 1.1. Mọi Schema phải có `timestamps: true`:

```javascript
// ✅ ĐÚNG — Schema có timestamps
// backend/src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password là bắt buộc'],
      minlength: [8, 'Password phải ít nhất 8 ký tự'],
    },
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
      maxlength: [100, 'Họ tên không quá 100 ký tự'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // ✅ BẮT BUỘC — tự động tạo createdAt, updatedAt
  }
);

module.exports = mongoose.model('User', userSchema);
```

```javascript
// ❌ SAI — Quên timestamps
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  // Không có timestamps!
});
```

### 1.2. Timestamps tự động tạo:

| Trường       | Kiểu     | Mô tả                                   |
|-------------|----------|------------------------------------------|
| `createdAt` | Date     | Thời gian document được tạo            |
| `updatedAt` | Date     | Thời gian document được cập nhật gần nhất |

---

## 2. .lean() KHI ĐỌC DATA (BẮT BUỘC)

### 2.1. Khi nào DÙNG `.lean()`:

**DÙNG `.lean()`** khi chỉ ĐỌC data (SELECT) — trả về plain JavaScript object, **nhanh hơn 2-3 lần** so với Mongoose Document.

```javascript
// ✅ ĐÚNG — Dùng .lean() khi chỉ đọc
async getUserById(id) {
  const user = await User.findById(id).lean();
  return user;
}

async getUsersByRole(role) {
  const users = await User.find({ role }).lean();
  return users;
}

async searchUsers(query) {
  const users = await User.find({
    fullName: { $regex: query, $options: 'i' }
  }).lean();
  return users;
}
```

### 2.2. Khi nào KHÔNG DÙNG `.lean()`:

**KHÔNG dùng `.lean()`** khi cần:
- Cập nhật document (`.save()`)
- Dùng Mongoose middleware/hooks
- Dùng instance methods

```javascript
// ✅ Dùng .lean() khi CHỈ đọc
const users = await User.find({ role: 'user' }).lean();

// ❌ KHÔNG dùng .lean() khi cần cập nhật
const user = await User.findById(id);
// user.save() // chỉ hoạt động với Mongoose Document

// ✅ KHÔNG dùng .lean() khi dùng middleware
const user = await User.findById(id);
user.on('save', () => { /* middleware */ });
```

### 2.3. Performance comparison:

```
find() không lean(): ~50-80ms (trả Mongoose Document, có overhead)
find() có lean():    ~15-25ms (trả plain object, không có method)

→ Dùng .lean() khi chỉ đọc data → TĂNG TỐC 2-3 lần
```

---

## 3. PASSWORD — BẮT BUỘC HASH (CẤM LƯU PLAINTEXT)

### 3.1. Hash password BẮT BUỘC trước khi lưu:

```javascript
// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Lưu HASHED password
    fullName: { type: String, required: true },
  },
  { timestamps: true }
);

// === BẮT BUỘC: Pre-save hook hash password ===
userSchema.pre('save', async function (next) {
  // Chỉ hash password nếu password được thay đổi
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12); // 12 rounds — cân bằng bảo mật & hiệu năng
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method để so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### 3.2. Cách sử dụng comparePassword:

```javascript
// backend/src/services/authService.js
const User = require('../models/User');

async login(email, password) {
  const user = await User.findOne({ email }).lean();

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // So sánh password đã hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  return user;
}
```

### 3.3. KHÔNG BAO GIỜ làm những điều này:

```javascript
// ❌ TUYỆT ĐỐI CẤM:
this.password = password;                    // Lưu plaintext
this.password = Buffer.from(password).toString('base64'); // Cũng không an toàn
const isMatch = user.password === password; // So sánh plaintext
```

---

## 4. OBJECTID & REFERENCE (BẮT BUỘC)

### 4.1. Khai báo Reference bằng ObjectId:

```javascript
// backend/src/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    date: { type: Date, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',           // ✅ Tham chiếu đến collection 'User'
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, 'Tối thiểu 1 người tham gia'],
    },
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'cancelled'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);
```

### 4.2. Truy vấn Population (điền data từ reference):

```javascript
// ✅ Dùng .populate() để lấy data từ collection liên quan
async getEventWithCreator(eventId) {
  const event = await Event.findById(eventId)
    .populate('creator', 'fullName email avatar')  // Chỉ lấy field cần thiết
    .populate('participants', 'fullName avatar')
    .lean();

  return event;
}

// ✅ Populate với điều kiện
async getActiveEvents() {
  const events = await Event.find({ status: 'open' })
    .populate('creator', 'fullName')
    .sort({ date: 1 })
    .lean();

  return events;
}
```

### 4.3. Virtual populate (thay thế array reference lớn):

```javascript
// backend/src/models/Event.js
eventSchema.virtual('participantDetails', {
  ref: 'Participant',
  localField: '_id',
  foreignField: 'event',
  justOne: false,
});

// Cần enable virtuals trong JSON output
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });
```

---

## 5. INDEX (BẮT BUỘC cho truy vấn thường xuyên)

### 5.1. Tạo index cho field thường xuyên truy vấn:

```javascript
// backend/src/models/User.js
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,          // ✅ Index cho truy vấn theo email
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,          // ✅ Index cho lọc theo role
    },
    createdAt: {
      type: Date,
      index: true,          // ✅ Index cho sắp xếp theo thời gian
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound index cho truy vấn phức tạp
userSchema.index({ role: 1, createdAt: -1 });
```

### 5.2. Index cho text search:

```javascript
// backend/src/models/Event.js
const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Text index cho tìm kiếm
eventSchema.index({ title: 'text', description: 'text' });

// Tìm kiếm text
const events = await Event.find(
  { $text: { $search: 'halloween party' } },
  { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } }).lean();
```

---

## 6. CÁC LOẠI SCHEMA THƯỜNG DÙNG

### 6.1. Embedded Document (sub-document):

```javascript
// Model với address embedded
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    addresses: [
      {
        street: String,
        city: String,
        country: { type: String, default: 'Vietnam' },
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);
```

### 6.2. Enum validation:

```javascript
// Dùng enum để giới hạn giá trị
const ticketSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['vip', 'standard', 'early-bird'],
        message: 'Loại vé không hợp lệ: {VALUE}',
      },
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'reserved'],
      default: 'available',
    },
  },
  { timestamps: true }
);
```

### 6.3. Default value:

```javascript
const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    priority: { type: Number, default: 0 },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
```

---

## 7. TRUY VẤN AN TOÀN — CHỐNG INJECTION

### 7.1. Dùng tham số (parameterized) trong query:

```javascript
// ✅ AN TOÀN — Dùng parameterized query (Mongoose tự escape)
const user = await User.findOne({ email: userInput });
const events = await Event.find({ status: { $in: statusArray } });

// ❌ NGUY HIỂM — KHÔNG BAO GIỜ làm thế này với user input
const user = await User.findOne({ email: eval(userInput) });
```

### 7.2. Giới hạn kết quả (prevent memory overload):

```javascript
// ✅ Luôn giới hạn số lượng kết quả khi pagination
const PAGE_SIZE = 20;

async getUsers(page = 1) {
  const skip = (page - 1) * PAGE_SIZE;

  const [users, total] = await Promise.all([
    User.find({})
      .skip(skip)
      .limit(PAGE_SIZE)
      .select('-password')    // KHÔNG bao giờ select password ra
      .lean(),
    User.countDocuments({}),
  ]);

  return {
    data: users,
    pagination: {
      page,
      pageSize: PAGE_SIZE,
      total,
      totalPages: Math.ceil(total / PAGE_SIZE),
    },
  };
}
```

### 7.3. Select trường cần thiết:

```javascript
// ✅ Chỉ select những field cần thiết (giảm bandwidth)
const events = await Event.find({ status: 'open' })
  .select('title date location maxParticipants')
  .lean();

// ✅ Loại bỏ field nhạy cảm bằng .select('-password')
const user = await User.findById(id)
  .select('-password -__v')  // Loại bỏ password và __v
  .lean();
```

---

## 8. TRANSACTION (KHI CẦN ĐẢM BẢO TÍNH NHẤT QUÁN)

### 8.1. Session/Transaction cho multiple operations:

```javascript
// backend/src/services/orderService.js
const mongoose = require('mongoose');

async createOrderWithPayment(orderData, paymentData) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Tạo order
    const order = new Order(orderData);
    await order.save({ session });

    // Cập nhật payment
    const payment = new Payment(paymentData);
    await payment.save({ session });

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return { order, payment };
  } catch (error) {
    // Rollback nếu có lỗi
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
```

---

## 9. SO SÁNH MONGOOSE QUERY METHODS

| Method           | Mục đích                              | Trả về               |
|-----------------|---------------------------------------|----------------------|
| `find()`         | Tìm nhiều documents                  | Array[Mongoose Doc]  |
| `findOne()`      | Tìm 1 document đầu tiên              | Mongoose Doc / null  |
| `findById()`     | Tìm theo _id                         | Mongoose Doc / null  |
| `create()`        | Tạo document mới                     | Mongoose Doc         |
| `findOneAndUpdate()` | Tìm và cập nhật 1 document      | Mongoose Doc         |
| `findByIdAndUpdate()` | Tìm theo _id và cập nhật       | Mongoose Doc         |
| `findByIdAndDelete()` | Tìm theo _id và xóa          | Mongoose Doc         |
| `countDocuments()` | Đếm số documents phù hợp         | Number               |

---

## TÓM TẮT — DATABASE CHECKLIST

Trước khi commit database code, đảm bảo:

- [ ] Schema có `timestamps: true`
- [ ] Đọc data dùng `.lean()` (trừ khi cần cập nhật)
- [ ] Password được hash bằng bcrypt trong pre-save hook
- [ ] Reference dùng `mongoose.Schema.Types.ObjectId` + `ref`
- [ ] Dùng `.populate()` khi cần lấy data từ collection liên quan
- [ ] Index được tạo cho field thường xuyên truy vấn
- [ ] KHÔNG select password ra ngoài (dùng `.select('-password')`)
- [ ] Dùng parameterized query để tránh injection
- [ ] Giới hạn kết quả bằng `.limit()` khi pagination
