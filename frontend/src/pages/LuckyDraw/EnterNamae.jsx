import React, { useState } from "react";
import { ArrowRight, Gift, Phone, Sparkles, UserRound } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosClient from "../../apis/axiosClient";
import { translateError } from "../../utils/translateResponse";
import "./EnterNamae.scss";

const EnterNamae = () => {
  const { t } = useTranslation();
  const { search } = useLocation();
  const luckyDraw = (key) => t(`luckyDraw.${key}`);
  const [form, setForm] = useState({ name: "", phoneNumber: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading(luckyDraw("saving"));
    try {
      await axiosClient.post("/lucky-draw", form);
      toast.success(luckyDraw("success"), { id: loadingToast });
      setForm({ name: "", phoneNumber: "" });
    } catch (error) {
      toast.error(translateError(error) || luckyDraw("saveError"), { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (new URLSearchParams(search).get("qr") === "1") {
    return (
      <main className="lucky-draw-qr-page">
        <section className="lucky-draw-qr-card" aria-labelledby="lucky-draw-qr-title">
          <div className="lucky-draw-entry__mark"><Gift size={26} /></div>
          <p className="lucky-draw-entry__eyebrow">{luckyDraw("entryEyebrow")}</p>
          <h1 id="lucky-draw-qr-title">{luckyDraw("scanTitle")}</h1>
          <p>{luckyDraw("scanDescription")}</p>
          <div className="lucky-draw-qr-code"><QRCodeCanvas value={`${window.location.origin}/lucky-draw`} size={280} includeMargin /></div>
          <small>{window.location.origin}/lucky-draw</small>
        </section>
      </main>
    );
  }

  return (
    <main className="lucky-draw-entry">
      <section className="lucky-draw-entry__panel" aria-labelledby="lucky-draw-title">
        <div className="lucky-draw-entry__copy">
          <div className="lucky-draw-entry__eyebrow"><Sparkles size={15} /> {luckyDraw("entryEyebrow")}</div>
          <div className="lucky-draw-entry__mark"><Gift size={26} /></div>
          <h1 id="lucky-draw-title">{luckyDraw("entryTitle").split("|").map((part, index) => <React.Fragment key={part}>{index > 0 && <br />}<em>{index === 1 ? part : ""}</em>{index === 0 ? part : ""}</React.Fragment>)}</h1>
          <p className="lucky-draw-entry__intro">{luckyDraw("entryIntro")}</p>
        </div>
        <div className="lucky-draw-entry__form-column">
          <form className="lucky-draw-entry__form" onSubmit={handleSubmit}>
          <label>
            <span>{luckyDraw("name")}</span>
            <div className="lucky-draw-entry__input"><UserRound size={18} /><input required maxLength={120} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder={luckyDraw("namePlaceholder")} /></div>
          </label>
          <label>
            <span>{luckyDraw("phone")}</span>
            <div className="lucky-draw-entry__input"><Phone size={18} /><input required type="tel" maxLength={20} value={form.phoneNumber} onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })} placeholder={luckyDraw("phonePlaceholder")} /></div>
          </label>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? luckyDraw("submitting") : luckyDraw("submit")}<ArrowRight size={18} /></button>
          </form>
          <p className="lucky-draw-entry__note">{luckyDraw("privacy")}</p>
        </div>
      </section>
    </main>
  );
};

export default EnterNamae;
