import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import ProductDetailCard from '../components/ProductDetailCard';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { Product } from '../types/products.type';
import { CommonActions } from '@react-navigation/native';
import { StorageService } from '../services/storageService';

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductDetailScreenNavigationProp;
  route: {
    params: {
      product: Product;
    };
  };
}

export default function ProductDetailScreen({ navigation, route }: Props) {
  const { product } = route.params;
  const [message, setMessage] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setIsErrorMessage(isError);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleAddToCart = async () => {
    if (product.stockQuantity <= 0) {
      showMessage('Product is out of stock', true);
      return;
    }

    if (quantity > product.stockQuantity) {
      showMessage(`Only ${product.stockQuantity} items available in stock`, true);
      return;
    }

    setIsAddingToCart(true);
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        showMessage('Please login to add items to cart', true);
        return;
      }

      const response = await fetch('https://localhost:7191/api/cart/add', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productId: product.productId, 
          quantity: quantity 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to cart');
      }

      showMessage(`Added ${quantity} item(s) to cart!`, false);
      
      // Reset quantity after successful add
      setQuantity(1);
      
    } catch (error: any) {
      console.error('Add to cart error:', error);
      showMessage(error.message || 'Failed to add to cart', true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handlePayment = async () => {
    if (product.stockQuantity <= 0) {
      showMessage('Product is out of stock', true);
      return;
    }

    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        showMessage('Please login to make payment', true);
        return;
      }

      const response = await fetch('https://localhost:7191/api/Order', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          productId: product.productId, 
          quantity: quantity 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Payment failed');
      }
      
      showMessage('Payment successful!', false);
      
      // Navigate back to home and refresh
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'BottomTabNavigator',
            state: {
              routes: [
                {
                  name: 'HomeTab',
                  params: { refresh: true }
                }
              ]
            }
          }
        ],
      });
      
    } catch (error: any) {
      console.error('Payment error:', error);
      showMessage(error.message || 'Payment failed', true);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <View style={styles.placeholder} />
      </View>
      
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      
      <ProductDetailCard product={product} />

      {/* Quantity Selector */}
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityLabel}>Quantity:</Text>
        <View style={styles.quantitySelector}>
          <TouchableOpacity
            style={[styles.quantityButton, quantity <= 1 && styles.quantityButtonDisabled]}
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Ionicons name="remove" size={20} color={quantity <= 1 ? Colors.textSecondary : Colors.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={[styles.quantityButton, quantity >= product.stockQuantity && styles.quantityButtonDisabled]}
            onPress={increaseQuantity}
            disabled={quantity >= product.stockQuantity}
          >
            <Ionicons name="add" size={20} color={quantity >= product.stockQuantity ? Colors.textSecondary : Colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.stockInfo}>
          {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
        </Text>
      </View>

      {/* Add to Cart and Payment Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionMainButton, 
            (product.stockQuantity <= 0 || isAddingToCart) && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={product.stockQuantity <= 0 || isAddingToCart}
        >
          <Text style={styles.actionButtonText}>
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionMainButton, product.stockQuantity <= 0 && styles.disabledButton]}
          onPress={handlePayment}
          disabled={product.stockQuantity <= 0}
        >
          <Text style={styles.actionButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  placeholder: {
    width: 24,
    height: 24,
  },
  messageContainer: {
    padding: Spacing.xs,
    marginHorizontal: Spacing.sm,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xs,
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
    fontSize: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: 8,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 20,
    paddingHorizontal: Spacing.sm,
  },
  quantityButton: {
    padding: Spacing.sm,
    borderRadius: 20,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    minWidth: 30,
    textAlign: 'center',
  },
  stockInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    gap: 12,
  },
  actionMainButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    opacity: 1,
  },
  actionButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
}); 