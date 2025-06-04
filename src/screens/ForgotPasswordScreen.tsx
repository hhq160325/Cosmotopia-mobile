"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { CustomInput } from "../components/CustomInput"
import { CustomButton } from "../components/CustomButton"
import { AuthService } from "../services/authService"
import { getEmailError } from "../utils/validation"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ForgotPassword">

interface Props {
  navigation: ForgotPasswordScreenNavigationProp
}

export default function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [emailError, setEmailError] = useState<string>()

  const handleResetPassword = async () => {
    const error = getEmailError(email)
    setEmailError(error)

    if (error) {
      return
    }

    setLoading(true)
    try {
      const response = await AuthService.forgotPassword(email)

      Alert.alert("Thành công", response.message || "Đã gửi mã OTP đến email của bạn", [
        {
          text: "OK",
          onPress: () => navigation.navigate("ResetPassword", { email }),
        },
      ])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gửi email thất bại"
      Alert.alert("Lỗi", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={GlobalStyles.title}>Quên mật khẩu?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>?</Text>
          </View>
        </View>

        <Text style={styles.description}>Nhập địa chỉ email đã đăng ký để nhận mã OTP đặt lại mật khẩu.</Text>

        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="Nhập email"
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              if (emailError) {
                setEmailError(undefined)
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <CustomButton
            title={loading ? "Đang gửi..." : "Gửi mã OTP"}
            onPress={handleResetPassword}
            disabled={loading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Nhớ mật khẩu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkTextPurple}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 32,
    color: Colors.background,
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
  },
  submitButton: {
    marginTop: Spacing.xl,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.xl,
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkTextPurple: {
    color: Colors.primary,
    fontSize: 14,
  },
})
