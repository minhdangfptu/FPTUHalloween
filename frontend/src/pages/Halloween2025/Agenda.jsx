import React from "react";
import "./Agenda.css";

const agendaDocuments = [
  {
    id: "schedule",
    index: "01",
    title: "Lịch trình sự kiện",
    description: "Khung placeholder cho ảnh lịch trình chương trình.",
    slotLabel: "AGENDASCHEDULEIMAGE",
    image: null,
  },
  {
    id: "map",
    index: "02",
    title: "Sơ đồ sự kiện",
    description: "Khung placeholder cho ảnh sơ đồ khu vực sự kiện.",
    slotLabel: "AGENDAMAPIMAGE",
    image: null,
  },
];

function Agenda() {
  return (
    <div className="fptu-halloween-agenda-page">
      <header className="fptu-halloween-agenda-hero">
        <div className="fptu-halloween-agenda-hero__inner">
          <p className="fptu-halloween-agenda-kicker">
            FPTU HALLOWEEN 2025 / WISHBOUND
          </p>
          <h1 className="fptu-halloween-agenda-hero__title">
            Lịch trình
            <br />
            <span> sự kiện.</span>
          </h1>
          <p className="fptu-halloween-agenda-hero__summary">
            Hai tài liệu để bạn định vị thời gian, không gian và những điểm chạm
            quan trọng của đêm Halloween.
          </p>
        </div>
        <p className="fptu-halloween-agenda-hero__year" aria-hidden="true">
          HLW26
        </p>
      </header>

      <main className="fptu-halloween-agenda-main">
        <section
          className="fptu-halloween-agenda-documents"
          aria-labelledby="agenda-documents-title"
        >
          <div className="fptu-halloween-agenda-section-head">
            <div className="fptu-halloween-agenda-section-head__copy">
              <p className="fptu-halloween-agenda-section-label">
                Tài liệu sự kiện
              </p>
              <h2 id="agenda-documents-title">
                Mọi điểm chạm,
                <span> trên cùng một trang.</span>
              </h2>
              <p>
                Lịch trình và sơ đồ sẽ được cập nhật trực tiếp vào hai khung bên
                dưới khi ảnh chính thức sẵn sàng.
              </p>
            </div>
          </div>

          <div className="fptu-halloween-agenda-grid">
            {agendaDocuments.map((document) => (
              <figure
                className={`fptu-halloween-agenda-document fptu-halloween-agenda-document--${document.id}`}
                key={document.id}
              >
                <div
                  className="fptu-halloween-agenda-document__frame"
                  data-image-slot={document.slotLabel}
                >
                  {document.image ? (
                    <img
                      src={document.image}
                      alt={document.title}
                      width="210"
                      height="297"
                      loading="lazy"
                      className="fptu-halloween-agenda-document__image"
                    />
                  ) : (
                    <div className="fptu-halloween-agenda-document__placeholder">
                      <span className="fptu-halloween-agenda-document__number">
                        {document.index}
                      </span>
                      <span className="fptu-halloween-agenda-document__placeholder-label">
                        Ảnh sẽ được thêm vào
                      </span>
                      <span className="fptu-halloween-agenda-document__slot">
                        {document.slotLabel}
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="fptu-halloween-agenda-document__caption">
                  <span>{document.index} / 02</span>
                  <div>
                    <h3>{document.title}</h3>
                    <p>{document.description}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Agenda;
