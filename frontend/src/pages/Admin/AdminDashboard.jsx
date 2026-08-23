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
import { useTranslation } from "react-i18next";
import { DashboardSkeleton } from "../../components/LoadingSkeletons";
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

const payload = (response) => response?.data?.data || response?.data || {};

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const dashboardText = (key, options) => t(`management.dashboard.${key}`, options);
  const money = (value) => new Intl.NumberFormat(i18n.language === "en" ? "en-US" : "vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value || 0);
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distributionDate, setDistributionDate] = useState("all");
  const [checkInDate, setCheckInDate] = useState("all");

  const load = async () => {
    const toastId = "admin-dashboard-loading";
    toast.loading(dashboardText("adminLoading"), { id: toastId });
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
      toast.success(dashboardText("adminUpdated"), { id: toastId });
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
            <p className="dashboard-kicker">{dashboardText("adminKicker")}</p>
            <h1>{dashboardText("adminTitle")}</h1>
            <p>{dashboardText("adminIntro")}</p>
          </div>
          <button
            className="dashboard-refresh"
            onClick={load}
            disabled={loading}
          >
            <RefreshCw size={16} /> {dashboardText("refresh")}
          </button>
        </header>

        {loading ? <DashboardSkeleton /> : <>
        <section className="dashboard-metrics">
          <Metric
            icon={<CircleDollarSign />}
            label={dashboardText("totalRevenue")}
            value={money(revenue)}
            note={dashboardText("paidOrders", { count: paidOrders.length })}
          />
          <Metric
            icon={<Ticket />}
            label={dashboardText("issuedTickets")}
            value={tickets.length || "—"}
            note={dashboardText("checkedTickets", { count: checked.length })}
          />
          <Metric
            icon={<Users />}
            label={dashboardText("userAccounts")}
            value={users.length || "—"}
            note={dashboardText("currentAccountData")}
          />
          <Metric
            icon={<PackageCheck />}
            label={dashboardText("usageRate")}
            value={
              tickets.length
                ? `${Math.round((checked.length / tickets.length) * 100)}%`
                : "—"
            }
            note={dashboardText("byCheckInStatus")}
          />
        </section>

        <section className="dashboard-grid">
          <ChartCard
            title={dashboardText("ticketDistribution")}
            eyebrow={dashboardText("eventScheduleChart")}
            action={
              <DateFilter
                value={distributionDate}
                dates={dates}
                onChange={setDistributionDate}
                ariaLabel={dashboardText("filterDistribution")}
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
            title={dashboardText("checkInProgress")}
            eyebrow={dashboardText("atGateChart")}
            action={
              <DateFilter
                value={checkInDate}
                dates={dates}
                onChange={setCheckInDate}
                ariaLabel={dashboardText("filterProgress")}
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
                  {dashboardText("checkedIn")} <b>{checkInCount}</b>
                </span>
                <span>
                  <i className="legend-dot legend-dot--gray" />
                  {dashboardText("unused")} {" "}
                  <b>{Math.max(checkInTickets.length - checkInCount, 0)}</b>
                </span>
              </div>
            </div>
          </ChartCard>
        </section>
        </>}

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

const DateFilter = ({ value, dates, onChange, ariaLabel }) => {
  const { t } = useTranslation();
  return <label className="chart-filter">
    <span>{t("management.dashboard.date")}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    >
      <option value="all">{t("management.common.all")}</option>
      {dates.map((date) => (
        <option key={date} value={date}>
          {t("management.dashboard.dayInOctober", { day: date })}
        </option>
      ))}
    </select>
  </label>;
};

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
