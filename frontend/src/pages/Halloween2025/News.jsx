import "@fontsource-variable/geist";
import { useCallback, useEffect, useState } from "react";
import {
  Clock3,
  ExternalLink,
  RefreshCw,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SkeletonCards } from "../../components/LoadingSkeletons";
import NewsDateFilter from "../../components/NewsDateFilter";
import NewsFeaturedCarousel from "../../components/NewsFeaturedCarousel";
import NewsMedia from "../../components/NewsMedia";
import NewsPagination from "../../components/NewsPagination";
import newsAPI from "../../apis/newsAPI";
import { translateError } from "../../utils/translateResponse";
import { getNewsPresentation } from "../../utils/newsPresentation";
import coverImage from "../../assets/cover-01.png";
import "./News.css";

// Four complete rows of four regular cards.
const PAGE_SIZE = 16;

const excerpt = (content, maxLength = 210) => {
  const value = String(content || "").replace(/\s+/g, " ").trim();
  return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
};

export default function News() {
  const { t, i18n } = useTranslation();
  const text = (key, options) => t(`eventPages.facebookNews.${key}`, options);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const formatDate = (value) => value
    ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : text("notUpdated");

  const loadNews = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await newsAPI.getList({
        page,
        limit: PAGE_SIZE,
        search,
        year: year || undefined,
        month: month || undefined,
        day: day || undefined,
      });
      setItems(result.items);
      setFeaturedItems(result.featured);
      setPagination(result.pagination);
      setAvailableYears(result.filters.years);

      if (result.pagination.totalPages > 0 && page > result.pagination.totalPages) {
        setPage(result.pagination.totalPages);
      }
    } catch (loadError) {
      setError(translateError(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [day, month, page, search, year]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchDraft.trim());
  };

  const handleYearChange = (value) => {
    setYear(value);
    setMonth("");
    setDay("");
    setPage(1);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    setDay("");
    setPage(1);
  };

  const clearDateFilters = () => {
    setYear("");
    setMonth("");
    setDay("");
    setPage(1);
  };

  const hasDateFilter = Boolean(year || month || day);

  return (
    <main className="facebook-news-page">
      <section
        className="facebook-news-hero"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <div className="facebook-news-hero__content">
          <div className="facebook-news-hero__copy">
            <span className="facebook-news-eyebrow">
              <span className="facebook-news-facebook-mark" aria-hidden="true">f</span>
              {text("eyebrow")}
            </span>
            <h1>{text("title")}</h1>
            <p>{text("intro")}</p>
          </div>
          <div className="facebook-news-hero__stamp" aria-hidden="true">
            <strong>FPTU</strong>
            <span>NEWS</span>
          </div>
        </div>
      </section>

      <section className="facebook-news-content" aria-live="polite">
        <div className="facebook-news-section-heading">
          <div className="facebook-news-section-heading__copy">
            <span>{text("latest")}</span>
            <h2>{search ? text("searchResults", { query: search }) : text("officialUpdates")}</h2>
            {!isLoading && !error && (
              <p className="facebook-news-section-heading__count">
                {text("resultCount", { count: pagination.total || 0 })}
              </p>
            )}
          </div>
          <form className="facebook-news-search" onSubmit={submitSearch} role="search">
            <Search size={18} aria-hidden="true" />
            <input
              value={searchDraft}
              onChange={(event) => setSearchDraft(event.target.value)}
              placeholder={text("searchPlaceholder")}
              aria-label={text("searchLabel")}
              maxLength={100}
            />
            <button type="submit" aria-label={text("search")} title={text("search")}>
              <Search size={18} aria-hidden="true" />
            </button>
          </form>
        </div>

        <NewsFeaturedCarousel
          items={featuredItems}
          formatDate={formatDate}
          isLoading={isLoading}
          labels={{
            carouselLabel: text("featuredCarouselLabel"),
            eyebrow: text("featuredEyebrow"),
            title: text("featuredTitle"),
            intro: text("featuredIntro"),
            emptyTitle: text("featuredEmptyTitle"),
            emptyText: text("featuredEmptyText"),
            pinnedBadge: text("pinnedBadge"),
            previous: text("featuredPrevious"),
            next: text("featuredNext"),
            viewNavigation: text("featuredViewNavigation"),
            goToView: (view) => text("goToFeaturedView", { view }),
            slideLabel: (current, total) => text("featuredSlideLabel", { current, total }),
            openPost: (title) => text("openFeaturedPost", { title }),
          }}
        />

        <NewsDateFilter
          years={availableYears}
          year={year}
          month={month}
          day={day}
          language={i18n.language}
          labels={{
            filterLabel: text("filterLabel"),
            yearLabel: text("yearLabel"),
            monthLabel: text("monthLabel"),
            dayLabel: text("dayLabel"),
            allYears: text("allYears"),
            allMonths: text("allMonths"),
            allDays: text("allDays"),
            clearFilters: text("clearFilters"),
          }}
          onYearChange={handleYearChange}
          onMonthChange={handleMonthChange}
          onDayChange={(value) => { setDay(value); setPage(1); }}
          onClear={clearDateFilters}
        />

        {isLoading ? (
          <SkeletonCards count={16} />
        ) : error ? (
          <div className="facebook-news-state facebook-news-state--error">
            <strong>{text("errorTitle")}</strong>
            <p>{error}</p>
            <button type="button" onClick={loadNews}>
              <RefreshCw size={17} aria-hidden="true" /> {text("retry")}
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="facebook-news-state">
            <span className="facebook-news-facebook-mark facebook-news-facebook-mark--empty" aria-hidden="true">
              f
            </span>
            <strong>{text("emptyTitle")}</strong>
            <p>{search || hasDateFilter ? text("emptyFiltered") : text("emptyText")}</p>
          </div>
        ) : (
          <>
            <div className="facebook-news-grid">
              {items.map((item) => {
                const post = getNewsPresentation(item);
                return (
                  <article className="facebook-news-card" key={item.id}>
                    {post.tag && <span className="facebook-news-card__tag">{post.tag}</span>}
                    <NewsMedia className="facebook-news-card__media" images={item.images} />
                    <div className="facebook-news-card__body">
                      <h3>{post.title}</h3>
                      <p>{excerpt(post.content)}</p>
                      <div className="facebook-news-meta">
                        <span><Clock3 size={14} aria-hidden="true" /> {formatDate(item.publishedAt)}</span>
                        {item.permalinkUrl && (
                          <a
                            href={item.permalinkUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={text("readPost")}
                            title={text("readPost")}
                          >
                            <ExternalLink size={17} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <NewsPagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={setPage}
              labels={{
                paginationLabel: text("paginationLabel"),
                firstPage: text("firstPage"),
                previous: text("previous"),
                next: text("next"),
                lastPage: text("lastPage"),
                goToPage: (targetPage) => text("goToPage", { page: targetPage }),
              }}
            />
          </>
        )}
      </section>
    </main>
  );
}
