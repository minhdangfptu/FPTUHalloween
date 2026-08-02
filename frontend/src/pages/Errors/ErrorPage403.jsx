import ErrorPageView from "./ErrorPageView";
import { useTranslation } from "react-i18next";

const ErrorPage403 = () => { const { t } = useTranslation(); return (
  <ErrorPageView
    code="403"
    eyebrow="Access / 403"
    title={t("pages.errors.forbiddenTitle")}
    description={t("pages.errors.forbiddenDescription")}
    statusLabel="FORBIDDEN"
    variant="forbidden"
  />
); };

export default ErrorPage403;
