export interface Category {
  categoryId: string;
  name: string;
  description: string;
  createdAt: string;
}

export interface Brand {
  brandId: string;
  name: string;
  isPremium: boolean;
  createdAt: string;
}

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrls: string[];
  commissionRate: number;
  categoryId: string;
  brandId: string;
  createAt: string;
  updatedAt: string | null;
  isActive: boolean;
  category: Category;
  brand: Brand;
}