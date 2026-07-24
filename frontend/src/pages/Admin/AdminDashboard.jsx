import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CircleDollarSign,
  PackageCheck,
  RefreshCw,
  Ticket,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import axiosClient from "../../apis/axiosClient";
import orderAPI from "../../apis/orderAPI";
import ManageSidebar from "../../components/ManageSidebar";
import { translateError } from "../../utils/translateResponse";
import {
  buildLineGeometry,
  filterTicketsByDay,
  getDashboardDates,
  getTimeSlots,
} from "../../utils/dashboardUtils";
import "./AdminDashboard.scss";
import "../../styles/dashboardFilters.scss";

const money = (value) =>
  `${new Intl.NumberFormat("vi-VN").format(value || 0)} đ`;
const payload = (response) => response?.data?.data || response?.data || {};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distributionDate, setDistributionDate] = useState("all");
  const [checkInDate, setCheckInDate] = useState("all");

  const load = async () => {
    const toastId = "admin-dashboard-loading";
    toast.loading("Đang tải dữ liệu tổng quan...", { id: toastId });
    setLoading(true);
    try {
      const [ordersResponse, ticketsResponse, usersResponse] =
        await Promise.all([
          orderAPI.getAdminOrders({ page: 1, pageSize: 100 }),
          axiosClient.get("/tickets", { params: { page: 1, pageSize: 100 } }),
          axiosClient.get("/users", { params: { page: 1, pageSize: 100 } }),
        ]);
      const orderData = payload(ordersResponse);
      const ticketData = payload(ticketsResponse);
      const userData = payload(usersResponse);
      setOrders(orderData.orders || []);
      setTickets(ticketData.tickets || []);
      setUsers(userData.users || userData.data || []);
      toast.success("Đã cập nhật dashboard.", { id: toastId });
    } catch (error) {
      toast.error(translateError(error), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const paidOrders = orders.filter((order) => order.orderStatus === "Paid");
  const revenue = paidOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0,
  );
  const checked = tickets.filter((ticket) => ticket.ticketStatus === "Checked");
  const dates = useMemo(() => getDashboardDates(tickets), [tickets]);
  const timeSlots = useMemo(() => getTimeSlots(tickets), [tickets]);
  const distributionTickets = useMemo(
    () => filterTicketsByDay(tickets, distributionDate),
    [distributionDate, tickets],
  );
  const checkInTickets = useMemo(
    () => filterTicketsByDay(tickets, checkInDate),
    [checkInDate, tickets],
  );
  const distribution = timeSlots.map((time) => ({
    label: time,
    value: distributionTickets.filter(
      (ticket) => ticket.ticketTypeId?.ticketTypeTime === time,
    ).length,
  }));
  const maxDistribution = Math.max(...distribution.map((bar) => bar.value), 1);
  const checkInCount = checkInTickets.filter(
    (ticket) => ticket.ticketStatus === "Checked",
  ).length;
  const checkInProgress = checkInTickets.length
    ? Math.round((checkInCount / checkInTickets.length) * 100)
    : 0;
  const revenueValues = dates.map((day) =>
    paidOrders
      .filter((order) => new Date(order.createdAt).getDate() === Number(day))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
  );
  const revenueGeometry = buildLineGeometry(revenueValues);

  return (
    <div className="dashboard-shell admin-dashboard">
      <ManageSidebar role="admin" activeItem="dashboard" />
      <main className="dashboard-main">
        <header className="dashboard-hero">
          <div>
            <p className="dashboard-kicker">Bảng điều phối · 2025</p>
            <h1>Toàn cảnh sự kiện</h1>
            <p>Nhịp vận hành, doanh thu và sức khỏe vé trong một màn hình.</p>
          </div>
          <button
            className="dashboard-refresh"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={16} /> Làm mới
          </button>
        </header>

        <section className="dashboard-metrics">
          <Metric
            icon={<CircleDollarSign />}
            label="Doanh thu tổng"
            value={money(revenue)}
            note={`${paidOrders.length} đơn đã thanh toán`}
          />
          <Metric
            icon={<Ticket />}
            label="Tổng vé phát hành"
            value={tickets.length || "—"}
            note={`${checked.length} vé đã check-in`}
          />
          <Metric
            icon={<Users />}
            label="Tài khoản người dùng"
            value={users.length || "—"}
            note="Dữ liệu tài khoản hiện tại"
          />
          <Metric
            icon={<PackageCheck />}
            label="Tỷ lệ sử dụng vé"
            value={
              tickets.length
                ? `${Math.round((checked.length / tickets.length) * 100)}%`
                : "—"
            }
            note="Theo trạng thái check-in"
          />
        </section>

        <section className="dashboard-grid">
          <ChartCard
            title="Phân bố vé theo từng mốc giờ"
            eyebrow="CỘT · LỊCH SỰ KIỆN"
            action={
              <DateFilter
                value={distributionDate}
                dates={dates}
                onChange={setDistributionDate}
                ariaLabel="Lọc phân bố vé theo ngày"
              />
            }
          >
            <div className="bar-chart">
              {distribution.map((bar) => (
                <div className="bar-item" key={bar.label}>
                  <strong>{bar.value || "—"}</strong>
                  <div className="bar-track">
                    <i
                      style={{
                        height: `${Math.max((bar.value / maxDistribution) * 100, bar.value ? 12 : 3)}%`,
                      }}
                    />
                  </div>
                  <span>{bar.label}</span>
                </div>
              ))}
            </div>
          </ChartCard>
          <ChartCard
            title="Tiến độ check-in mỗi ngày"
            eyebrow="PIE · TẠI CỔNG"
            action={
              <DateFilter
                value={checkInDate}
                dates={dates}
                onChange={setCheckInDate}
                ariaLabel="Lọc tiến độ check-in theo ngày"
              />
            }
          >
            <div className="pie-layout">
              <div
                className="pie-chart"
                style={{ "--pie-progress": `${checkInProgress}%` }}
              >
                <strong>
                  {checkInTickets.length ? `${checkInProgress}%` : "—"}
                </strong>
              </div>
              <div className="legend">
                <span>
                  <i className="legend-dot legend-dot--red" />
                  Đã check-in <b>{checkInCount}</b>
                </span>
                <span>
                  <i className="legend-dot legend-dot--gray" />
                  Chưa sử dụng{" "}
                  <b>{Math.max(checkInTickets.length - checkInCount, 0)}</b>
                </span>
              </div>
            </div>
          </ChartCard>
        </section>

        {/* <section className="dashboard-wide">
        <ChartCard title="Doanh thu theo ngày tạo đơn" eyebrow="ĐƯỜNG · DÒNG TIỀN">
          <div className="line-chart">
            <div className="line-values">
              {dates.map((day, index) => <span key={day}>
                <b>{revenueValues[index] ? money(revenueValues[index]) : "—"}</b>
                <em>{day}</em>
              </span>)}
            </div>
            <svg viewBox="0 0 600 150" role="img" aria-label="Biểu đồ doanh thu theo ngày">
              <path d={revenueGeometry.path} />
              {revenueGeometry.points.map((point, index) => <circle key={dates[index]} cx={point.x} cy={point.y} r="5" />)}
            </svg>
          </div>
        </ChartCard>
      </section> */}
      </main>
    </div>
  );
};

const DateFilter = ({ value, dates, onChange, ariaLabel }) => (
  <label className="chart-filter">
    <span>Ngày</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    >
      <option value="all">Tất cả</option>
      {dates.map((date) => (
        <option key={date} value={date}>
          Ngày {date}/10
        </option>
      ))}
    </select>
  </label>
);

const Metric = ({ icon, label, value, note }) => (
  <article className="metric-card">
    <div className="metric-icon">{icon}</div>
    <span>{label}</span>
    <strong>{value}</strong>
    <small>{note}</small>
  </article>
);

const ChartCard = ({ title, eyebrow, action, children }) => (
  <article className="chart-card">
    <header>
      <div>
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      <div className="chart-card__actions">
        {action}
        <ArrowUpRight size={18} />
      </div>
    </header>
    {children}
  </article>
);

export default AdminDashboard;
