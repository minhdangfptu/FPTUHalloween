import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./NewsPagination.scss";

const getPageItems = (currentPage, totalPages) => {
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1);
  if (currentPage <= 3) return [1, 2, 3, "end-gap", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "start-gap", totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "start-gap", currentPage, "end-gap", totalPages];
};

const NewsPagination = ({ page, totalPages, labels, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageItems = getPageItems(page, totalPages);
  const goToPage = (nextPage) => {
    if (nextPage !== page && nextPage >= 1 && nextPage <= totalPages) onPageChange(nextPage);
  };

  return (
    <nav className="news-pagination" aria-label={labels.paginationLabel}>
      <button
        type="button"
        className="news-pagination__control"
        onClick={() => goToPage(1)}
        disabled={page <= 1}
        aria-label={labels.firstPage}
        title={labels.firstPage}
      >
        <ChevronsLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className="news-pagination__control"
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        aria-label={labels.previous}
        title={labels.previous}
      >
        <ChevronLeft aria-hidden="true" />
      </button>

      {pageItems.map((item) => typeof item === "number" ? (
        <button
          type="button"
          className={`news-pagination__page${item === page ? " is-active" : ""}`}
          onClick={() => goToPage(item)}
          aria-label={labels.goToPage(item)}
          aria-current={item === page ? "page" : undefined}
          key={item}
        >
          {item}
        </button>
      ) : (
        <span className="news-pagination__ellipsis" aria-hidden="true" key={item}>…</span>
      ))}

      <button
        type="button"
        className="news-pagination__control"
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        aria-label={labels.next}
        title={labels.next}
      >
        <ChevronRight aria-hidden="true" />
      </button>
      <button
        type="button"
        className="news-pagination__control"
        onClick={() => goToPage(totalPages)}
        disabled={page >= totalPages}
        aria-label={labels.lastPage}
        title={labels.lastPage}
      >
        <ChevronsRight aria-hidden="true" />
      </button>
    </nav>
  );
};

export default NewsPagination;
