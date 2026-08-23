import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ScanLine,
} from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { DashboardSkeleton } from "../../components/LoadingSkeletons";
import axiosClient from "../../apis/axiosClient";
import ManageSidebar from "../../components/ManageSidebar";
import { translateError } from "../../utils/translateResponse";
import {
  buildLineGeometry,
  filterTicketsByDay,
  getDashboardDates,
  getTimeSlots,
} from "../../utils/dashboardUtils";
import "./StaffDashboardPage.scss";
import "../../styles/dashboardFilters.scss";

const dataOf = (response) => response?.data?.data || response?.data || {};

const StaffDashboardPage = () => {
  const { t, i18n } = useTranslation();
  const dashboardText = (key, options) => t(`management.dashboard.${key}`, options);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distributionDate, setDistributionDate] = useState("all");
  const [checkInDate, setCheckInDate] = useState("all");

  const load = async () => {
    const id = "staff-dashboard-loading";
    toast.loading(dashboardText("staffLoading"), { id });
    setLoading(true);
    try {
      const response = await axiosClient.get("/tickets", {
        params: { page: 1, pageSize: 100 },
      });
      setTickets(dataOf(response).tickets || []);
      toast.success(dashboardText("staffUpdated"), { id });
    } catch (error) {
      toast.error(translateError(error), { id });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const checked = tickets.filter((ticket) => ticket.ticketStatus === "Checked");
  const today = String(new Date().getDate());
  const todayTickets = tickets.filter(
    (ticket) => String(ticket.ticketTypeId?.ticketTypeDate) === today,
  );
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
  const checkInHours = useMemo(() => {
    const hours = [
      ...new Set(
        checkInTickets
          .filter(
            (ticket) => ticket.ticketStatus === "Checked" && ticket.checkedInAt,
          )
          .map(
            (ticket) =>
              `${String(new Date(ticket.checkedInAt).getHours()).padStart(2, "0")}:00`,
          ),
      ),
    ];
    return (
      hours.length ? hours : ["08:00", "10:00", "12:00", "14:00", "16:00"]
    ).sort();
  }, [checkInTickets]);
  const checkInHourValues = checkInHours.map(
    (hour) =>
      checkInTickets.filter(
        (ticket) =>
          ticket.ticketStatus === "Checked" &&
          ticket.checkedInAt &&
          `${String(new Date(ticket.checkedInAt).getHours()).padStart(2, "0")}:00` ===
            hour,
      ).length,
  );
  const checkInGeometry = buildLineGeometry(checkInHourValues);

  return (
    <div className="dashboard-shell staff-dashboard">
      <ManageSidebar role="staff" activeItem="dashboard" />
      <main className="dashboard-main">
        <header className="dashboard-hero">
          <div>
            <p className="dashboard-kicker">{dashboardText("staffKicker")}</p>
            <h1>{dashboardText("staffTitle")}</h1>
            <p>{dashboardText("staffIntro")}</p>
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
            icon={<CheckCircle2 />}
            label={dashboardText("checkedIn")}
            value={checked.length || "—"}
            note={dashboardText("allShifts")}
          />
          <Metric
            icon={<ScanLine />}
            label={dashboardText("todayTickets")}
            value={todayTickets.length || "—"}
            note={dashboardText("day", { day: today })}
          />
          <Metric
            icon={<Clock3 />}
            label={dashboardText("latestScan")}
            value={
              checked[0]
                ? new Date(checked[0].checkedInAt).toLocaleTimeString(i18n.language === "en" ? "en-US" : "vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
            note={dashboardText("serverTime")}
          />
        </section>

        <section className="dashboard-grid">
          <ChartCard
            title={dashboardText("ticketDistribution")}
            eyebrow={dashboardText("quickScanChart")}
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
            eyebrow={dashboardText("gateStatusChart")}
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
        <ChartCard title="Check-in theo mốc giờ" eyebrow="ĐƯỜNG · NHỊP CA TRỰC">
          <div className="line-chart">
            <div className="line-values">
              {checkInHours.map((hour, index) => <span key={hour}>
                <b>{checkInHourValues[index] || "—"}</b>
                <em>{hour}</em>
              </span>)}
            </div>
            <svg viewBox="0 0 600 150" role="img" aria-label="Biểu đồ check-in theo mốc giờ">
              <path d={checkInGeometry.path} />
              {checkInGeometry.points.map((point, index) => <circle key={checkInHours[index]} cx={point.x} cy={point.y} r="5" />)}
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

export default StaffDashboardPage;
