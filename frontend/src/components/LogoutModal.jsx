import React from "react";
import { X } from "lucide-react";
import wtm from "../assets/wtm.png";
import "./LogoutModal.css";

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="logout-modal-overlay" onClick={onClose}>
      <div className="logout-modal-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="logout-modal-close" onClick={onClose} aria-label="Đóng">
          <X size={22} />
        </button>
        <img className="logout-modal-logo" src={wtm} alt="FPTU Halloween" />
        <h2 className="logout-modal-title">Đăng xuất</h2>
        <p className="logout-modal-desc">Bạn đang rời đi<br />Bạn chắc chắn chứ?</p>
        <div className="logout-modal-actions">
          <button type="button" className="logout-modal-cancel" onClick={onClose}>Không, đùa chút thôi</button>
          <button type="button" className="logout-modal-confirm" onClick={onConfirm}>Đúng, đăng xuất cho tôi</button>
        </div>
      </div>
    </div>
  );
}

export default LogoutModal;
