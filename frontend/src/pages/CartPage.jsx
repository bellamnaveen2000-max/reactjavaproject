import { useState } from "react";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingState } from "../components/LoadingState";
import { useAppDispatch } from "../app/hooks";
import { setUserId } from "../features/cart/cartSlice";
import { useCart } from "../hooks/useCart";

export function CartPage() {
  const dispatch = useAppDispatch();
  const { userId, items, total, status, error, removeItem } = useCart();
  const [userInput, setUserInput] = useState(String(userId));

  const changeUser = (event) => {
    event.preventDefault();
    const nextUserId = Number(userInput);
    if (Number.isInteger(nextUserId) && nextUserId > 0) dispatch(setUserId(nextUserId));
  };

  return (
    <main className="page-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">ORDERS / CUSTOMER CART</p>
          <h1>Shopping cart</h1>
          <p className="subheading">Cart contents are validated against current product stock.</p>
        </div>
        <form className="customer-picker" onSubmit={changeUser}>
          <label htmlFor="customer-id">Customer ID</label>
          <input id="customer-id" min="1" type="number" value={userInput} onChange={(event) => setUserInput(event.target.value)} />
          <button className="button button-small" type="submit">Open cart</button>
        </form>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div><h2>Cart for customer {userId}</h2><p>{items.length} unique items</p></div>
          <span className="total-block"><small>Order total</small><strong>${Number(total).toFixed(2)}</strong></span>
        </div>
        <ErrorMessage message={error} />
        {status === "loading" && <LoadingState label="Loading cart" />}
        {status === "failed" && !items.length && <div className="empty-state">This customer has no cart yet. Add a product from the catalog to create one.</div>}
        {status === "succeeded" && !items.length && <div className="empty-state">This cart is empty. Add products from the catalog.</div>}
        {items.length > 0 && (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Unit price</th><th>Quantity</th><th>Line total</th><th><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.productId}>
                    <td><div className="product-name">{item.productName}</div><div className="product-sku">SKU · {String(item.productId).padStart(5, "0")}</div></td>
                    <td>${Number(item.unitPrice).toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td className="price-cell">${Number(item.lineTotal).toFixed(2)}</td>
                    <td><button className="button button-quiet button-small" type="button" onClick={() => removeItem(item.productId)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
