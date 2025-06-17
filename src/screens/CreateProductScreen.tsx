import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from '../components/CustomButton';
import { Brand, Category, Product } from '../types/products.type';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreateProduct'>;

interface Props {
  navigation: CreateProductScreenNavigationProp;
  route: {
    params?: {
      product?: Product;
      mode?: 'edit' | 'create';
    };
  };
}

const CreateProductScreen = ({ route, navigation }: Props) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [commissionRate, setCommissionRate] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [image, setImage] = useState<{ uri: string; type: string; name: string } | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newBrandName, setNewBrandName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setIsErrorMessage(isError);
    setTimeout(() => {
      setMessage(null);
    }, 3000); 
  };

  useEffect(() => {
    fetchBrands();
    fetchCategories();
    fetchProducts();


    if (route.params?.product && route.params?.mode === 'edit') {
      const product = route.params.product;
      setSelectedProductId(product.productId);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setStockQuantity(product.stockQuantity.toString());
      setCommissionRate(product.commissionRate?.toString() || '');
      setSelectedBrand(product.brandId);
      setSelectedCategory(product.categoryId);
      if (product.imageUrls && product.imageUrls.length > 0) {
        setImage({
          uri: product.imageUrls[0],
          type: 'image/jpeg',
          name: 'product-image.jpg'
        });
      }
    }
  }, [route.params]);

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Brand/GetAllBrand?page=1&pageSize=10"
      );
      const data = await response.json();
      setBrands(data.brands || []);
    } catch (error) {
      console.error("Failed to fetch brands:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Category/GetAllCategory"
      );
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct"
      );
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // console.log('Fetched products:', data.products);
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showMessage('Failed to load products. Please try again.', true);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        const result = await new Promise<{ canceled: boolean; assets?: Array<{ uri: string; type: string; fileName: string }> }>((resolve) => {
          input.onchange = async (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
           
              const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
              if (!validTypes.includes(file.type)) {
                showMessage('Please select a valid image file (JPEG, PNG, GIF, or WebP)', true);
                resolve({ canceled: true });
                return;
              }
              
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve({
                  canceled: false,
                  assets: [{
                    uri: reader.result as string,
                    type: file.type,
                    fileName: file.name
                  }]
                });
              };
              reader.readAsDataURL(file);
            } else {
              resolve({ canceled: true });
            }
          };
          input.click();
        });

        if (!result.canceled && result.assets?.[0]) {
          const selectedAsset = result.assets[0];
          setImage({
            uri: selectedAsset.uri,
            type: selectedAsset.type,
            name: selectedAsset.fileName,
          });
        }
      } else {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
          base64: true,
        });

        if (!result.canceled && result.assets?.[0]) {
          const selectedAsset = result.assets[0];
          // Determine the image type from the URI
          const imageType = selectedAsset.uri.startsWith('data:') 
            ? selectedAsset.uri.split(';')[0].split(':')[1]
            : 'image/jpeg';
            
          setImage({
            uri: selectedAsset.uri,
            type: imageType,
            name: selectedAsset.fileName || `product-image.${imageType.split('/')[1]}`,
          });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showMessage('Failed to pick image', true);
    }
  };

  const createBrand = async () => {
    if (!newBrandName.trim()) {
      showMessage('Please enter a brand name', true);
      return;
    }

    try {
      const response = await fetch(
        "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Brand/CreateBrand",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newBrandName }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create brand');
      }

      const data = await response.json();
      setBrands([...brands, data]);
      setNewBrandName('');
      showMessage('Brand created successfully', false);
    } catch (error) {
      console.error("Failed to create brand:", error);
      showMessage('Failed to create brand', true);
    }
  };

 
  const handleCreateProduct = async () => {
    if (!validateForm()) {
      return;
    }
  
    setIsSubmitting(true);
    try {
     
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
  
      const imageUrlOnly = image?.uri?.startsWith('http') ? image.uri : '';
  
      const productData = {
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        commissionRate: Number(commissionRate || 0),
        categoryId: selectedCategory,
        brandId: selectedBrand,
        imageUrls: imageUrlOnly ? [imageUrlOnly] : [],
      };
  
      // console.log('Sending product data:', productData);
  
      const response = await fetch(
        'https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/CreateProduct',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        }
      );
  
      // console.log('Response status:', response.status);
      const responseText = await response.text();
      // console.log('Response text:', responseText);
  
      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
      }
  
      try {
        const responseData = JSON.parse(responseText);
        // console.log('Product created successfully:', responseData);
        showMessage('Product created successfully', false);
      } catch (e) {
        // console.log('Response was not JSON, but product was likely created successfully');
        showMessage('Product created successfully', false);
      }
  
   
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTabNavigator',
          params: {
            screen: 'HomeTab',
            params: { refresh: true },
          },
        })
      );
    } catch (error) {
      console.error('Error creating product:', error);
      showMessage(error instanceof Error ? error.message : 'Failed to create product', true);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const updateProduct = async (productId: string) => {
    if (!name || !description || !price || !stockQuantity || !selectedBrand || !selectedCategory) {
      showMessage('Please fill in all required fields', true);
      return;
    }

    try {
      const productData = {
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        brandId: selectedBrand,
        categoryId: selectedCategory,
        commissionRate: Number(commissionRate || "0"),
        imageUrls: image ? [image.uri] : []
      };

      // console.log('Sending update data:', productData);

      const response = await fetch(
        `https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/UpdateProduct/${productId}`,
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to update product: ${response.status} ${response.statusText}`);
      }

      showMessage('Product updated successfully', false);
      resetForm();
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTabNavigator',
          params: {
            screen: 'HomeTab',
            params: { refresh: true },
          },
        })
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      showMessage(error instanceof Error ? error.message : 'Failed to update product', true);
    }
  };

  const deleteProduct = async (productId: string) => {
    // console.log('Starting delete process for product:', productId);
    try {
      
      const cleanProductId = productId.trim();
      // console.log('Cleaned product ID:', cleanProductId);

      const apiUrl = `https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/DeleteProduct/${cleanProductId}`;
      // console.log('Sending delete request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      // console.log('Delete response status:', response.status);
      const responseText = await response.text();
      // console.log('Delete response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}\nResponse: ${responseText}`);
      }

      // console.log('Delete successful');
      showMessage('Product deleted successfully', false);
      resetForm();
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTabNavigator',
          params: {
            screen: 'HomeTab',
            params: { refresh: true },
          },
        })
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
      showMessage(error instanceof Error ? error.message : 'Failed to delete product', true);
      throw error;
    }
  };

  const handleProductSelect = (product: any) => {
    // console.log('Product selected:', product);
    if (!product.productId) {
      showMessage('Invalid product data: missing product ID', true);
      return;
    }
    setSelectedProductId(product.productId);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price.toString());
    setStockQuantity(product.stockQuantity.toString());
    setCommissionRate(product.commissionRate?.toString() || '');
    setSelectedBrand(product.brandId);
    setSelectedCategory(product.categoryId);
    if (product.imageUrls && product.imageUrls.length > 0) {
      setImage({
        uri: product.imageUrls[0],
        type: 'image/jpeg',
        name: 'product-image.jpg'
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!selectedProductId) {
      showMessage('No product selected for update', true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProduct(selectedProductId);
      showMessage('Product updated successfully', false);
      resetForm();
      navigation.dispatch(
        CommonActions.navigate({
          name: 'BottomTabNavigator',
          params: {
            screen: 'HomeTab',
            params: { refresh: true },
          },
        })
      );
    } catch (error) {
      console.error("Failed to update product:", error);
      showMessage(error instanceof Error ? error.message : 'Failed to update product', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    // console.log('Delete button clicked, selectedProductId:', selectedProductId);
    
    if (!selectedProductId) {
      // console.log('No product selected');
      showMessage('No product selected for deletion', true);
      return;
    }
    
    // console.log('Delete confirmed, proceeding with deletion');
    setIsSubmitting(true);
    try {
      await deleteProduct(selectedProductId);
    } catch (error) {
      console.error("Delete operation failed:", error);
      showMessage(error instanceof Error ? error.message : 'Failed to delete product', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedProductId(null);
    setName('');
    setDescription('');
    setPrice('');
    setStockQuantity('');
    setCommissionRate('');
    setSelectedBrand('');
    setSelectedCategory('');
    setImage(null);
  };

  const validateForm = () => {
    if (!name.trim()) {
      showMessage('Please enter a product name', true);
      return false;
    }
    if (!description.trim()) {
      showMessage('Please enter a product description', true);
      return false;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      showMessage('Please enter a valid price', true);
      return false;
    }
    if (!stockQuantity.trim() || isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      showMessage('Please enter a valid stock quantity', true);
      return false;
    }
    if (!selectedCategory) {
      showMessage('Please select a category', true);
      return false;
    }
    return true;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}
      <Text style={styles.title}>{route.params?.mode === 'edit' ? 'Edit Product' : 'Create New Product'}</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Product Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Stock Quantity"
        value={stockQuantity}
        onChangeText={setStockQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Commission Rate (optional)"
        value={commissionRate}
        onChangeText={setCommissionRate}
        keyboardType="numeric"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Image</Text>
        {image ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity onPress={() => setImage(null)} style={styles.removeImageButton}>
              <Text style={styles.removeImageButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CustomButton title="Select Image" onPress={pickImage} variant="secondary" />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brand</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <ScrollView horizontal style={styles.brandList}>
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand.brandId}
                style={[
                  styles.brandChip,
                  selectedBrand === brand.brandId && styles.selectedBrandChip,
                ]}
                onPress={() => setSelectedBrand(brand.brandId)}
              >
                <Text
                  style={[
                    styles.brandChipText,
                    selectedBrand === brand.brandId && styles.selectedBrandChipText,
                  ]}
                >
                  {brand.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView horizontal style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.categoryId}
              style={[
                styles.categoryChip,
                selectedCategory === category.categoryId && styles.selectedCategoryChip,
              ]}
              onPress={() => setSelectedCategory(category.categoryId)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === category.categoryId && styles.selectedCategoryChipText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        {selectedProductId ? (
          <>
            <CustomButton
              title={isSubmitting ? "Updating..." : "Update Product"}
              onPress={handleUpdateProduct}
              variant="primary"
              style={styles.actionButton}
              disabled={isSubmitting}
            />
            <CustomButton
              title="Cancel"
              onPress={() => navigation.goBack()}
              variant="secondary"
              style={styles.actionButton}
              disabled={isSubmitting}
            />
          </>
        ) : (
          <CustomButton
            title={isSubmitting ? "Creating..." : "Create Product"}
            onPress={handleCreateProduct}
            variant="primary"
            style={styles.createButton}
            disabled={isSubmitting}
          />
        )}
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text>Loading products...</Text>
        </View>
      )}
      {products.length === 0 && !isLoading && (
        <Text style={styles.noProductsText}>No products found. Create one!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  contentContainer: {
    padding: Spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.xs,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontSize: 14,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  imagePreviewContainer: {
    width: 100,
    height: 100,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    alignSelf: 'center',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,0,0,0.7)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  brandList: {
    marginBottom: Spacing.sm,
  },
  brandChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedBrandChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  brandChipText: {
    color: Colors.text,
    fontSize: 12,
  },
  selectedBrandChipText: {
    color: '#fff',
  },
  categoryList: {
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.text,
    fontSize: 12,
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  createButton: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  deleteButton: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    backgroundColor: Colors.error,
    opacity: 1,
    paddingVertical: Spacing.xs,
  },
  loadingContainer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  noProductsText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    padding: Spacing.lg,
    fontSize: 14,
  },
  messageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  messageText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorMessage: {
    backgroundColor: Colors.error,
  },
  successMessage: {
    backgroundColor: Colors.success,
  },
});

export default CreateProductScreen; 