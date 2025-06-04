"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SplashScreen from "expo-splash-screen"

// Screens
import SplashScreenComponent from "./src/screens/SplashScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen"
import VerifyOtpScreen from "./src/screens/VerifyOtpScreen"
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen"
import HomeScreen from "./src/screens/HomeScreen"

// Types
import type { RootStackParamList } from "./src/types/navigation"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
})

const Stack = createStackNavigator<RootStackParamList>()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user is authenticated
        const token = await AsyncStorage.getItem("auth_token")
        setIsAuthenticated(!!token)
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady) {
      // Hide the splash screen after 2 seconds
      const timer = setTimeout(() => {
        setShowSplash(false)
        SplashScreen.hideAsync().catch(console.warn)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [appIsReady])

  if (!appIsReady || showSplash) {
    return <SplashScreenComponent />
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Login"}
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
