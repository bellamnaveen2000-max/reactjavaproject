export function ProductFilters({ search, onSearch, minimumPrice, onMinimumPrice, maximumPrice, onMaximumPrice }) {
  return (
    <div className="filter-row">
      <label className="search-field">
        <span className="sr-only">Search products</span>
        <span className="search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
        />
      </label>
      <label className="filter-field">
        <span>Min price</span>
        <input min="0" type="number" value={minimumPrice} onChange={(event) => onMinimumPrice(event.target.value)} />
      </label>
      <label className="filter-field">
        <span>Max price</span>
        <input min="0" type="number" value={maximumPrice} onChange={(event) => onMaximumPrice(event.target.value)} />
      </label>
    </div>
  );
}
