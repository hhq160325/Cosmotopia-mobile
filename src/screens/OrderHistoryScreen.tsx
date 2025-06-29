import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';
import { Spacing, FontSize, BorderRadius } from '../constants/Dimensions';
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../types/navigation";

interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

type OrderHistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OrderHistory'>;

interface Props {
  navigation: OrderHistoryScreenNavigationProp;
}

const OrderHistoryScreen = ({ navigation }: Props) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      // TODO: Replace with actual API endpoint
      const response = await fetch(
        'https://localhost:7191/api/Order/history?page=1&pageSize=20'
      );
      if (!response.ok) {
        throw new Error('Failed to fetch order history');
      }
      const data = await response.json();
      setOrders(data.items || []);
    } catch (err) {
      // For demo purposes, create mock data
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          orderDate: '2024-01-15',
          totalAmount: 299.99,
          status: 'delivered',
          items: [
            {
              id: '1',
              productName: 'Smartphone XYZ',
              quantity: 1,
              price: 299.99,
              imageUrl: 'https://via.placeholder.com/100'
            }
          ]
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          orderDate: '2024-01-10',
          totalAmount: 149.50,
          status: 'shipped',
          items: [
            {
              id: '2',
              productName: 'Wireless Headphones',
              quantity: 2,
              price: 74.75,
              imageUrl: 'https://via.placeholder.com/100'
            }
          ]
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          orderDate: '2024-01-05',
          totalAmount: 89.99,
          status: 'pending',
          items: [
            {
              id: '3',
              productName: 'Smart Watch',
              quantity: 1,
              price: 89.99,
              imageUrl: 'https://via.placeholder.com/100'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return Colors.success;
      case 'shipped':
        return Colors.primary;
      case 'confirmed':
        return Colors.warning;
      case 'pending':
        return Colors.textSecondary;
      case 'cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'Đã giao hàng';
      case 'shipped':
        return 'Đang giao hàng';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'pending':
        return 'Chờ xử lý';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const renderOrderItem = ({ item }: { item: Order }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetail')}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>
      
      <Text style={styles.orderDate}>{formatDate(item.orderDate)}</Text>
      
      <View style={styles.itemsContainer}>
        {item.items.slice(0, 2).map((orderItem, index) => (
          <View key={orderItem.id} style={styles.itemRow}>
            {orderItem.imageUrl && (
              <Image
                source={{ uri: orderItem.imageUrl }}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.itemDetails}>
              <Text style={styles.itemName} numberOfLines={1}>
                {orderItem.productName}
              </Text>
              <Text style={styles.itemQuantity}>
                Số lượng: {orderItem.quantity}
              </Text>
            </View>
          </View>
        ))}
        {item.items.length > 2 && (
          <Text style={styles.moreItems}>
            +{item.items.length - 2} sản phẩm khác
          </Text>
        )}
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.totalAmount}>
          Tổng cộng: ${item.totalAmount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
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
      <Text style={styles.title}>Lịch sử mua hàng</Text>
      {orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    padding: Spacing.lg,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    color: Colors.text,
  },
  listContainer: {
    padding: Spacing.lg,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.text,
  },
  status: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  itemsContainer: {
    marginBottom: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: FontSize.sm,
    color: Colors.text,
    fontWeight: '500',
  },
  itemQuantity: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  moreItems: {
    fontSize: FontSize.xs,
    color: Colors.primary,
    fontStyle: 'italic',
    marginTop: Spacing.xs,
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  totalAmount: {
    fontSize: FontSize.lg,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'right',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});

export default OrderHistoryScreen; 