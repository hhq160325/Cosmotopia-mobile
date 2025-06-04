export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password: string): boolean => {
  return password.length >= 6
}

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2
}

export const getEmailError = (email: string): string | undefined => {
  if (!email) return "Email là bắt buộc"
  if (!validateEmail(email)) return "Email không hợp lệ"
  return undefined
}

export const getPasswordError = (password: string): string | undefined => {
  if (!password) return "Mật khẩu là bắt buộc"
  if (!validatePassword(password)) return "Mật khẩu phải có ít nhất 6 ký tự"
  return undefined
}

export const getNameError = (name: string): string | undefined => {
  if (!name.trim()) return "Tên là bắt buộc"
  if (!validateName(name)) return "Tên phải có ít nhất 2 ký tự"
  return undefined
}
