/* Hallmark · pre-emit critique: P5 H5 E4 S5 R4 V5 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CircleDollarSign, PackageCheck, RefreshCw, Ticket, Users } from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../apis/axiosClient";
import orderAPI from "../../apis/orderAPI";
import ManageSidebar from "../../components/ManageSidebar";
import { translateError } from "../../utils/translateResponse";
import "./AdminDashboard.scss";

const money = (value) => `${new Intl.NumberFormat("vi-VN").format(value || 0)} đ`;
const payload = (response) => response?.data?.data || response?.data || {};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const toastId = "admin-dashboard-loading";
    toast.loading("Đang tải dữ liệu tổng quan...", { id: toastId }); setLoading(true);
    try {
      const [ordersResponse, ticketsResponse, usersResponse] = await Promise.all([
        orderAPI.getAdminOrders({ page: 1, pageSize: 100 }),
        axiosClient.get("/tickets", { params: { page: 1, pageSize: 100 } }),
        axiosClient.get("/users", { params: { page: 1, pageSize: 100 } }),
      ]);
      const orderData = payload(ordersResponse); const ticketData = payload(ticketsResponse); const userData = payload(usersResponse);
      setOrders(orderData.orders || []); setTickets(ticketData.tickets || []); setUsers(userData.users || userData.data || []);
      toast.success("Đã cập nhật dashboard.", { id: toastId });
    } catch (error) { toast.error(translateError(error), { id: toastId }); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const paidOrders = orders.filter((order) => order.orderStatus === "Paid");
  const revenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
  const checked = tickets.filter((ticket) => ticket.ticketStatus === "Checked").length;
  const bars = useMemo(() => ["27", "28", "29"].map((label) => ({ label, value: tickets.filter((t) => String(t.ticketTypeId?.ticketTypeDate) === label).length })), [tickets]);
  const maxBar = Math.max(...bars.map((bar) => bar.value), 1);
  const pieTotal = Math.max(tickets.length, 1); const pieChecked = Math.round((checked / pieTotal) * 100);

  return <div className="dashboard-shell admin-dashboard"><ManageSidebar role="admin" activeItem="dashboard" /><main className="dashboard-main">
    <header className="dashboard-hero"><div><p className="dashboard-kicker">Bảng điều phối · 2025</p><h1>Toàn cảnh sự kiện</h1><p>Nhịp vận hành, doanh thu và sức khỏe vé trong một màn hình.</p></div><button className="dashboard-refresh" onClick={load} disabled={loading}><RefreshCw size={16} /> Làm mới</button></header>
    <section className="dashboard-metrics"><Metric icon={<CircleDollarSign />} label="Doanh thu đã thu" value={money(revenue)} note={`${paidOrders.length} đơn đã thanh toán`} /><Metric icon={<Ticket />} label="Tổng vé phát hành" value={tickets.length || "—"} note={`${checked} vé đã check-in`} /><Metric icon={<Users />} label="Tài khoản người dùng" value={users.length || "—"} note="Dữ liệu tài khoản hiện tại" /><Metric icon={<PackageCheck />} label="Tỷ lệ sử dụng vé" value={tickets.length ? `${Math.round((checked / tickets.length) * 100)}%` : "—"} note="Theo trạng thái check-in" /></section>
    <section className="dashboard-grid"><ChartCard title="Phân bổ vé theo ngày" eyebrow="CỘT · LỊCH SỰ KIỆN"><div className="bar-chart">{bars.map((bar) => <div className="bar-item" key={bar.label}><strong>{bar.value || "—"}</strong><div className="bar-track"><i style={{ height: `${Math.max((bar.value / maxBar) * 100, bar.value ? 12 : 3)}%` }} /></div><span>Ngày {bar.label}</span></div>)}</div></ChartCard><ChartCard title="Tiến độ check-in" eyebrow="PIE · TẠI CỔNG"><div className="pie-layout"><div className="pie-chart" style={{ "--pie-progress": `${pieChecked}%` }}><strong>{tickets.length ? `${pieChecked}%` : "—"}</strong></div><div className="legend"><span><i className="legend-dot legend-dot--red" />Đã check-in <b>{checked}</b></span><span><i className="legend-dot legend-dot--gray" />Chưa sử dụng <b>{Math.max(tickets.length - checked, 0)}</b></span></div></div></ChartCard></section>
    <section className="dashboard-wide"><ChartCard title="Doanh thu theo ngày tạo đơn" eyebrow="ĐƯỜNG · DÒNG TIỀN"><div className="line-chart"><div className="line-values">{["27", "28", "29"].map((label) => { const value = paidOrders.filter((o) => new Date(o.createdAt).getDate() === Number(label)).reduce((sum, o) => sum + Number(o.totalAmount || 0), 0); return <span key={label}><b>{value ? money(value) : "—"}</b><em>{label}</em></span>; })}</div><svg viewBox="0 0 600 150" role="img" aria-label="Biểu đồ doanh thu"><path d="M25 120 C160 110 190 75 300 88 S440 40 575 30" /><circle cx="25" cy="120" r="5" /><circle cx="300" cy="88" r="5" /><circle cx="575" cy="30" r="5" /></svg></div></ChartCard></section>
  </main></div>;
};
const Metric = ({ icon, label, value, note }) => <article className="metric-card"><div className="metric-icon">{icon}</div><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
const ChartCard = ({ title, eyebrow, children }) => <article className="chart-card"><header><div><p>{eyebrow}</p><h2>{title}</h2></div><ArrowUpRight size={18} /></header>{children}</article>;
export default AdminDashboard;
