"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ForgotPasswordScreenProps {
  navigation: any
}

export default function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState("")

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert("Lỗi", "Vui lòng nhập email")
      return
    }
    // Handle reset password logic here
    Alert.alert("Thành công", "Đã gửi email khôi phục mật khẩu!")
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Quên mật khẩu?</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>?</Text>
          </View>
        </View>

        <Text style={styles.description}>Nhập địa chỉ email đã đăng ký để nhận liên kết đặt lại mật khẩu.</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleResetPassword}>
            <Text style={styles.submitButtonText}>Gửi email</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Nhớ mật khẩu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.linkTextPurple}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 50,
    marginBottom: 20,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    fontSize: 32,
    color: "#ffffff",
    fontWeight: "bold",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    width: "100%",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkTextPurple: {
    color: "#8B5CF6",
    fontSize: 14,
  },
})
