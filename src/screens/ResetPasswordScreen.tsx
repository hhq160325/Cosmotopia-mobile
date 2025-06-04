"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../types/navigation"
import { CustomInput } from "../components/CustomInput"
import { CustomButton } from "../components/CustomButton"
import { AuthService } from "../services/authService"
import { getPasswordError } from "../utils/validation"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"

type ResetPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, "ResetPassword">
type ResetPasswordScreenRouteProp = RouteProp<RootStackParamList, "ResetPassword">

interface Props {
  navigation: ResetPasswordScreenNavigationProp
  route: ResetPasswordScreenRouteProp
}

export default function ResetPasswordScreen({ navigation, route }: Props) {
  const { email } = route.params
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    otp?: string
    newPassword?: string
    confirmPassword?: string
  }>({})

  const validateForm = (): boolean => {
    const otpError = !otp ? "Mã OTP là bắt buộc" : undefined
    const passwordError = getPasswordError(newPassword)
    const confirmPasswordError = newPassword !== confirmPassword ? "Mật khẩu xác nhận không khớp" : undefined

    setErrors({
      otp: otpError,
      newPassword: passwordError,
      confirmPassword: confirmPasswordError,
    })

    return !otpError && !passwordError && !confirmPasswordError
  }

  const handleResetPassword = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await AuthService.newPassword({
        email,
        otp,
        newPassword,
      })

      Alert.alert("Thành công", "Đặt lại mật khẩu thành công!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại"
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
        <Text style={GlobalStyles.title}>Đặt lại mật khẩu</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={32} color={Colors.background} />
          </View>
        </View>

        <Text style={styles.description}>Nhập mã OTP đã được gửi đến email {email} và mật khẩu mới của bạn.</Text>

        <View style={styles.form}>
          <CustomInput
            label="Mã OTP"
            placeholder="Nhập mã OTP"
            value={otp}
            onChangeText={(text) => {
              setOtp(text)
              if (errors.otp) {
                setErrors((prev) => ({ ...prev, otp: undefined }))
              }
            }}
            keyboardType="numeric"
            error={errors.otp}
          />

          <CustomInput
            label="Mật khẩu mới"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text)
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: undefined }))
              }
            }}
            isPassword
            error={errors.newPassword}
          />

          <CustomInput
            label="Xác nhận mật khẩu"
            placeholder="Nhập lại mật khẩu mới"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
              }
            }}
            isPassword
            error={errors.confirmPassword}
          />

          <CustomButton
            title={loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
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
