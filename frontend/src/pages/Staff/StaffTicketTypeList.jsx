import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock3, Eye, Search, Ticket } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { SkeletonCards } from "../../components/LoadingSkeletons";
import ManageSidebar from "../../components/ManageSidebar";
import AddTicketType from "../../components/AddTicketType";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import "./StaffTicketTypeList.scss";

const getStoredRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return String(user?.role?.roleName || user?.roleName || user?.role || user?.roleId?.roleName || "").toLowerCase();
  } catch {
    return "";
  }
};

const StaffTicketTypeList = () => {
  const { t, i18n } = useTranslation();
  const ticketTypeText = (key, options) => t(`management.ticketTypes.${key}`, options);
  const formatPrice = (price) => new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "vi-VN", {
    style: "currency", currency: "VND",
  }).format(price || 0);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin/") || getStoredRole() === "admin";
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [totalTicketTypes, setTotalTicketTypes] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTicketTypes = useCallback(async () => {
    const loadingToast = toast.loading(ticketTypeText("loadingList"));
    setIsLoading(true);
    setError(null);
    try {
      const result = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      const nextTicketTypes = Array.isArray(result?.ticketTypes) ? result.ticketTypes : [];
      setTicketTypes(nextTicketTypes);
      setTotalTicketTypes(result?.pagination?.total ?? nextTicketTypes.length);
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
      const isSoldOut = Number(ticketType.availableQuantity) <= 0;
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
      <ManageSidebar role={isAdmin ? "admin" : "staff"} activeItem="ticket-types" />
      <main className="staff-ticket-list">
        <header className="staff-ticket-list__header">
          <div>
            <p className="staff-ticket-list__kicker"><Ticket size={16} /> {ticketTypeText("kicker")}</p>
            <h1>{ticketTypeText("title")}</h1>
            <p>{ticketTypeText("intro")}</p>
          </div>
          <div className="staff-ticket-list__header-actions">
            {!isAdmin && <span className="staff-ticket-list__readonly">{ticketTypeText("readOnly")}</span>}
            <AddTicketType onCreated={loadTicketTypes} />
          </div>
        </header>

        <div className="staff-ticket-list__toolbar">
          <label className="staff-ticket-list__search">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={ticketTypeText("searchPlaceholder")} aria-label={ticketTypeText("search")} />
          </label>
          <div className="staff-ticket-list__filters" role="tablist" aria-label={ticketTypeText("filterDate")}>
            <button className={activeFilter === "all" ? "is-active" : ""} type="button" role="tab" aria-selected={activeFilter === "all"} onClick={() => setActiveFilter("all")}>{t("management.common.all")}</button>
            {[27, 28, 29].map((day) => (
              <button className={activeFilter === String(day) ? "is-active" : ""} type="button" role="tab" aria-selected={activeFilter === String(day)} key={day} onClick={() => setActiveFilter(String(day))}>{day}/10</button>
            ))}
          </div>
          <select className="staff-ticket-list__status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label={ticketTypeText("filterStatus")}>
            <option value="all">{ticketTypeText("allStatuses")}</option>
            <option value="active">{ticketTypeText("selling")}</option>
            <option value="inactive">{ticketTypeText("notSelling")}</option>
          </select>
          <span>{ticketTypeText("count", { count: search || activeFilter !== "all" || statusFilter !== "all" ? `${visibleTickets.length}/${totalTicketTypes}` : totalTicketTypes })}</span>
        </div>

        {isLoading ? (
          <SkeletonCards count={3} />
        ) : error ? (
          <div className="staff-ticket-list__state">
            <p>{error}</p>
            <button type="button" onClick={loadTicketTypes}>{t("management.common.retry")}</button>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="staff-ticket-list__state">{ticketTypeText("empty")}</div>
        ) : (
          <section className="staff-ticket-list__grid" aria-label={ticketTypeText("title")}>
            {visibleTickets.map((ticketType, index) => (
              <article className={`staff-ticket-card${Number(ticketType.availableQuantity) <= 0 ? " staff-ticket-card--sold-out" : ""}`} key={ticketType._id}>
                <div className="staff-ticket-card__visual">
                  <div className="staff-ticket-card__visual-orbit" />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <small>{ticketTypeText("entryPass")}</small>
                </div>
                <div className="staff-ticket-card__body">
                  <div className="staff-ticket-card__title">
                    <h2>{ticketType.ticketTypeName}</h2>
                    <span className="staff-ticket-card__status">
                      <i /> {ticketTypeText(Number(ticketType.availableQuantity) <= 0 ? "soldOut" : ticketType.ticketTypeStatus === "active" ? "onSale" : "paused")}
                    </span>
                  </div>
                  <div className="staff-ticket-card__meta">
                    <span><CalendarDays size={16} /> {ticketTypeText("eventDate", { day: ticketType.ticketTypeDate })}</span>
                    <span><Clock3 size={16} /> {ticketType.ticketTypeTime || t("management.common.notUpdated")}</span>
                  </div>
                  <div className="staff-ticket-card__bottom">
                    <strong>{formatPrice(ticketType.ticketTypePrice)}</strong>
                    <button type="button" onClick={() => navigate(`${isAdmin ? "/admin" : "/staff"}/ticket-types/${ticketType._id}`)}><Eye size={17} /> {ticketTypeText("viewDetails")}</button>
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
