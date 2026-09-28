import React from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import wtmDark from "../assets/wtm.png";
import wtmLight from "../assets/wtm_lightmode.png";
import ThemeAsset from "./ThemeAsset";
import "./LogoutModal.css";

function LogoutModal({ isOpen, onClose, onConfirm, title, description, cancelLabel, confirmLabel }) {
  const { t } = useTranslation();
  const componentText = (key) => t(`components.${key}`);
  const resolvedTitle = title || componentText("logoutTitle");
  const resolvedDescription = description || componentText("logoutDescription");
  const resolvedCancelLabel = cancelLabel || componentText("logoutCancel");
  const resolvedConfirmLabel = confirmLabel || componentText("logoutConfirm");
  const closeLabel = componentText("close");

  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="logout-modal-close" onClick={onClose} aria-label={closeLabel}>
          <X size={22} />
        </button>
        <ThemeAsset lightSrc={wtmLight} darkSrc={wtmDark} className="logout-modal-logo" alt={componentText("eventBrand")} />
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
