// src/components/AuthContext.tsx
import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Product, CartItem } from "../constant/HeroLink";
import {
  apiRegister,
  apiLogin,
  apiGetCart,
  apiAddToCart,
  apiRemoveFromCart,
  apiUpdateCart,
} from "../services/api";

interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  cart: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQty: (id: number, qty: number) => Promise<void>;
  cartCount: number;
  cartTotal: number;
}

export const AuthContext = createContext<AuthContextType | null>(null);

// Shape of items as the backend returns them
interface BackendCartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // ── Load cart whenever token changes (i.e. on login / refresh) ──
  useEffect(() => {
    if (token) {
      refreshCart(token);
    } else {
      setCart([]);
    }
  }, [token]);

  async function refreshCart(authToken: string) {
    const res = await apiGetCart(authToken);
    if (res.success && res.cart) {
      const backendItems = (res.cart as { items?: BackendCartItem[] }).items || [];
      const mapped: CartItem[] = backendItems.map((item) => ({
        id: Number(item.productId),
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        category: "", // backend doesn't store category — fine for cart display
        description: "",
        rating: 0,
        reviews: 0,
      }));
      setCart(mapped);
    }
  }

  // ── REGISTER ──────────────────────────────────────────
  async function register(name: string, email: string, password: string): Promise<boolean> {
    const res = await apiRegister(name, email, password);
    return res.success;
  }

  // ── LOGIN ─────────────────────────────────────────────
  async function login(email: string, password: string): Promise<boolean> {
    const res = await apiLogin(email, password);

    if (!res.success || !res.token || !res.user) return false;

    const loggedInUser = res.user as User;

    setUser(loggedInUser);
    setToken(res.token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    localStorage.setItem("token", res.token);

    return true;
  }

  // ── LOGOUT ────────────────────────────────────────────
  function logout() {
    setUser(null);
    setToken(null);
    setCart([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // ── ADD TO CART ───────────────────────────────────────
  async function addToCart(product: Product) {
    if (!token) return;

    await apiAddToCart(token, {
      productId: String(product.id),
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: 1,
    });

    await refreshCart(token);
  }

  // ── REMOVE FROM CART ──────────────────────────────────
  async function removeFromCart(id: number) {
    if (!token) return;
    await apiRemoveFromCart(token, String(id));
    await refreshCart(token);
  }

  // ── UPDATE QUANTITY ───────────────────────────────────
  async function updateQty(id: number, qty: number) {
    if (!token) return;
    await apiUpdateCart(token, String(id), qty);
    await refreshCart(token);
  }

  // ── TOTALS ────────────────────────────────────────────
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}