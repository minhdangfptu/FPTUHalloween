import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileCheck2,
  Newspaper,
  Pin,
  PinOff,
  RefreshCw,
  Search,
} from "lucide-react";
import { FaFacebookF } from "react-icons/fa";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ManageSidebar from "../../components/ManageSidebar";
import { SkeletonCards } from "../../components/LoadingSkeletons";
import NewsDateFilter from "../../components/NewsDateFilter";
import NewsFeaturedCarousel from "../../components/NewsFeaturedCarousel";
import NewsMedia from "../../components/NewsMedia";
import NewsPagination from "../../components/NewsPagination";
import newsAPI from "../../apis/newsAPI";
import { getErrorMessage } from "../../utils/translateResponse";
import { getNewsPresentation } from "../../utils/newsPresentation";
import "./FacebookNews.scss";

const PAGE_SIZE = 12;

const getFriendlySyncIssue = (error, text) => {
  const message = String(typeof error === "string" ? error : getErrorMessage(error)).toLowerCase();

  if (/too many|rate limit/.test(message)) return text("issues.tooManyRequests");
  if (/interrupted/.test(message)) return text("issues.interrupted");
  if (/already running|in progress/.test(message)) return text("issues.inProgress");
  if (/timeout|timed out|network|fetch|reach/.test(message)) return text("issues.connection");
  if (/token|oauth|permission|not configured|unsupported|get request|page/.test(message)) {
    return text("issues.fanpageAccess");
  }

  return text("issues.unknown");
};

