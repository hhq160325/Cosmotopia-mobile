import { Product } from "./products.type"

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyOtp: { email: string; fromRegister?: boolean }
  ResetPassword: { email: string }
  Home: undefined
  ProductDetail: { product: Product }
  BottomTabNavigator: undefined
}

export type BottomTabParamList = {
  HomeTab: undefined
  ListTab: undefined
  CreateProductTab: undefined
  BookTab: undefined
  MenuTab: undefined
}
