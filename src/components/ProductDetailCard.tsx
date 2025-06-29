import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Product } from '../types/products.type';

type Props = {
  product: Product;
};

const ProductDetailCard = ({ product }: Props) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: product.imageUrls[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{product.name}</Text>
        
        <View style={styles.brandCategoryContainer}>
          <Text style={styles.brandCategory}>
            {product.brand.name} • {product.category.name}
          </Text>
          {product.brand.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>

        <Text style={styles.price}>
          {(product.price / 1000).toLocaleString()}₫
        </Text>

        <View style={styles.stockContainer}>
          <Text style={styles.stockLabel}>Stock:</Text>
          <Text style={[
            styles.stockValue,
            { color: product.stockQuantity > 0 ? '#22c55e' : '#ef4444' }
          ]}>
            {product.stockQuantity > 0 ? `${product.stockQuantity} available` : 'Out of stock'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Commission Rate</Text>
          <Text style={styles.commissionRate}>{product.commissionRate}%</Text>
        </View>

       
    
      </View>
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.8,
    backgroundColor: '#f3f4f6',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f2937',
  },
  brandCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandCategory: {
    fontSize: 16,
    color: '#6b7280',
    marginRight: 8,
  },
  premiumBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e11d48',
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 16,
    color: '#4b5563',
    marginRight: 8,
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  commissionRate: {
    fontSize: 16,
    color: '#4b5563',
  },
  detailsContainer: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
  },
  detailItem: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
});

export default ProductDetailCard; 