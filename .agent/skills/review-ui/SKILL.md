# ============================================================
# SKILL: UI/UX Review
# File: .agent/skills/review-ui/SKILL.md
# Mục đích: Check Responsive, đánh giá UX/UI, tính nhất quán CSS
# ============================================================

---

## MỤC LỤC

1. [Tổng quan](#1-tổng-quan)
2. [Quy trình Review UI/UX 5 bước](#2-quy-trình-review-uiux-5-bước)
3. [Responsive Design Checklist](#3-responsive-design-checklist)
4. [UX Principles Checklist](#4-ux-principles-checklist)
5. [Visual Consistency Checklist](#5-visual-consistency-checklist)
6. [Accessibility Checklist](#6-accessibility-checklist)
7. [Format báo cáo UI Review](#7-format-báo-cáo-ui-review)

---

## 1. TỔNG QUAN

### Mục tiêu:
- Đảm bảo giao diện responsive trên mọi thiết bị
- Cải thiện trải nghiệm người dùng (UX)
- Đảm bảo tính nhất quán về màu sắc, spacing, typography
- Kiểm tra accessibility (a11y) cơ bản

### Phạm vi review:
- React components (TSX/JSX)
- Tailwind CSS classes
- Responsive breakpoints
- Interactive elements (button, form, modal)
- Loading & error states

---

## 2. QUY TRÌNH REVIEW UI/UX 5 BƯỚC

### Bước 1: Xác định component/page cần review

```
1. Đọc code component
2. Xác định các element chính (header, card, button, form, modal)
3. Xác định responsive breakpoints cần check
4. Lên danh sách các interactions (click, hover, focus, loading)
```

### Bước 2: Check Responsive Design (Section 3)

### Bước 3: Check UX Principles (Section 4)

### Bước 4: Check Visual Consistency (Section 5)

### Bước 5: Check Accessibility (Section 6)

### Bước 6: Viết báo cáo (Section 7)

---

## 3. RESPONSIVE DESIGN CHECKLIST

### 3.1. Breakpoints cơ bản

| Breakpoint      | Tailwind prefix | Screen width | Thiết bị              |
|----------------|-----------------|-------------|------------------------|
| Extra small    | (default)      | < 640px     | Mobile                 |
| Small          | `sm:`           | ≥ 640px     | Large phone, tablet    |
| Medium         | `md:`           | ≥ 768px     | Tablet                 |
| Large          | `lg:`           | ≥ 1024px    | Laptop                 |
| Extra large    | `xl:`           | ≥ 1280px    | Desktop                |
| 2XL            | `2xl:`          | ≥ 1536px    | Large desktop          |

### 3.2. Layout responsive đúng cách

```tsx
// ✅ ĐÚNG — Responsive grid layout
// frontend/src/components/EventCard.tsx
const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="
      w-full              {/* Mobile: full width */}
      sm:w-1/2            {/* sm: 2 columns */}
      md:w-1/3             {/* md: 3 columns */}
      lg:w-1/4             {/* lg: 4 columns */}
      p-4
    ">
      {/* Card content */}
    </div>
  );
};
```

```tsx
// ❌ SAI — Không responsive
<div className="w-1/4">  {/* Chỉ có desktop, mobile tràn! */}
  <EventCard />
</div>
```

### 3.3. Typography responsive

```tsx
// ✅ ĐÚNG — Font size thay đổi theo breakpoint
<h1 className="
  text-2xl             {/* Mobile: 24px */}
  md:text-4xl          {/* md: 36px */}
  lg:text-5xl          {/* lg: 48px */}
  font-bold
">
  Halloween 2025
</h1>

// ❌ SAI — Font quá nhỏ trên mobile
<h1 className="text-5xl font-bold">  {/* Mobile: quá to, tràn! */}
  Halloween 2025
</h1>
```

### 3.4. Spacing responsive

```tsx
// ✅ ĐÚNG — Padding thay đổi theo breakpoint
<div className="
  p-4              {/* Mobile: 16px */}
  md:p-8           {/* md: 32px */}
  lg:p-12          {/* lg: 48px */}
">
  Content
</div>

// ✅ ĐÚNG — Margin thay đổi
<button className="
  w-full             {/* Mobile: full width */}
  sm:w-auto           {/* sm: auto width */}
  px-4 py-2
">
  Submit
</button>
```

### 3.5. Hidden/Visible theo breakpoint

```tsx
// ✅ Ẩn element trên mobile, hiện trên desktop
<div className="hidden md:block">
  <Sidebar />
</div>

// ✅ Ẩn element trên desktop, hiện trên mobile
<div className="block md:hidden">
  <MobileMenu />
</div>
```

**Checklist Responsive:**
- [ ] Layout dùng `grid` / `flex` với responsive prefix (`sm:`, `md:`, `lg:`)?
- [ ] Font size có thay đổi theo breakpoint không?
- [ ] Padding/margin có điều chỉnh theo kích thước màn hình không?
- [ ] Trên mobile, các element có bị tràn (overflow) không?
- [ ] Button/input trên mobile có đủ lớn để tap không (ít nhất 44x44px)?

---

## 4. UX PRINCIPLES CHECKLIST

### 4.1. Loading States (BẮT BUỘC)

```tsx
// ❌ SAI — Chỉ hiện spinning trống
const { isLoading } = useApi();
if (isLoading) return <div>Loading...</div>; // Quá đơn giản!

// ❌ SAI — Hiện spinner trong khi nội dung load
{isLoading && <Spinner />}
{data && <Content />}

// ✅ ĐÚNG — Skeleton loading giữ layout
const { isLoading } = useApi();
if (isLoading) return <EventListSkeleton />; // Giữ layout

// ✅ ĐÚNG — Skeleton component
const EventListSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 h-48 rounded-t-lg" />
        <div className="p-4 space-y-2">
          <div className="bg-gray-200 h-4 w-3/4 rounded" />
          <div className="bg-gray-200 h-4 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);
```

**Checklist Loading:**
- [ ] Mọi API call có loading state không?
- [ ] Loading state hiện skeleton chứ không phải spinner trống?
- [ ] Layout không bị nhảy (jump) khi loading xong?

---

### 4.2. Error States (BẮT BUỘC)

```tsx
// ❌ SAI — Không xử lý error
const { data } = useApi();
return <div>{data.map(...)}</div>; // Crash nếu error!

// ✅ ĐÚNG — Error boundary + error state
const { data, error, isLoading } = useApi();

if (isLoading) return <Skeleton />;
if (error) return <ErrorState message={error.message} onRetry={refetch} />;
return <Content data={data} />;

// ✅ Error State Component
const ErrorState: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 text-5xl mb-4">⚠️</div>
    <h3 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
    >
      Thử lại
    </button>
  </div>
);
```

**Checklist Error:**
- [ ] Mọi API call có error state không?
- [ ] Error hiển thị message rõ ràng cho user không?
- [ ] Error state có nút "Thử lại" (Retry) không?
- [ ] 404 page tồn tại và thân thiện không?

---

### 4.3. Empty States

```tsx
// ❌ SAI — Để trống khi không có data
const { data } = useApi();
if (!data?.length) return null; // Trang trắng!

// ✅ ĐÚNG — Empty state với illustration
const EmptyState: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-6xl mb-4">🎃</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500 mb-6">{description}</p>
    <Link
      to="/events/create"
      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
    >
      Tạo sự kiện đầu tiên
    </Link>
  </div>
);
```

**Checklist Empty State:**
- [ ] Danh sách rỗng có Empty State component không?
- [ ] Empty State có hành động gợi ý cho user không?
- [ ] Icon/illustration phù hợp với ngữ cảnh không?

---

### 4.4. Form UX

```tsx
// ✅ ĐÚNG — Form với validation inline, disabled khi submitting
const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
} = useForm();

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input
      {...register('email')}
      className={errors.email ? 'border-red-500' : 'border-gray-300'}
    />
    {errors.email && (
      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
    )}

    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-orange-500 disabled:opacity-50"
    >
      {isSubmitting ? 'Đang xử lý...' : 'Đăng nhập'}
    </button>
  </form>
);
```

**Checklist Form UX:**
- [ ] Validation error hiển thị ngay bên dưới field (inline)?
- [ ] Button bị disabled khi đang submit để tránh double-submit?
- [ ] Required fields có dấu `*` hoặc label rõ ràng không?
- [ ] Input có `placeholder` hữu ích không?

---

### 4.5. Navigation & Flow

```tsx
// ✅ ĐÚNG — Loading redirect với preserve intended destination
const LoginPage: React.FC = () => {
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from || '/dashboard';

  return (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Trong ProtectedRoute:
const from = (location.state as { from?: Location })?.from;
return <Navigate to={from?.pathname || '/dashboard'} replace />;
```

**Checklist Navigation:**
- [ ] Redirect sau login quay lại trang trước đó không?
- [ ] Breadcrumb có cho page cần thiết không?
- [ ] Back button hoạt động đúng không?
- [ ] Toast notification cho action thành công/thất bại có không?

---

## 5. VISUAL CONSISTENCY CHECKLIST

### 5.1. Color System (Tailwind)

```tsx
// ❌ KHÔNG NHẤT QUÁN — Màu tự chọn không có trong theme
<button className="bg-[#ff6b35] text-white">  {/* Màu không có trong palette! */}

// ✅ NHẤT QUÁN — Dùng màu từ Tailwind config
<button className="bg-orange-500 text-white hover:bg-orange-600">
  Primary Button
</button>

// ✅ Dùng CSS custom property cho brand colors
<button className="bg-primary text-white">
  Primary Button
</button>
```

**Checklist Color:**
- [ ] Chỉ dùng màu từ Tailwind palette hoặc CSS custom property?
- [ ] Primary/Secondary/Accent color nhất quán trên toàn app?
- [ ] Màu error (đỏ), success (xanh), warning (vàng) nhất quán?
- [ ] Hover/active state có thay đổi màu rõ ràng không?

---

### 5.2. Spacing & Sizing

```tsx
// ❌ KHÔNG NHẤT QUÁN — Spacing tùy ý
<div className="p-3">...</div>
<div className="p-5">...</div>
<div className="p-6">...</div>

// ✅ NHẤT QUÁN — Dùng spacing scale cố định
<div className="p-4">...</div>    {/* 16px */}
<div className="p-4">...</div>    {/* 16px */}
<div className="p-4">...</div>    {/* 16px */}
```

**Checklist Spacing:**
- [ ] Spacing dùng Tailwind scale (p-1, p-2, p-4...)?
- [ ] Margin giữa các section nhất quán?
- [ ] Padding trong card/component nhất quán?

---

### 5.3. Typography Scale

```tsx
// ✅ NHẤT QUÁN — Heading hierarchy
<h1 className="text-3xl md:text-5xl font-bold">Tiêu đề lớn</h1>
<h2 className="text-2xl md:text-3xl font-semibold">Tiêu đề phụ</h2>
<h3 className="text-xl md:text-2xl font-semibold">Section heading</h3>
<p className="text-base text-gray-600">Body text</p>
<span className="text-sm text-gray-500">Caption</span>

// ❌ KHÔNG NHẤT QUÁN — Font size tùy ý
<h1 style={{ fontSize: '28px' }}>Tiêu đề</h1>
<p style={{ fontSize: '14px' }}>Body</p>
```

**Checklist Typography:**
- [ ] Heading hierarchy (h1 → h2 → h3) rõ ràng?
- [ ] Font size dùng Tailwind classes (text-sm, text-base, text-lg...)?
- [ ] Line height (leading-) phù hợp với font size?
- [ ] Font weight (font-light, font-normal, font-bold) nhất quán?

---

### 5.4. Border Radius & Shadows

```tsx
// ✅ NHẤT QUÁN — Border radius
<button className="rounded-lg">       {/* 8px — button */}
<Card className="rounded-xl">         {/* 12px — card */}
<input className="rounded-md">         {/* 6px — input */}

// ✅ NHẤT QUÁN — Shadow
<Card className="shadow-md">           {/* Card shadow */}
<Modal className="shadow-2xl">         {/* Modal shadow */}
<Button className="shadow-sm">         {/* Button shadow */}
```

---

## 6. ACCESSIBILITY CHECKLIST

### 6.1. Semantic HTML

```tsx
// ❌ SAI — Dùng div cho interactive element
<div onClick={handleClick} className="cursor-pointer">
  Click me
</div>

// ✅ ĐÚNG — Dùng semantic element
<button onClick={handleClick}>
  Click me
</button>

// ✅ Dùng nav thay vì div
<nav className="flex items-center">
  <a href="/" className="font-bold">Home</a>
  <a href="/about">About</a>
</nav>
```

**Checklist Semantic:**
- [ ] Dùng `<button>` cho click action, không dùng `<div>`?
- [ ] Dùng `<a>` cho navigation link?
- [ ] Dùng `<nav>`, `<header>`, `<main>`, `<footer>` đúng cách?
- [ ] Form inputs có `<label>` associated không?

---

### 6.2. ARIA Attributes

```tsx
// ✅ Icon button có aria-label
<button
  onClick={handleDelete}
  aria-label="Xóa sự kiện"
  className="p-2 text-red-500"
>
  <TrashIcon />
</button>

// ✅ Loading state có aria-busy
<div aria-busy={isLoading} className="grid ...">
  {events.map(event => <EventCard key={event.id} event={event} />)}
</div>

// ✅ Error message có aria-live
<div aria-live="polite" className="text-red-500">
  {error && <p>{error.message}</p>}
</div>
```

**Checklist ARIA:**
- [ ] Icon button có `aria-label` không?
- [ ] Loading state có `aria-busy` không?
- [ ] Error message có `aria-live` không?
- [ ] Modal/Dialog có `role="dialog"` và `aria-modal="true"` không?

---

### 6.3. Color Contrast

```tsx
// ❌ SAI — Contrast quá thấp (dưới 4.5:1)
<p className="text-gray-400 bg-gray-200">Text khó đọc</p>

// ✅ ĐÚNG — Contrast đủ (≥ 4.5:1 cho text nhỏ, ≥ 3:1 cho text lớn)
<p className="text-gray-700 bg-white">Text dễ đọc</p>
```

---

### 6.4. Keyboard Navigation

```tsx
// ✅ Focus visible
<button
  className="focus:outline-none focus:ring-2 focus:ring-orange-500"
>
  Nút có focus ring
</button>

// ✅ Tab order hợp lý
<div className="flex flex-col gap-2">
  <input placeholder="Email" tabIndex={1} />
  <input placeholder="Password" tabIndex={2} />
  <button tabIndex={3}>Submit</button>
</div>
```

**Checklist Keyboard:**
- [ ] Mọi interactive element focus được (tab) không?
- [ ] Focus ring hiển thị rõ ràng (custom `focus:ring-*`)?
- [ ] Modal trap focus bên trong không cho ra ngoài?
- [ ] Keyboard user có thể đóng modal bằng `Escape` không?

---

## 7. FORMAT BÁO CÁO UI REVIEW

```markdown
## 🎨 UI/UX Review Report

### Page/Component: `EventListPage.tsx`

#### 🔴 Vấn đề nghiêm trọng (Phải fix)

| # | Vị trí | Mô tả | Ảnh minh họa |
|---|--------|--------|--------------|
| 1 | EventCard | Mobile: card bị tràn, text không xuống dòng | (screenshot) |
| 2 | LoginForm | Button "Đăng nhập" không bị disabled khi submitting → double-submit | (screenshot) |

#### 🟡 Cải thiện UX (Nên fix)

| # | Vị trí | Mô tả | Đề xuất |
|---|--------|--------|---------|
| 1 | EventList | Loading state chỉ hiện spinner, không có skeleton | Thêm skeleton loader |
| 2 | SearchBar | Placeholder quá chung chung ("Search...") | Đổi thành "Tìm sự kiện Halloween..." |
| 3 | ErrorState | Error message hiện tiếng Anh, không nhất quán | Đổi sang tiếng Việt |

#### 🟡 Nhất quán CSS (Style fix)

| # | Vị trí | Mô tả | Đề xuất |
|---|--------|--------|---------|
| 1 | Button | Dùng `bg-[#FF6600]` thay vì `bg-orange-500` | Thống nhất dùng Tailwind color |
| 2 | Card | Card này `rounded-lg`, card kia `rounded-xl` | Thống nhất `rounded-xl` |
| 3 | Padding | Section này `p-6`, section kia `p-4` | Thống nhất `p-6` |

#### 🟢 Tốt (Giữ nguyên)

- EventCard: Hover effect rõ ràng ✓
- EmptyState: Có illustration + CTA button ✓
- Responsive: 3 breakpoints (mobile/tablet/desktop) hoạt động tốt ✓
- Accessibility: Button có aria-label ✓

### Tổng kết

- 🔴 Vấn đề nghiêm trọng: 2
- 🟡 Cần cải thiện: 3
- ✅ Đạt: 4

**Hành động:** Fix vấn đề nghiêm trọng trước khi merge.
```

---

## CÁCH SỬ DỤNG SKILL NÀY

### Khi nào gọi skill:
- User gõ: `"review UI"`, `"check design"`, `"check responsive"`, `"đánh giá giao diện"`
- Sau khi viết xong component/page
- Trước khi merge UI PR

### Cách thực hiện:
1. Đọc toàn bộ skill (file này)
2. Xác định page/component cần review
3. Chạy 5 bước review
4. Viết báo cáo theo format Section 7
5. Đề xuất code fix cụ thể cho từng vấn đề
