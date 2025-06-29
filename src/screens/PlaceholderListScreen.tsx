import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product as BaseProduct, Brand, Category } from '../types/products.type'; 
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { Colors } from '../constants/Colors'; 
import { Spacing } from '../constants/Dimensions'; 
import { StorageService } from '../services/storageService';
import { fetchCartItems } from '../services/cartService';

// Extend Product type for cart items to include quantity
type CartProduct = BaseProduct & { quantity?: number };

const cleanProductData = (product: any): BaseProduct => ({
  productId: String(product.productId || ''),
  name: String(product.name || ''),
  description: String(product.description || ''),
  price: Number(product.price || 0),
  stockQuantity: Number(product.stockQuantity || 0),
  imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls.map(String) : [],
  commissionRate: Number(product.commissionRate || 0),
  categoryId: String(product.categoryId || ''),
  brandId: String(product.brandId || ''),
  createAt: String(product.createAt || ''),
  updatedAt: String(product.updatedAt || null),
  isActive: Boolean(product.isActive || false),
  category: cleanCategoryData(product.category),
  brand: cleanBrandData(product.brand),
});

const cleanBrandData = (brand: any): Brand => ({
  brandId: String(brand.brandId || ''),
  name: String(brand.name || ''),
  isPremium: Boolean(brand.isPremium || false),
  createdAt: String(brand.createdAt || ''),
});

const cleanCategoryData = (category: any): Category => ({
  categoryId: String(category.categoryId || ''),
  name: String(category.name || ''),
  description: String(category.description || ''),
  createdAt: String(category.createdAt || ''),
});

const PlaceholderListScreen = () => {
  const navigation = useNavigation();
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setIsErrorMessage(isError);
    setTimeout(() => {
      setMessage(null);
    }, 3000); 
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        setError('Please login to view your cart');
        setProducts([]);
        setLoading(false);
        return;
      }

      const response = await fetch(
        'https://localhost:7191/api/cart',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        // Token expired or invalid
        await StorageService.clearAuthData();
        setError('Session expired. Please login again.');
        setProducts([]);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch cart: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched cart data:', data);
      
      // Assuming data.cartItems or data.items is the array of cart products
      const cartItems = Array.isArray(data.cartItems) ? data.cartItems : (Array.isArray(data.items) ? data.items : []);
      
      // If cart item structure is different, map to Product type
      const productsData = cartItems.map((item: any) => {
        // If item.product exists, use it, else fallback to item
        const product = item.product || item;
        return {
          ...cleanProductData(product),
          quantity: item.quantity || 1, // Optionally add quantity if needed
        };
      });
      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError(err.message || 'Failed to load cart. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // console.log('PlaceholderListScreen focused, refreshing products...');
      fetchProducts();
    }, [])
  );

  const handleDeleteProduct = async (productId: string) => {
    // console.log('Delete button clicked for product:', productId);
    
    try {
      const response = await fetch(
        `https://localhost:7191/api/Product/DeleteProduct/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      // console.log('Delete API response status:', response.status);
      const responseBody = await response.text();
      // console.log('Delete API response body:', responseBody);

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}. Response: ${responseBody}`);
      }

      // console.log('Product deleted successfully:', productId);
      showMessage('Product deleted successfully', false);
      fetchProducts(); 
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      showMessage(err.message || 'Failed to delete product. Please try again.', true);
    }
  };

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const token = await StorageService.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(
        `https://localhost:7191/api/cart/remove/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to remove from cart');
      }
      showMessage('Removed from cart', false);
      fetchProducts();
    } catch (err: any) {
      showMessage(err.message || 'Failed to remove from cart', true);
    }
  };

  const handlePayment = async (productId: string, quantity: number) => {
    try {
      const token = await StorageService.getAuthToken();
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(
        'https://localhost:7191/api/Order',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ productId, quantity })
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Payment failed');
      showMessage('Payment successful!', false);
      fetchProducts();
    } catch (err: any) {
      showMessage(err.message || 'Payment failed', true);
    }
  };

  const renderProductItem = ({ item }: { item: CartProduct }) => (
    <View style={styles.cartCard}>
      <Image
        source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/120' }}
        style={styles.cartImage}
        resizeMode="cover"
      />
      <View style={styles.cartInfo}>
        <Text style={styles.cartName}>{item.name}</Text>
        <Text style={styles.cartDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.cartPrice}>{item.price?.toLocaleString()} VND</Text>
        <Text style={styles.cartQty}>Số lượng: {item.quantity}</Text>
        <View style={styles.cartActions}>
          <TouchableOpacity style={styles.payButton} onPress={() => handlePayment(item.productId, item.quantity || 1)}>
            <Ionicons name="card-outline" size={18} color="#fff" />
            <Text style={styles.payButtonText}>Thanh toán</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveFromCart(item.productId)}>
            <Ionicons name="trash-outline" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        {(error.includes('login') || error.includes('Login')) && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            )}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    alignItems: 'center',
  },
  cartImage: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 16,
    backgroundColor: '#f3f3f3',
  },
  cartInfo: {
    flex: 1,
  },
  cartName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  cartDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  cartPrice: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cartQty: {
    fontSize: 14,
    color: '#444',
    marginBottom: 8,
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  removeButton: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  messageContainer: {
    padding: Spacing.sm,
    marginHorizontal: Spacing.md,
    borderRadius: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    position: 'absolute', // Position message over content
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  successMessage: {
    backgroundColor: Colors.success,
  },
  errorMessage: {
    backgroundColor: Colors.error,
  },
  messageText: {
    color: Colors.background,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  loginButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PlaceholderListScreen; 