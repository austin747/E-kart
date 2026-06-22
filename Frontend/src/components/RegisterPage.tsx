// src/pages/RegisterPage.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiUserLine, RiLockLine, RiMailLine, RiShoppingBag3Line } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

 async function handleRegister() {
  // basic validation
  if (name === "" || email === "" || password === "" || confirm === "") {
    setError("All fields are required.");
    return;
  }
  if (password !== confirm) {
    setError("Passwords do not match.");
    return;
  }
  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  const success = await register(name, email, password);  // ✅ add await

  if (success === false) {
    setError("An account with this email already exists.");
    return;
  }

  setSuccess(true);

  setTimeout(function () {
    navigate("/login");
  }, 1500);
}

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mb-3">
            <RiShoppingBag3Line size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Create account</h2>
          <p className="text-gray-500 text-sm mt-1">Join Shop Now in seconds</p>
        </div>

        {/* Success message */}
        {success === true && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            Account created! Taking you to login…
          </div>
        )}

        {/* Error message */}
        {error !== "" && success === false && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        {/* Name field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full name
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiUserLine className="text-gray-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Email field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiMailLine className="text-gray-400" size={18} />
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
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiLockLine className="text-gray-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Confirm password field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Confirm password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiLockLine className="text-gray-400" size={18} />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
        >
          Register
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
}