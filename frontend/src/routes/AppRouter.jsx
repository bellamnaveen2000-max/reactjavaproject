import { Navigate, Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { AddProductPage } from "../pages/AddProductPage";
import { CartPage } from "../pages/CartPage";
import { ProductListPage } from "../pages/ProductListPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <div className="app-frame">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="*" element={<Navigate to="/products" replace />} />
        </Routes>
        <footer className="footer"><span>Northstar Market</span><span>Product + Cart services · Java 21</span></footer>
      </div>
    </BrowserRouter>
  );
}
