import { ErrorMessage } from "../components/ErrorMessage";
import { useProductForm } from "../hooks/useProductForm";

export function AddProductPage() {
  const { form, updateField, submit, validationError, createStatus, createError, navigate } = useProductForm();

  return (
    <main className="page-shell narrow-shell">
      <section className="page-heading">
        <div>
          <p className="eyebrow">INVENTORY / NEW ITEM</p>
          <h1>Add a product</h1>
          <p className="subheading">Create a catalog entry for your team and customers.</p>
        </div>
      </section>
      <section className="panel form-panel">
        <div className="panel-heading">
          <div><h2>Product details</h2><p>Fields marked required must be completed.</p></div>
        </div>
        <ErrorMessage message={validationError || createError} />
        <form className="product-form" onSubmit={submit}>
          <label>
            Product name <span aria-hidden="true">*</span>
            <input autoComplete="off" name="name" maxLength="160" required value={form.name} onChange={updateField} />
          </label>
          <div className="form-grid">
            <label>
              Price <span aria-hidden="true">*</span>
              <span className="input-prefix"><b>$</b><input name="price" min="0.01" step="0.01" type="number" required value={form.price} onChange={updateField} /></span>
            </label>
            <label>
              Available stock <span aria-hidden="true">*</span>
              <input name="stock" min="0" step="1" type="number" required value={form.stock} onChange={updateField} />
            </label>
          </div>
          <div className="form-actions">
            <button className="button button-quiet" type="button" onClick={() => navigate("/products")}>Cancel</button>
            <button className="button button-primary" type="submit" disabled={createStatus === "loading"}>
              {createStatus === "loading" ? "Saving…" : "Create product"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
