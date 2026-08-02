import React from "react";
import { CircleHelp, Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./Rules.scss";

export default function TicketPolicy() {
  const { t } = useTranslation();
  return <PolicyPage icon={<Ticket />} eyebrow={t("normal.policy.ticketEyebrow")} title={t("normal.policy.ticketTitle")} intro={t("normal.policy.ticketIntro")} sections={t("normal.policy.ticketSections", { returnObjects: true })} note={t("normal.policy.contactNote")} iconNote={<CircleHelp size={19} />} />;
}

function PolicyPage({ icon, eyebrow, title, intro, sections, note, iconNote }) { return <main className="rules-page"><div className="rules-shell"><header className="rules-hero"><span className="rules-icon">{icon}</span><p>{eyebrow}</p><h1>{title}</h1><div className="rules-intro">{intro}</div></header><div className="rules-content">{sections.map(([heading, ...paragraphs]) => <section key={heading}><h2>{heading}</h2>{paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<aside className="rules-note">{iconNote}<span>{note}</span></aside></div></div></main>; }
