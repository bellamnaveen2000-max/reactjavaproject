import { NavLink } from "react-router-dom";

export function Navigation() {
  return (
    <header className="topbar">
      <NavLink className="brand" to="/products" aria-label="Northstar Market home">
        <span className="brand-mark">N</span>
        <span>northstar<span className="brand-light"> / market</span></span>
      </NavLink>
      <nav aria-label="Main navigation">
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/add-product">Add product</NavLink>
        <NavLink to="/cart">Cart</NavLink>
      </nav>
      <span className="environment-pill"><span /> Service console</span>
    </header>
  );
}
