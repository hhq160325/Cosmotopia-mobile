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
import { API_CONFIG } from '../config/api';


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
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALL_PRODUCTS}`);
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
    
    const mockAnalysis: AIAnalysis = {
      skinTone: 'Warm Medium',
      skinType: 'Combination',
      faceShape: 'Oval',
      recommendations: [
        'Use warm-toned foundation for your skin tone',
        'Opt for cream-based products for combination skin',
        'Highlight cheekbones to enhance oval face shape',
        'Choose products with SPF for daily protection'
      ]
    };
    
    setAiAnalysis(mockAnalysis);
    generateRecommendations(mockAnalysis);
  };

  const generateRecommendations = (analysis: AIAnalysis) => {
    const recommendations: RecommendedProduct[] = [];
    
    availableProducts.forEach(product => {
      let matchScore = 0;
      let reason = '';
      
      if (product.name.toLowerCase().includes('foundation')) {
        matchScore += 30;
        reason = 'Perfect foundation for your skin tone';
      }
      if (product.name.toLowerCase().includes('concealer')) {
        matchScore += 25;
        reason = 'Great concealer for combination skin';
      }
      if (product.name.toLowerCase().includes('highlight')) {
        matchScore += 20;
        reason = 'Ideal for highlighting your oval face shape';
      }
      if (product.name.toLowerCase().includes('blush')) {
        matchScore += 15;
        reason = 'Warm-toned blush to complement your skin';
      }
      
      if (matchScore > 0) {
        recommendations.push({
          product,
          reason,
          matchScore
        });
      }
    });
    
    recommendations.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendedProducts(recommendations.slice(0, 5));
  };

  const resetAnalysis = () => {
    setUploadedImage(null);
    setAiAnalysis(null);
    setRecommendedProducts([]);
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
          <Text style={styles.analysisTitle}>AI Analysis Results</Text>
          
          <View style={styles.analysisGrid}>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Skin Tone</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.skinTone}</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Skin Type</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.skinType}</Text>
            </View>
            <View style={styles.analysisItem}>
              <Text style={styles.analysisLabel}>Face Shape</Text>
              <Text style={styles.analysisValue}>{aiAnalysis.faceShape}</Text>
            </View>
          </View>

          <Text style={styles.recommendationsTitle}>AI Recommendations</Text>
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
          <Text style={styles.productsTitle}>Recommended Products</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedProducts.map((item, index) => (
              <TouchableOpacity
                key={index}
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
                <View style={styles.matchScore}>
                  <Text style={styles.matchScoreText}>{item.matchScore}% Match</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    marginBottom: Spacing.xs,
  },
  analysisValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
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
  productsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.md,
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
});

export default ScannerScreen; 