import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { saveProduct } from "../features/products/productSlice";

export function useProductForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { createStatus, createError } = useAppSelector((state) => state.products);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [validationError, setValidationError] = useState("");

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.name.trim() || !Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      setValidationError("Enter a name, a price greater than zero, and a non-negative whole-number stock.");
      return;
    }
    setValidationError("");
    const result = await dispatch(saveProduct({ name: form.name.trim(), price, stock }));
    if (saveProduct.fulfilled.match(result)) navigate("/products");
  };

  return { form, updateField, submit, validationError, createStatus, createError, navigate };
}
