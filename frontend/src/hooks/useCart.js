import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  addItemToCart,
  deleteCartItem,
  fetchCart,
} from "../features/cart/cartSlice";

export function useCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart(cart.userId));
  }, [dispatch, cart.userId]);

  const addItem = useCallback(
    (productId, quantity = 1) =>
      dispatch(addItemToCart({ userId: cart.userId, productId, quantity })),
    [cart.userId, dispatch],
  );
  const removeItem = useCallback(
    (productId) => dispatch(deleteCartItem({ userId: cart.userId, productId })),
    [cart.userId, dispatch],
  );

  return { ...cart, addItem, removeItem };
}
