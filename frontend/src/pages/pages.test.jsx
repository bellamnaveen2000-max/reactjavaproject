import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import cartReducer from "../features/cart/cartSlice";
import productsReducer from "../features/products/productSlice";
import { AddProductPage } from "./AddProductPage";
import { CartPage } from "./CartPage";
import { ProductListPage } from "./ProductListPage";
import { addCartItem, getCart, removeCartItem } from "../services/cartApi";
import { createProduct, getProducts } from "../services/productApi";

vi.mock("../services/productApi", () => ({
  createProduct: vi.fn(),
  getProducts: vi.fn(),
}));

vi.mock("../services/cartApi", () => ({
  addCartItem: vi.fn(),
  getCart: vi.fn(),
  removeCartItem: vi.fn(),
}));

const products = [
  { id: 1, name: "Desk Lamp", price: 25, stock: 4 },
  { id: 2, name: "Oak Desk", price: 250, stock: 2 },
];

function renderWithStore(element, initialRoute = "/") {
  const store = configureStore({
    reducer: { products: productsReducer, cart: cartReducer },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialRoute]}>{element}</MemoryRouter>
    </Provider>,
  );
}

describe("product and cart screens", () => {
  beforeEach(() => {
    getProducts.mockResolvedValue({
      content: products,
      number: 0,
      totalPages: 2,
      totalElements: 12,
    });
    getCart.mockResolvedValue({ id: 3, userId: 1, items: [], total: 0 });
    createProduct.mockResolvedValue({ id: 3, name: "Chair", price: 40, stock: 5 });
    addCartItem.mockResolvedValue({
      id: 3,
      userId: 1,
      items: [{ productId: 1, productName: "Desk Lamp", quantity: 1, unitPrice: 25, lineTotal: 25 }],
      total: 25,
    });
    removeCartItem.mockResolvedValue({});
  });

  it("loads products and filters the current page by name and price", async () => {
    renderWithStore(<ProductListPage />);

    expect(await screen.findByText("Desk Lamp")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search products" }), {
      target: { value: "oak" },
    });

    expect(screen.getByText("Oak Desk")).toBeInTheDocument();
    expect(screen.queryByText("Desk Lamp")).not.toBeInTheDocument();
  });

  it("submits the add-product form through the Redux API thunk", async () => {
    renderWithStore(
      <Routes>
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/products" element={<h1>Product catalog</h1>} />
      </Routes>,
      "/add-product",
    );

    fireEvent.change(screen.getByLabelText(/Product name/), { target: { value: "Chair" } });
    fireEvent.change(screen.getByLabelText(/Price/), { target: { value: "40" } });
    fireEvent.change(screen.getByLabelText(/Available stock/), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Create product" }));

    expect(await screen.findByRole("heading", { name: "Product catalog" })).toBeInTheDocument();
    expect(createProduct).toHaveBeenCalledWith({ name: "Chair", price: 40, stock: 5 });
  });

  it("loads cart items and exposes remove behavior", async () => {
    getCart.mockResolvedValue({
      id: 3,
      userId: 1,
      items: [{ productId: 1, productName: "Desk Lamp", quantity: 2, unitPrice: 25, lineTotal: 50 }],
      total: 50,
    });
    renderWithStore(<CartPage />);

    expect(await screen.findByText("Desk Lamp")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => expect(removeCartItem).toHaveBeenCalledWith(1, 1));
  });

  it("dispatches add-to-cart from the product table", async () => {
    renderWithStore(<ProductListPage />);
    await screen.findByText("Desk Lamp");

    fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);

    await waitFor(() => expect(addCartItem).toHaveBeenCalledWith(1, { productId: 2, quantity: 1 }));
  });
});
