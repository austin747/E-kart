import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import HeroSection from "./components/Hero/Hero";

import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import CartPage from "./components/CartPage";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import RetailerDashboard from "./pages/dashboard/RetailerDashboard";

import VerifyEmailPage from "./pages/VerifyEmailPage";  
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";

import { AuthProvider } from "./components/AuthContext";
import { useAuth } from "./constant/useAuth";

import { Toaster } from "react-hot-toast";

import ProtectedRoute from "./routes/ProtectedRoute";
import RoleGuard from "./routes/RoleGuard";

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
        <Toaster position="top-center" />

        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<ShopLayout />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* CART (PROTECTED) */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* RETAILER DASHBOARD */}
          <Route
            path="/dashboard/retailer"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={["retailer", "admin"]}>
                  <RetailerDashboard />
                </RoleGuard>
              </ProtectedRoute>
            }
          />

          {/* PAYMENT */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}