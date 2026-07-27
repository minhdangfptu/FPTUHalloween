import ErrorPageView from "./ErrorPageView";

const ErrorPage403 = () => (
  <ErrorPageView
    code="403"
    eyebrow="Access / 403"
    title="Cửa này không dành cho tài khoản của bạn."
    description="Bạn đã đăng nhập, nhưng tài khoản hiện tại không có quyền mở đường dẫn này."
    statusLabel="FORBIDDEN"
    variant="forbidden"
  />
);

export default ErrorPage403;
