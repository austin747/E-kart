import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/Hero";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CartPage from "./components/CartPage";

import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./constant/useAuth";


function ShopLayout() {
  const { addToCart } = useAuth();


  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <HeroSection onAddToCart={addToCart} />
     
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<ShopLayout />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart"     element={<CartPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )};