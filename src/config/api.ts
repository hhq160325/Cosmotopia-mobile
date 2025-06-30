import { Platform } from 'react-native';

// Determine the correct base URL based on platform and environment
const getBaseUrl = () => {
  // For Android emulator
  if (Platform.OS === 'android') {
    return 'https://10.0.2.2:7191/api';
  }
  // For iOS simulator or web
  return 'https://localhost:7191/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    LOGIN: "/User/Login",
    REGISTER_WITH_OTP: "/User/registerwithotp",
    VERIFY_OTP: "/User/verifyotp",
    CHANGE_PASSWORD: "/User/ChangePassword",
    FORGOT_PASSWORD: "/User/forgotpassword",
    NEW_PASSWORD: "/User/newPass",
    GET_ALL_PRODUCTS: "/Product/GetAllProduct",
    CREATE_PRODUCT: "/Product/CreateProduct",
    DELETE_PRODUCT: "/Product/DeleteProduct",
    GET_ALL_BRANDS: "/Brand/GetAllBrand",
    CREATE_BRAND: "/Brand/CreateBrand",
    CART: "/cart",
    CART_ADD: "/cart/add",
    CART_REMOVE: "/cart/remove",
    ORDER: "/Order",
    ORDER_HISTORY: "/Order/history",
    ORDER_DETAIL: "/OrderDetail",
    KOL_VIDEO_MY_VIDEOS: "/KOLVideo/myVideos",
    KOL_VIDEO_UPLOAD: "/KOLVideo/upload",
    KOL_VIDEO_DELETE: "/KOLVideo",
    KOL_VIDEO_UPDATE: "/KOLVideo",
    PAYMENT_CREATE_LINK: "/Payment/create-payment-link",
    PAYMENT: "/Payment/payment",
    CHAT: "/Chat",
  },
  TIMEOUT: 10000,
}


export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    phone?: string
  }
  refreshToken?: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  phone?: string
}

export interface RegisterResponse {
  message: string
  otpSent: boolean
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface VerifyOtpResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    phone?: string
  }
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ForgotPasswordResponse {
  message: string
  otpSent: boolean
}

export interface NewPasswordRequest {
  email: string
  otp: string
  newPassword: string
}
