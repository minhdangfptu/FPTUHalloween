import React, { useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./QRModal.scss";

const QRModal = ({ isOpen, onClose, value, title, isManagement = false }) => {
  const { t } = useTranslation();
  const componentText = (key) => t(`components.${key}`);
  const resolvedTitle = title || (isManagement ? "Mã QR vé điện tử" : componentText("qrTitle"));
  const closeLabel = isManagement ? "Đóng" : componentText("close");
  const helpText = isManagement
    ? "Đưa mã này cho BTC để kiểm tra vé."
    : componentText("qrHelp");

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !value) return null;
  return (
    <div
      className="qr-modal-overlay"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="qr-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="qr-modal-title"
      >
        <button
          type="button"
          className="qr-modal-close"
          onClick={onClose}
          aria-label={closeLabel}
        >
          <X size={20} />
        </button>
        <h2 id="qr-modal-title">{resolvedTitle}</h2>
        <p>{helpText}</p>
        <div className="qr-modal-code">
          <QRCodeCanvas value={String(value)} size={240} includeMargin />
        </div>
        <code>{value}</code>
      </section>
    </div>
  );
};

export default QRModal;
