import React from "react";
import { ArrowUpRight, CalendarDays, CheckCircle2, Clock3, CreditCard, HelpCircle, Mail, MapPin, QrCode, ShieldCheck, ShoppingBag, Ticket, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BouncyAccordion } from "../../components/ui/bouncy-accordion";
import "./FAQ.scss";

const groupIcons = [<Ticket size={18} />, <CreditCard size={18} />, <QrCode size={18} />, <UserRound size={18} />];
const questionIcons = [[ShoppingBag, Ticket, CalendarDays], [QrCode, Clock3, ShieldCheck, HelpCircle], [UserRound, ShieldCheck, CalendarDays, MapPin], [Mail, UserRound, CreditCard, Mail]];

const FAQ = () => {
  const { t } = useTranslation();
  const faq = t("normal.faq", { returnObjects: true });
  const groups = faq.groups.map((label, groupIndex) => {
    const values = faq.questions[groupIndex];
    return { label, icon: groupIcons[groupIndex], questions: Array.from({ length: values.length / 2 }, (_, index) => ({ question: values[index * 2], answer: values[index * 2 + 1], icon: React.createElement(questionIcons[groupIndex][index], { size: 17 }) })) };
  });

  return <main className="faq-page"><div className="faq-shell">
    <header className="faq-hero"><div className="faq-hero__copy">
      <p className="faq-eyebrow"><HelpCircle size={15} /> {faq.eyebrow}</p>
      <h1>{faq.title}</h1><p className="faq-hero__intro">{faq.intro}</p>
      <div className="faq-hero__actions"><Link className="faq-button faq-button--primary" to="/tickets">{faq.tickets} <ArrowUpRight size={16} /></Link><Link className="faq-button faq-button--quiet" to="/contact-us">{faq.support}</Link></div>
    </div><aside className="faq-hero__note"><span className="faq-hero__note-mark"><CheckCircle2 size={18} /></span><div><strong>{faq.important}</strong><p>{faq.importantText}</p></div></aside></header>
    <div className="faq-layout"><aside className="faq-rail" aria-label={faq.quickInfo}><p className="faq-rail__label">{faq.beforeAsk}</p><h2>{faq.railTitle}</h2><p className="faq-rail__intro">{faq.railIntro}</p>
      <div className="faq-rail__facts"><div><CalendarDays size={17} /><span><b>{faq.ticketDate}</b><small>{faq.ticketDateText}</small></span></div><div><Clock3 size={17} /><span><b>{faq.qrTime}</b><small>{faq.qrTimeText}</small></span></div><div><MapPin size={17} /><span><b>{faq.location}</b><small>{faq.locationText}</small></span></div></div>
      <div className="faq-rail__links"><Link to="/ticket-policy">{faq.readTickets} <ArrowUpRight size={14} /></Link><Link to="/data-policy">{faq.dataPolicy} <ArrowUpRight size={14} /></Link></div>
    </aside><div className="faq-groups">{groups.map((group, groupIndex) => <section className="faq-group" key={group.label} aria-labelledby={`faq-${groupIndex}`}><header className="faq-group__header"><span>{group.icon}</span><div><p>{faq.answer}</p><h2 id={`faq-${groupIndex}`}>{group.label}</h2></div></header><BouncyAccordion className="faq-question-list" defaultValue={`${groupIndex}-0`} items={group.questions.map((item, index) => ({ id: `${groupIndex}-${index}`, title: item.question, icon: item.icon, description: <p>{item.answer}</p> }))} classNames={{ item: "faq-item", trigger: "faq-item__trigger", icon: "faq-item__icon", title: "faq-item__question", chevron: "faq-item__chevron", content: "faq-item__content", description: "faq-item__answer" }} /></section>)}</div></div>
    <footer className="faq-contact-strip"><div><span className="faq-contact-strip__icon"><Mail size={18} /></span><div><strong>{faq.noAnswer}</strong><p>{faq.noAnswerText}</p></div></div><Link to="/contact-us">{faq.contact} <ArrowUpRight size={16} /></Link></footer>
  </div></main>;
};

export default FAQ;
