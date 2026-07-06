import { createContext, useContext } from "react";
import type { Product, CartItem } from "../constant/HeroLink";

// User state interface alignment
interface User {
  id?: string;
  name: string;
  email: string;
  role: "admin" | "retailer" | "customer";
}

// Complete Context Type Definition matching AuthProvider values
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
}

// Create the context base
export const AuthContext = createContext<AuthContextType | null>(null);

// ✅ FIXED: Safely exporting the custom hook from the definition file to enable clean Fast Refresh mechanics
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}