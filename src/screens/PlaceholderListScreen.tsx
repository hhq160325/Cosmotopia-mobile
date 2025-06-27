import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product as BaseProduct, Brand, Category } from '../types/products.type'; 
import { CommonActions, useNavigation, useFocusEffect } from '@react-navigation/native'; 
import { Colors } from '../constants/Colors'; 
import { Spacing } from '../constants/Dimensions'; 
import { StorageService } from '../services/storageService';

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
      if (!token) throw new Error('No authentication token found');
      const response = await fetch(
        'https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/cart',
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
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
        `https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/DeleteProduct/${productId}`,
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
        `https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/cart/remove/${productId}`,
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
        'https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Order',
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
    <View style={styles.productItem}>
      <View style={styles.productImageContainer}>
        <Image
          source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.productPrice}>Price: {item.price.toLocaleString()} VND</Text>
        <Text style={styles.productStock}>Stock: {item.stockQuantity}</Text>
        <Text style={styles.productStock}>Quantity: {item.quantity || 1}</Text>
        <View style={styles.cartActionRow}>
          <TouchableOpacity
            style={[styles.cartActionButton, item.stockQuantity <= 0 && styles.disabledButton]}
            onPress={() => handlePayment(item.productId, item.quantity || 1)}
            disabled={item.stockQuantity <= 0}
          >
            <Text style={styles.cartActionButtonText}>Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cartActionButton}
            onPress={() => handleRemoveFromCart(item.productId)}
          >
            <Text style={styles.cartActionButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteProduct(item.productId)}
        >
          <Ionicons name="trash-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
    padding: 16,
  },
  productItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
  productStock: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteButton: {
    padding: 8,
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
  cartActionRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  cartActionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cartActionButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
});

export default PlaceholderListScreen; 