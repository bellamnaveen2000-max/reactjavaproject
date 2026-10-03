import { apiClient } from "./apiClient";

const baseUrl = import.meta.env.VITE_CART_API_URL ?? "http://localhost:8082";

export async function getCart(userId) {
  const response = await apiClient.get(`${baseUrl}/api/cart/users/${userId}`);
  return response.data;
}

export async function addCartItem(userId, item) {
  const response = await apiClient.post(`${baseUrl}/api/cart/users/${userId}/items`, item);
  return response.data;
}

export async function removeCartItem(userId, productId) {
  const response = await apiClient.delete(
    `${baseUrl}/api/cart/users/${userId}/items/${productId}`,
  );
  return response.data;
}
