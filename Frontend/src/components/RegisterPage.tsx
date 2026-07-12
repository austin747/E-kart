// src/pages/RegisterPage.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { RiUserLine, RiLockLine, RiMailLine, RiShoppingBag3Line, RiStore2Line, RiUser3Line } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";


export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"customer" | "retailer">("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleRegister() {
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

    const success = await register(name, email, password, role);

    if (success === false) {
      setError("An account with this email already exists.");
      return;
    }

    setError("");
    setSuccess(true);
    // No auto-redirect — user needs to go check their inbox, not the app
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">

      {/* AMBIENT BACKGROUND SYSTEM */}
      <style>{`
        @keyframes drift-slow {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(60px, -40px) scale(1.15); }
        }
        @keyframes drift-reverse {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          50% { transform: translate(-40px, 60px) scale(1.05); }
        }
        .animate-drift-1 { animation: drift-slow 18s ease-in-out infinite; }
        .animate-drift-2 { animation: drift-reverse 22s ease-in-out infinite; }
        .animate-drift-3 { animation: drift-slow 15s ease-in-out infinite 3s; }
      `}</style>

      {/* Floating Light Mesh Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/20 blur-[120px] -top-40 -left-20 animate-drift-1" style={{ willChange: 'transform' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[110px] top-1/3 -right-32 animate-drift-2" style={{ willChange: 'transform' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/15 blur-[90px] -bottom-20 left-1/4 animate-drift-3" style={{ willChange: 'transform' }} />
      </div>

      {/* Cinematic Fractal Grain Texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* REGISTER CARD */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

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
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-5">
            <p className="font-medium mb-1">Account created 🎉</p>
            <p>
              We've sent a verification link to <span className="font-medium">{email}</span>.
              Please check your inbox and click the link to activate your account.
            </p>
          </div>
        )}

        {/* Error message */}
        {error !== "" && success === false && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        {/* Form (hidden once registered — nothing left to do here) */}
        {success === false && (
          <>
            {/* Role selector */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I want to join as
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("customer")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    role === "customer"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <RiUser3Line size={22} />
                  <span className="text-sm font-semibold">Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("retailer")}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                    role === "retailer"
                      ? "border-blue-600 bg-blue-50 text-blue-600"
                      : "border-gray-200 text-gray-400 hover:border-gray-300"
                  }`}
                >
                  <RiStore2Line size={22} />
                  <span className="text-sm font-semibold">Retailer</span>
                </button>
              </div>
            </div>

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
          </>
        )}

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