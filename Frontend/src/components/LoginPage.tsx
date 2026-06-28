// src/pages/LoginPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiUserLine, RiLockLine, RiShoppingBag3Line } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 async function handleLogin() {
  if (email === "" || password === "") {
    setError("Please fill in all fields.");
    return;
  }

  const success = await login(email, password);  // ✅ add await

  if (success === true) {
    toast.success("Login successful! Welcome back 👋");
    navigate("/");
  } else {
    setError("Wrong email or password. Not registered yet?");
  }
}

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mb-3">
            <RiShoppingBag3Line size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error !== "" && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        {/* Email field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiUserLine className="text-gray-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Password field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiLockLine className="text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Sign in
        </button>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          New here?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}