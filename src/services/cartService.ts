import { StorageService } from './storageService';
import { cleanProductData } from '../utils/validation';

export const fetchCartItems = async () => {
  const token = await StorageService.getAuthToken();
  if (!token) throw new Error('No authentication token found');
  const response = await fetch('https://localhost:7191/api/cart', {
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
  const response = await fetch('https://localhost:7191/api/cart/add', {
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
  const response = await fetch(`https://localhost:7191/api/cart/remove/${productId}`, {
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
  const response = await fetch('https://localhost:7191/api/Order', {
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