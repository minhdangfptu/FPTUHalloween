import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MapPin,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { SkeletonCards } from "../../components/LoadingSkeletons";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import "./ListTicketTypePage.scss";

const FEATURE_KEYS = ["featureExperience", "featurePersonal", "featureEventDay"];

const ListTicketTypePage = () => {
  const { t } = useTranslation();
  const ticket = (key, options) => t(`ticket.${key}`, options);
  const [activeFilter, setActiveFilter] = useState("all");
  const [ticketTypes, setTicketTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadTicketTypes = useCallback(async () => {
    const loadingToast = toast.loading(ticket("loadingList"));
    setIsLoading(true);
    setError(null);
    try {
      const data = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      setTicketTypes(data.ticketTypes || []);
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  }, []);

  useEffect(() => {
    loadTicketTypes();
  }, [loadTicketTypes]);

  const visibleTickets = useMemo(
    () =>
      activeFilter === "all"
        ? ticketTypes.filter(
            ({ ticketTypeStatus, availableQuantity }) =>
              ticketTypeStatus === "active" && Number(availableQuantity) > 0,
          )
        : ticketTypes.filter(
            ({ ticketTypeDate, ticketTypeStatus, availableQuantity }) =>
              ticketTypeStatus === "active" &&
              Number(availableQuantity) > 0 &&
              String(ticketTypeDate) === activeFilter,
          ),
    [activeFilter, ticketTypes],
  );

  const formatPrice = (price) =>
    `${new Intl.NumberFormat("vi-VN").format(price)} VND`;

  return (
    <main className="ticket-list-page">
      <section className="ticket-list-hero">
        <div className="ticket-list-hero__copy">
          <p className="ticket-list-kicker">
            <Ticket size={15} /> FPTU Halloween 2026
          </p>
          <h1>
            {t("ticketHero.titleBefore")}
            <br />
            <span style={{ color: "red" }}>{t("ticketHero.titleAfter")}</span>
          </h1>
          <p className="ticket-list-hero__intro">{t("ticketHero.intro")}</p>
          <div className="ticket-list-hero__note">
            <span className="ticket-list-hero__dot" /> {t("ticketHero.note")}
          </div>
        </div>
        <div className="ticket-list-hero__mark" aria-hidden="true">
          <span style={{ color: "red" }}>HLW</span>
          <span>2026</span>
        </div>
      </section>
      <section
        className="ticket-list-content"
        aria-labelledby="ticket-list-heading"
      >
        <div className="ticket-list-heading-row">
          <div>
            <p className="ticket-list-section-label">{t("ticketHero.sectionKicker")}</p>
            <h2 id="ticket-list-heading">{t("ticketHero.sectionTitle")}</h2>
          </div>
          <div
            className="ticket-list-filter"
            role="tablist"
            aria-label={t("ticketHero.filterLabel")}
          >
            <button
              className={activeFilter === "all" ? "is-active" : ""}
              onClick={() => setActiveFilter("all")}
              role="tab"
              aria-selected={activeFilter === "all"}
            >
              {ticket("all")}
            </button>
            {[27, 28, 29].map((day) => (
              <button
                key={day}
                className={activeFilter === String(day) ? "is-active" : ""}
                onClick={() => setActiveFilter(String(day))}
                role="tab"
                aria-selected={activeFilter === String(day)}
              >
                {day}/10
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <SkeletonCards count={3} />
        ) : error ? (
          <div className="ticket-list-state">
            <p>{error}</p>
            <button type="button" onClick={loadTicketTypes}>
              {ticket("retry")}
            </button>
          </div>
        ) : visibleTickets.length === 0 ? (
          <div className="ticket-list-state">{ticket("empty")}</div>
        ) : (
          <div className="ticket-list-grid">
            {visibleTickets.map((ticketType, index) => (
              <article
                className="ticket-card ticket-card--red"
                key={ticketType._id}
              >
                <div className="ticket-card__topline">
                  <span className="ticket-card__eyebrow">
                    {ticket("hauntedHouse")}
                  </span>
                  <span className="ticket-card__status">
                    <span />{" "}
                    {ticketType.ticketTypeStatus === "active"
                      ? ticket("active")
                      : ticket("paused")}
                  </span>
                </div>
                <div className="ticket-card__visual" aria-hidden="true">
                  <div className="ticket-card__visual-orbit" />
                  <span className="ticket-card__visual-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ticket-card__visual-word">ENTRY</span>
                </div>
                <div className="ticket-card__body">
                  <div className="ticket-card__title-row">
                    <h3>{ticketType.ticketTypeName}</h3>
                    <strong className="ticket-card__price">
                      {formatPrice(ticketType.ticketTypePrice)}
                    </strong>
                  </div>
                  <div className="ticket-card__meta">
                    <span>
                      <Clock3 size={16} />
                      {ticketType.ticketTypeTime}
                    </span>
                    <span>
                      <CalendarDays size={16} />
                      {ticket("dateTime", { date: ticketType.ticketTypeDate })}
                    </span>
                    <span>
                      <MapPin size={16} />
                      {ticket("venue")}
                    </span>
                    <span>
                      <Ticket size={16} />
                      {ticketType.availableQuantity} {ticket("tickets")} {ticket("remaining").toLowerCase()}
                    </span>
                  </div>
                  <ul>
                    {FEATURE_KEYS.map((featureKey) => (
                      <li key={featureKey}>
                        <Check size={16} /> {ticket(featureKey)}
                      </li>
                    ))}
                  </ul>
                  <button
                    className="ticket-card__action"
                    onClick={() =>
                      navigate(`/tickets/detail/${ticketType._id}`)
                    }
                  >
                    <span>{ticket("detail")}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="ticket-list-trust" aria-label={ticket("purchaseInfo")}>
        <div>
          <ShoppingBag size={20} />
          <span>
            <strong>{ticket("simplePurchase")}</strong>{ticket("chooseDay")}
          </span>
        </div>
        <div>
          <Clock3 size={20} />
          <span>
            <strong>{ticket("digitalTicket")}</strong>{ticket("receiveAfterPayment")}
          </span>
        </div>
        <div>
          <Ticket size={20} />
          <span>
            <strong>{ticket("oneTicket")}</strong>{ticket("useOnEventDay")}
          </span>
        </div>
      </section>
    </main>
  );
};

export default ListTicketTypePage;
