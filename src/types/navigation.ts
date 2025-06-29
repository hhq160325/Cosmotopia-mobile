import { Product } from "./products.type"
import { NavigatorScreenParams } from "@react-navigation/native"

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyOtp: { email: string; fromRegister?: boolean }
  ResetPassword: { email: string }
  Home: undefined
  ProductDetail: { product: Product }
  Scanner: { product?: Product; mode?: 'edit' | 'create' }
  BottomTabNavigator: NavigatorScreenParams<BottomTabParamList> | undefined
  OrderDetail: undefined
  OrderHistory: undefined
  Profile: undefined
}

export type BottomTabParamList = {
  HomeTab: { refresh?: boolean } | undefined
  ListTab: undefined
  ScannerTab: undefined
  ProductTab: undefined
  MenuTab: undefined
}
