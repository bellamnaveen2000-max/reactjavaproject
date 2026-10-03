import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { Pagination } from "../components/Pagination";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";
import { useProductFilters } from "../hooks/useProductFilters";

export function ProductListPage() {
  const { items, page, totalPages, totalElements, status, error, changePage } = useProducts();
  const { addItem, error: cartError, actionStatus } = useCart();
  const {
    search,
    setSearch,
    minimumPrice,
    setMinimumPrice,
    maximumPrice,
    setMaximumPrice,
    visibleProducts,
  } = useProductFilters(items);

  const addProduct = (productId) => {
    addItem(productId);
  };

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">INVENTORY / CATALOG</p>
          <h1>Products</h1>
          <p className="subheading">A clear view of what’s moving through your catalog.</p>
        </div>
        <div className="heading-metric">
          <span>Catalog size</span>
          <strong>{totalElements.toLocaleString()}</strong>
          <small>active products</small>
        </div>
      </section>
      <section className="panel" aria-label="Product catalog">
        {actionStatus === "failed" && <ErrorMessage message={cartError} />}
        <div className="panel-heading">
          <div>
            <h2>All products</h2>
            <p>Search, refine, and add items to a customer cart.</p>
          </div>
          <span className="count-pill">{totalElements} items</span>
        </div>
        <ProductFilters
          search={search}
          onSearch={setSearch}
          minimumPrice={minimumPrice}
          onMinimumPrice={setMinimumPrice}
          maximumPrice={maximumPrice}
          onMaximumPrice={setMaximumPrice}
        />
        <ErrorMessage message={error} />
        {status === "loading" && <LoadingState label="Loading catalog" />}
        {status === "succeeded" && <ProductTable products={visibleProducts} onAdd={addProduct} />}
        <Pagination page={page} totalPages={totalPages} onChange={changePage} />
      </section>
    </main>
  );
}
