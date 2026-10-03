export function ProductTable({ products, onAdd }) {
  if (!products.length) {
    return <div className="empty-state">No products match these filters.</div>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Available</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-name">{product.name}</div>
                <div className="product-sku">SKU · {String(product.id).padStart(5, "0")}</div>
              </td>
              <td className="price-cell">${Number(product.price).toFixed(2)}</td>
              <td>
                <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </td>
              <td className="action-cell">
                <button
                  className="button button-small"
                  type="button"
                  disabled={product.stock < 1}
                  onClick={() => onAdd(product.id)}
                >
                  Add to cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
