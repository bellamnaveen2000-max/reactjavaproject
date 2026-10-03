import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchProducts, setPage } from "../features/products/productSlice";

export function useProducts() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page: products.page, size: products.size }));
  }, [dispatch, products.page, products.size]);

  const changePage = useCallback((page) => dispatch(setPage(page)), [dispatch]);

  return { ...products, changePage };
}
