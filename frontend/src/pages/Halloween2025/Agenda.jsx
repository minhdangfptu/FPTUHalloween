import React from "react";
import "./Agenda.css";
import { useTranslation } from "react-i18next";

const agendaDocuments = [
  {
    id: "schedule",
    index: "01",
    titleKey: "schedule",
    descriptionKey: "scheduleDescription",
    slotLabel: "AGENDASCHEDULEIMAGE",
    image: null,
  },
  {
    id: "map",
    index: "02",
    titleKey: "map",
    descriptionKey: "mapDescription",
    slotLabel: "AGENDAMAPIMAGE",
    image: null,
  },
];

function Agenda() {
  const { t } = useTranslation();
  const page = (key) => t(`eventPages.agenda.${key}`);
  return (
    <div className="fptu-halloween-agenda-page">
      <header className="fptu-halloween-agenda-hero">
        <div className="fptu-halloween-agenda-hero__inner">
          <p className="fptu-halloween-agenda-kicker">
            {page("kicker")}
          </p>
          <h1 className="fptu-halloween-agenda-hero__title">
            {page("title")}
            <br />
            <span> {page("titleAfter")}</span>
          </h1>
          <p className="fptu-halloween-agenda-hero__summary">
            {page("summary")}
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
                {page("section")}
              </p>
              <h2 id="agenda-documents-title">
                {page("heading")}<span>{page("headingAfter")}</span>
              </h2>
              <p>
                {page("description")}
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
                      alt={page(document.titleKey)}
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
                        {page("placeholder")}
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
                    <h3>{page(document.titleKey)}</h3>
                    <p>{page(document.descriptionKey)}</p>
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
