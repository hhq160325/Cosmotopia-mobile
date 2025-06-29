import React, { createContext, useContext, useState } from 'react';

// Định nghĩa kiểu cho cart item nếu muốn, tạm thời để any cho linh hoạt
const CartContext = createContext<any>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<any[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 