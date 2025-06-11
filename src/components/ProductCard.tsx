import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Product } from '../types/products.type';

type Props = {
  product: Product;
};

const ProductCard = ({ product }: Props) => {
  const firstImageUrl = product.imageUrls && product.imageUrls.length > 0 
    ? product.imageUrls[0] 
    : undefined;

  const imageUrl = typeof firstImageUrl === 'string' 
    ? firstImageUrl 
    : 'https://via.placeholder.com/80'; // Fallback image URL

  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.name}>{product.name || 'N/A'}</Text>
      <Text style={styles.meta}>
        {product.brand?.name || 'N/A'} • {product.category?.name || 'N/A'}
      </Text>
      <Text style={styles.price}>{(product.price / 1000).toLocaleString()}₫</Text>
      <Text style={styles.description}>{product.description || 'No description available.'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 16 },
  image: { width: '100%', height: 150, borderRadius: 10 },
  name: { fontWeight: 'bold', fontSize: 16, marginTop: 8 },
  meta: { color: 'gray', fontSize: 12 },
  price: { color: '#e11d48', fontWeight: 'bold', marginTop: 4 },
  description: { color: '#666', fontSize: 12, marginTop: 4 }
});

export default ProductCard;
