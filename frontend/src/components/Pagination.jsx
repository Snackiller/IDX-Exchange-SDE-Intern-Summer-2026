import "./Pagination.css";

function getPageItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, index) => index + 1
    );
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(
    totalItems / itemsPerPage
  );

  if (totalPages <= 1) {
    return null;
  }

  const pageItems = getPageItems(
    currentPage,
    totalPages
  );

  function handlePageChange(page) {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    onPageChange(page);
  }

  return (
    <nav
      className="pagination"
      aria-label="Property listings pagination"
    >
      <button
        type="button"
        className="pagination__button"
        onClick={() =>
          handlePageChange(currentPage - 1)
        }
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="pagination__pages">
        {pageItems.map((item, index) => {
          if (item === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="pagination__ellipsis"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          return (
            <button
              key={item}
              type="button"
              className={`pagination__page ${
                item === currentPage
                  ? "pagination__page--active"
                  : ""
              }`}
              onClick={() =>
                handlePageChange(item)
              }
              aria-label={`Go to page ${item}`}
              aria-current={
                item === currentPage
                  ? "page"
                  : undefined
              }
            >
              {item}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="pagination__button"
        onClick={() =>
          handlePageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;