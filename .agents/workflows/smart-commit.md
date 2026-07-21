# ============================================================
# WORKFLOW: Smart Commit
# File: .agent/workflows/smart-commit.md
# Mục đích: Quy tắc tạo commit message chuẩn Conventional Commits
# ============================================================
# Áp dụng KHI: User yêu cầu commit code, hoặc trước khi push
# ============================================================

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Conventional Commits Format](#2-conventional-commits-format)
3. [Commit Types](#3-commit-types)
4. [Scope](#4-scope)
5. [Viết Subject hay](#5-viết-subject-đúng-cách)
6. [Body & Footer](#6-body--footer)
7. [Branch Naming](#7-branch-naming)
8. [Git Workflow](#8-git-workflow)
9. [Ví dụ thực tế](#9-ví-dụ-thực-tế)
10. [Commit Checklist](#10-commit-checklist)

---

## 1. TỔNG QUAN

### Tại sao cần Conventional Commits?

```
❌ Commit message không rõ ràng
commit "fix bug"
→ Không biết fix cái gì, ở đâu, tại sao

✅ Commit message có cấu trúc
feat(auth): add JWT refresh token mechanism
→ Biết ngay: thêm tính năng auth, về JWT refresh token
```

### Lợi ích:

- **Searchable**: Tìm kiếm commit theo type, scope, subject
- **Automated Changelog**: Tự động tạo CHANGELOG.md
- **Semantic Versioning**: Xác định PATCH/MINOR/MAJOR version
- **Code Review**: Reviewer hiểu ngay mục đích commit
- **Bisect**: Dễ dàng revert về working state

---

## 2. CONVENTIONAL COMMITS FORMAT

### Format chuẩn:

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Ví dụ:

```
feat(auth): add JWT refresh token mechanism

Implement automatic token refresh before expiration.
Store refresh token in httpOnly cookie for security.
Auto-logout if refresh token also expires.

Closes #HW-42
BREAKING CHANGE: Token expiration changed from 1h to 15m
```

### Quy tắc:

```
1. <type>        : LUÔN luôn viết thường (feat, fix, chore...)
2. (<scope>)     : Viết thường, dùng / cho nested (auth/login, api/user)
3. <subject>     : Viết thường, KHÔNG có dấu chấm cuối
4. <body>        : Tùy chọn, giải thích WHAT và WHY
5. <footer>      : Tùy chọn, references, BREAKING CHANGE
```

---

## 3. COMMIT TYPES

### 3.1. Types chính:

| Type     | Mô tả                           | Gây breaking change? | Version bump |
|----------|--------------------------------|----------------------|-------------|
| `feat`   | Thêm tính năng mới             | **Có** (MINOR ↑)     | 1.x → 1.x+1 |
| `fix`    | Sửa bug                        | Không (PATCH ↑)      | 1.1 → 1.1.1 |
| `perf`   | Cải thiện hiệu năng            | Không (PATCH ↑)      | 1.1 → 1.1.1 |
| `refactor` | Viết lại code không đổi logic | Không (PATCH ↑)      | 1.1 → 1.1.1 |

### 3.2. Types phụ:

| Type        | Mô tả                                      | Version bump |
|-------------|-------------------------------------------|-------------|
| `docs`      | Cập nhật tài liệu (README, CHANGELOG)      | None        |
| `style`     | Format code, không đổi logic              | None        |
| `test`      | Thêm/sửa unit test                        | None        |
| `build`     | Thay đổi build system, dependencies      | None        |
| `ci`        | Thay đổi CI/CD pipeline                   | None        |
| `chore`     | Cập nhật config, không ảnh hưởng code     | None        |
| `revert`    | Revert commit trước đó                   | None        |

### 3.3. Decision tree — Chọn type đúng:

```
Chỉnh sửa có THAY ĐỔI LOGIC?
│
├─ CÓ → Có THÊM tính năng mới?
│   ├─ CÓ → `feat`
│   └─ KHÔNG → Sửa bug?
│       ├─ CÓ → `fix`
│       └─ KHÔNG → Thay đổi để TỐI ƯU?
│           ├─ CÓ → `perf`
│           └─ KHÔNG → Viết lại code CŨ?
│               ├─ CÓ → `refactor`
│               └─ KHÔNG → [Cần xem lại mục đích]
│
└─ KHÔNG → (Chỉ thay đổi formatting, không đổi logic)
    ├─ Thêm test? → `test`
    ├─ Cập nhật docs? → `docs`
    ├─ Thay đổi build/CI? → `build` / `ci`
    ├─ Thay đổi config? → `chore`
    └─ Format code? → `style`
```

---

## 4. SCOPE

### 4.1. Scope là gì?

Scope xác định **phạm vi** của thay đổi — thường là module, feature, hoặc layer.

### 4.2. Common scopes cho dự án MERN:

```
Backend:
  auth, user, event, notification, ticket, payment, upload, api

Frontend:
  login, register, dashboard, event-card, modal, form, layout

Shared:
  database, middleware, validation, utils, types, config, ci
```

### 4.3. Nested scope (dùng `/`):

```
feat(auth/login): add OAuth2 Google login
fix(api/events): correct pagination offset
refactor(database/user-model): apply lean() optimization
```

### 4.4. Khi nào KHÔNG dùng scope:

```
- Thay đổi nhỏ, không thuộc module cụ thể
- Ví dụ: "update gitignore", "bump node version"
→ Dùng: `chore: update node version to 20.x`
→ KHÔNG: `chore(node): update node version` (scope không cần thiết)
```

---

## 5. VIẾT SUBJECT ĐÚNG CÁCH

### 5.1. Quy tắc:

```
✅ VIẾT ĐÚNG:
- Viết thường toàn bộ
- Không có dấu chấm cuối
- Imperative mood (mệnh lệnh)
- Tối đa 50 ký tự
- Mô tả NGẮN GỌN những gì thay đổi

❌ VIẾT SAI:
- "Added feature X" (past tense)
- "Adding feature X" (present progressive)
- "Feature X was added" (passive voice)
```

### 5.2. Imperative Mood vs Past Tense:

```
Imperative (ĐÚNG - như ra lệnh cho AI làm điều đó):
  "add login form validation"
  "fix 500 error on user registration"
  "update JWT token expiry"
  "remove unused import"

Past Tense (SAI - như kể chuyện):
  "added login form validation"
  "fixed 500 error on user registration"
  "updated JWT token expiry"
  "removed unused import"
```

### 5.3. So sánh:

| ❌ Sai (Past Tense)         | ✅ Đúng (Imperative)         |
|----------------------------|-----------------------------|
| `added user authentication` | `add user authentication`   |
| `fixed login redirect bug` | `fix login redirect bug`    |
| `updated error messages`   | `update error messages`     |
| `removed unnecessary code`   | `remove unnecessary code`   |
| `changed API response`      | `change API response`       |

### 5.4. Subject template:

```
[verb] + [what] + [where/condition]

Ví dụ:
add JWT refresh token to auth module
fix 401 redirect loop on login page
update error handling in user service
remove console.log from production code
implement pagination for event list
optimize N+1 query in notification fetch
```

### 5.5. Checklist Subject:

```
□ Viết thường toàn bộ?
□ Không có dấu chấm cuối?
□ Dùng imperative mood (add, fix, update, remove...)?
□ Tối đa 50 ký tự?
□ Mô tả WHAT thay đổi, không phải WHY?
□ Có verb đầu tiên?
```

---

## 6. BODY & FOOTER

### 6.1. Body (tùy chọn):

Dùng để giải thích **WHAT** thay đổi và **WHY** — không phải HOW (code đã tự giải thích HOW).

```
feat(auth): add JWT refresh token mechanism

- Implement auto-refresh before token expiration (5 min before)
- Store refresh token in httpOnly cookie (XSS protection)
- Force logout if both tokens expire
- Retry original request after successful refresh

This improves security by reducing token lifetime exposure.
```

### 6.2. Footer (tùy chọn):

Dùng cho references và breaking changes.

```
Closes #HW-42                    # Đóng ticket
Refs #HW-30                      # Tham chiếu ticket liên quan
See-also: /docs/api.md          # Tham chiếu tài liệu

BREAKING CHANGE: Token expiration changed from 1h to 15m
All existing tokens will be invalidated. Users must re-login.
```

### 6.3. Breaking Change:

```
feat(auth)!: change token expiry from 1h to 15m

OR

feat(auth): change token expiry from 1h to 15m

BREAKING CHANGE: All existing tokens will be invalidated.
Users must re-login after deploying this change.
```

---

## 7. BRANCH NAMING

### 7.1. Format:

```
<type>/<ticket-id>-<short-description>

Ví dụ:
feature/HW-42-jwt-refresh-token
fix/HW-99-login-redirect-loop
chore/update-node-version
hotfix/HW-100-security-patch
refactor/extract-auth-service
docs/update-api-documentation
```

### 7.2. Branch type:

| Type     | Dùng khi                              | Ví dụ                    |
|----------|---------------------------------------|--------------------------|
| `feature/` | Thêm tính năng mới                  | `feature/HW-42-auth`     |
| `fix/`     | Sửa bug                              | `fix/HW-99-login-bug`    |
| `chore/`   | Cập nhật config, dependency          | `chore/update-deps`      |
| `hotfix/`  | Fix gấp trên production              | `hotfix/HW-100-patch`    |
| `refactor/`| Viết lại code không đổi logic        | `refactor/user-service`   |
| `docs/`    | Cập nhật tài liệu                   | `docs/update-readme`     |

### 7.3. Quy tắc:

```
✅ ĐÚNG:
- feature/HW-42-add-jwt-refresh
- fix/HW-99-login-redirect
- chore/update-typescript

❌ SAI:
- HW-42-jwt-refresh       (thiếu type prefix)
- new-feature             (thiếu ticket ID)
- bug_fix                 (dùng underscore thay vì hyphen)
- Feature/HW-42-auth      (Feature viết hoa)
```

---

## 8. GIT WORKFLOW

### 8.1. Quy trình commit chuẩn:

```bash
# 1. Check trạng thái
git status

# 2. Xem thay đổi
git diff

# 3. Thêm file vào staging
git add <file>           # Thêm từng file
git add .                # Thêm tất cả

# 4. Commit với message
git commit -m "feat(auth): add JWT refresh token mechanism"

# 5. Push
git push origin feature/HW-42-jwt-refresh
```

### 8.2. Amend commit (chỉ dùng cho LOCAL commit CHƯA push):

```bash
# Sửa commit message cuối
git commit --amend -m "feat(auth): add JWT refresh token mechanism"

# Thêm file vào commit cuối (CHƯA push)
git add forgotten-file.js
git commit --amend --no-edit
```

### 8.3. Interactive rebase (dọn dẹp commit):

```bash
# Gộp 3 commit cuối thành 1
git rebase -i HEAD~3

# Trong editor:
# pick abc1234 feat(auth): add login form
# pick def5678 fix(auth): update validation
# pick ghi9012 docs(auth): update README
#
# Sửa thành:
# pick abc1234 feat(auth): add login form
# s   def5678 fix(auth): update validation
# s   ghi9012 docs(auth): update README
#
# Viết commit message mới khi thoát editor
```

### 8.4. Revert commit:

```bash
# Revert commit cuối
git revert HEAD

# Revert commit cụ thể
git revert abc1234

# Commit message sẽ tự động được tạo:
# "Revert "feat(auth): add JWT refresh token mechanism"
```

---

## 9. VÍ DỤ THỰC TẾ

### 9.1. Feature commit:

```bash
git commit -m "feat(auth): add JWT refresh token mechanism

- Auto-refresh token before expiration (5 min before)
- Store refresh token in httpOnly cookie
- Force logout if refresh also fails
- Retry original request after successful refresh

Closes #HW-42"
```

### 9.2. Bug fix commit:

```bash
git commit -m "fix(auth): prevent redirect loop on expired token

When token expires during page navigation, the app was stuck
in a redirect loop between dashboard and login.

- Clear localStorage tokens on 401
- Only redirect if not already on login page
- Add guard to prevent multiple redirects

Closes #HW-99"
```

### 9.3. Refactor commit:

```bash
git commit -m "refactor(database): apply .lean() to read-only queries

Replace Mongoose Document with plain JS objects for all
read-only queries to improve performance 2-3x.

Changed files:
- userService.js (5 queries)
- eventService.js (8 queries)
- notificationService.js (3 queries)"
```

### 9.4. Performance commit:

```bash
git commit -m "perf(event): optimize N+1 query with populate

Before: 1 + N queries (N = number of events)
After: 2 queries (events + users)

Replaced manual forEach + findById loop with populate()
which does a single $lookup aggregation on MongoDB.

Closes #HW-55"
```

### 9.5. Chore commit:

```bash
git commit -m "chore: update Node.js to v20 LTS

- Bump from v18 to v20
- Update engines field in package.json
- Update Dockerfile base image"
```

### 9.6. Hotfix commit:

```bash
git commit -m "hotfix(auth): invalidate all sessions on password change

Security fix: When user changes password, all existing
JWT tokens are now invalidated immediately.

- Add passwordChangedAt field to User schema
- Check token.iat < user.passwordChangedAt on every request

Closes #HW-100"
```

### 9.7. Breaking change commit:

```bash
git commit -m "feat(api)!: change event creation payload

BREAKING CHANGE: 'maxParticipants' is now required.
Default unlimited participants behavior removed.

New payload:
{
  "title": "Halloween Party",
  "date": "2025-10-31",
  "maxParticipants": 100  // Required
}

Migration: Run 'npm run migrate:enforce-participants'

Closes #HW-88"
```

---

## 10. COMMIT CHECKLIST

### Trước khi commit:

```
□ Đã chạy lint (eslint/prettier) chưa?
□ Đã chạy test chưa? (npm test)
□ File .env có trong staging không? (PHẢI KHÔNG)
□ Có console.log/debug thừa không? (Xóa hết)
□ Code có hoạt động bình thường không?
□ Staging có đúng files cần commit không?
□ Commit message đúng format chưa?
□ Branch name đúng convention chưa?
```

### Commit message checklist:

```
□ Type viết thường? (feat, fix, chore...)
□ Có scope? (auth, user, event...)
□ Subject viết thường, không dấu chấm cuối?
□ Dùng imperative mood?
□ Subject tối đa 50 ký tự?
□ Có ticket reference nếu có ticket? (Closes #HW-xx)
□ Breaking change có đánh dấu (!: hoặc BREAKING CHANGE)?
```

### Sau khi commit:

```
□ Git log --oneline xem message đúng chưa?
□ Git push lên remote?
□ Tạo PR nếu cần?
□ Gửi notification cho team?
```

---

## QUICK REFERENCE CARD

```
╔════════════════════════════════════════════════════════════╗
║  CONVENTIONAL COMMITS QUICK REFERENCE                     ║
╠════════════════════════════════════════════════════════════╣
║  FORMAT: <type>(<scope>): <subject>                      ║
║                                                            ║
║  TYPES:                                                   ║
║    feat  = Thêm tính năng  → MINOR version ↑             ║
║    fix   = Sửa bug        → PATCH version ↑             ║
║    perf  = Tối ưu hiệu năng                             ║
║    refactor = Viết lại code                              ║
║    docs  = Cập nhật tài liệu                             ║
║    style = Format code                                    ║
║    test  = Thêm/sửa test                                 ║
║    build = Build system, deps                             ║
║    ci    = CI/CD pipeline                                 ║
║    chore = Config, maintenance                             ║
║    revert = Revert commit                                  ║
║                                                            ║
║  SUBJECT:                                                 ║
║    • Viết thường toàn bộ                                  ║
║    • Imperative mood (add, fix, update, remove)           ║
║    • Không dấu chấm cuối                                  ║
║    • Tối đa 50 ký tự                                      ║
║                                                            ║
║  SCOPE (examples):                                        ║
║    auth, auth/login, user, event, api/events, database    ║
║                                                            ║
║  FOOTER:                                                  ║
║    Closes #HW-42    → Đóng ticket                        ║
║    Refs #HW-30      → Tham chiếu ticket                  ║
║    BREAKING CHANGE: → Breaking change                     ║
╚════════════════════════════════════════════════════════════╝
```
