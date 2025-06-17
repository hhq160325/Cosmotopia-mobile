"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Alert, ScrollView } from "react-native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../types/navigation"
import { CustomInput } from "../components/CustomInput"
import { CustomButton } from "../components/CustomButton"
import { SocialButton } from "../components/SocialButton"
import { AuthService } from "../services/authService"
import { StorageService } from "../services/storageService"
import { getEmailError, getPasswordError } from "../utils/validation"
import { Colors } from "../constants/Colors"
import { Spacing } from "../constants/Dimensions"
import { GlobalStyles } from "../styles/GlobalStyles"
import { CommonActions } from "@react-navigation/native"

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">

interface Props {
  navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validateForm = (): boolean => {
    const emailError = getEmailError(email)
    const passwordError = getPasswordError(password)

    setErrors({
      email: emailError,
      password: passwordError,
    })

    return !emailError && !passwordError
  }

  const handleLogin = async () => {
    // console.log('Login attempt started for email:', email);
    
    if (!validateForm()) {
      // console.log('Form validation failed:', errors);
      return
    }

    setLoading(true)
    try {
      // console.log('Calling login API...');
      const response = await AuthService.login({ email, password })
      // console.log('Login API response received:', response);

      
      // console.log('Saving auth data...');
      await StorageService.setAuthToken(response.token)
     
      // console.log('Auth data saved successfully');
      // console.log('Navigating to BottomTabNavigator with HomeTab...');
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'BottomTabNavigator',
            state: {
              routes: [
                {
                  name: 'HomeTab'
                }
              ]
            }
          }
        ],
      });
      // Alert.alert("Thành công", "Đăng nhập thành công!", [{ 
      //   text: "OK", 
      //   onPress: () => {
      
      //     navigation.reset({
      //       index: 0,
      //       routes: [
      //         {
      //           name: 'BottomTabNavigator',
      //           state: {
      //             routes: [
      //               {
      //                 name: 'HomeTab'
      //               }
      //             ]
      //           }
      //         }
      //       ],
      //     });
      //   } 
      // }])
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Đăng nhập thất bại"
      Alert.alert("Lỗi", errorMessage)
    } finally {
      setLoading(false)
      
      // console.log('Login process completed');
    }
  }

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Thông báo", `Tính năng đăng nhập với ${provider} sẽ được cập nhật sớm`)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <View style={styles.header}>
        <Text style={GlobalStyles.title}>Đăng nhập</Text>
      </View>

      <View style={styles.form}>
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

        <CustomButton
          title={loading ? "Đang đăng nhập..." : "Đăng nhập"}
          onPress={handleLogin}
          disabled={loading}
          style={styles.loginButton}
        />

        <View style={styles.linkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>Tạo tài khoản mới? </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
            <Text style={styles.linkTextPurple}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialContainer}>
          <SocialButton provider="google" onPress={() => handleSocialLogin("Google")} />
          <SocialButton provider="facebook" onPress={() => handleSocialLogin("Facebook")} />
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
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  form: {
    flex: 1,
  },
  loginButton: {
    marginTop: Spacing.xl,
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing.md,
    flexWrap: "wrap",
  },
  linkText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  linkTextPurple: {
    color: Colors.primary,
    fontSize: 14,
  },
  socialContainer: {
    marginTop: Spacing.xl,
  },
})
