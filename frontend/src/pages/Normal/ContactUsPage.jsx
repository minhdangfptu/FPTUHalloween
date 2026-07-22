import React, { useEffect, useState } from "react";
import "./ContactUsPage.css";
import axiosClient from "../../apis/axiosClient";
import {
  translateError,
  translateSuccess,
} from "../../utils/translateResponse";
import toast, { Toaster } from "react-hot-toast";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Dices, Ghost, Mail, MapPin, Phone } from "lucide-react";

function ContactUsPage() {
  const [formData, setFormData] = useState({
    receiverName: "",
    phone: "",
    email: "",
    topic: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user)
        setFormData((prev) => ({
          ...prev,
          receiverName: user.fullName || user.name || "",
          phone: user.phone || "",
          email: user.email || "",
        }));
    } catch {
      // Keep the form empty when local user data is invalid.
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.receiverName.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.phone.trim()) {
      newErrors.phone_number = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.topic.trim()) {
      newErrors.subject = "Tiêu đề là bắt buộc";
    }

    if (!formData.message.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
    }

    if (newErrors.name) newErrors.receiverName = newErrors.name;
    if (newErrors.phone_number) newErrors.phone = newErrors.phone_number;
    if (newErrors.subject) newErrors.topic = newErrors.subject;
    if (newErrors.content) newErrors.message = newErrors.content;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const loadingToast = toast.loading("Đang gửi thông tin...");
    try {
      const response = await axiosClient.post("/contacts", formData);
      toast.success(translateSuccess(response.data.message), {
        id: loadingToast,
      });
      setFormData((prev) => ({ ...prev, topic: "", message: "" }));
      setErrors({});
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    }
    return;
  };

  return (
    <div className="fptu-halloween-contact-page">
      <Toaster position="top-center" />
      {/* Header */}
      <header className="fptu-halloween-contact-header">
        <div className="fptu-halloween-contact-banner">
          <h1 className="fptu-halloween-contact-banner-title">
            GÓP Ý - PHẢN HỒI
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="fptu-halloween-contact-main">
        <div className="fptu-halloween-contact-container">
          {/* Left Section - Feedback Form */}
          <div className="fptu-halloween-contact-form-section">
            <div className="fptu-halloween-contact-form-card">
              <h2 className="fptu-halloween-contact-form-title">
                Góp ý cho chúng tôi
              </h2>
              <p className="fptu-halloween-contact-form-description">
                Chúng tôi luôn sẵn sàng lắng nghe mọi ý kiến đóng góp của bạn để
                phát triển sự kiện ngày càng tốt hơn.
              </p>

              <div
                className="fptu-halloween-contact-social"
                style={{ display: "flex", gap: "12px" }}
              >
                <button
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/fptuhalloween",
                      "_blank",
                    )
                  }
                  className="fpt-header__social-btn fpt-header__social-btn--facebook"
                >
                  <FacebookIcon />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/fuboardgameclub",
                      "_blank",
                    )
                  }
                  className="fpt-header__social-btn fpt-header__social-btn--tiktok"
                >
                  <InstagramIcon />
                </button>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.tiktok.com/@fptu.halloween2025",
                      "_blank",
                    )
                  }
                  className="fpt-header__social-btn fpt-header__social-btn--youtube"
                >
                  <YouTubeIcon />
                </button>
                {/* <p className="fptu-halloween-contact-google-form-text">
                  Hoặc gửi ý kiến, phản hồi qua Google Form
                </p>
                <button className="fptu-halloween-contact-google-form-btn">
                  Google Form
                </button> */}
              </div>

              <form
                onSubmit={handleSubmit}
                className="fptu-halloween-contact-form"
              >
                <div className="fptu-halloween-contact-form-fields">
                  <div className="fptu-halloween-contact-form-group">
                    <input
                      style={{ color: "black" }}
                      type="text"
                      name="receiverName"
                      placeholder="Tên của bạn"
                      value={formData.receiverName}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.receiverName
                          ? "fptu-halloween-contact-form-input-error"
                          : ""
                      }`}
                    />
                    {errors.name && (
                      <span className="fptu-halloween-contact-form-error">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="fptu-halloween-contact-form-group">
                    <input
                      style={{ color: "black" }}
                      type="phone"
                      name="phone"
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.phone
                          ? "fptu-halloween-contact-form-input-error"
                          : ""
                      }`}
                    />
                    {errors.phone_number && (
                      <span className="fptu-halloween-contact-form-error">
                        {errors.phone_number}
                      </span>
                    )}
                  </div>

                  <div className="fptu-halloween-contact-form-group">
                    <input
                      style={{ color: "black" }}
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${errors.email ? "fptu-halloween-contact-form-input-error" : ""}`}
                    />
                    {errors.email && (
                      <span className="fptu-halloween-contact-form-error">
                        {errors.email}
                      </span>
                    )}
                  </div>

                  <div className="fptu-halloween-contact-form-group">
                    <input
                      style={{ color: "black" }}
                      type="text"
                      name="topic"
                      placeholder="Tiêu đề"
                      value={formData.topic}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.topic
                          ? "fptu-halloween-contact-form-input-error"
                          : ""
                      }`}
                    />
                    {errors.subject && (
                      <span className="fptu-halloween-contact-form-error">
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  <div className="fptu-halloween-contact-form-group">
                    <textarea
                      style={{ color: "black" }}
                      name="message"
                      placeholder="Nội dung"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className={`fptu-halloween-contact-form-textarea ${
                        errors.message
                          ? "fptu-halloween-contact-form-input-error"
                          : ""
                      }`}
                    />
                    {errors.content && (
                      <span className="fptu-halloween-contact-form-error">
                        {errors.content}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="fptu-halloween-contact-form-submit"
                >
                  Gửi ý kiến
                </button>
              </form>
            </div>
          </div>

          {/* Right Section - Map and Contact Info */}
          <div className="fptu-halloween-contact-info-section">
            <div className="fptu-halloween-contact-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2218.7988692920785!2d105.52420295348495!3d21.01218777371515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135abc60e7d3f19%3A0x2be9d7d0b5abcbf4!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBGUFQgSMOgIE7hu5lp!5e1!3m2!1svi!2s!4v1760409563114!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="FPT University Location"
                className="fptu-halloween-contact-map-iframe"
              ></iframe>
            </div>

            <div className="fptu-halloween-contact-info-cards">
              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <Ghost size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Fanpage</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPTU Halloween
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <Dices size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Fanpage</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPTU Board Game Club
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <MapPin size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Địa chỉ</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPT University
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <Mail size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Email</h3>
                  <p className="fptu-halloween-contact-info-text">
                    fptuhalloween@gmail.com
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <Phone size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">
                    Trưởng Ban Tổ Chức
                  </h3>
                  <p className="fptu-halloween-contact-info-text">
                    Nguyễn Thảo Vy - 0338263886
                  </p>
                </div>
              </div>

              <div className="fptu-halloween-contact-info-card">
                <div
                  className="fptu-halloween-contact-info-icon"
                  aria-hidden="true"
                >
                  <Phone size={24} />
                </div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">
                    Trưởng Ban Truyền thông
                  </h3>
                  <p className="fptu-halloween-contact-info-text">
                    Lê Thị Thuỳ - 0947319889
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ContactUsPage;
