import AsyncStorage from "@react-native-async-storage/async-storage"

const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
}

export class StorageService {
  static async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    } catch (error) {
      console.error("Error saving auth token:", error)
    }
  }

  static async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    } catch (error) {
      console.error("Error getting auth token:", error)
      return null
    }
  }

  static async setRefreshToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token)
    } catch (error) {
      console.error("Error saving refresh token:", error)
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
    } catch (error) {
      console.error("Error getting refresh token:", error)
      return null
    }
  }

  static async setUserData(userData: any): Promise<void> {
    try {
      if (userData === null || userData === undefined) {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA)
      } else {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
      }
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  static async getUserData(): Promise<any | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error("Error getting user data:", error)
      return null
    }
  }

  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([STORAGE_KEYS.AUTH_TOKEN, STORAGE_KEYS.REFRESH_TOKEN, STORAGE_KEYS.USER_DATA])
    } catch (error) {
      console.error("Error clearing auth data:", error)
    }
  }
}
