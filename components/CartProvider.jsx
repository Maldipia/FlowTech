'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export default function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('supero_cart');
      if (saved) setCart(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    try { localStorage.setItem('supero_cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const addToCart = (product, variant, qty = 1) => {
    const key = `${product.id}-${variant.id}`;
    setCart(c => {
      const ex = c.find(i => i.key === key);
      return ex
        ? c.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
        : [...c, { key, product, variant, qty }];
    });
    setCartOpen(true);
  };

  const updateQty = (key, delta) => {
    setCart(c => c.map(i => i.key === key ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const removeItem = (key) => setCart(c => c.filter(i => i.key !== key));

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.variant.retail_price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, cartOpen, setCartOpen, addToCart, updateQty, removeItem, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