const FacebookNews = () => {
  const { t, i18n } = useTranslation();
  const text = (key, options) => t(`management.facebookNews.${key}`, options);
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [featuredItems, setFeaturedItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 0 });
  const [availableYears, setAvailableYears] = useState([]);
  const [page, setPage] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState("");
  const [reorderingFeaturedId, setReorderingFeaturedId] = useState("");
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [isSavingToken, setIsSavingToken] = useState(false);

  const formatDate = (value) => value
    ? new Date(value).toLocaleString(i18n.language === "en" ? "en-US" : "vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    })
    : text("notYet");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const [syncStatus, newsResult] = await Promise.all([
        newsAPI.getFacebookSyncStatus(),
        newsAPI.getList({
          page,
          limit: PAGE_SIZE,
          search,
          year: year || undefined,
          month: month || undefined,
          day: day || undefined,
        }),
      ]);
      setStatus(syncStatus);
      setItems(newsResult.items);
      setFeaturedItems(newsResult.featured);
      setPagination(newsResult.pagination);
      setAvailableYears(newsResult.filters.years);

      if (newsResult.pagination.totalPages > 0 && page > newsResult.pagination.totalPages) {
        setPage(newsResult.pagination.totalPages);
      }
    } catch {
      const message = t("management.facebookNews.loadError");
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [day, month, page, search, t, year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = async () => {
    setIsSyncing(true);
    const toastId = toast.loading(text("syncing"));
    try {
      const result = await newsAPI.syncFacebook();
      setStatus(result.status);
      if (page === 1) await loadData();
      else setPage(1);
      toast.success(text("updateSuccess"), { id: toastId });
    } catch (syncError) {
      toast.error(getFriendlySyncIssue(syncError, text), { id: toastId });
      await loadData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveToken = async (event) => {
    event.preventDefault();
    if (!accessToken.trim()) return;
    setIsSavingToken(true);
    const toastId = toast.loading(text("savingToken"));
    try {
      await newsAPI.updateFacebookAccessToken(accessToken.trim());
      setAccessToken("");
      await loadData();
      toast.success(text("tokenSaved"), { id: toastId });
    } catch (tokenError) {
      toast.error(getFriendlySyncIssue(tokenError, text), { id: toastId });
    } finally {
      setIsSavingToken(false);
    }
  };

  const statusLabel = status ? text(`status.${status.status}`) : text("status.idle");
  const isHealthy = status?.status === "success";
  const hasSearch = Boolean(search);
  const hasDateFilter = Boolean(year || month || day);

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

  const submitSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchDraft.trim());
  };

  const handleFeaturedToggle = async (item, nextFeatured = !item.isFeatured) => {
    if (updatingFeaturedId || reorderingFeaturedId) return;
    setUpdatingFeaturedId(item.id);
    try {
      const updatedItem = await newsAPI.setFeatured(item.id, nextFeatured);
      setItems((current) => current.map((newsItem) => (
        newsItem.id === updatedItem.id ? updatedItem : newsItem
      )));
      setFeaturedItems((current) => {
        if (!updatedItem.isFeatured) {
          return current.filter((newsItem) => newsItem.id !== updatedItem.id);
        }
        return [updatedItem, ...current.filter((newsItem) => newsItem.id !== updatedItem.id)]
          .sort((first, second) => second.featuredOrder - first.featuredOrder);
      });
      toast.success(text(updatedItem.isFeatured ? "featuredAddSuccess" : "featuredRemoveSuccess"));
    } catch {
      toast.error(text("featuredUpdateError"));
    } finally {
      setUpdatingFeaturedId("");
    }
  };

  const handleFeaturedMove = async (item, offset) => {
    if (updatingFeaturedId || reorderingFeaturedId) return;

    const currentIndex = featuredItems.findIndex((featuredItem) => featuredItem.id === item.id);
    const targetIndex = currentIndex + offset;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= featuredItems.length) return;

    const previousItems = featuredItems;
    const nextItems = [...featuredItems];
    [nextItems[currentIndex], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[currentIndex]];

    setFeaturedItems(nextItems);
    setReorderingFeaturedId(item.id);
    const toastId = toast.loading(text("featuredReordering"));
    try {
      const reorderedItems = await newsAPI.reorderFeatured(nextItems.map((featuredItem) => featuredItem.id));
      const reorderedById = new Map(reorderedItems.map((featuredItem) => [featuredItem.id, featuredItem]));
      setFeaturedItems(reorderedItems);
      setItems((current) => current.map((newsItem) => (
        reorderedById.has(newsItem.id)
          ? { ...newsItem, featuredOrder: reorderedById.get(newsItem.id).featuredOrder }
          : newsItem
      )));
      toast.success(text("featuredReorderSuccess"), { id: toastId });
    } catch {
      setFeaturedItems(previousItems);
      toast.error(text("featuredReorderError"), { id: toastId });
    } finally {
      setReorderingFeaturedId("");
    }
  };

  return (
    <div className="facebook-news-admin">
      <ManageSidebar role="admin" activeItem="facebook-news" />
      <main className="facebook-news-admin__main">
        <header className="facebook-news-admin__header">
          <div>
            <span className="facebook-news-admin__eyebrow">
              <FaFacebookF size={16} /> {text("eyebrow")}
            </span>
            <h1>{text("title")}</h1>
            <p>{text("intro")}</p>
          </div>
          <div className="facebook-news-admin__actions">
            <button type="button" className="is-quiet" onClick={loadData} disabled={isLoading || isSyncing}>
              <RefreshCw size={17} className={isLoading ? "is-spinning" : ""} /> {text("refresh")}
            </button>
            <button
              type="button"
              className="is-primary"
              onClick={handleSync}
              disabled={isLoading || isSyncing || !status?.configured || status?.isRunning}
            >
              <RefreshCw size={17} className={isSyncing ? "is-spinning" : ""} />
              {isSyncing ? text("syncingShort") : text("syncNow")}
            </button>
          </div>
        </header>

        {error && (
          <div className="facebook-news-admin__error" role="alert">
            <AlertTriangle size={18} /> <span>{error}</span>
          </div>
        )}

        <section className="facebook-news-admin__status" aria-label={text("statusSection")}>
          <article className={`is-${status?.status || "idle"}`}>
            <span>{isHealthy ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}</span>
            <div><small>{text("syncStatus")}</small><strong>{statusLabel}</strong></div>
          </article>
          <article>
            <span><Clock3 size={20} /></span>
            <div><small>{text("lastSuccess")}</small><strong>{formatDate(status?.lastSuccessAt)}</strong></div>
          </article>
          <article>
            <span><FileCheck2 size={20} /></span>
            <div><small>{text("lastResult")}</small><strong>{text("syncStats", {
              inserted: status?.stats?.inserted || 0,
              updated: status?.stats?.updated || 0,
            })}</strong></div>
          </article>
        </section>

        {!isLoading && status && !status.configured && (
          <section className="facebook-news-admin__setup">
            <AlertTriangle size={22} />
            <div>
              <h2>{text("setupTitle")}</h2>
              <p>{text("setupText")}</p>
            </div>
          </section>
        )}

        {status?.lastError && status.configured && (
          <section className="facebook-news-admin__provider-error">
            <strong>{text("lastError")}</strong>
            <p>{getFriendlySyncIssue(status.lastError, text)}</p>
          </section>
        )}

        <section className="facebook-news-admin__token-card">
          <div>
            <span className="facebook-news-admin__eyebrow">{text("tokenEyebrow")}</span>
            <h2>{text("tokenTitle")}</h2>
            <p>{text("tokenIntro")}</p>
          </div>
          <form onSubmit={handleSaveToken} className="facebook-news-admin__token-form" autoComplete="off">
            <label htmlFor="facebook-page-access-token">{text("tokenLabel")}</label>
            <div>
              <input
                id="facebook-page-access-token"
                name="facebook-page-access-token"
                type="text"
                value={accessToken}
                onChange={(event) => setAccessToken(event.target.value)}
                placeholder={text("tokenPlaceholder")}
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                spellCheck="false"
              />
              <button type="submit" className="is-primary" disabled={!accessToken.trim() || isSavingToken}>
                {isSavingToken ? text("savingTokenShort") : text("saveToken")}
              </button>
            </div>
          </form>
        </section>

        <section className="facebook-news-admin__feed">
          <div className="facebook-news-admin__section-heading">
            <div className="facebook-news-admin__section-heading-copy">
              <span><Newspaper size={16} /> {text("feedEyebrow")}</span>
              <h2>{text("feedTitle")}</h2>
              <p>{text("showingCount", { count: pagination.total })}</p>
            </div>
            <form className="facebook-news-admin__search" onSubmit={submitSearch} role="search">
              <Search size={17} aria-hidden="true" />
              <input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder={text("searchPlaceholder")}
                aria-label={text("searchLabel")}
                maxLength={100}
              />
              <button type="submit" aria-label={text("search")} title={text("search")}>
                <Search size={17} aria-hidden="true" />
              </button>
            </form>
          </div>

          <NewsFeaturedCarousel
            items={featuredItems}
            formatDate={formatDate}
            isLoading={isLoading}
            onRemove={(item) => handleFeaturedToggle(item, false)}
            onMove={handleFeaturedMove}
            updatingId={updatingFeaturedId}
            reorderingId={reorderingFeaturedId}
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
              removePost: (title) => text("removeFeaturedPost", { title }),
              removeFeatured: text("removeFeatured"),
              position: (current, total) => text("featuredPosition", { current, total }),
              moveEarlier: (title) => text("moveFeaturedEarlierPost", { title }),
              moveLater: (title) => text("moveFeaturedLaterPost", { title }),
              moveEarlierLabel: text("moveFeaturedEarlier"),
              moveLaterLabel: text("moveFeaturedLater"),
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
            <SkeletonCards count={6} />
          ) : items.length === 0 ? (
            <div className="facebook-news-admin__empty">
              <Newspaper size={30} />
              <strong>{text("emptyTitle")}</strong>
              <p>{hasSearch ? text("emptySearch", { query: search }) : hasDateFilter ? text("emptyFiltered") : text("emptyText")}</p>
            </div>
          ) : (
            <>
              <div className="facebook-news-admin__list">
                {items.map((item) => (
                  <article key={item.id}>
                    <NewsMedia className="facebook-news-admin__thumb" images={item.images} />
                    <div className="facebook-news-admin__post-copy">
                      <strong>{getNewsPresentation(item).title}</strong>
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    <div className="facebook-news-admin__post-meta">
                      <small>{text("reactions", { count: item.reacts || 0 })}</small>
                      <button
                        type="button"
                        className={item.isFeatured ? "is-featured" : ""}
                        onClick={() => handleFeaturedToggle(item)}
                        disabled={Boolean(updatingFeaturedId || reorderingFeaturedId)}
                        aria-pressed={item.isFeatured}
                        aria-label={text(item.isFeatured ? "removeFeaturedPost" : "addFeaturedPost", { title: item.title })}
                        title={text(item.isFeatured ? "removeFeatured" : "addFeatured")}
                      >
                        {item.isFeatured
                          ? <PinOff size={17} aria-hidden="true" />
                          : <Pin size={17} aria-hidden="true" />}
                      </button>
                      {item.permalinkUrl && (
                        <a href={item.permalinkUrl} target="_blank" rel="noreferrer" aria-label={text("openPostAria", { title: item.title })}>
                          <ExternalLink size={17} />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
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
    </div>
  );
};

export default FacebookNews;
