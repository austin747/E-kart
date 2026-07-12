import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { RiUserLine, RiLockLine, RiShoppingBag3Line, RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";
import toast from "react-hot-toast";

export default function LoginPage(): React.ReactElement {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // ✅ Role-based redirect (clean + reactive)
  useEffect(() => {
    if (!user) return;

    if (user.role === "admin") {
      navigate("/dashboard/admin");
    } else if (user.role === "retailer") {
      navigate("/dashboard/retailer");
    } else {
      navigate("/");
    }
  }, [user, navigate]);

  // ✅ Login handler (clean, no redirect logic here)
  async function handleLogin() {
    if (email === "" || password === "") {
      setError("Please fill in all fields.");
      return;
    }

    const success = await login(email, password);

    if (success) {
      toast.success("Login successful! Welcome back 👋");
      setError("");
    } else {
      setError("Wrong email or password. Not registered yet?");
    }
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

      {/* LOGIN CARD */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mb-3">
            <RiShoppingBag3Line size={28} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        {/* Error */}
        {error !== "" && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2.5 mb-5">
            {error}
          </div>
        )}

        {/* Email */}
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

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2.5 gap-2 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <RiLockLine className="text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              {showPassword ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
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