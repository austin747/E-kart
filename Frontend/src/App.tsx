import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/Hero";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CartPage from "./components/CartPage";

import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./constant/useAuth";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import { Toaster } from "react-hot-toast";

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
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/"               element={<ShopLayout />} />
          <Route path="/login"          element={<LoginPage />} />
          <Route path="/register"       element={<RegisterPage />} />
          <Route path="/cart"           element={<CartPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}