import "@fontsource-variable/geist";
import error404 from "../../assets/errors/404.png";
import ErrorPageView from "./ErrorPageView";
import { useTranslation } from "react-i18next";

const ErrorPage404 = () => { const { t } = useTranslation(); return (
  <ErrorPageView
    code="404"
    eyebrow="Request / 404"
    title={t("pages.errors.notFoundTitle")}
    description={t("pages.errors.notFoundDescription")}
    statusLabel="NOT FOUND"
    illustration={error404}
    illustrationAlt={t("pages.errors.illustrationAlt")}
    variant="not-found"
  />
); };

export default ErrorPage404;
