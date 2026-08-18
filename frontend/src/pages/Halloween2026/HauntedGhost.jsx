import React, { useCallback, useEffect, useState } from "react";
import { ArrowRight, CalendarDays, Clock3, MapPin, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ticketTypeAPI from "../../apis/ticketTypeAPI";
import { translateError } from "../../utils/translateResponse";
import { useTranslation } from "react-i18next";
import coverImage from "../../assets/cover-01.png";
import "./HauntedGhost.scss";

const HauntedGhost = () => {
  const { t } = useTranslation();
  const page = (key, options) => t(`eventPages.haunted.${key}`, options);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadTickets = useCallback(async () => {
    const loadingToast = toast.loading(page("loading"));
    setIsLoading(true);
    setError("");
    try {
      const data = await ticketTypeAPI.getList({ page: 1, pageSize: 100 });
      const activeTickets = (data.ticketTypes || []).filter(
        (ticket) => ticket.ticketTypeStatus === "active",
      );
      setTickets(activeTickets);
      toast.success(page("loaded"), { id: loadingToast });
    } catch (requestError) {
      const message = translateError(requestError);
      setError(message);
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  return (
    <main className="haunted-ghost-page">
      <section
        className="haunted-ghost-hero"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="haunted-ghost-hero__copy">
          <p className="haunted-ghost-kicker">
            {page("kicker")}
          </p>
          <h1>
            {page("title")}
            <br />
            <span>{page("titleAfter")}</span>
          </h1>
          <p className="haunted-ghost-hero__intro">
            {page("intro")}
          </p>
        </div>
        <div className="haunted-ghost-hero__stamp" aria-hidden="true">
          <strong>HLW</strong>
          <span>2026</span>
        </div>
      </section>

      <section
        className="haunted-ghost-story"
        aria-labelledby="haunted-story-title"
      >
        <div className="haunted-ghost-section-label">{page("storyLabel")}</div>
        <div>
          <h2 id="haunted-story-title">{page("storyTitle")}</h2>
          <p>{page("storyText")}</p>
        </div>
      </section>

      <section
        className="haunted-ghost-trailer"
        aria-labelledby="haunted-trailer-title"
      >
        <div
          className="haunted-ghost-trailer__visual"
          role="img"
          aria-label={page("trailerPlaceholder")}
        >
          <Play size={34} fill="currentColor" />
          <span>{page("trailerPlaceholder")}</span>
        </div>
        <div className="haunted-ghost-trailer__copy">
          <div className="haunted-ghost-section-label">{page("trailerLabel")}</div>
          <h2 id="haunted-trailer-title">{page("trailer")}</h2>
          <p>{page("trailerText")}</p>
        </div>
      </section>

      <section
        className="haunted-ghost-rules"
        aria-labelledby="haunted-rules-title"
      >
        <div className="haunted-ghost-rules__image">
          <img src={coverImage} alt={page("imageAlt")} />
        </div>
        <div className="haunted-ghost-rules__copy">
          <div className="haunted-ghost-section-label">
            {page("rulesLabel")}
          </div>
          <h2 id="haunted-rules-title">{page("rulesTitle")}</h2>
          <ul>
            {page("rules", { returnObjects: true }).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="haunted-ghost-tickets"
        aria-labelledby="haunted-ticket-title"
      >
        <header className="haunted-ghost-heading">
          <div>
            <div className="haunted-ghost-section-label">{page("ticketLabel")}</div>
            <h2 id="haunted-ticket-title">{page("ticketTitle")}</h2>
          </div>
          <p>{page("ticketIntro")}</p>
        </header>
        {isLoading ? (
          <div className="haunted-ghost-state" aria-busy="true">
            <Skeleton count={4} height={24} />
          </div>
        ) : error ? (
          <div className="haunted-ghost-state haunted-ghost-state--error">
            <p>{error}</p>
            <button type="button" onClick={loadTickets}>
              {page("retry")}
            </button>
          </div>
        ) : tickets.length === 0 ? (
          <div className="haunted-ghost-state">
            {page("empty")}
          </div>
        ) : (
          <div className="haunted-ghost-table-wrap">
            <div className="haunted-ghost-ticket-venue">
              <MapPin size={16} aria-hidden="true" />
              <span>
                <strong>{page("location")}:</strong> {page("venue")}
              </span>
            </div>
            <table
              className="haunted-ghost-table"
              aria-label={page("ticketTitle")}
            >
              <thead>
                <tr>
                  <th scope="col">{page("day")}</th>
                  <th scope="col">{page("time")}</th>
                  <th scope="col">{page("price")}</th>
                  <th scope="col">{page("remaining")}</th>
                  <th scope="col"><span className="sr-only">{page("buy")}</span></th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td data-label={page("day")}>
                      <span className="haunted-ghost-table__detail">
                        <CalendarDays size={16} aria-hidden="true" />
                        <strong>{ticket.ticketTypeDate}/10/2026</strong>
                      </span>
                    </td>
                    <td data-label={page("time")}>
                      <span className="haunted-ghost-table__detail">
                        <Clock3 size={16} aria-hidden="true" />
                        <strong>{ticket.ticketTypeTime}</strong>
                      </span>
                    </td>
                    <td
                      data-label={page("price")}
                      className="haunted-ghost-table__price"
                    >
                      <strong>
                        {new Intl.NumberFormat("vi-VN").format(
                          ticket.ticketTypePrice,
                        )}{" "}
                        VND
                      </strong>
                    </td>
                    <td data-label={page("remaining")}>
                      <span className="haunted-ghost-table__availability">
                        {page("tickets", { count: ticket.availableQuantity })}
                      </span>
                    </td>
                    <td className="haunted-ghost-table__action">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/tickets/detail/${ticket._id}`)
                        }
                      >
                        <span>{page("buy")}</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
};

export default HauntedGhost;
