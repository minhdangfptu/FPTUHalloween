import React, { useState } from "react";
import "./ContactUsPage.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    subject: "",
    content: "",
  });
  const [errors, setErrors] = useState({});

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

    if (!formData.name.trim()) {
      newErrors.name = "Tên là bắt buộc";
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone_number = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone_number)) {
      newErrors.phone_number = "Số điện thoại không hợp lệ";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Tiêu đề là bắt buộc";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Nội dung là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create email content from form data
    const emailSubject = encodeURIComponent(`[Phản hồi] ${formData.subject}`);
    const emailBody = encodeURIComponent(
      `Thông tin người gửi:\n` +
        `- Tên: ${formData.name}\n` +
        `- Số điện thoại: ${formData.phone_number}\n\n` +
        `Nội dung phản hồi:\n${formData.content}`
    );

    // Open default email client
    window.location.href = `mailto:fptuhalloween@gmail.com?subject=${emailSubject}&body=${emailBody}`;

    // Reset form
    setFormData({
      name: "",
      phone_number: "",
      subject: "",
      content: "",
    });

    // Show confirmation
    alert(
      "Cảm ơn bạn đã góp ý! Trình email của bạn sẽ được mở để gửi phản hồi."
    );
  };

  return (
    <div className="fptu-halloween-contact-page">
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
                      "_blank"
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
                      "_blank"
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
                      "_blank"
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
                     style={{color:'black'}}
                      type="text"
                      name="name"
                      placeholder="Tên của bạn"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.name
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
                     style={{color:'black'}}
                      type="phone"
                      name="phone_number"
                      placeholder="Số điện thoại"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.phone_number
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
                     style={{color:'black'}}
                      type="text"
                      name="subject"
                      placeholder="Tiêu đề"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`fptu-halloween-contact-form-input ${
                        errors.subject
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
                    style={{color:'black'}}
                      name="content"
                      placeholder="Nội dung"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={4}
                      className={`fptu-halloween-contact-form-textarea ${
                        errors.content
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
                  GỬI Ý KIẾN
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
                <div className="fptu-halloween-contact-info-icon">👻</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Fanpage</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPTU Halloween
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div className="fptu-halloween-contact-info-icon">🎲</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Fanpage</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPTU Board Game Club
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div className="fptu-halloween-contact-info-icon">📍</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Địa chỉ</h3>
                  <p className="fptu-halloween-contact-info-text">
                    FPT University
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div className="fptu-halloween-contact-info-icon">✉️</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">Email</h3>
                  <p className="fptu-halloween-contact-info-text">
                    fptuhalloween@gmail.com
                  </p>
                </div>
              </div>
              <div className="fptu-halloween-contact-info-card">
                <div className="fptu-halloween-contact-info-icon">📞</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">
                    Trưởng Ban Tổ Chức
                  </h3>
                  <p className="fptu-halloween-contact-info-text">
                    Lê Quỳnh Anh - 0355987238
                  </p>
                </div>
              </div>

              <div className="fptu-halloween-contact-info-card">
                <div className="fptu-halloween-contact-info-icon">📞</div>
                <div className="fptu-halloween-contact-info-content">
                  <h3 className="fptu-halloween-contact-info-title">
                    Trưởng Ban Đối Ngoại
                  </h3>
                  <p className="fptu-halloween-contact-info-text">
                    Bùi Thị Mai Anh - 0972679993
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
