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
import successSound from "../../assets/success_sound.mp3";
import "./StaffCheckinTicket.scss";

const STORAGE_KEY = "fptu-checkin-scanned-tickets";

const readScannedTickets = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const StaffCheckinTicket = () => {
  const location = useLocation();
  const role = location.pathname.startsWith("/admin/") ? "admin" : "staff";
  const scannerRef = useRef(null);
  const [scannedTickets, setScannedTickets] = useState(readScannedTickets);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [pendingTicket, setPendingTicket] = useState(null);

  const playScanBeep = () => {
    const audio = new Audio(successSound);
    audio.volume = 0.8;
    audio.play().catch(() => {});
  };

  const stopCamera = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        scannerRef.current.clear();
        scannerRef.current = null;
      });
    }
    setIsCameraOpen(false);
  };

  const previewScan = (code) => {
    const normalizedCode = String(code || "").trim();
    if (!normalizedCode) {
      toast.error("Vui lòng cung cấp mã QR hợp lệ.");
      return;
    }
    if (scannedTickets.some((ticket) => ticket.code === normalizedCode)) {
      toast.error("Vé này đã được quét trước đó.");
      return;
    }

    const nextTicket = {
      code: normalizedCode,
      scannedAt: new Date().toISOString(),
      customerName: "Khách tham gia",
      customerEmail: "Thông tin sẽ được tải từ backend",
      ticketName: "Vé FPTU Halloween",
    };
    playScanBeep();
    setPendingTicket(nextTicket);
    stopCamera();
  };

  const confirmScan = () => {
    if (!pendingTicket) return;
    const nextTickets = [pendingTicket, ...scannedTickets];
    setScannedTickets(nextTickets);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextTickets));
    setManualCode("");
    setPendingTicket(null);
    toast.success("Check-in vé thành công.");
  };

  const openCamera = async () => {
    const loadingToast = toast.loading("Đang mở camera check-in...");
    try {
      setIsCameraOpen(true);
      toast.success("Camera đã sẵn sàng. Đưa mã QR vào khung quét.", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error("Không thể mở camera. Vui lòng cấp quyền camera và dùng HTTPS hoặc localhost.", { id: loadingToast });
    }
  };

  useEffect(() => {
    if (!isCameraOpen) return undefined;
    const scanner = new Html5Qrcode("staff-checkin-reader");
    scannerRef.current = scanner;
    scanner.start({ facingMode: "environment" }, { fps: 10, qrbox: { width: 250, height: 250 } }, (decodedText) => previewScan(decodedText), () => {}).catch(() => {
      toast.error("Không thể khởi động camera. Hãy kiểm tra quyền truy cập camera.");
      stopCamera();
    });
    return () => {
      if (scannerRef.current === scanner) stopCamera();
    };
  }, [isCameraOpen]);

  useEffect(() => () => stopCamera(), []);

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
                ? new Date(scannedTickets[0].scannedAt).toLocaleTimeString(
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
                <article key={`${ticket.code}-${ticket.scannedAt}`}>
                  <div className="staff-checkin-ticket-icon">
                    <Ticket size={19} />
                  </div>
                  <div className="staff-checkin-ticket-copy">
                    <strong>{ticket.code}</strong>
                    <span>
                      <UserRound size={14} /> Khách tham gia
                    </span>
                  </div>
                  <time>
                    <Clock3 size={14} />{" "}
                    {new Date(ticket.scannedAt).toLocaleString("vi-VN")}
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
          <section className="staff-checkin-ticket-dialog" role="dialog" aria-modal="true" aria-label="Thông tin vé">
            <button className="staff-checkin-ticket-dialog__close" type="button" onClick={() => setPendingTicket(null)} aria-label="Đóng"><X size={20} /></button>
            <p className="staff-checkin-eyebrow"><CheckCircle2 size={16} /> Đã nhận diện mã QR</p>
            <h2>Thông tin vé</h2>
            <div className="staff-checkin-ticket-details"><div><span>Mã vé</span><strong>{pendingTicket.code}</strong></div><div><span>Khách tham gia</span><strong>{pendingTicket.customerName}</strong><small>{pendingTicket.customerEmail}</small></div><div><span>Loại vé</span><strong>{pendingTicket.ticketName}</strong></div></div>
            <div className="staff-checkin-ticket-dialog__actions"><button type="button" onClick={() => setPendingTicket(null)}>Hủy</button><button type="button" onClick={confirmScan}><CheckCircle2 size={17} /> Xác nhận check-in</button></div>
          </section>
        </div>
      )}

      {isCameraOpen && (
        <div className="staff-checkin-camera-modal" role="presentation">
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
