import "@fontsource-variable/geist";
import error404 from "../../assets/errors/404.png";
import ErrorPageView from "./ErrorPageView";

const ErrorPage404 = () => (
  <ErrorPageView
    code="404"
    eyebrow="Request / 404"
    title="Trang này không có trong bản đồ."
    description="Đường dẫn không trỏ tới một trang đang được mở trong FPTU Halloween."
    statusLabel="NOT FOUND"
    illustration={error404}
    illustrationAlt="Minh hoạ chiếc nồi bị lạc giữa vùng màu đỏ"
    variant="not-found"
  />
);

export default ErrorPage404;
