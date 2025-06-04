"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface RegisterScreenProps {
  navigation: any
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = () => {
    if (!email || !name || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin")
      return
    }
    // Handle register logic here
    Alert.alert("Thành công", "Đăng ký thành công!")
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Đăng ký</Text>
      </View>

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

        <Text style={styles.label}>Tên</Text>
        <TextInput style={styles.input} placeholder="Nhập tên" value={name} onChangeText={setName} />

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          Bằng cách nhấp vào <Text style={styles.termsLink}>Điều khoản</Text> và{" "}
          <Text style={styles.termsLink}>Chính sách bảo mật</Text> của chúng tôi, bạn đồng ý với các điều khoản.
        </Text>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Đăng ký</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Đã có tài khoản? </Text>
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    backgroundColor: "#F9F9F9",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  termsText: {
    fontSize: 12,
    color: "#666",
    marginTop: 16,
    lineHeight: 18,
  },
  termsLink: {
    color: "#8B5CF6",
  },
  registerButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  registerButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
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
