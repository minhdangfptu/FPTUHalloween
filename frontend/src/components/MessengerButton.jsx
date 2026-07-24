import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./MessengerButton.scss";
import logo from "../assets/avatar.jpg"; // Thay đường dẫn này bằng đường dẫn thực tế đến logo của dự án
export default function MessengerButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="messenger-wrapper">
      {/* Khung Pop-up chat */}
      {isOpen && (
        <div className="messenger-popup">
          <div className="popup-header">
            <div className="header-info">
              {/* Bồ nhớ thay link ảnh logo của dự án vào đây nha */}
              <img src={logo} alt="FPTUHalloween" className="page-avatar" />
              <div className="page-details">
                <h4>FPTUHalloween</h4>
                <p>Thường trả lời ngay lập tức</p>
              </div>
            </div>
          </div>

          <div className="popup-body">
            <div className="chat-bubble">
              Xin chào! <br />
              FPTUHalloween có thể giúp gì cho bạn hôm nay?
            </div>
          </div>

          <div className="popup-footer">
            <a
              href="https://m.me/fptuhalloween"
              target="_blank"
              rel="noopener noreferrer"
              className="start-chat-btn"
            >
              <FaFacebookMessenger className="btn-icon" aria-hidden="true" />
              Chat trên Messenger
            </a>
          </div>
        </div>
      )}

      <div className="messenger-fab-stack">
        {/* Nút bấm tròn lơ lửng */}
        <button
          className="messenger-fab"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Mở khung chat"
        >
          {isOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <FaFacebookMessenger size={28} aria-hidden="true" />
          )}
        </button>

        <Link
          className="faq-fab"
          to="/faq"
          aria-label="Mở trang câu hỏi thường gặp"
          title="Câu hỏi thường gặp"
        >
          <HelpCircle size={28} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
