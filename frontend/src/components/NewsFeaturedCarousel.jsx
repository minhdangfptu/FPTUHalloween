import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Pin,
  PinOff,
} from "lucide-react";
import NewsMedia from "./NewsMedia";
import { getNewsPresentation } from "../utils/newsPresentation";
import "./NewsFeaturedCarousel.scss";

const DESKTOP_VISIBLE_CARDS = 4;

const excerpt = (content, maxLength = 130) => {
  const value = String(content || "").replace(/\s+/g, " ").trim();
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
};

const getCarouselMetrics = (viewport) => {
  const cards = viewport
    ? Array.from(viewport.querySelectorAll("[data-carousel-card]"))
    : [];
  if (!viewport || cards.length === 0) return { cards, step: 0, maxIndex: 0 };

  const firstOffset = cards[0].offsetLeft;
  const step = cards[1]
    ? cards[1].offsetLeft - firstOffset
    : cards[0].offsetWidth;
  const maxScrollLeft = Math.max(viewport.scrollWidth - viewport.clientWidth, 0);
  const maxIndex = step > 0
    ? Math.min(Math.round(maxScrollLeft / step), cards.length - 1)
    : 0;

  return { cards, step, maxIndex, firstOffset };
};

const NewsFeaturedCarousel = ({
  items = [],
  labels,
  formatDate,
  isLoading = false,
  onRemove,
  updatingId = "",
}) => {
  const viewportRef = useRef(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [maxViewIndex, setMaxViewIndex] = useState(0);
  const totalViews = maxViewIndex + 1;
  const activeViewIndex = Math.min(viewIndex, maxViewIndex);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || isLoading || items.length === 0) {
      setMaxViewIndex(0);
      setViewIndex(0);
      return undefined;
    }

    const updateMetrics = () => {
      const { maxIndex } = getCarouselMetrics(viewport);
      setMaxViewIndex(maxIndex);
      setViewIndex((current) => Math.min(current, maxIndex));
    };

    updateMetrics();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateMetrics);
      return () => window.removeEventListener("resize", updateMetrics);
    }

    const resizeObserver = new ResizeObserver(updateMetrics);
    resizeObserver.observe(viewport);
    return () => resizeObserver.disconnect();
  }, [isLoading, items.length]);

  const scrollToView = (targetIndex) => {
    const viewport = viewportRef.current;
    const { cards, maxIndex, firstOffset = 0 } = getCarouselMetrics(viewport);
    const nextIndex = Math.min(Math.max(targetIndex, 0), maxIndex);
    const targetCard = cards[nextIndex];
    if (!viewport || !targetCard) return;

    setViewIndex(nextIndex);
    viewport.scrollTo({
      left: targetCard.offsetLeft - firstOffset,
      behavior: "auto",
    });
  };

  const handleViewportScroll = (event) => {
    const { scrollLeft } = event.currentTarget;
    const { step, maxIndex } = getCarouselMetrics(event.currentTarget);
    if (!step) return;

    const nextIndex = Math.min(
      Math.max(Math.round(scrollLeft / step), 0),
      maxIndex,
    );
    setViewIndex((current) => (current === nextIndex ? current : nextIndex));
  };

  const handleViewportKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToView(activeViewIndex - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToView(activeViewIndex + 1);
    }
  };

  return (
    <section
      className="news-featured-carousel"
      aria-roledescription="carousel"
      aria-label={labels.carouselLabel}
      aria-busy={isLoading}
    >
      <header className="news-featured-carousel__header">
        <div>
          <span className="news-featured-carousel__eyebrow">
            <Pin size={16} aria-hidden="true" /> {labels.eyebrow}
          </span>
          <h3>{labels.title}</h3>
          <p>{labels.intro}</p>
        </div>

        {!isLoading && totalViews > 1 && (
          <div className="news-featured-carousel__controls">
            <button
              type="button"
              onClick={() => scrollToView(activeViewIndex - 1)}
              disabled={activeViewIndex === 0}
              aria-label={labels.previous}
              title={labels.previous}
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollToView(activeViewIndex + 1)}
              disabled={activeViewIndex >= totalViews - 1}
              aria-label={labels.next}
              title={labels.next}
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        )}
      </header>

      {isLoading ? (
        <div className="news-featured-carousel__viewport" aria-hidden="true">
          {Array.from({ length: DESKTOP_VISIBLE_CARDS }, (_, index) => (
            <div className="news-featured-carousel__skeleton" key={index}>
              <span />
              <div><i /><i /><i /></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="news-featured-carousel__empty">
          <Pin size={25} aria-hidden="true" />
          <strong>{labels.emptyTitle}</strong>
          <p>{labels.emptyText}</p>
        </div>
      ) : (
        <>
          <div
            className="news-featured-carousel__viewport"
            ref={viewportRef}
            onScroll={handleViewportScroll}
            onKeyDown={handleViewportKeyDown}
            tabIndex={totalViews > 1 ? 0 : undefined}
          >
            {items.map((item, index) => {
              const post = getNewsPresentation(item);
              return (
                <article
                className="news-featured-carousel__card"
                data-carousel-card
                aria-roledescription="slide"
                aria-label={labels.slideLabel(index + 1, items.length)}
                key={item.id}
                >
                {post.tag && <span className="news-featured-carousel__tag">{post.tag}</span>}
                <NewsMedia className="news-featured-carousel__media" images={item.images} />
                <div className="news-featured-carousel__body">
                  <span className="news-featured-carousel__badge">
                    <Pin size={13} aria-hidden="true" /> {labels.pinnedBadge}
                  </span>
                  <h4>{post.title}</h4>
                  <p>{excerpt(post.content)}</p>
                  <div className="news-featured-carousel__meta">
                    <span><Clock3 size={14} aria-hidden="true" /> {formatDate(item.publishedAt)}</span>
                    <div>
                      {item.permalinkUrl && (
                        <a
                          href={item.permalinkUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={labels.openPost(item.title)}
                        >
                          <ExternalLink size={16} aria-hidden="true" />
                        </a>
                      )}
                      {onRemove && (
                        <button
                          type="button"
                          onClick={() => onRemove(item)}
                          disabled={updatingId === item.id}
                          aria-label={labels.removePost(item.title)}
                          title={labels.removeFeatured}
                        >
                          <PinOff size={16} aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                </article>
              );
            })}
          </div>

          {totalViews > 1 && (
            <div
              className="news-featured-carousel__dots"
              role="navigation"
              aria-label={labels.viewNavigation}
            >
              {Array.from({ length: totalViews }, (_, index) => (
                <button
                  type="button"
                  className={index === activeViewIndex ? "is-active" : ""}
                  onClick={() => scrollToView(index)}
                  aria-label={labels.goToView(index + 1)}
                  aria-current={index === activeViewIndex ? "true" : undefined}
                  key={index}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default NewsFeaturedCarousel;
