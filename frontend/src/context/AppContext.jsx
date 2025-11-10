import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "../api/api";
import { CartItem, Product, Purchase } from "../types";

interface AppContextType {
  user: any | null;
  loginWithGoogle: () => void;
  logout: () => Promise<void>;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  purchases: Purchase[];
  loading: boolean;
  completePurchase: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get("/user");
      setUser(res.data);
      await loadPurchases();
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google/redirect`;
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
    setPurchases([]);
  };

  const loadPurchases = async () => {
    const res = await api.get("/purchases");
    setPurchases(res.data.data || res.data);
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
   238);
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const completePurchase = async () => {
    if (!user || cart.length === 0) return;

    const payload = {
      items: cart.map((i) => ({ product_id: i.id, quantity: i.quantity })),
      total: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
    };

    await api.post("/purchases", payload);
    await loadPurchases();
    clearCart();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loginWithGoogle,
        logout,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        purchases,
        loading,
        completePurchase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};