import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TextInput, Image, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { CustomButton } from "../components/CustomButton"
import { StorageService } from "../services/storageService"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"
import { apiClient } from "../services/apiClient"
import { Product } from "../types/products.type"
import ProductCard from "../components/ProductCard"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">

interface Props {
  navigation: HomeScreenNavigationProp
}

export default function HomeScreen({ navigation }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState("")
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
     const response = await apiClient.get<Product[]>("/Product/GetAllProduct")

      setProducts(response.data || [])
      setFilteredProducts(response.data || [])
    }
    fetchProducts()
  }, [])

  const handleSearch = () => {
    setFilteredProducts(
      search
        ? products.filter(product =>
            !isNaN(Number(search))
              ? String(product.productId).includes(search)
              : product.name && product.name.toLowerCase().includes(search.toLowerCase())
          )
        : products
    )
  }

  console.log('Filtered products:', filteredProducts)

  const handleLogout = async () => {
    await StorageService.clearAuthData()
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }

  const ListHeader = () => (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>C</Text>
          </View>
          <Text style={styles.appName}>Cosmotopia</Text>
        </View>

        <Text style={GlobalStyles.title}>Chào mừng đến với Cosmotopia!</Text>
        <Text style={styles.subtitle}>Bạn đã đăng nhập thành công vào vũ trụ số của chúng tôi</Text>

        <View style={styles.features}>
          <Text style={styles.featureTitle}>Khám phá các tính năng:</Text>
          <Text style={styles.featureItem}>🌟 Quản lý tài khoản cá nhân</Text>
          <Text style={styles.featureItem}>🚀 Khám phá nội dung mới</Text>
        </View>

        <TextInput
          placeholder="Search products..."
          value={search}
          onChangeText={text => setSearch(text)}
          onSubmitEditing={handleSearch}
          style={styles.searchBar}
          returnKeyType="search"
        />
        <CustomButton title="Search" onPress={handleSearch} style={{ marginTop: 8, minWidth: 100 }} />
      </View>
    </>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={filteredProducts || products}
        keyExtractor={item => String(item.productId)}
        ListHeaderComponent={<ListHeader />}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image
              source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/80' }}
              style={styles.image}
            />
            <View style={styles.info}>
              <Text style={styles.name}>ID: {item.productId}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.price}>Giá: {item.price} VND</Text>
              <Text>Số lượng: {item.stockQuantity}</Text>
              <Text>Ảnh: {item.imageUrls?.[0]}</Text>
            </View>
          </View>
        )}
        ListFooterComponent={
          <CustomButton title="Đăng xuất" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        style={styles.container}
      />
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
  logoutButton: {
    marginTop: Spacing.xl,
    minWidth: 200,
  },
  searchBar: { borderWidth: 1, borderRadius: 8, padding: 8, marginBottom: 10 },
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
  image: { width: 80, height: 80, marginRight: 10 },
  info: { flex: 1, justifyContent: "center" },
  name: { fontWeight: "bold", fontSize: 16 },
  price: { color: "green", marginTop: 5 }
})
