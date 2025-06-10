export type RootStackParamList = {
  Login: undefined
  Register: undefined
  ForgotPassword: undefined
  VerifyOtp: { email: string; fromRegister?: boolean }
  ResetPassword: { email: string }
  Home: undefined
  ProductDetail: { product: Product }
}
