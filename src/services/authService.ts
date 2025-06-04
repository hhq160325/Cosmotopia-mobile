import { apiClient } from "./apiClient"
import { API_CONFIG } from "../config/api"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ChangePasswordRequest,
  ForgotPasswordResponse,
  NewPasswordRequest,
} from "../config/api"

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || "Login failed")
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Login failed")
    }
  }

  static async registerWithOtp(credentials: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await apiClient.post<RegisterResponse>(API_CONFIG.ENDPOINTS.REGISTER_WITH_OTP, credentials)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || "Registration failed")
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Registration failed")
    }
  }

  static async verifyOtp(otpData: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    try {
      const response = await apiClient.post<VerifyOtpResponse>(API_CONFIG.ENDPOINTS.VERIFY_OTP, otpData)

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || "OTP verification failed")
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("OTP verification failed")
    }
  }

  static async changePassword(passwordData: ChangePasswordRequest, token: string): Promise<void> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData, {
        Authorization: `Bearer ${token}`,
      })

      if (!response.success) {
        throw new Error(response.message || "Password change failed")
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Password change failed")
    }
  }

  static async forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await apiClient.post<ForgotPasswordResponse>(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, { email })

      if (response.success && response.data) {
        return response.data
      }

      throw new Error(response.message || "Forgot password request failed")
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Forgot password request failed")
    }
  }

  static async newPassword(passwordData: NewPasswordRequest): Promise<void> {
    try {
      const response = await apiClient.post(API_CONFIG.ENDPOINTS.NEW_PASSWORD, passwordData)

      if (!response.success) {
        throw new Error(response.message || "Password reset failed")
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error("Password reset failed")
    }
  }
}
