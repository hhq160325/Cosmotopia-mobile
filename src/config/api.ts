// API Configuration
export const API_CONFIG = {
  BASE_URL: "https://192.168.1.10:7191/api",
  ENDPOINTS: {
    LOGIN: "/User/Login",
    REGISTER_WITH_OTP: "/User/registerwithotp",
    VERIFY_OTP: "/User/verifyotp",
    CHANGE_PASSWORD: "/User/ChangePassword",
    FORGOT_PASSWORD: "/User/forgotpassword",
    NEW_PASSWORD: "/User/newPass",
  },
  TIMEOUT: 10000,
}

// API Response types
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
