export function Pagination({ page, totalPages, onChange }) {
  if (totalPages < 2) return null;

  return (
    <div className="pagination" aria-label="Product pages">
      <button type="button" className="button button-quiet" disabled={page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <div className="page-numbers">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            type="button"
            key={index}
            className={`page-number ${page === index ? "active" : ""}`}
            aria-current={page === index ? "page" : undefined}
            onClick={() => onChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="button button-quiet"
        disabled={page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}
