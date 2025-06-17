import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import ProductDetailCard from '../components/ProductDetailCard';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { CustomButton } from '../components/CustomButton';
import { Product } from '../types/products.type';
import { CommonActions } from '@react-navigation/native';

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setIsErrorMessage(isError);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  const handleDelete = async () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    setShowConfirmModal(false);
    try {
      console.log('Preparing to fetch delete API for product ID:', product.productId);
      const response = await fetch(
        `https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/DeleteProduct/${product.productId}`,
        {
          method: "DELETE",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Delete API response status:', response.status);
      const responseBody = await response.text();
      console.log('Delete API response body:', responseBody);

      if (!response.ok) {
        console.error('Delete failed with status:', response.status);
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}. Response: ${responseBody}`);
      }

      console.log('Product deleted successfully:', product.productId);
      showMessage('Product deleted successfully', false);
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
      console.error("Failed to delete product (full error object):", error);
      showMessage(error.message || 'Failed to delete product. Please try again.', true);
    }
  };

  const handleUpdate = () => {
    navigation.navigate('CreateProduct', { 
      product: product,
      mode: 'edit'
    });
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
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdate}
          >
            <Ionicons name="create-outline" size={20} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color={Colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <ProductDetailCard product={product} />

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalMessage}>Are you sure you want to delete this product?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteConfirmButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateButton: {
    padding: Spacing.xs,
    marginRight: Spacing.xs,
  },
  deleteButton: {
    padding: Spacing.xs,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    width: '80%',
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 16,
    color: Colors.text,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 8,
  },
  modalButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.border,
  },
  deleteConfirmButton: {
    backgroundColor: Colors.error,
  },
  buttonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButtonText: {
    color: Colors.background,
  },
}); 