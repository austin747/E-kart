import { createContext } from "react";
import type { CartItem, Product } from "../constant/HeroLink";

interface User {
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
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