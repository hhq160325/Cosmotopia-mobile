export const validateEmail = (email: string): boolean => {
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
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

export const cleanBrandData = (brand: any) => ({
  brandId: String(brand.brandId || ''),
  name: String(brand.name || ''),
  isPremium: Boolean(brand.isPremium || false),
  createdAt: String(brand.createdAt || ''),
});

export const cleanCategoryData = (category: any) => ({
  categoryId: String(category.categoryId || ''),
  name: String(category.name || ''),
  description: String(category.description || ''),
  createdAt: String(category.createdAt || ''),
});

export const cleanProductData = (product: any) => ({
  productId: String(product.productId || ''),
  name: String(product.name || ''),
  description: String(product.description || ''),
  price: Number(product.price || 0),
  stockQuantity: Number(product.stockQuantity || 0),
  imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls.map(String) : [],
  commissionRate: Number(product.commissionRate || 0),
  categoryId: String(product.categoryId || ''),
  brandId: String(product.brandId || ''),
  createAt: String(product.createAt || ''),
  updatedAt: String(product.updatedAt || null),
  isActive: Boolean(product.isActive || false),
  category: cleanCategoryData(product.category),
  brand: cleanBrandData(product.brand),
});
