"use client"

import React, { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator, BottomTabNavigationOptions } from "@react-navigation/bottom-tabs"
import { StatusBar } from "expo-status-bar"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as SplashScreen from "expo-splash-screen"
import { Ionicons } from "@expo/vector-icons"
import { View, Platform } from "react-native"
import { RouteProp } from '@react-navigation/native';

// Screens
import SplashScreenComponent from "./src/screens/SplashScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen"
import VerifyOtpScreen from "./src/screens/VerifyOtpScreen"
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen"
import HomeScreen from "./src/screens/HomeScreen"
import ProductDetailScreen from "./src/screens/ProductDetailScreen"
import PlaceholderListScreen from "./src/screens/PlaceholderListScreen"
import CreateProductScreen from "./src/screens/CreateProductScreen"
import PlaceholderProductScreen from "./src/screens/PlaceholderProductScreen"
import MenuScreen from "./src/screens/MenuScreen"
import OrderDetailScreen from "./src/screens/OrderDetailScreen"
import ProfileScreen from "./src/screens/ProfileScreen"

// Types
import type { RootStackParamList, BottomTabParamList } from "./src/types/navigation"

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
})

const Stack = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<BottomTabParamList>()

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<BottomTabParamList, keyof BottomTabParamList> }): BottomTabNavigationOptions => ({
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (!route || !route.name) {
            return <Ionicons name="help-circle" size={size} color={color} />;
          }

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ListTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'CreateProductTab') {
            return (
              <View style={{
                backgroundColor: 'black',
                width: 50,
                height: 50,
                borderRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === 'ios' ? 30 : 0,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}>
                <Ionicons name="add" size={30} color="white" />
              </View>
            );
          } else if (route.name === 'ProductTab') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'MenuTab') {
            iconName = focused ? 'menu' : 'menu-outline';
          } else {
            iconName = 'help-circle'; // Default icon
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingBottom: Platform.OS === 'ios' ? 30 : 0,
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tab.Screen name="ListTab" component={PlaceholderListScreen} options={{ title: 'List', tabBarLabel: 'List' }} />
      <Tab.Screen name="CreateProductTab" component={CreateProductScreen} options={{ title: '', tabBarLabel: '' }} />
      <Tab.Screen name="ProductTab" component={PlaceholderProductScreen} options={{ title: 'Product', tabBarLabel: 'Product' }} />
      <Tab.Screen name="MenuTab" component={MenuScreen} options={{ title: 'Menu', tabBarLabel: 'Menu' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
      
        const token = await AsyncStorage.getItem("auth_token")
        setIsAuthenticated(!!token)
      } catch (e) {
        console.warn(e)
      } finally {
      
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    if (appIsReady) {
     
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
        initialRouteName={isAuthenticated ? "BottomTabNavigator" : "Login"}
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
        <Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        <Stack.Screen name="CreateProduct" component={CreateProductScreen} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
