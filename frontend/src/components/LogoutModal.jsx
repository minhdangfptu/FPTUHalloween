import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import wtm from "../assets/wtm.png";
import "./LogoutModal.css";

function LogoutModal({ isOpen, onClose, onConfirm, title, description, cancelLabel, confirmLabel, isManagement = false }) {
  const { t } = useTranslation();
  const componentText = (key) => t(`components.${key}`);
  const resolvedTitle = title || (isManagement ? "Đăng xuất" : componentText("logoutTitle"));
  const resolvedDescription = description || (isManagement ? "Bạn đang rời đi<br />Bạn chắc chắn chứ?" : componentText("logoutDescription"));
  const resolvedCancelLabel = cancelLabel || (isManagement ? "Không, đùa chút thôi" : componentText("logoutCancel"));
  const resolvedConfirmLabel = confirmLabel || (isManagement ? "Đúng, đăng xuất cho tôi" : componentText("logoutConfirm"));
  const closeLabel = isManagement ? "Đóng" : componentText("close");

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="logout-modal-close" onClick={onClose} aria-label={closeLabel}>
          <X size={22} />
        </button>
        <img className="logout-modal-logo" src={wtm} alt="FPTU Halloween" />
        <h2 className="logout-modal-title">{resolvedTitle}</h2>
        <p className="logout-modal-desc" dangerouslySetInnerHTML={{ __html: resolvedDescription }} />
        <div className="logout-modal-actions">
          <button type="button" className="logout-modal-cancel" onClick={onClose}>{resolvedCancelLabel}</button>
          <button type="button" className="logout-modal-confirm" onClick={onConfirm}>{resolvedConfirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
