# ============================================================
# WORKFLOW: Pre-Deploy
# File: .agent/workflows/pre-deploy.md
# Mục đụng: Checklist dọn dẹp, kiểm tra trước khi push/deploy
# ============================================================
# Áp dụng KHI: Trước khi push code, tạo PR, hoặc deploy
# ============================================================

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Checklist dọn dẹp code](#2-checklist-dọn-dẹp-code)
3. [Checklist bảo mật](#3-checklist-bảo-mật)
4. [Checklist môi trường](#4-checklist-môi-trường)
5. [Checklist build & test](#5-checklist-build--test)
6. [Checklist Git](#6-checklist-git)
7. [Production deployment checklist](#7-production-deployment-checklist)
8. [Rollback plan](#8-rollback-plan)

---

## 1. TỔNG QUAN

### Mục tiêu:

Đảm bảo code đủ chất lượng để deploy lên production bằng cách kiểm tra:

- **Sạch sẽ**: Không có console.log thừa, debug code, TODO chưa xong
- **An toàn**: Không có secret leak, config sai, injection vulnerability
- **Ổn định**: Build thành công, test pass, không break features hiện tại
- **Nhất quán**: Code style đồng bộ, naming convention đúng

### Khi nào chạy checklist:

```
□ Trước khi push lên remote (git push)
□ Trước khi tạo Pull Request
□ Trước khi deploy lên staging
□ Trước khi deploy lên production
□ Sau khi merge PR vào main
```

### Thứ tự kiểm tra:

```
1. Local cleanup     → Code sạch
2. Security scan     → Không leak secret
3. Environment check → Config đúng
4. Build            → Không compile error
5. Test             → Tất cả test pass
6. Git check         → Commit đúng cách
7. Deploy           → Monitoring
```

---

## 2. CHECKLIST DỌN DẸP CODE

### 2.1. Console.log & Debug:

```bash
# Tìm console.log thừa
# Backend
rg "console\.log" backend/src --type js --type ts
rg "console\.error" backend/src --type js --type ts

# Frontend
rg "console\.log" frontend/src --type tsx --type ts
rg "console\.debug" frontend/src --type tsx --type ts

# Đặc biệt: console.log có thể crash SSR hoặc leak data
# ✅ Chỉ giữ lại console.error khi cần log lỗi
# ❌ Xóa hết console.log, console.warn, console.debug
```

```bash
# Tìm debugger statements
rg "debugger" backend/src frontend/src
# → Xóa tất cả debugger statements
```

### 2.2. TODO & FIXME:

```bash
# Tìm TODO chưa xong (cân nhắc xóa hoặc tạo ticket)
rg "TODO" backend/src frontend/src
rg "FIXME" backend/src frontend/src
rg "HACK" backend/src frontend/src
rg "XXX" backend/src frontend/src

# Action:
# - TODO cần fix trước deploy → Fix ngay hoặc tạo ticket
# - TODO feature đang phát triển → Có thể giữ lại với comment rõ ràng
```

### 2.3. Dead code:

```bash
# Tìm import không dùng
# TypeScript/ESLint
npx eslint --ext .ts,.tsx --fix
# Hoặc
npm run lint

# Tìm function không dùng (TypeScript)
npx tsc --noUnusedLocals
npx tsc --noUnusedParameters
```

```typescript
// ❌ DEAD CODE — Xóa
const unusedFunction = () => { ... };

// ❌ UNUSED IMPORT — Xóa
import { UnusedImport } from './module';

// ❌ COMMENTED CODE — Xóa
// const oldCode = 'This is no longer needed';
// oldCode.doSomething();
```

### 2.4. Formatting:

```bash
# Chạy Prettier để format code
# Backend
cd backend && npx prettier --write src/**/*.js

# Frontend
cd frontend && npx prettier --write src/**/*.{ts,tsx}

# Hoặc format tất cả
npx prettier --write "**/*.{js,ts,tsx,json,md}"
```

### 2.5. Checklist cleanup:

```
□ Đã tìm và xóa console.log, console.warn, console.debug?
□ Đã tìm và xóa debugger statements?
□ Đã kiểm tra TODO/FIXME/HACK có cần xử lý?
□ Đã xóa dead code (unused functions, imports)?
□ Đã chạy prettier format?
□ Đã chạy eslint fix?
□ Đã kiểm tra không có commented-out code thừa?
```

---

## 3. CHECKLIST BẢO MẬT

### 3.1. Secret leaks — Cấm tuyệt đối:

```bash
# Tìm hardcoded secrets trong code
rg "JWT_SECRET" backend/src --type js --type ts
rg "MONGO_URI" backend/src --type js --type ts
rg "apiKey" backend/src frontend/src --type js --type ts
rg "sk_live" backend/src frontend/src
rg "password\s*=\s*['\"][^'\"]+['\"]" backend/src

# Tìm .env files trong git
git ls-files | grep "\.env"
git status | grep "\.env"

# Đặc biệt: Kiểm tra không commit .env
```

```bash
# .gitignore phải có:
# Backend
# .env
# .env.local
# .env.*.local

# Frontend
# .env.local
# .env.production.local
```

### 3.2. Sensitive data exposure:

```bash
# Tìm password/secret trong response
rg "password.*res\." backend/src
rg "secret.*res\." backend/src

# Tìm stack trace trong API response
rg "error\.stack" backend/src
# → Production: Không gửi stack trace ra client
```

```javascript
// ❌ NGUY HIỂM — Stack trace trong response
res.status(500).json({ error: error.stack });

// ✅ AN TOÀN — Chỉ gửi message
res.status(500).json({
  success: false,
  message: 'Internal Server Error', // Production
  ...(process.env.NODE_ENV === 'development' && { stack: error.stack }) // Dev only
});
```

### 3.3. SQL/NoSQL Injection check:

```bash
# Tìm eval() với user input
rg "eval\s*\(" backend/src
rg "new\s+Function\s*\(" backend/src

# Tìm string concatenation trong query
rg "\$.*find\s*\(\s*.*\+ " backend/src  # NoSQL injection possibility
```

### 3.4. CORS & Security headers:

```javascript
// backend/src/app.js
// Kiểm tra CORS config
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
};
app.use(cors(corsOptions));

// Security headers ( helmet)
const helmet = require('helmet');
app.use(helmet());
```

### 3.5. Checklist security:

```
□ .env file có trong staging không? (PHẢI KHÔNG)
□ Có hardcoded secret/API key/JWT password trong code không?
□ Stack trace có được ẩn trong production response không?
□ Có eval() hoặc Function() với user input không?
□ CORS được config đúng origins không?
□ Security headers (helmet) được enable không?
□ Input validation có được apply không?
```

---

## 4. CHECKLIST MÔI TRƯỜNG

### 4.1. Environment variables check:

```bash
# Backend: Kiểm tra .env.example
cat backend/.env.example
# → Phải có template cho tất cả biến môi trường

# Frontend: Kiểm tra .env.example
cat frontend/.env.example
# → VITE_API_BASE_URL=http://localhost:5000/api
# → VITE_... (chỉ VITE_ prefix mới exposed ra frontend)
```

### 4.2. Required env vars cho Backend:

```bash
# backend/.env.example
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/halloween2025

# JWT (KHÔNG commit giá trị thật!)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (nếu có)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=your-password

# Frontend URL (cho CORS)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 4.3. Required env vars cho Frontend:

```bash
# frontend/.env.example
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Halloween 2025
# VITE_STRIPE_PUBLIC_KEY=pk_test_xxx (nếu có payment)
```

### 4.4. Database migration check:

```bash
# Kiểm tra có migration cần chạy không
cd backend
npm run migrate:status

# Hoặc
npx prisma migrate status   # Nếu dùng Prisma
```

### 4.5. Checklist environment:

```
□ .env.example có đầy đủ các biến cần thiết?
□ Biến môi trường mới có được thêm vào CI/CD?
□ Database migration có chạy trước deploy?
□ Config staging/production đã được set đúng?
□ Backup database đã được thực hiện (production)?
```

---

## 5. CHECKLIST BUILD & TEST

### 5.1. Backend build:

```bash
cd backend

# 1. Kiểm tra TypeScript (nếu dùng TS)
npx tsc --noEmit
# → Phải không có error

# 2. Chạy linter
npm run lint
# → Phải không có error

# 3. Chạy test
npm test
# → Tất cả test phải pass

# 4. Build (nếu dùng TypeScript)
npm run build
# → Phải tạo được dist/ folder
```

### 5.2. Frontend build:

```bash
cd frontend

# 1. Type check
npx tsc --noEmit
# → Phải không có error

# 2. Lint
npm run lint
# → Phải không có error

# 3. Test
npm test
# → Tất cả test phải pass

# 4. Build production
npm run build
# → Phải tạo được dist/ folder
# → Kiểm tra dist/index.html có tồn tại
```

### 5.3. Kiểm tra build output:

```bash
# Backend
ls -la backend/dist/
# → Phải có compiled JS files

# Frontend
ls -la frontend/dist/
# → Phải có index.html, assets/, static files
```

### 5.4. Smoke test sau build:

```bash
# Backend: Chạy server và test vài endpoint
cd backend
npm start &
sleep 5
curl http://localhost:5000/api/health
# → { "status": "ok" }

# Frontend: Kiểm tra build output
# → Mở dist/index.html bằng static server
npx serve frontend/dist -p 3000
```

### 5.5. Checklist build:

```
□ TypeScript compile không error?
□ ESLint không có error?
□ Unit tests tất cả pass?
□ Backend build thành công?
□ Frontend build thành công?
□ Build output có đầy đủ files?
□ Smoke test endpoint hoạt động?
```

---

## 6. CHECKLIST GIT

### 6.1. Trước khi commit:

```bash
# 1. Xem thay đổi
git status
git diff --stat

# 2. Kiểm tra không commit .env
git ls-files | grep "\.env"
# → Phải trả về rỗng
```

### 6.2. Kiểm tra commit message:

```bash
# Xem commit cuối
git log -1 --format='%s'

# Kiểm tra format: <type>(<scope>): <subject>
# Đúng: feat(auth): add JWT refresh token
# Sai: update code, fix bug, WIP
```

### 6.3. Kiểm tra files trong staging:

```bash
# Xem tất cả files sẽ commit
git diff --cached --name-only

# Đảm bảo không có:
# - .env files
# - node_modules/
# - dist/ build artifacts
# - *.log files
# - .DS_Store
# - credentials files
```

### 6.4. Gitignore verification:

```bash
# Kiểm tra .gitignore có cover các file nhạy cảm
cat .gitignore

# Phải có:
# Backend
node_modules/
dist/
build/
.env
.env.local
.env.*.local
*.log
npm-debug.log*

# Frontend
node_modules/
dist/
build/
.env
.env.local
.env.production.local

# Shared
.DS_Store
*.log
```

### 6.5. Checklist Git:

```
□ Đã kiểm tra git status?
□ Đã kiểm tra git diff?
□ Không có .env files trong staging?
□ Commit message đúng Conventional Commits format?
□ Files trong staging là đúng những gì cần commit?
□ .gitignore đã cover hết file nhạy cảm?
□ Đã chạy git fetch trước khi push?
□ Branch name đúng convention chưa?
```

---

## 7. PRODUCTION DEPLOYMENT CHECKLIST

### 7.1. Trước khi deploy:

```
□ CODE
  □ All tests pass
  □ Build thành công
  □ Smoke test thành công
  □ Security scan pass

□ DATABASE
  □ Migration đã chạy
  □ Backup đã được tạo
  □ Index đã được tạo cho field mới

□ ENVIRONMENT
  □ Production env vars đã set đúng
  □ Secrets đã được rotate nếu cần
  □ ALLOWED_ORIGINS đã update production URL

□ MONITORING
  □ Error tracking (Sentry) đã enable
  □ Logging đã configure
  □ Health check endpoint đã tạo

□ COMMUNICATION
  □ Team đã được thông báo về deploy
  □ Changelog đã được cập nhật
  □ Rollback plan đã sẵn sàng
```

### 7.2. Deployment steps:

```bash
# 1. Tạo production build
cd frontend && npm run build

# 2. Chạy migration
cd backend && npm run migrate:prod

# 3. Deploy backend
# (CI/CD pipeline hoặc manual)
npm run start:prod

# 4. Deploy frontend
# (CI/CD pipeline hoặc manual)
# Upload dist/ folder

# 5. Verify deployment
curl https://api.halloween2025.com/api/health
# → {"status":"ok","timestamp":"..."}

# 6. Kiểm tra frontend
curl https://halloween2025.com
# → 200 OK + HTML content
```

### 7.3. Post-deployment verification:

```bash
# 1. Smoke test critical paths
# - Login flow
# - API endpoints
# - Database reads/writes

# 2. Check error monitoring
# Sentry dashboard
# → Không có spike error mới

# 3. Check logs
# Server logs → Không có error
# Access logs → 2xx status codes

# 4. Check performance
# Response time < 200ms (p95)
# No memory leak
```

### 7.4. Checklist post-deploy:

```
□ Health check endpoint trả về 200 OK?
□ Frontend chính hoạt động?
□ Login/auth flow hoạt động?
□ Các API endpoints chính hoạt động?
□ Không có error spike trong Sentry?
□ Logs không có error mới?
□ Response time bình thường?
□ Team đã confirm feature hoạt động?
```

---

## 8. ROLLBACK PLAN

### 8.1. Khi nào rollback:

```
□ Error rate tăng đột ngột (> 5%)
□ Critical feature không hoạt động
□ Security breach detected
□ Performance degradation nghiêm trọng
□ Database corruption detected
```

### 8.2. Rollback steps:

```bash
# 1. Identify issue
git log --oneline -5
# → Xác định commit gây vấn đề

# 2. Rollback backend (Git)
git revert <commit-hash>
npm run build
pm2 restart backend

# HOẶC: Revert to previous version
git checkout <previous-tag>
npm run build
pm2 restart backend

# 3. Rollback frontend
git checkout <previous-tag>
npm run build
# Deploy previous build

# 4. Database rollback (nếu migration)
npm run migrate:rollback

# 5. Verify rollback
curl http://localhost:5000/api/health
# → Xác nhận working
```

### 8.3. Rollback checklist:

```
□ Issue đã được identify và document?
□ Team đã được thông báo về rollback?
□ Rollback đã được thực hiện thành công?
□ Database đã được rollback (nếu có migration)?
□ Post-rollback verification đã pass?
□ Root cause đã được phân tích?
□ Hotfix đã được lên kế hoạch?
```

---

## PRE-DEPLOY ONE-PAGE CHECKLIST

```
┌──────────────────────────────────────────────────────────┐
│  PRE-DEPLOY CHECKLIST                                   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ☑ CODE CLEANUP                                         │
│    ☐ No console.log/warn/debug in code                  │
│    ☐ No debugger statements                              │
│    ☐ No TODO/FIXME left (or tickets created)            │
│    ☐ No dead code (unused imports/functions)             │
│    ☐ Code formatted (prettier)                          │
│    ☐ Linting passed (eslint)                             │
│                                                          │
│  ☑ SECURITY                                             │
│    ☐ No .env files in git                               │
│    ☐ No hardcoded secrets in code                       │
│    ☐ No stack trace in production response              │
│    ☐ No eval() with user input                          │
│    ☐ CORS configured correctly                          │
│    ☐ Security headers enabled                            │
│                                                          │
│  ☑ ENVIRONMENT                                          │
│    ☐ .env.example updated with new vars                 │
│    ☐ Production env vars configured                      │
│    ☐ Database migration ready                            │
│                                                          │
│  ☑ BUILD & TEST                                         │
│    ☐ TypeScript compile: PASS                           │
│    ☐ ESLint: PASS                                       │
│    ☐ Unit tests: ALL PASS                               │
│    ☐ Backend build: SUCCESS                             │
│    ☐ Frontend build: SUCCESS                            │
│    ☐ Smoke test: PASS                                   │
│                                                          │
│  ☑ GIT                                                  │
│    ☐ git status: clean (no .env)                        │
│    ☐ Commit message: Conventional Commits               │
│    ☐ Branch name: correct convention                    │
│                                                          │
│  ☑ DEPLOYMENT                                           │
│    ☐ Backup created                                     │
│    ☐ Monitoring enabled                                 │
│    ☐ Team notified                                      │
│    ☐ Rollback plan ready                                │
│                                                          │
│  [ ] → TODO  [x] → DONE                                 │
│                                                          │
└──────────────────────────────────────────────────────────┘
```
