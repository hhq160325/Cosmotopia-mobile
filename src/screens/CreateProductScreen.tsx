import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from '../components/CustomButton';
import { Brand, Category } from '../types/products.type';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';

const CreateProductScreen = () => {
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

  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

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

  const pickImage = async () => {
    try {
      if (Platform.OS === 'web') {
        // Create a file input element for web
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        // Create a promise to handle the file selection
        const result = await new Promise<{ canceled: boolean; assets?: Array<{ uri: string; type: string; fileName: string }> }>((resolve) => {
          input.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
              resolve({
                canceled: false,
                assets: [{
                  uri: URL.createObjectURL(file),
                  type: file.type,
                  fileName: file.name
                }]
              });
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
        // Use expo-image-picker for mobile
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });

        if (!result.canceled && result.assets?.[0]) {
          const selectedAsset = result.assets[0];
          setImage({
            uri: selectedAsset.uri,
            type: 'image/jpeg',
            name: selectedAsset.fileName || 'product-image.jpg',
          });
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const createBrand = async () => {
    if (!newBrandName.trim()) {
      Alert.alert('Error', 'Please enter a brand name');
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
      Alert.alert('Success', 'Brand created successfully');
    } catch (error) {
      console.error("Failed to create brand:", error);
      Alert.alert('Error', 'Failed to create brand');
    }
  };

  const handleCreateProduct = async () => {
    if (!name || !description || !price || !stockQuantity || !selectedBrand || !selectedCategory || !image) {
      Alert.alert('Error', 'Please fill in all fields and select an image');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stockQuantity", stockQuantity);
      formData.append("brandId", selectedBrand);
      formData.append("categoryId", selectedCategory);
      formData.append("commissionRate", commissionRate);
      
      if (image) {
        formData.append("imageFile", {
          uri: image.uri,
          type: image.type,
          name: image.name,
        } as any);
      }

      const response = await fetch(
        "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/CreateProduct",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      Alert.alert('Success', 'Product created successfully');
      // Reset form
      setName('');
      setDescription('');
      setPrice('');
      setStockQuantity('');
      setCommissionRate('');
      setSelectedBrand('');
      setSelectedCategory('');
      setImage(null);
    } catch (error) {
      console.error("Failed to create product:", error);
      Alert.alert('Error', 'Failed to create product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create New Product</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Image</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.selectedImage} />
          ) : (
            <Text style={styles.imagePickerText}>Select Product Image</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Product Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Product Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
        <TextInput
          style={styles.input}
          placeholder="Price (VND)"
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
          placeholder="Commission Rate (%)"
          value={commissionRate}
          onChangeText={setCommissionRate}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brand</Text>
        <View style={styles.brandSection}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New Brand Name"
            value={newBrandName}
            onChangeText={setNewBrandName}
          />
          <CustomButton
            title="Create Brand"
            onPress={createBrand}
            variant="secondary"
            style={styles.createBrandButton}
          />
        </View>
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

      <CustomButton
        title="Create Product"
        onPress={handleCreateProduct}
        variant="primary"
        style={styles.createButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
    color: Colors.text,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
    color: Colors.text,
  },
  input: {
    backgroundColor: '#fff',
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  imagePickerText: {
    color: Colors.text,
    fontSize: 16,
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  brandSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  createBrandButton: {
    marginLeft: Spacing.sm,
  },
  brandList: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  brandChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedBrandChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  brandChipText: {
    color: Colors.text,
  },
  selectedBrandChipText: {
    color: '#fff',
  },
  categoryList: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    color: Colors.text,
  },
  selectedCategoryChipText: {
    color: '#fff',
  },
  createButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});

export default CreateProductScreen; 