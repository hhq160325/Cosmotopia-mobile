import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TextInput, Image, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList, BottomTabParamList } from "../types/navigation"
import { CompositeNavigationProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { CustomButton } from "../components/CustomButton"
import { StorageService } from "../services/storageService"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"
import { apiClient } from "../services/apiClient"
import { Product, Brand, Category } from "../types/products.type"
import ProductCard from "../components/ProductCard"
import { CommonActions } from '@react-navigation/native'
import { Ionicons } from "@expo/vector-icons"
import { FloatingChatButton } from "../components/FloatingChatButton"
import { useCart } from '../context/CartContext'
import { API_CONFIG } from '../config/api'

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<BottomTabParamList, 'HomeTab'>,
  StackNavigationProp<RootStackParamList>
>

interface Props {
  navigation: HomeScreenNavigationProp
  route: any
}

export default function HomeScreen({ navigation, route }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const { cart } = useCart()
  const cartItemCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)

  const cleanProductData = (product: any): Product => ({
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
  })

  const cleanBrandData = (brand: any): Brand => ({
    brandId: String(brand.brandId || ''),
    name: String(brand.name || ''),
    isPremium: Boolean(brand.isPremium || false),
    createdAt: String(brand.createdAt || ''),
  })

  const cleanCategoryData = (category: any): Category => ({
    categoryId: String(category.categoryId || ''),
    name: String(category.name || ''),
    description: String(category.description || ''),
    createdAt: String(category.createdAt || ''),
  })

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALL_PRODUCTS}`
      )
      const data = await response.json()
      const productsItem = Array.isArray(data.products) ? data.products.map(cleanProductData) : []
      setProducts(productsItem)
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setProducts([])
    }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.GET_ALL_BRANDS}?page=1&pageSize=10`
      )
      const data = await response.json()
      const brandsItem = Array.isArray(data.brands) ? data.brands.map(cleanBrandData) : []
      setBrands(brandsItem)
    } catch (error) {
      console.error("Failed to fetch brands:", error)
      setBrands([])
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchBrands()
  }, [])

  useEffect(() => {
    if (route.params?.refresh) {
      console.log('Refreshing products list...')
      fetchProducts()
      navigation.setParams({ refresh: false })
    }
  }, [route.params?.refresh])

  const createBrand = async (name: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_BRAND}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Brand created successfully:", data)
      fetchBrands() 
    } catch (error) {
      console.error("Failed to create brand:", error)
    }
  }

  const createProduct = async (productDetails: {
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    brandId: string;
    commissionRate: number;
    categoryId: string;
    image: { uri: string; type: string; name: string };
  }) => {
    try {
      const formData = new FormData()
      formData.append("name", productDetails.name)
      formData.append("description", productDetails.description)
      formData.append("price", productDetails.price.toString())
      formData.append("stockQuantity", productDetails.stockQuantity.toString())
      formData.append("brandId", productDetails.brandId)
      formData.append("commissionRate", productDetails.commissionRate.toString())
      formData.append("categoryId", productDetails.categoryId)
      
      if (productDetails.image && productDetails.image.uri && productDetails.image.type && productDetails.image.name) {
        formData.append("imageFile", {
          uri: productDetails.image.uri,
          type: productDetails.image.type,
          name: productDetails.image.name,
        } as any)
      } else {
        console.warn("Product image details are incomplete or missing.")
   
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_PRODUCT}`,
        {
          method: "POST",
          headers: {
           
          },
          body: formData,
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log("Product created successfully:", data)
      fetchProducts() 
    } catch (error) {
      console.error("Failed to create product:", error)
    }
  }

  const handleLogout = async () => {
    await StorageService.clearAuthData()
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    )
  }

  const filteredProducts = selectedBrand
    ? products.filter((product: Product) => product.brandId && product.brandId === selectedBrand)
    : products

  const searchFilteredProducts = searchQuery
    ? filteredProducts.filter((product: Product) => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredProducts

  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.appName}>Cosmotopia</Text>
        </View>
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('ListTab')}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.text} />
          {cartItemCount > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sản phẩm..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text style={GlobalStyles.title}>Chào mừng đến với Cosmotopia!</Text>
      <Text style={styles.subtitle}>Bạn đã đăng nhập thành công vào vũ trụ số của chúng tôi</Text>
    </View>
  )

  const ListHeader = () => (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <Header />
      <FlatList
        data={brands}
        keyExtractor={item => String(item.brandId || item.name || Math.random().toString())}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.brandItem,
              selectedBrand === (item.brandId || null) && styles.selectedBrandItem
            ]}
            onPress={() => setSelectedBrand(item.brandId === selectedBrand ? null : (item.brandId || null))}
          >
            <Text style={[
              styles.brandName,
              selectedBrand === (item.brandId || null) && styles.selectedBrandName
            ]}>
              {item.name || 'N/A'}
            </Text>
          </TouchableOpacity>
        )}
      />
    </>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ListHeaderComponent={ListHeader}
        data={searchFilteredProducts}
        keyExtractor={item => String(item.productId || Math.random().toString())}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              style={styles.imageContainer}
            >
              <Image
                source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
                style={styles.image}
              />
            </TouchableOpacity>
            <View style={styles.info}>
              <Text style={styles.name}>{String(item.name)}</Text>
              <Text>{String(item.description)}</Text>
              <Text style={styles.price}>Giá: {item.price} VND</Text>
              <Text>Số lượng: {item.stockQuantity}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={null}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.container}
      />
      
      <FloatingChatButton />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    backgroundColor: Colors.primary,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  features: {
    alignItems: "flex-start",
    marginBottom: Spacing.xxl,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  featureItem: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 24,
  },
  searchBar: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    width: '100%',
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  itemContainer: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    maxWidth: '48%',
  },
  imageContainer: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: { flex: 1, justifyContent: "center" },
  name: { fontWeight: "bold", fontSize: 16 },
  price: { color: "green", marginTop: 5 },
  brandItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedBrandItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  brandName: {
    fontWeight: 'bold',
    color: Colors.text,
  },
  selectedBrandName: {
    color: Colors.background,
  },
  header: {
    backgroundColor: Colors.background,
    padding: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Spacing.sm,
    padding: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  cartBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    position: 'absolute',
    top: -5,
    right: -5,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.background,
  },
})
