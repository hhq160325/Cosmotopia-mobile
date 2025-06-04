"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface LoginScreenProps {
  navigation: any
}

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin")
      return
    }
    // Handle login logic here
    Alert.alert("Thành công", "Đăng nhập thành công!")
  }

  const handleGoogleLogin = () => {
    Alert.alert("Google", "Đăng nhập với Google")
  }

  const handleFacebookLogin = () => {
    Alert.alert("Facebook", "Đăng nhập với Facebook")
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <Text style={styles.title}>Đăng nhập</Text>
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Tạo tài khoản mới? </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.linkTextPurple}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} color="#DB4437" />
            <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
            <Ionicons name="logo-facebook" size={20} color="#4267B2" />
            <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
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
  header: {
    marginTop: 60,
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
  loginButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    flexWrap: "wrap",
  },
  linkText: {
    color: "#666",
    fontSize: 14,
  },
  linkTextPurple: {
    color: "#8B5CF6",
    fontSize: 14,
  },
  socialContainer: {
    marginTop: 32,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff",
  },
  socialButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
})
