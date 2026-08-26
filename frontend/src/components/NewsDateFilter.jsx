import { CalendarDays, X } from "lucide-react";
import "./NewsDateFilter.scss";

const getDaysInMonth = (year, month) => (
  year && month ? new Date(Number(year), Number(month), 0).getDate() : 31
);

const NewsDateFilter = ({
  years = [],
  year,
  month,
  day,
  language = "vi",
  labels,
  onYearChange,
  onMonthChange,
  onDayChange,
  onClear,
}) => {
  const monthFormatter = new Intl.DateTimeFormat(language === "en" ? "en-US" : "vi-VN", {
    month: "long",
    timeZone: "UTC",
  });
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: monthFormatter.format(new Date(Date.UTC(2024, index, 1))),
  }));
  const dayOptions = Array.from(
    { length: getDaysInMonth(year, month) },
    (_, index) => index + 1,
  );
  const hasSelection = Boolean(year || month || day);

  return (
    <section className="news-date-filter" aria-label={labels.filterLabel}>
      <div className="news-date-filter__title">
        <CalendarDays size={18} aria-hidden="true" />
        <span>{labels.filterLabel}</span>
      </div>

      <div className="news-date-filter__fields">
        <label>
          <span>{labels.yearLabel}</span>
          <select
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
          >
            <option value="">{labels.allYears}</option>
            {years.map((optionYear) => (
              <option value={optionYear} key={optionYear}>{optionYear}</option>
            ))}
          </select>
        </label>

        <label>
          <span>{labels.monthLabel}</span>
          <select
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            disabled={!year}
          >
            <option value="">{labels.allMonths}</option>
            {monthOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </label>

        <label>
          <span>{labels.dayLabel}</span>
          <select
            value={day}
            onChange={(event) => onDayChange(event.target.value)}
            disabled={!month}
          >
            <option value="">{labels.allDays}</option>
            {dayOptions.map((optionDay) => (
              <option value={optionDay} key={optionDay}>{optionDay}</option>
            ))}
          </select>
        </label>
      </div>

      {hasSelection && (
        <button type="button" className="news-date-filter__clear" onClick={onClear}>
          <X size={16} aria-hidden="true" /> {labels.clearFilters}
        </button>
      )}
    </section>
  );
};

export default NewsDateFilter;
