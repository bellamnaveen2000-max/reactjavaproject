import { apiClient } from "./apiClient";

const baseUrl = import.meta.env.VITE_PRODUCT_API_URL ?? "http://localhost:8081";

export async function getProducts({ page, size, sortBy = "name", direction = "asc" }) {
  const response = await apiClient.get(`${baseUrl}/api/products`, {
    params: { page, size, sortBy, direction },
  });
  return response.data;
}

export async function createProduct(product) {
  const response = await apiClient.post(`${baseUrl}/api/products`, product);
  return response.data;
}

export async function getProduct(productId) {
  const response = await apiClient.get(`${baseUrl}/api/products/${productId}`);
  return response.data;
}
