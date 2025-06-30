import { StorageService } from './storageService';
import { cleanProductData } from '../utils/validation';
import { API_CONFIG } from '../config/api';

export const fetchCartItems = async () => {
  const token = await StorageService.getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch cart');
  const data = await response.json();

  // Chuẩn hóa giống HomeScreen
  const cartItems = Array.isArray(data.cartItems)
    ? data.cartItems
    : Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.products)
        ? data.products
        : Array.isArray(data)
          ? data
          : [];

  return cartItems.map((item: any) => ({
    ...cleanProductData(item.product || item),
    quantity: item.quantity || 1,
  }));
};

export const addToCart = async (productId: string, quantity: number = 1) => {
  const token = await StorageService.getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_ADD}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity })
  });
  if (!response.ok) throw new Error('Failed to add to cart');
  return await response.json();
};

export const removeFromCart = async (productId: string) => {
  const token = await StorageService.getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CART_REMOVE}/${productId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to remove from cart');
  return await response.json();
};

export const payForProduct = async (productId: string, quantity: number) => {
  const token = await StorageService.getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ORDER}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity })
  });
  if (!response.ok) throw new Error('Payment failed');
  return await response.json();
}; 