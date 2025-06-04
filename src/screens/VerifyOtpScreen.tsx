"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RouteProp } from "@react-navigation/native"
import type { RootStackParamList } from "../types/navigation"
import { CustomButton } from "../components/CustomButton"
import { AuthService } from "../services/authService"
import { StorageService } from "../services/storageService"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"

type VerifyOtpScreenNavigationProp = StackNavigationProp<RootStackParamList, "VerifyOtp">
type VerifyOtpScreenRouteProp = RouteProp<RootStackParamList, "VerifyOtp">

interface Props {
  navigation: VerifyOtpScreenNavigationProp
  route: VerifyOtpScreenRouteProp
}

export default function VerifyOtpScreen({ navigation, route }: Props) {
  const { email, fromRegister = false } = route.params
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [countdown, setCountdown] = useState(60)
  const inputRefs = useRef<(TextInput | null)[]>([])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("")
    if (otpCode.length !== 6) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mã OTP")
      return
    }

    setLoading(true)
    try {
      const response = await AuthService.verifyOtp({ email, otp: otpCode })

      // Save auth data
      await StorageService.setAuthToken(response.token)
      await StorageService.setUserData(response.user)

      Alert.alert("Thành công", fromRegister ? "Đăng ký thành công!" : "Xác thực thành công!", [
        { text: "OK", onPress: () => navigation.navigate("Home") },
      ])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Xác thực OTP thất bại"
      Alert.alert("Lỗi", errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (countdown > 0) return

    setResendLoading(true)
    try {
      if (fromRegister) {
        // Resend registration OTP - you might need a separate endpoint for this
        Alert.alert("Thông báo", "Đã gửi lại mã OTP")
      } else {
        await AuthService.forgotPassword(email)
        Alert.alert("Thành công", "Đã gửi lại mã OTP đến email của bạn")
      }
      setCountdown(60)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Gửi lại OTP thất bại"
      Alert.alert("Lỗi", errorMessage)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={GlobalStyles.title}>Xác thực OTP</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={32} color={Colors.background} />
          </View>
        </View>

        <Text style={styles.description}>
          Chúng tôi đã gửi mã xác thực 6 số đến email {email}. Vui lòng nhập mã để tiếp tục.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <CustomButton
          title={loading ? "Đang xác thực..." : "Xác thực"}
          onPress={handleVerifyOtp}
          disabled={loading}
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Không nhận được mã? </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={countdown > 0 || resendLoading}>
            <Text style={[styles.resendLink, (countdown > 0 || resendLoading) && styles.resendDisabled]}>
              {resendLoading ? "Đang gửi..." : countdown > 0 ? `Gửi lại (${countdown}s)` : "Gửi lại"}
            </Text>
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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: Spacing.xl,
  },
  otpInput: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    fontSize: 18,
    fontWeight: "600",
    backgroundColor: Colors.surface,
    color: Colors.text,
  },
  verifyButton: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.lg,
  },
  resendText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  resendLink: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  resendDisabled: {
    color: Colors.textSecondary,
  },
})
