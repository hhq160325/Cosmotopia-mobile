import { View, Text, StyleSheet, StatusBar } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { CustomButton } from "../components/CustomButton"
import { StorageService } from "../services/storageService"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">

interface Props {
  navigation: HomeScreenNavigationProp
}

export default function HomeScreen({ navigation }: Props) {
  const handleLogout = async () => {
    await StorageService.clearAuthData()
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    })
  }

  return (
    <View style={styles.container}>
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
          <Text style={styles.featureItem}>🌍 Kết nối với cộng đồng</Text>
          <Text style={styles.featureItem}>⚡ Trải nghiệm tốc độ cao</Text>
        </View>

        <CustomButton title="Đăng xuất" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      </View>
    </View>
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
})
