import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Eye, Search, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ManageSidebar from "../../components/ManageSidebar";
import AddTicketType from "../../components/AddTicketType";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import "./StaffTicketTypeList.scss";

const formatPrice = (price) =>
  `${new Intl.NumberFormat("vi-VN").format(price || 0)} VND`;

const getStoredRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(user?.role?.roleName || user?.roleName || user?.role || user?.roleId?.roleName || "").toLowerCase();
  } catch {
    return "";
  }
};

const StaffTicketTypeList = () => {
  const navigate = useNavigate();
  const isAdmin = getStoredRole() === "admin";
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [totalTicketTypes, setTotalTicketTypes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTicketTypes = useCallback(async () => {
    const loadingToast = toast.loading("Đang tải danh sách loại vé...");
    setIsLoading(true);
    setError(null);
    try {
      const result = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      setTicketTypes(result.ticketTypes || []);
      setTotalTicketTypes(result.pagination?.total ?? result.ticketTypes?.length ?? 0);
    } catch (requestError) {
      setError(translateError(requestError));
      toast.error(translateError(requestError));
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, []);

  useEffect(() => {
    loadTicketTypes();
  }, [loadTicketTypes]);

  const visibleTickets = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return ticketTypes.filter((ticketType) => {
      const isSoldOut = Number(ticketType.availableQuantity) < 0;
      const matchesDate = activeFilter === "all" || String(ticketType.ticketTypeDate) === activeFilter;
      const matchesStatus = statusFilter === "all"
        || (statusFilter === "active" && ticketType.ticketTypeStatus === "active" && !isSoldOut)
        || (statusFilter === "inactive" && (ticketType.ticketTypeStatus !== "active" || isSoldOut));
      const matchesSearch = !normalizedSearch || String(ticketType.ticketTypeName || "").toLowerCase().includes(normalizedSearch);
      return matchesDate && matchesStatus && matchesSearch;
    });
  }, [activeFilter, search, statusFilter, ticketTypes]);

  return (
    <div className="staff-manage-layout">
      <ManageSidebar role="staff" activeItem="ticket-types" />
      <main className="staff-ticket-list">
        <header className="staff-ticket-list__header">
          <div>
            <p className="staff-ticket-list__kicker"><Ticket size={16} /> Quản lý vé</p>
            <h1>Danh sách loại vé</h1>
            <p>Thông tin các loại vé đang được phát hành cho sự kiện.</p>
          </div>
          <div className="staff-ticket-list__header-actions">
            {!isAdmin && <span className="staff-ticket-list__readonly">Chế độ chỉ xem</span>}
            <AddTicketType onCreated={loadTicketTypes} />
          </div>
        </header>

        <div className="staff-ticket-list__toolbar">
          <label className="staff-ticket-list__search">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm loại vé..." aria-label="Tìm loại vé" />
          </label>
          <div className="staff-ticket-list__filters" role="tablist" aria-label="Lọc theo ngày">
            <button className={activeFilter === "all" ? "is-active" : ""} type="button" role="tab" aria-selected={activeFilter === "all"} onClick={() => setActiveFilter("all")}>Tất cả</button>
            {[27, 28, 29].map((day) => (
              <button className={activeFilter === String(day) ? "is-active" : ""} type="button" role="tab" aria-selected={activeFilter === String(day)} key={day} onClick={() => setActiveFilter(String(day))}>{day}/10</button>
            ))}
          </div>
          <select className="staff-ticket-list__status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Lọc theo trạng thái">
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Không bán</option>
          </select>
          <span>{search || activeFilter !== "all" || statusFilter !== "all" ? `${visibleTickets.length}/${totalTicketTypes}` : totalTicketTypes} loại vé</span>
        </div>

        {isLoading ? (
          <div className="staff-ticket-list__state" aria-busy="true" />
        ) : error ? (
          <div className="staff-ticket-list__state">
            <p>{error}</p>
            <button type="button" onClick={loadTicketTypes}>Thử lại</button>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="staff-ticket-list__state">Không tìm thấy loại vé phù hợp.</div>
        ) : (
          <section className="staff-ticket-list__grid" aria-label="Danh sách loại vé">
            {visibleTickets.map((ticketType, index) => (
              <article className={`staff-ticket-card${Number(ticketType.availableQuantity) < 0 ? " staff-ticket-card--sold-out" : ""}`} key={ticketType._id}>
                <div className="staff-ticket-card__visual">
                  <div className="staff-ticket-card__visual-orbit" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>ENTRY PASS</small>
                </div>
                <div className="staff-ticket-card__body">
                  <div className="staff-ticket-card__title">
                    <h2>{ticketType.ticketTypeName}</h2>
                    <span className="staff-ticket-card__status">
                      <i /> {Number(ticketType.availableQuantity) < 0 ? "Đã bán hết" : ticketType.ticketTypeStatus === "active" ? "Đang mở bán" : "Tạm ngưng"}
                    </span>
                  </div>
                  <div className="staff-ticket-card__meta">
                    <span><CalendarDays size={16} /> Ngày {ticketType.ticketTypeDate}/10/2025</span>
                    <span><Clock3 size={16} /> {ticketType.ticketTypeTime || "Đang cập nhật"}</span>
                  </div>
                  <div className="staff-ticket-card__bottom">
                    <strong>{formatPrice(ticketType.ticketTypePrice)}</strong>
                    <button type="button" onClick={() => navigate(`${isAdmin ? "/admin" : "/staff"}/ticket-types/${ticketType._id}`)}><Eye size={17} /> Xem chi tiết</button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default StaffTicketTypeList;
