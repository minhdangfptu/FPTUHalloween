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
import { useLocation } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import ManageSidebar from "../../components/ManageSidebar";
import ticketAPI from "../../apis/ticketAPI";
import { translateError } from "../../utils/translateResponse";
import successSound from "../../assets/success_sound.mp3";
import "./StaffCheckinTicket.scss";

const StaffCheckinTicket = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/admin/") ? "admin" : "staff";
  const scannerRef = useRef(null);
  const cameraLoadingToastRef = useRef(null);
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
    const scanner = scannerRef.current;
    scannerRef.current = null;
    setIsCameraOpen(false);
    if (cameraLoadingToastRef.current?.status === "loading") {
      toast.dismiss(cameraLoadingToastRef.current.id);
    }
    cameraLoadingToastRef.current = null;
    if (!scanner) return;

    scanner
      .stop()
      .catch(() => {})
      .finally(() => {
        try {
          scanner.clear();
        } catch {
          // The scanner may already be cleared when the modal closes twice.
        }
      });
  };

  const previewScan = async (code) => {
    const normalizedCode = String(code || "").trim();
    if (!normalizedCode) {
      toast.error("Vui lòng cung cấp mã QR hợp lệ.");
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
        customerName: ticket.userId?.fullName || "Khách tham gia",
        customerEmail: ticket.userId?.email || "—",
        customerPhone: ticket.userId?.phone || "—",
        ticketName: ticket.ticketTypeId?.ticketTypeName || "Vé FPTU Halloween",
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
      toast.success("Check-in vé thành công.");
    } catch (error) {
      toast.error(translateError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCamera = () => {
    if (isCameraOpen || scannerRef.current) return;
    const loadingToast = toast.loading("Đang mở camera check-in...");
    cameraLoadingToastRef.current = { id: loadingToast, status: "loading" };
    setIsCameraOpen(true);
  };

  useEffect(() => {
    if (!isCameraOpen) return undefined;
    const scanner = new Html5Qrcode("staff-checkin-reader");
    scannerRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => previewScan(decodedText),
        () => {},
      )
      .then(() => {
        if (scannerRef.current !== scanner) {
          scanner
            .stop()
            .catch(() => {})
            .finally(() => {
              try {
                scanner.clear();
              } catch {
                /* already cleared */
              }
            });
          return;
        }
        toast.success("Camera đã sẵn sàng. Đưa mã QR vào khung quét.", {
          id: cameraLoadingToastRef.current?.id,
        });
        if (cameraLoadingToastRef.current) {
          cameraLoadingToastRef.current.status = "success";
        }
      })
      .catch((error) => {
        if (scannerRef.current !== scanner) return;
        const errorDetails = [error?.name, error?.message, error?.cause, error]
          .filter(Boolean)
          .map(String)
          .join(" ");
        const cameraIsBusy =
          /notreadableerror|trackstarterror|already in use|could not start video source|device busy|camera.*(?:busy|in use)|(?:busy|in use).*camera/i.test(
            errorDetails,
          );
        const errorMessage = cameraIsBusy
          ? "Camera đang được sử dụng ở nơi khác. Hãy đóng ứng dụng hoặc tab đang dùng camera rồi thử lại."
          : "Không thể khởi động camera. Hãy kiểm tra quyền truy cập camera và cấp quyền cho trình duyệt.";
        if (cameraLoadingToastRef.current) {
          cameraLoadingToastRef.current.status = "error";
        }
        toast.error(errorMessage, { id: cameraLoadingToastRef.current?.id });
        stopCamera();
      });
    return () => {
      if (scannerRef.current === scanner) stopCamera();
    };
  }, [isCameraOpen]);

  useEffect(() => () => stopCamera(), []);

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
              <ScanLine size={16} /> Cổng vào sự kiện
            </p>
            <h1>Check-in vé</h1>
            <p>
              Quét mã QR của khách và theo dõi các lượt check-in trong ca trực.
            </p>
          </div>
          <button
            className="staff-checkin-camera-button"
            type="button"
            onClick={openCamera}
          >
            <Camera size={18} /> Mở camera check-in
          </button>
        </header>

        <section className="staff-checkin-stats">
          <div>
            <span>Đã quét hôm nay</span>
            <strong>{scannedTickets.length}</strong>
          </div>
          <div>
            <span>Lượt quét gần nhất</span>
            <strong>
              {scannedTickets[0]
                ? new Date(scannedTickets[0].checkedInAt).toLocaleTimeString(
                    "vi-VN",
                  )
                : "—"}
            </strong>
          </div>
        </section>

        <section className="staff-checkin-card">
          <div className="staff-checkin-card__header">
            <div>
              <h2>Vé đã quét</h2>
              <span>Danh sách lượt check-in trên tài khoản này</span>
            </div>
            <CheckCircle2 size={22} />
          </div>
          <div className="staff-checkin-manual">
            <input
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              placeholder="Nhập mã QR nếu không dùng camera..."
              onKeyDown={(event) => {
                if (event.key === "Enter") previewScan(manualCode);
              }}
            />
            <button type="button" onClick={() => previewScan(manualCode)}>
              Xác nhận
            </button>
          </div>
          {scannedTickets.length === 0 ? (
            <div className="staff-checkin-empty">
              <ScanLine size={34} />
              <strong>Chưa có lượt check-in</strong>
              <span>Mở camera để bắt đầu quét vé của khách.</span>
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
                      <UserRound size={14} /> Khách tham gia
                    </span>
                  </div>
                  <time>
                    <Clock3 size={14} />{" "}
                    {new Date(ticket.checkedInAt).toLocaleString("vi-VN")}
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
            aria-label="Thông tin vé"
          >
            <button
              className="staff-checkin-ticket-dialog__close"
              type="button"
              onClick={() => setPendingTicket(null)}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
            <p className="staff-checkin-eyebrow">
              <CheckCircle2 size={16} /> Đã nhận diện mã QR
            </p>
            <h2>Thông tin vé</h2>
            <div className="staff-checkin-ticket-dialog__columns">
              <div className="staff-checkin-ticket-dialog__info">
            <div className="staff-checkin-ticket-details">
              <div>
                <span>Mã vé</span>
                <strong>{pendingTicket.code}</strong>
              </div>
              <div>
                <span>Khách tham gia</span>
                <strong>{pendingTicket.customerName}</strong>
                <small>{pendingTicket.customerEmail}</small>
                <small>Số điện thoại: {pendingTicket.customerPhone}</small>
              </div>
              <div>
                <span>Loại vé</span>
                <strong>{pendingTicket.ticketName}</strong>
              </div>
              {!pendingTicket.canCheckIn && (
                <small>
                  Vé chỉ được check-in đúng ngày ghi trên vé hoặc vé đã được sử
                  dụng.
                </small>
              )}
            </div>
              </div>
              <div className="staff-checkin-ticket-dialog__guidance">
            {!pendingTicket.canCheckIn && (
              <div className={`staff-checkin-ticket-alert staff-checkin-ticket-alert--${pendingTicket.checkInBlockReason}`} role="alert">
                <strong>{pendingTicket.checkInBlockReason === "wrong-date" ? "Vé chưa đúng ngày sử dụng" : "Vé đã hết hiệu lực check-in"}</strong>
                <span>{pendingTicket.checkInBlockReason === "wrong-date" ? "Vé này chỉ được check-in vào đúng ngày sự kiện ghi trên vé." : "Vé này đã được check-in hoặc không còn ở trạng thái có thể sử dụng."}</span>
              </div>
            )}
            <div className="staff-checkin-ticket-notes">
              <strong>Lưu ý</strong>
              <ul>
                <li>
                  Đối chiếu tên và số điện thoại với khách trước khi xác nhận.
                </li>
                <li>
                  Chỉ check-in vé đúng ngày sự kiện, không xác nhận vé đã sử
                  dụng.
                </li>
                <li>
                  Nếu thông tin không khớp, giữ vé ở trạng thái chờ và báo
                  trưởng ban/điều phối.
                </li>
              </ul>
            </div>
              </div>
            </div>
            <div className="staff-checkin-ticket-dialog__actions">
              <button type="button" onClick={() => setPendingTicket(null)}>
                Hủy
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
                {isSubmitting ? "Đang xử lý..." : "Xác nhận check-in"}
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
            aria-label="Quét mã QR"
          >
            <header>
              <div>
                <p>Đang quét</p>
                <h2>Đưa mã QR vào khung</h2>
              </div>
              <button
                className="staff-checkin-camera-dialog__close"
                type="button"
                onClick={stopCamera}
                aria-label="Đóng camera"
              >
                <X size={20} />
              </button>
            </header>
            <div className="staff-checkin-camera-frame">
              <div id="staff-checkin-reader" />
            </div>
            <p className="staff-checkin-camera-hint">
              Giữ mã QR cách camera khoảng 15–30 cm.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default StaffCheckinTicket;
