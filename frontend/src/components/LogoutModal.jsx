import React from "react";
import { X } from "lucide-react";
import wtm from "../assets/wtm.png";
import "./LogoutModal.css";

function LogoutModal({ isOpen, onClose, onConfirm, title = "Đăng xuất", description = "Bạn đang rời đi<br />Bạn chắc chắn chứ?", cancelLabel = "Không, đùa chút thôi", confirmLabel = "Đúng, đăng xuất cho tôi" }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="logout-modal-close" onClick={onClose} aria-label="Đóng">
          <X size={22} />
        </button>
        <img className="logout-modal-logo" src={wtm} alt="FPTU Halloween" />
        <h2 className="logout-modal-title">{title}</h2>
        <p className="logout-modal-desc" dangerouslySetInnerHTML={{ __html: description }} />
        <div className="logout-modal-actions">
          <button type="button" className="logout-modal-cancel" onClick={onClose}>{cancelLabel}</button>
          <button type="button" className="logout-modal-confirm" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
