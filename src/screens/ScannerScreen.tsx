import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Platform, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CustomButton } from '../components/CustomButton';
import { Product } from '../types/products.type';
import { Colors } from '../constants/Colors';
import { Spacing } from '../constants/Dimensions';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StorageService } from '../services/storageService';

type ScannerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Scanner'>;

interface Props {
  navigation: ScannerScreenNavigationProp;
  route: {
    params?: {
      product?: Product;
      mode?: 'edit' | 'create';
    };
  };
}

interface AIAnalysis {
  skinTone: string;
  skinType: string;
  faceShape: string;
  recommendations: string[];
}

interface RecommendedProduct {
  product: Product;
  reason: string;
  matchScore: number;
}

const { width: screenWidth } = Dimensions.get('window');

const ScannerScreen = ({ navigation }: Props) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<RecommendedProduct[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [addingToCart, setAddingToCart] = useState<{ [key: string]: boolean }>({});

  const showMessage = (msg: string, isError: boolean = false) => {
    setMessage(msg);
    setIsErrorMessage(isError);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  useEffect(() => {
    fetchAvailableProducts();
  }, []);

  const fetchAvailableProducts = async () => {
    try {
      const response = await fetch('https://localhost:7191/api/Product/GetAllProduct');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setAvailableProducts(data.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      showMessage('Failed to load products', true);
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        setUploadedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showMessage('Failed to pick image', true);
    }
  };

  const analyzeImage = async (imageUri: string) => {
    setIsAnalyzing(true);
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        showMessage('Please login to use AI analysis', true);
        return;
      }

      // Simulate AI analysis for now
      await simulateAIAnalysis();
    } catch (error) {
      console.error('AI Analysis error:', error);
      await simulateAIAnalysis();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const simulateAIAnalysis = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate random but realistic analysis results
    const skinTones = ['Warm Light', 'Warm Medium', 'Warm Deep', 'Cool Light', 'Cool Medium', 'Cool Deep', 'Neutral Light', 'Neutral Medium'];
    const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'];
    const faceShapes = ['Oval', 'Round', 'Square', 'Heart', 'Diamond', 'Rectangle'];
    
    const randomSkinTone = skinTones[Math.floor(Math.random() * skinTones.length)];
    const randomSkinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
    const randomFaceShape = faceShapes[Math.floor(Math.random() * faceShapes.length)];
    
    // Generate recommendations based on the random results
    const recommendations: string[] = [];
    
    // Skin tone based recommendations
    if (randomSkinTone.toLowerCase().includes('warm')) {
      recommendations.push('Chọn foundation có tông màu ấm (warm) để phù hợp với da bạn');
      recommendations.push('Sử dụng blush màu coral hoặc peach để tôn lên tông da ấm');
    } else if (randomSkinTone.toLowerCase().includes('cool')) {
      recommendations.push('Chọn foundation có tông màu mát (cool) với undertone hồng');
      recommendations.push('Sử dụng blush màu hồng hoặc rose để phù hợp với da mát');
    } else {
      recommendations.push('Chọn foundation neutral để phù hợp với tông da trung tính');
      recommendations.push('Có thể sử dụng nhiều loại màu sắc khác nhau');
    }
    
    // Skin type based recommendations
    if (randomSkinType.toLowerCase().includes('dry')) {
      recommendations.push('Sử dụng foundation dạng cream hoặc liquid có độ ẩm cao');
      recommendations.push('Thêm primer dưỡng ẩm trước khi trang điểm');
    } else if (randomSkinType.toLowerCase().includes('oily')) {
      recommendations.push('Chọn foundation dạng matte để kiểm soát dầu');
      recommendations.push('Sử dụng setting powder để giữ makeup lâu hơn');
    } else if (randomSkinType.toLowerCase().includes('combination')) {
      recommendations.push('Sử dụng foundation phù hợp với da hỗn hợp');
      recommendations.push('Tập trung kiểm soát dầu ở vùng chữ T');
    }
    
    // Face shape based recommendations
    if (randomFaceShape.toLowerCase().includes('oval')) {
      recommendations.push('Highlight xương gò má để tôn lên khuôn mặt oval');
      recommendations.push('Có thể sử dụng nhiều kiểu trang điểm khác nhau');
    } else if (randomFaceShape.toLowerCase().includes('round')) {
      recommendations.push('Contour để tạo đường nét cho khuôn mặt tròn');
      recommendations.push('Highlight ở giữa trán và cằm để kéo dài khuôn mặt');
    } else if (randomFaceShape.toLowerCase().includes('square')) {
      recommendations.push('Contour góc hàm để làm mềm khuôn mặt vuông');
      recommendations.push('Highlight ở giữa trán để cân bằng tỷ lệ');
    }
    
    // General recommendations
    recommendations.push('Luôn sử dụng kem chống nắng trước khi trang điểm');
    recommendations.push('Tẩy trang sạch sẽ sau khi sử dụng makeup');
    
    const mockAnalysis: AIAnalysis = {
      skinTone: randomSkinTone,
      skinType: randomSkinType,
      faceShape: randomFaceShape,
      recommendations: recommendations.slice(0, 6) // Limit to 6 recommendations
    };
    
    setAiAnalysis(mockAnalysis);
    generateRecommendations(mockAnalysis);
  };

  const generateRecommendations = (analysis: AIAnalysis) => {
    const recommendations: RecommendedProduct[] = [];
    
    availableProducts.forEach(product => {
      let matchScore = 0;
      let reason = '';
      
      // Skin tone based recommendations
      if (analysis.skinTone.toLowerCase().includes('warm')) {
        if (product.name.toLowerCase().includes('foundation') && 
            (product.name.toLowerCase().includes('warm') || product.name.toLowerCase().includes('golden') || product.name.toLowerCase().includes('beige'))) {
          matchScore += 40;
          reason = 'Warm-toned foundation perfect for your skin tone';
        }
        if (product.name.toLowerCase().includes('blush') && 
            (product.name.toLowerCase().includes('coral') || product.name.toLowerCase().includes('peach') || product.name.toLowerCase().includes('warm'))) {
          matchScore += 35;
          reason = 'Warm blush tones to complement your skin';
        }
        if (product.name.toLowerCase().includes('lipstick') && 
            (product.name.toLowerCase().includes('coral') || product.name.toLowerCase().includes('peach') || product.name.toLowerCase().includes('warm'))) {
          matchScore += 30;
          reason = 'Warm lipstick shades for your skin tone';
        }
      } else if (analysis.skinTone.toLowerCase().includes('cool')) {
        if (product.name.toLowerCase().includes('foundation') && 
            (product.name.toLowerCase().includes('cool') || product.name.toLowerCase().includes('pink') || product.name.toLowerCase().includes('neutral'))) {
          matchScore += 40;
          reason = 'Cool-toned foundation perfect for your skin tone';
        }
        if (product.name.toLowerCase().includes('blush') && 
            (product.name.toLowerCase().includes('pink') || product.name.toLowerCase().includes('rose') || product.name.toLowerCase().includes('cool'))) {
          matchScore += 35;
          reason = 'Cool blush tones to complement your skin';
        }
        if (product.name.toLowerCase().includes('lipstick') && 
            (product.name.toLowerCase().includes('pink') || product.name.toLowerCase().includes('rose') || product.name.toLowerCase().includes('cool'))) {
          matchScore += 30;
          reason = 'Cool lipstick shades for your skin tone';
        }
      }
      
      // Skin type based recommendations
      if (analysis.skinType.toLowerCase().includes('combination')) {
        if (product.name.toLowerCase().includes('foundation') && 
            (product.name.toLowerCase().includes('matte') || product.name.toLowerCase().includes('oil') || product.name.toLowerCase().includes('control'))) {
          matchScore += 25;
          reason += ' Oil-control formula for combination skin';
        }
        if (product.name.toLowerCase().includes('primer') && 
            (product.name.toLowerCase().includes('pore') || product.name.toLowerCase().includes('matte'))) {
          matchScore += 20;
          reason = 'Pore-minimizing primer for combination skin';
        }
      } else if (analysis.skinType.toLowerCase().includes('dry')) {
        if (product.name.toLowerCase().includes('foundation') && 
            (product.name.toLowerCase().includes('hydrating') || product.name.toLowerCase().includes('moisture') || product.name.toLowerCase().includes('dewy'))) {
          matchScore += 25;
          reason += ' Hydrating formula for dry skin';
        }
        if (product.name.toLowerCase().includes('primer') && 
            (product.name.toLowerCase().includes('hydrating') || product.name.toLowerCase().includes('moisture'))) {
          matchScore += 20;
          reason = 'Hydrating primer for dry skin';
        }
      } else if (analysis.skinType.toLowerCase().includes('oily')) {
        if (product.name.toLowerCase().includes('foundation') && 
            (product.name.toLowerCase().includes('matte') || product.name.toLowerCase().includes('oil') || product.name.toLowerCase().includes('control'))) {
          matchScore += 25;
          reason += ' Oil-control formula for oily skin';
        }
        if (product.name.toLowerCase().includes('powder') && 
            (product.name.toLowerCase().includes('setting') || product.name.toLowerCase().includes('matte'))) {
          matchScore += 20;
          reason = 'Setting powder for oily skin';
        }
      }
      
      // Face shape based recommendations
      if (analysis.faceShape.toLowerCase().includes('oval')) {
        if (product.name.toLowerCase().includes('highlight') || product.name.toLowerCase().includes('illuminator')) {
          matchScore += 20;
          reason += ' Perfect for highlighting your oval face shape';
        }
        if (product.name.toLowerCase().includes('contour') || product.name.toLowerCase().includes('bronzer')) {
          matchScore += 15;
          reason += ' Subtle contouring for oval face';
        }
      } else if (analysis.faceShape.toLowerCase().includes('round')) {
        if (product.name.toLowerCase().includes('contour') || product.name.toLowerCase().includes('bronzer')) {
          matchScore += 25;
          reason += ' Contouring to define your round face';
        }
        if (product.name.toLowerCase().includes('blush') && 
            (product.name.toLowerCase().includes('matte') || product.name.toLowerCase().includes('natural'))) {
          matchScore += 20;
          reason += ' Natural blush for round face';
        }
      } else if (analysis.faceShape.toLowerCase().includes('square')) {
        if (product.name.toLowerCase().includes('highlight') || product.name.toLowerCase().includes('illuminator')) {
          matchScore += 25;
          reason += ' Highlighting to soften square features';
        }
        if (product.name.toLowerCase().includes('blush') && 
            (product.name.toLowerCase().includes('soft') || product.name.toLowerCase().includes('natural'))) {
          matchScore += 20;
          reason += ' Soft blush to soften square features';
        }
      }
      
      // General makeup recommendations
      if (product.name.toLowerCase().includes('concealer')) {
        matchScore += 15;
        reason += ' Essential for covering imperfections';
      }
      if (product.name.toLowerCase().includes('mascara')) {
        matchScore += 10;
        reason += ' Enhances your natural beauty';
      }
      if (product.name.toLowerCase().includes('eyeliner')) {
        matchScore += 10;
        reason += ' Defines your eyes beautifully';
      }
      if (product.name.toLowerCase().includes('eyeshadow')) {
        matchScore += 10;
        reason += ' Complements your skin tone';
      }
      if (product.name.toLowerCase().includes('setting spray')) {
        matchScore += 15;
        reason += ' Keeps your makeup in place';
      }
      
      // Price-based scoring (prefer affordable options)
      if (product.price < 500000) {
        matchScore += 5;
      } else if (product.price < 1000000) {
        matchScore += 3;
      }
      
      if (matchScore > 0) {
        recommendations.push({
          product,
          reason: reason.trim(),
          matchScore
        });
      }
    });
    
    // Sort by match score and take top 8
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendedProducts(recommendations.slice(0, 8));
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAiAnalysis(null);
    setRecommendedProducts([]);
  };

  const handleAddToCart = async (product: Product) => {
    if (product.stockQuantity <= 0) {
      showMessage('Sản phẩm đã hết hàng', true);
      return;
    }

    setAddingToCart(prev => ({ ...prev, [product.productId]: true }));
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        showMessage('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng', true);
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
          quantity: 1 
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Không thể thêm vào giỏ hàng');
      }

      showMessage(`Đã thêm "${product.name}" vào giỏ hàng!`, false);
      
    } catch (error: any) {
      console.error('Add to cart error:', error);
      showMessage(error.message || 'Không thể thêm vào giỏ hàng', true);
    } finally {
      setAddingToCart(prev => ({ ...prev, [product.productId]: false }));
    }
  };

  const handleAddAllToCart = async () => {
    try {
      const token = await StorageService.getAuthToken();
      if (!token) {
        showMessage('Vui lòng đăng nhập để thêm tất cả sản phẩm vào giỏ hàng', true);
        return;
      }

      for (const product of recommendedProducts) {
        await handleAddToCart(product.product);
      }

      showMessage('Đã thêm tất cả sản phẩm vào giỏ hàng!', false);
    } catch (error: any) {
      console.error('Add all to cart error:', error);
      showMessage(error.message || 'Không thể thêm tất cả sản phẩm vào giỏ hàng', true);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {message && (
        <View style={[styles.messageContainer, isErrorMessage ? styles.errorMessage : styles.successMessage]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      <Text style={styles.title}>AI Beauty Scanner</Text>
      <Text style={styles.subtitle}>
        Upload a photo to get personalized makeup recommendations
      </Text>

      {!uploadedImage && (
        <View style={styles.uploadSection}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={pickImageFromGallery}
          >
            <Ionicons name="images" size={48} color={Colors.primary} />
            <Text style={styles.uploadButtonText}>Upload Photo</Text>
            <Text style={styles.uploadButtonSubtext}>
              Take a selfie or choose from gallery
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {uploadedImage && (
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: uploadedImage }} 
            style={styles.imagePreview} 
          />
          <View style={styles.imageActions}>
            <CustomButton
              title="Analyze with AI"
              onPress={() => analyzeImage(uploadedImage)}
              variant="primary"
              disabled={isAnalyzing}
            />
            <CustomButton
              title="Choose Different Photo"
              onPress={resetAnalysis}
              variant="secondary"
            />
          </View>
        </View>
      )}

      {aiAnalysis && (
        <View style={styles.analysisContainer}>
          <Text style={styles.analysisTitle}>Kết quả phân tích AI</Text>
          
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Ionicons name="color-palette" size={24} color={Colors.primary} />
              <Text style={styles.analysisLabel}>Tông da</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.skinTone}</Text>
            </View>
            <View style={styles.analysisItem}>
              <Ionicons name="water" size={24} color={Colors.primary} />
              <Text style={styles.analysisLabel}>Loại da</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.skinType}</Text>
            </View>
            <View style={styles.analysisItem}>
              <Ionicons name="body" size={24} color={Colors.primary} />
              <Text style={styles.analysisLabel}>Hình dạng mặt</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.faceShape}</Text>
            </View>
          </View>

          <Text style={styles.recommendationsTitle}>Gợi ý trang điểm</Text>
          {aiAnalysis.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      )}

      {recommendedProducts.length > 0 && (
        <View style={styles.productsContainer}>
          <View style={styles.productsHeader}>
            <Text style={styles.productsTitle}>Sản phẩm được đề xuất cho bạn</Text>
            <TouchableOpacity
              style={styles.addAllButton}
              onPress={handleAddAllToCart}
            >
              <Ionicons name="cart" size={20} color={Colors.background} />
              <Text style={styles.addAllButtonText}>Thêm tất cả</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.productsSummary}>
            {recommendedProducts.filter(item => item.product.stockQuantity > 0).length} sản phẩm có sẵn để thêm vào giỏ hàng
          </Text>
          
          {/* Foundation & Base Products */}
          {recommendedProducts.filter(item => 
            item.product.name.toLowerCase().includes('foundation') || 
            item.product.name.toLowerCase().includes('concealer') ||
            item.product.name.toLowerCase().includes('primer')
          ).length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Nền trang điểm</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedProducts
                  .filter(item => 
                    item.product.name.toLowerCase().includes('foundation') || 
                    item.product.name.toLowerCase().includes('concealer') ||
                    item.product.name.toLowerCase().includes('primer')
                  )
                  .map((item, index) => (
                    <TouchableOpacity
                      key={`base-${index}`}
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
                    >
                      <Image
                        source={{ uri: item.product.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {item.product.price.toLocaleString()} VND
                      </Text>
                      <Text style={styles.productReason} numberOfLines={2}>
                        {item.reason}
                      </Text>
                      <View style={styles.productActions}>
                        <View style={styles.matchScore}>
                          <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.addToCartButton,
                            (item.product.stockQuantity <= 0 || addingToCart[item.product.productId]) && styles.disabledButton
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.product);
                          }}
                          disabled={item.product.stockQuantity <= 0 || addingToCart[item.product.productId]}
                        >
                          <Ionicons 
                            name={addingToCart[item.product.productId] ? "hourglass" : "cart"} 
                            size={16} 
                            color={Colors.background} 
                          />
                          <Text style={styles.addToCartText}>
                            {addingToCart[item.product.productId] ? 'Đang thêm...' : 'Thêm'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Color Products */}
          {recommendedProducts.filter(item => 
            item.product.name.toLowerCase().includes('blush') || 
            item.product.name.toLowerCase().includes('lipstick') ||
            item.product.name.toLowerCase().includes('eyeshadow') ||
            item.product.name.toLowerCase().includes('highlight') ||
            item.product.name.toLowerCase().includes('contour')
          ).length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Màu sắc & Tạo khối</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedProducts
                  .filter(item => 
                    item.product.name.toLowerCase().includes('blush') || 
                    item.product.name.toLowerCase().includes('lipstick') ||
                    item.product.name.toLowerCase().includes('eyeshadow') ||
                    item.product.name.toLowerCase().includes('highlight') ||
                    item.product.name.toLowerCase().includes('contour')
                  )
                  .map((item, index) => (
                    <TouchableOpacity
                      key={`color-${index}`}
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
                    >
                      <Image
                        source={{ uri: item.product.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {item.product.price.toLocaleString()} VND
                      </Text>
                      <Text style={styles.productReason} numberOfLines={2}>
                        {item.reason}
                      </Text>
                      <View style={styles.productActions}>
                        <View style={styles.matchScore}>
                          <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.addToCartButton,
                            (item.product.stockQuantity <= 0 || addingToCart[item.product.productId]) && styles.disabledButton
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.product);
                          }}
                          disabled={item.product.stockQuantity <= 0 || addingToCart[item.product.productId]}
                        >
                          <Ionicons 
                            name={addingToCart[item.product.productId] ? "hourglass" : "cart"} 
                            size={16} 
                            color={Colors.background} 
                          />
                          <Text style={styles.addToCartText}>
                            {addingToCart[item.product.productId] ? 'Đang thêm...' : 'Thêm'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Eye & Lip Products */}
          {recommendedProducts.filter(item => 
            item.product.name.toLowerCase().includes('mascara') || 
            item.product.name.toLowerCase().includes('eyeliner') ||
            item.product.name.toLowerCase().includes('brow') ||
            item.product.name.toLowerCase().includes('lip')
          ).length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Mắt & Môi</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedProducts
                  .filter(item => 
                    item.product.name.toLowerCase().includes('mascara') || 
                    item.product.name.toLowerCase().includes('eyeliner') ||
                    item.product.name.toLowerCase().includes('brow') ||
                    item.product.name.toLowerCase().includes('lip')
                  )
                  .map((item, index) => (
                    <TouchableOpacity
                      key={`eye-lip-${index}`}
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
                    >
                      <Image
                        source={{ uri: item.product.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {item.product.price.toLocaleString()} VND
                      </Text>
                      <Text style={styles.productReason} numberOfLines={2}>
                        {item.reason}
                      </Text>
                      <View style={styles.productActions}>
                        <View style={styles.matchScore}>
                          <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.addToCartButton,
                            (item.product.stockQuantity <= 0 || addingToCart[item.product.productId]) && styles.disabledButton
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.product);
                          }}
                          disabled={item.product.stockQuantity <= 0 || addingToCart[item.product.productId]}
                        >
                          <Ionicons 
                            name={addingToCart[item.product.productId] ? "hourglass" : "cart"} 
                            size={16} 
                            color={Colors.background} 
                          />
                          <Text style={styles.addToCartText}>
                            {addingToCart[item.product.productId] ? 'Đang thêm...' : 'Thêm'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}

          {/* Other Products */}
          {recommendedProducts.filter(item => 
            !item.product.name.toLowerCase().includes('foundation') && 
            !item.product.name.toLowerCase().includes('concealer') &&
            !item.product.name.toLowerCase().includes('primer') &&
            !item.product.name.toLowerCase().includes('blush') && 
            !item.product.name.toLowerCase().includes('lipstick') &&
            !item.product.name.toLowerCase().includes('eyeshadow') &&
            !item.product.name.toLowerCase().includes('highlight') &&
            !item.product.name.toLowerCase().includes('contour') &&
            !item.product.name.toLowerCase().includes('mascara') && 
            !item.product.name.toLowerCase().includes('eyeliner') &&
            !item.product.name.toLowerCase().includes('brow')
          ).length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.categoryTitle}>Sản phẩm khác</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {recommendedProducts
                  .filter(item => 
                    !item.product.name.toLowerCase().includes('foundation') && 
                    !item.product.name.toLowerCase().includes('concealer') &&
                    !item.product.name.toLowerCase().includes('primer') &&
                    !item.product.name.toLowerCase().includes('blush') && 
                    !item.product.name.toLowerCase().includes('lipstick') &&
                    !item.product.name.toLowerCase().includes('eyeshadow') &&
                    !item.product.name.toLowerCase().includes('highlight') &&
                    !item.product.name.toLowerCase().includes('contour') &&
                    !item.product.name.toLowerCase().includes('mascara') && 
                    !item.product.name.toLowerCase().includes('eyeliner') &&
                    !item.product.name.toLowerCase().includes('brow')
                  )
                  .map((item, index) => (
                    <TouchableOpacity
                      key={`other-${index}`}
                      style={styles.productCard}
                      onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
                    >
                      <Image
                        source={{ uri: item.product.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
                        style={styles.productImage}
                      />
                      <Text style={styles.productName} numberOfLines={2}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        {item.product.price.toLocaleString()} VND
                      </Text>
                      <Text style={styles.productReason} numberOfLines={2}>
                        {item.reason}
                      </Text>
                      <View style={styles.productActions}>
                        <View style={styles.matchScore}>
                          <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                        </View>
                        <TouchableOpacity
                          style={[
                            styles.addToCartButton,
                            (item.product.stockQuantity <= 0 || addingToCart[item.product.productId]) && styles.disabledButton
                          ]}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item.product);
                          }}
                          disabled={item.product.stockQuantity <= 0 || addingToCart[item.product.productId]}
                        >
                          <Ionicons 
                            name={addingToCart[item.product.productId] ? "hourglass" : "cart"} 
                            size={16} 
                            color={Colors.background} 
                          />
                          <Text style={styles.addToCartText}>
                            {addingToCart[item.product.productId] ? 'Đang thêm...' : 'Thêm'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>
      )}

      {isAnalyzing && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>AI is analyzing your photo...</Text>
        </View>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  uploadSection: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  uploadButton: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    minHeight: 200,
    justifyContent: 'center',
  },
  uploadButtonText: {
    marginTop: Spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  uploadButtonSubtext: {
    marginTop: Spacing.xs,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginBottom: Spacing.md,
  },
  imageActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  analysisContainer: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  analysisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  analysisItem: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.sm,
  },
  analysisLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  recommendationText: {
    marginLeft: Spacing.xs,
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  productsContainer: {
    marginBottom: Spacing.lg,
  },
  productsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addAllButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addAllButtonText: {
    marginLeft: Spacing.xs,
    fontSize: 12,
    color: Colors.background,
    fontWeight: 'bold',
  },
  productCard: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: Spacing.sm,
    marginRight: Spacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 8,
    marginBottom: Spacing.xs,
  },
  productName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  productPrice: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  productReason: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  matchScore: {
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  matchScoreText: {
    fontSize: 10,
    color: Colors.background,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.xs,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: Colors.textSecondary,
  },
  addToCartText: {
    marginLeft: Spacing.xs,
    fontSize: 12,
    color: Colors.background,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: Spacing.lg,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  messageContainer: {
    padding: Spacing.sm,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  messageText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: Colors.error,
  },
  successMessage: {
    backgroundColor: Colors.success,
  },
  categorySection: {
    marginBottom: Spacing.lg,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  productsSummary: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
});

export default ScannerScreen; 