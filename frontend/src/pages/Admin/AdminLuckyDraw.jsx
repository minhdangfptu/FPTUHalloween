import React, { useCallback, useEffect, useState } from "react";
import { CalendarDays, Gift, Pencil, Phone, QrCode, RefreshCw, Search, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import { translateError, translateSuccess } from "../../utils/translateResponse";
import "./AdminLuckyDraw.scss";

const AdminLuckyDraw = () => {
  const { t, i18n } = useTranslation();
  const luckyDraw = (key) => t(`luckyDraw.${key}`);
  const openQrTab = () => window.open(`${window.location.origin}/lucky-draw?qr=1`, "_blank", "noopener,noreferrer");
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [filters, setFilters] = useState({ search: "", prize: "", from: "", to: "" });
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingPrize, setEditingPrize] = useState("");

  const loadEntries = useCallback(async (page = 1) => {
    setIsLoading(true);
    const loadingToast = toast.loading(luckyDraw("loading"));
    try {
      const response = await axiosClient.get("/lucky-draw", { params: { ...filters, page, pageSize: 10 } });
      const data = response.data?.data || {};
      setEntries(data.entries || []);
      setPagination(data.pagination || { page, pageSize: 10, total: 0, totalPages: 1 });
      toast.success(translateSuccess("Operation successful"), { id: loadingToast });
    } catch (error) {
      toast.error(translateError(error), { id: loadingToast });
    } finally { setIsLoading(false); }
  }, [filters]);

  useEffect(() => { loadEntries(1); }, [loadEntries]);

  const formatDate = (date) => date ? new Date(date).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN") : "—";
  const submitSearch = (event) => { event.preventDefault(); setFilters((current) => ({ ...current, search: searchInput })); };
  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const savePrize = async (entry) => {
    const loadingToast = toast.loading(luckyDraw("updating"));
    try {
      const response = await axiosClient.patch(`/lucky-draw/${entry._id}/prize`, { prize: editingPrize });
      setEntries((current) => current.map((item) => item._id === entry._id ? response.data.data : item));
      setEditingId(null);
      toast.success(luckyDraw("successUpdate"), { id: loadingToast });
    } catch (error) { toast.error(translateError(error), { id: loadingToast }); }
  };

  return <div className="staff-manage-layout admin-lucky-draw-page">
    <ManageSidebar role="admin" activeItem="lucky-draw" />
    <main className="admin-lucky-draw">
      <header className="admin-lucky-draw__header"><div><p className="admin-lucky-draw__kicker"><Gift size={16} /> {luckyDraw("luckyDraw")}</p><h1>{luckyDraw("title")}</h1><p>{luckyDraw("intro")}</p></div><div className="admin-lucky-draw__header-actions"><button className="admin-lucky-draw__qr" type="button" onClick={openQrTab}><QrCode size={16} /> {luckyDraw("showQr")}</button><button className="admin-lucky-draw__refresh" type="button" onClick={() => loadEntries(1)} disabled={isLoading}><RefreshCw size={16} /> {luckyDraw("refresh")}</button></div></header>
      <section className="admin-lucky-draw__card"><div className="admin-lucky-draw__summary"><strong>{pagination.total}</strong><span>{luckyDraw("participants")}</span><div className="admin-lucky-draw__filters"><form className="admin-lucky-draw__search" onSubmit={submitSearch}><Search size={15} /><input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={luckyDraw("searchPlaceholder")} /><button type="submit" aria-label={t("management.common.search")}><Search size={15} /></button></form><label><span>{luckyDraw("prize")}</span><input value={filters.prize} onChange={(event) => updateFilter("prize", event.target.value)} placeholder={luckyDraw("allPrizes")} /></label><label><span>{luckyDraw("from")}</span><input type="date" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} /></label><label><span>{luckyDraw("to")}</span><input type="date" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} /></label></div></div>
        {isLoading ? <div className="admin-lucky-draw__empty">{luckyDraw("loadingData")}</div> : entries.length === 0 ? <div className="admin-lucky-draw__empty">{luckyDraw("empty")}</div> : <div className="admin-lucky-draw__table-wrap"><table><thead><tr><th>{luckyDraw("name")}</th><th>{luckyDraw("phone")}</th><th>{luckyDraw("time")}</th><th>{luckyDraw("prize")}</th><th>{luckyDraw("actions")}</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry._id}><td><div className="admin-lucky-draw__person"><UserRound size={18} /><strong>{entry.name}</strong></div></td><td><span className="admin-lucky-draw__contact"><Phone size={14} />{entry.phoneNumber}</span></td><td><span className="admin-lucky-draw__date"><CalendarDays size={14} />{formatDate(entry.createAt)}</span></td><td>{editingId === entry._id ? <input className="admin-lucky-draw__prize-input" value={editingPrize} onChange={(event) => setEditingPrize(event.target.value)} autoFocus /> : <span className={`admin-lucky-draw__prize ${entry.prize ? "is-won" : ""}`}>{entry.prize || luckyDraw("noPrize")}</span>}</td><td>{editingId === entry._id ? <button className="admin-lucky-draw__save" type="button" onClick={() => savePrize(entry)}>{luckyDraw("save")}</button> : <button className="admin-lucky-draw__edit" type="button" onClick={() => { setEditingId(entry._id); setEditingPrize(entry.prize || ""); }}><Pencil size={15} /> {luckyDraw("edit")}</button>}</td></tr>)}</tbody></table></div>}
        {!isLoading && pagination.totalPages > 1 && <div className="admin-lucky-draw__pagination"><button type="button" disabled={pagination.page <= 1} onClick={() => loadEntries(pagination.page - 1)}>{luckyDraw("previous")}</button><span>{luckyDraw("page")} {pagination.page} / {pagination.totalPages}</span><button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadEntries(pagination.page + 1)}>{luckyDraw("next")}</button></div>}
      </section>
    </main>
  </div>;
};

export default AdminLuckyDraw;
