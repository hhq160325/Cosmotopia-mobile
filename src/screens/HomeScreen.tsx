import React, { useEffect, useState } from "react"
import { View, Text, FlatList, TextInput, Image, StyleSheet, StatusBar, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://cosmetics20250328083913-ajfsa0cegrdggzej.southeastasia-01.azurewebsites.net/api/Product/GetAllProduct"
        )
        const data = await response.json()
        const productsItem = data.products
        setProducts(productsItem || [])
      } catch (error) {
        console.error("Failed to fetch products:", error)
        setProducts([])
      }
    }
    fetchProducts()
  }, [])

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

    
      </View>
    </>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        data={products}
        keyExtractor={item => String(item.productId)}
        ListHeaderComponent={<ListHeader />}
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
              <Text style={styles.name}>{item.name}</Text>
              <Text>{item.description}</Text>
              <Text style={styles.price}>Giá: {item.price} VND</Text>
              <Text>Số lượng: {item.stockQuantity}</Text>
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
  price: { color: "green", marginTop: 5 }
})
