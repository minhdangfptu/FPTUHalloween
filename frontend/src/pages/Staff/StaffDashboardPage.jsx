import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ScanLine,
} from "lucide-react";
import toast from "react-hot-toast";
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
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [distributionDate, setDistributionDate] = useState("all");
  const [checkInDate, setCheckInDate] = useState("all");

  const load = async () => {
    const id = "staff-dashboard-loading";
    toast.loading("Đang tải ca vận hành...", { id });
    setLoading(true);
    try {
      const response = await axiosClient.get("/tickets", {
        params: { page: 1, pageSize: 100 },
      });
      setTickets(dataOf(response).tickets || []);
      toast.success("Đã cập nhật dữ liệu ca trực.", { id });
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
            <p className="dashboard-kicker">Trực bàn Check-in · hôm nay</p>
            <h1>Nhịp check-in</h1>
            <p>
              Bạn chớ nên bỏ cuộc khi bạn vẫn còn điều gì đó để cho đi. Không có
              gì là hoàn toàn bế tắc, sự việc chỉ thật sự trở nên bế tắc khi bạn
              thôi không cố gắng nữa. Vậy nên đừng ngừng cố gắng nhé, bạn sẽ làm
              được thôi! (Minh Đặng không nói thế)
            </p>
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
            icon={<CheckCircle2 />}
            label="Đã check-in"
            value={checked.length || "—"}
            note="Tất cả ca trực"
          />
          <Metric
            icon={<ScanLine />}
            label="Vé trong ngày"
            value={todayTickets.length || "—"}
            note={`Ngày ${today}`}
          />
          <Metric
            icon={<Clock3 />}
            label="Lượt gần nhất"
            value={
              checked[0]
                ? new Date(checked[0].checkedInAt).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"
            }
            note="Theo thời gian server"
          />
        </section>

        <section className="dashboard-grid">
          <ChartCard
            title="Phân bố vé theo từng mốc giờ"
            eyebrow="CỘT · QUÉT NHANH"
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
            eyebrow="PIE · TÌNH HÌNH TẠI CỔNG"
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

export default StaffDashboardPage;
