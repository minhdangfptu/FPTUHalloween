/* Hallmark · macrostructure: Operations Desk · tone: editorial administration · anchor hue: FPT red */
import React, { useEffect, useRef, useState } from "react";
import {
  Camera,
  CheckCircle2,
  Clock3,
  ScanLine,
  Ticket,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import ManageSidebar from "../../components/ManageSidebar";
import ticketAPI from "../../apis/ticketAPI";
import { translateError } from "../../utils/translateResponse";
import successSound from "../../assets/success_sound.mp3";
import "./StaffCheckinTicket.scss";

const StaffCheckinTicket = () => {
  const { t, i18n } = useTranslation();
  const checkInText = (key, options) => t(`management.checkIn.${key}`, options);
  const location = useLocation();
  const role = location.pathname.startsWith("/admin/") ? "admin" : "staff";
  const cameraScanInFlightRef = useRef(false);
  const [scannedTickets, setScannedTickets] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [pendingTicket, setPendingTicket] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const today = new Date().getDate();
    // The list endpoint is restricted to staff/admin and already returns populated ticket data.
    ticketAPI
      .getCheckedInTickets({ status: "Checked", date: today, pageSize: 100 })
      .then(({ data }) =>
        setScannedTickets(data.data?.tickets || data.tickets || []),
      )
      .catch(() => {});
  }, []);

  const playScanBeep = () => {
    const audio = new Audio(successSound);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  const stopCamera = () => {
    cameraScanInFlightRef.current = false;
    setIsCameraOpen(false);
  };

  const previewScan = async (code) => {
    const normalizedCode = String(code || "").trim();
    if (!normalizedCode) {
      toast.error(checkInText("invalidQr"));
      return;
    }
    try {
      const { data } = await ticketAPI.getByQrCode(normalizedCode);
      const ticket = data.data || data;
      const today = new Date().getDate();
      const checkInBlockReason = ticket.ticketStatus !== "Pending"
        ? "already-used"
        : Number(ticket.ticketTypeId?.ticketTypeDate) !== today
          ? "wrong-date"
          : null;
      setPendingTicket({
        ...ticket,
        code: ticket.qrCodeData,
        customerName: ticket.buyerName || ticket.orderId?.buyerInfo?.fullName || ticket.userId?.fullName || checkInText("attendee"),
        customerEmail: ticket.buyerEmail || ticket.orderId?.buyerInfo?.email || "—",
        customerPhone: ticket.buyerPhone || ticket.orderId?.buyerInfo?.phone || "—",
        ticketName: ticket.ticketTypeId?.ticketTypeName || checkInText("ticketFallback"),
        canCheckIn: !checkInBlockReason,
        checkInBlockReason,
      });
      playScanBeep();
      stopCamera();
    } catch (error) {
      toast.error(translateError(error));
    }
  };

  const confirmScan = async () => {
    const isBlockedTicket = ["wrong-date", "already-used"].includes(pendingTicket?.checkInBlockReason);
    if (!pendingTicket || isBlockedTicket || !pendingTicket.canCheckIn || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const { data } = await ticketAPI.checkIn(pendingTicket.code);
      const checkedTicket = data.data || data;
      setScannedTickets((tickets) => [checkedTicket, ...tickets]);
      setManualCode("");
      setPendingTicket(null);
      toast.success(checkInText("success"));
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCamera = () => {
    if (isCameraOpen) return;
    cameraScanInFlightRef.current = false;
    setIsCameraOpen(true);
  };

  const handleCameraScan = async (detectedCodes) => {
    const decodedCode = detectedCodes?.[0]?.rawValue;
    if (!decodedCode || cameraScanInFlightRef.current) return;

    cameraScanInFlightRef.current = true;
    try {
      await previewScan(decodedCode);
    } finally {
      window.setTimeout(() => {
        cameraScanInFlightRef.current = false;
      }, 800);
    }
  };

  const handleCameraError = (error) => {
    console.error("QR scanner error:", error);
    const errorMessages = {
      "permission-denied": checkInText("cameraPermission"),
      "no-camera": checkInText("cameraMissing"),
      "in-use": checkInText("cameraInUse"),
      "insecure-context": checkInText("httpsRequired"),
      unsupported: checkInText("cameraUnsupported"),
    };
    const message = errorMessages[error?.kind];
    if (!message) return;
    toast.error(message);
    stopCamera();
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") stopCamera();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const isConfirmDisabled = !pendingTicket
    || !pendingTicket.canCheckIn
    || ["wrong-date", "already-used"].includes(pendingTicket.checkInBlockReason)
    || isSubmitting;

  return (
    <div className="staff-manage-layout staff-checkin-page">
      <ManageSidebar role={role} activeItem="check-in" />
      <main className="staff-checkin-main">
        <header className="staff-checkin-header">
          <div>
            <p className="staff-checkin-eyebrow">
              <ScanLine size={16} /> {checkInText("kicker")}
            </p>
            <h1>{checkInText("title")}</h1>
            <p>{checkInText("intro")}</p>
          </div>
          <button
            className="staff-checkin-camera-button"
            type="button"
            onClick={openCamera}
          >
            <Camera size={18} /> {checkInText("openCamera")}
          </button>
        </header>

        <section className="staff-checkin-stats">
          <div>
            <span>{checkInText("scannedToday")}</span>
            <strong>{scannedTickets.length}</strong>
          </div>
          <div>
            <span>{checkInText("latestScan")}</span>
            <strong>
              {scannedTickets[0]
                ? new Date(scannedTickets[0].checkedInAt).toLocaleTimeString(
                    i18n.language === "en" ? "en-US" : "vi-VN",
                  )
                : "—"}
            </strong>
          </div>
        </section>

        <section className="staff-checkin-card">
          <div className="staff-checkin-card__header">
            <div>
              <h2>{checkInText("scannedTickets")}</h2>
              <span>{checkInText("scannedList")}</span>
            </div>
            <CheckCircle2 size={22} />
          </div>
          <div className="staff-checkin-manual">
            <input
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder={checkInText("manualPlaceholder")}
              onKeyDown={(event) => {
                if (event.key === "Enter") previewScan(manualCode);
              }}
            />
            <button type="button" onClick={() => previewScan(manualCode)}>
              {checkInText("confirm")}
            </button>
          </div>
          {scannedTickets.length === 0 ? (
            <div className="staff-checkin-empty">
              <ScanLine size={34} />
              <strong>{checkInText("emptyTitle")}</strong>
              <span>{checkInText("emptyText")}</span>
            </div>
          ) : (
            <div className="staff-checkin-list">
              {scannedTickets.map((ticket) => (
                <article key={`${ticket.qrCodeData || ticket.code}-${ticket.checkedInAt || ticket.scannedAt}`}>
                  <div className="staff-checkin-ticket-icon">
                    <Ticket size={19} />
                  </div>
                  <div className="staff-checkin-ticket-copy">
                    <strong>{ticket.qrCodeData}</strong>
                    <span>
                      <UserRound size={14} /> {ticket.buyerName || ticket.orderId?.buyerInfo?.fullName || ticket.userId?.fullName || checkInText("attendee")}
                    </span>
                  </div>
                  <time>
                    <Clock3 size={14} />{" "}
                    {new Date(ticket.checkedInAt).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN")}
                  </time>
                  <CheckCircle2 className="staff-checkin-ticket-ok" size={19} />
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {pendingTicket && (
        <div className="staff-checkin-ticket-modal" role="presentation">
          <section
            className="staff-checkin-ticket-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={checkInText("ticketInfo")}
          >
            <button
              className="staff-checkin-ticket-dialog__close"
              type="button"
              onClick={() => setPendingTicket(null)}
              aria-label={t("management.common.close")}
            >
              <X size={20} />
            </button>
            <p className="staff-checkin-eyebrow">
              <CheckCircle2 size={16} /> {checkInText("qrRecognized")}
            </p>
            <h2>{checkInText("ticketInfo")}</h2>
            <div className="staff-checkin-ticket-dialog__columns">
              <div className="staff-checkin-ticket-dialog__info">
            <div className="staff-checkin-ticket-details">
              <div>
                <span>{checkInText("ticketCode")}</span>
                <strong>{pendingTicket.code}</strong>
              </div>
              <div>
                <span>{checkInText("attendee")}</span>
                <strong>{pendingTicket.customerName}</strong>
                <small>{pendingTicket.customerEmail}</small>
                <small>{checkInText("phone", { phone: pendingTicket.customerPhone })}</small>
              </div>
              <div>
                <span>{checkInText("ticketType")}</span>
                <strong>{pendingTicket.ticketName}</strong>
              </div>
              {!pendingTicket.canCheckIn && (
                <small>
                  {checkInText("invalidTicketNote")}
                </small>
              )}
            </div>
              </div>
              <div className="staff-checkin-ticket-dialog__guidance">
            {!pendingTicket.canCheckIn && (
              <div className={`staff-checkin-ticket-alert staff-checkin-ticket-alert--${pendingTicket.checkInBlockReason}`} role="alert">
                <strong>{checkInText(pendingTicket.checkInBlockReason === "wrong-date" ? "wrongDateTitle" : "usedTitle")}</strong>
                <span>{checkInText(pendingTicket.checkInBlockReason === "wrong-date" ? "wrongDateText" : "usedText")}</span>
              </div>
            )}
            <div className="staff-checkin-ticket-notes">
              <strong>{checkInText("notes")}</strong>
              <ul>
                <li>
                  {checkInText("noteIdentity")}
                </li>
                <li>
                  {checkInText("noteDate")}
                </li>
                <li>
                  {checkInText("noteMismatch")}
                </li>
              </ul>
            </div>
              </div>
            </div>
            <div className="staff-checkin-ticket-dialog__actions">
              <button type="button" onClick={() => setPendingTicket(null)}>
                {t("management.common.cancel")}
              </button>
              <button
                className={isConfirmDisabled ? "is-disabled" : ""}
                type="button"
                onClick={(event) => {
                  if (isConfirmDisabled) {
                    event.preventDefault();
                    return;
                  }
                  confirmScan();
                }}
                disabled={isConfirmDisabled}
                aria-disabled={isConfirmDisabled}
              >
                <CheckCircle2 size={17} />{" "}
                {checkInText(isSubmitting ? "processing" : "confirmCheckIn")}
              </button>
            </div>
          </section>
        </div>
      )}

      {isCameraOpen && (
        <div
          className="staff-checkin-camera-modal"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) stopCamera();
          }}
        >
          <section
            className="staff-checkin-camera-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={checkInText("scanQr")}
          >
            <header>
              <div>
                <p>{checkInText("scanning")}</p>
                <h2>{checkInText("positionQr")}</h2>
              </div>
              <button
                className="staff-checkin-camera-dialog__close"
                type="button"
                onClick={stopCamera}
                aria-label={checkInText("closeCamera")}
              >
                <X size={20} />
              </button>
            </header>
            <div className="staff-checkin-camera-frame">
              <Scanner
                formats={["qr_code"]}
                constraints={{ facingMode: "environment" }}
                onScan={handleCameraScan}
                onError={handleCameraError}
                scanDelay={350}
                components={{ finder: false }}
                sound={false}
                styles={{
                  container: { width: "100%", height: "100%" },
                  video: { width: "100%", height: "100%", objectFit: "cover" },
                }}
              />
              <div
                className="staff-checkin-camera-finder"
                aria-hidden="true"
              />
            </div>
            <p className="staff-checkin-camera-hint">
              {checkInText("cameraHint")}
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default StaffCheckinTicket;
