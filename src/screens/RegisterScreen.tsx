"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { CustomInput } from "../components/CustomInput"
import { CustomButton } from "../components/CustomButton"
import { AuthService } from "../services/authService"
import { getEmailError, getPasswordError, getNameError } from "../utils/validation"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Register">

interface Props {
  navigation: RegisterScreenNavigationProp
}

export default function RegisterScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    firstName?: string
    lastName?: string
    password?: string
    confirmPassword?: string
  }>({})

  const validateForm = (): boolean => {
    const emailError = getEmailError(email)
    const firstNameError = !firstName.trim() ? "Họ là bắt buộc" : firstName.trim().length < 2 ? "Họ phải có ít nhất 2 ký tự" : undefined
    const lastNameError = !lastName.trim() ? "Tên là bắt buộc" : lastName.trim().length < 2 ? "Tên phải có ít nhất 2 ký tự" : undefined
    const passwordError = getPasswordError(password)
    const confirmPasswordError = !confirmPassword ? "Xác nhận mật khẩu là bắt buộc" : confirmPassword !== password ? "Mật khẩu xác nhận không khớp" : undefined

    setErrors({
      email: emailError,
      firstName: firstNameError,
      lastName: lastNameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    })

    return !emailError && !firstNameError && !lastNameError && !passwordError && !confirmPasswordError
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await AuthService.registerWithOtp({
        email,
        name: `${firstName} ${lastName}`.trim(),
        password,
      })

      Alert.alert("Thành công", response.message || "Đã gửi mã OTP đến email của bạn. Vui lòng kiểm tra và xác thực.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("VerifyOtp", { email, fromRegister: true }),
        },
      ])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đăng ký thất bại"
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
        <Text style={GlobalStyles.title}>Đăng ký</Text>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Họ"
          placeholder="Nhập họ"
          value={firstName}
          onChangeText={(text) => {
            setFirstName(text)
            if (errors.firstName) {
              setErrors((prev) => ({ ...prev, firstName: undefined }))
            }
          }}
          error={errors.firstName}
        />

        <CustomInput
          label="Tên"
          placeholder="Nhập tên"
          value={lastName}
          onChangeText={(text) => {
            setLastName(text)
            if (errors.lastName) {
              setErrors((prev) => ({ ...prev, lastName: undefined }))
            }
          }}
          error={errors.lastName}
        />

        <CustomInput
          label="Email"
          placeholder="Nhập email"
          value={email}
          onChangeText={(text) => {
            setEmail(text)
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }))
            }
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />

        <CustomInput
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={(text) => {
            setPassword(text)
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }))
            }
          }}
          isPassword
          error={errors.password}
        />

        <CustomInput
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
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

        <Text style={styles.termsText}>
          Bằng cách nhấp vào <Text style={styles.termsLink}>Điều khoản</Text> và{" "}
          <Text style={styles.termsLink}>Chính sách bảo mật</Text> của chúng tôi, bạn đồng ý với các điều khoản.
        </Text>

        <CustomButton
          title={loading ? "Đang đăng ký..." : "Đăng ký"}
          onPress={handleRegister}
          disabled={loading}
          style={styles.registerButton}
        />

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Đã có tài khoản? </Text>
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
  form: {
    flex: 1,
  },
  termsText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
  },
  registerButton: {
    marginTop: Spacing.xl,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.md,
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
