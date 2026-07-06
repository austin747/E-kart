import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../constant/useAuth"; 
import { 
  apiGetRetailerProducts, 
  apiAddProduct, 
  apiDeleteProduct, 
  type ApiBackendProduct 
} from "../../services/api"; 

type ActiveTab = "overview" | "inventory" | "add-product";

export default function RetailerDashboard() {
  const { token, logout, user } = useAuth();
  const navigate = useNavigate();

  // ── Dashboard UI States ──
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [products, setProducts] = useState<ApiBackendProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ── Form States ──
  const [formData, setFormData] = useState({ name: "", category: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // ── API Fetch ──
  const fetchRetailerData = async (authToken: string) => {
    try {
      const res = await apiGetRetailerProducts(authToken);
      if (res.success) setProducts(res.products);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load inventory logs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: State changes moved within microtask stack to satisfy lint execution lifecycle hooks
  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    const loadDataAsync = async () => {
      if (isMounted) {
        setLoading(true); 
        await fetchRetailerData(token);
      }
    };

    loadDataAsync();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // ── Handlers ──
  // ✅ FIXED: Added HTMLSelectElement to event target union definition type
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      setSubmitting(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("price", formData.price);
      data.append("description", formData.description);
      if (imageFile) data.append("image", imageFile);

      const res = await apiAddProduct(token, data);
      if (res.success) {
        toast.success("Product uploaded successfully! Awaiting review.");
        setFormData({ name: "", category: "", price: "", description: "" });
        setImageFile(null);
        setActiveTab("inventory");
        fetchRetailerData(token);
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!token || !window.confirm("Delete this product listing?")) return;
    try {
      const res = await apiDeleteProduct(token, id);
      if (res.success) {
        toast.success("Product removed");
        fetchRetailerData(token);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ── Computed Metrics ──
  const total = products.length;
  const approved = products.filter(p => p.isApproved).length;
  const pending = total - approved;

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-300 relative overflow-hidden">
      
      {/* ── AMBIENT BACKGROUND SYSTEM ── */}
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
        <div className="absolute w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] -top-40 -left-20 animate-drift-1" style={{ willChange: 'transform' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-600/10 blur-[110px] top-1/3 -right-32 animate-drift-2" style={{ willChange: 'transform' }} />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[90px] -bottom-20 left-1/4 animate-drift-3" style={{ willChange: 'transform' }} />
      </div>

      {/* Cinematic Fractal Grain Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
        }}
      />

      {/* ── SIDEBAR NAVIGATION PANEL ── */}
      <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800/60 text-slate-300 flex flex-col justify-between p-5 shadow-xl z-10">
        <div>
          <div className="mb-8 pt-2 px-2 border-b border-slate-800 pb-5">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-emerald-400">🛍️</span> ShopNow Retail
            </h1>
            <p className="text-xs text-slate-500 mt-1">Welcome back, {user?.name || "Vendor"}</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Dashboard Overview", icon: "📊" },
              { id: "inventory", label: "My Inventory", icon: "📦" },
              { id: "add-product", label: "Add New Product", icon: "➕" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === tab.id 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                    : "hover:bg-slate-800/60 hover:text-slate-100"
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-2 border-t border-slate-800 pt-4">
          <button
            onClick={() => navigate("/")}
            className="w-full text-center py-2.5 text-xs font-medium bg-slate-800/80 rounded-lg hover:bg-slate-700 text-slate-200 border border-slate-700/50 transition-colors"
          >
            Back to Marketplace
          </button>
          <button
            onClick={() => { logout(); navigate("/login"); }}
            className="w-full text-center py-2.5 text-xs font-bold bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-lg transition-all"
          >
            Log Out Account
          </button>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE CONTENT CONTAINER ── */}
      <main className="flex-1 p-10 max-w-6xl mx-auto z-10 overflow-y-auto">
        
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="relative pl-4 border-l-4 border-emerald-500">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">
                Performance Summary
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Real-time tracking of your store metrics and catalog synchronization.
              </p>
            </div>
            
            {/* Metric Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { 
                  title: "Total Catalog Items", 
                  val: total, 
                  icon: "📦",
                  borderHover: "hover:border-blue-500/40",
                  badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                  textGlow: "group-hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] bg-blue-600/5"
                },
                { 
                  title: "Active Live Items", 
                  val: approved, 
                  icon: "⚡",
                  borderHover: "hover:border-emerald-500/40",
                  badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                  textGlow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] bg-emerald-600/5"
                },
                { 
                  title: "Awaiting Admin Review", 
                  val: pending, 
                  icon: "⏳",
                  borderHover: "hover:border-amber-500/40",
                  badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                  textGlow: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] bg-amber-600/5"
                },
              ].map((card, i) => (
                <div 
                  key={i} 
                  className={`relative group overflow-hidden backdrop-blur-xl p-6 rounded-2xl border border-slate-800/80 bg-slate-900/40 ${card.borderHover} transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col justify-between`}
                >
                  {/* Smooth Background Aura Glow on Hover */}
                  <div className={`absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${card.textGlow}`} />

                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400/80">
                        {card.title}
                      </span>
                      <span className={`w-8 h-8 flex items-center justify-center rounded-lg border text-base shadow-inner ${card.badge}`}>
                        {card.icon}
                      </span>
                    </div>

                    {/* Hardware Accelerated Flat Color Transitions (No Blink) */}
                    <div className="mt-5 flex items-baseline gap-1.5">
                      <span className="text-4xl font-black text-slate-100 group-hover:text-white tracking-tight transition-colors duration-300 ease-out">
                        {card.val}
                      </span>
                      <span className="text-xs text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-400">
                        units
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Product Portfolio</h2>
            
            {loading ? (
              <div className="text-center py-12 text-slate-400 animate-pulse">Loading catalog indexes...</div>
            ) : products.length === 0 ? (
              <div className="bg-slate-900/40 backdrop-blur-md p-12 text-center rounded-xl border border-slate-800 text-slate-500">
                Your inventory is currently empty.
              </div>
            ) : (
              <div className="bg-slate-900/40 backdrop-blur-md rounded-xl border border-slate-800 overflow-hidden">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-300 font-semibold">
                      <th className="p-4 w-20">Preview</th>
                      <th className="p-4">Item Name</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4">
                          {/* ✅ FIXED: Normalizes database backslashes and ensures absolute location configuration parsing */}
                          <div className="w-12 h-12 rounded-lg border border-slate-700 bg-slate-800 overflow-hidden flex items-center justify-center">
                            <img
                              src={
                                p.image
                                  ? p.image.startsWith("http")
                                    ? p.image
                                    : `http://localhost:5000/${p.image.replace(/\\/g, "/").replace(/^\/?uploads\//, "uploads/")}`
                                  : "https://placehold.co/80x80?text=📦"
                              }
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=📦"; }}
                            />
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-white">{p.name}</td>
                        <td className="p-4 text-slate-400 capitalize">{p.category}</td>
                        <td className="p-4 font-medium text-white">Rs. {p.price}</td>
                        <td className="p-4">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            p.isApproved ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}>
                            {p.isApproved ? "Live" : "Pending"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteProduct(p._id)}
                            className="text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded-md border border-rose-500/20 transition-all"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ADD PRODUCT TAB */}
        {activeTab === "add-product" && (
          <div className="max-w-xl bg-slate-900/40 backdrop-blur-md p-8 rounded-xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">Create New Listing</h2>
            
            <form onSubmit={handleCreateProduct} className="space-y-5 text-sm">
              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Product Title</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:border-emerald-500 outline-none transition-all text-white"
                  placeholder="e.g., Slim-Fit Leather Jacket"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* ✅ FIXED: Custom input changed to strict type-supported semantic dropdown */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:border-emerald-500 outline-none transition-all text-slate-300 cursor-pointer"
                    required
                  >
                    <option value="" disabled hidden>Select Category</option>
                    <option value="electronics" className="bg-slate-950 text-white">Electronics</option>
                    <option value="fashion" className="bg-slate-950 text-white">Fashion</option>
                    <option value="fitness" className="bg-slate-950 text-white">Fitness</option>
                    <option value="home" className="bg-slate-950 text-white">Home</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1.5">Price (Rs.)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:border-emerald-500 outline-none transition-all text-white"
                    placeholder="1500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-lg focus:border-emerald-500 outline-none transition-all text-white"
                  placeholder="Describe your item key features..."
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1.5">Display Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setImageFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold p-3 rounded-lg shadow-lg shadow-emerald-600/10 transition-colors disabled:bg-emerald-300/20 mt-2"
              >
                {submitting ? "Publishing..." : "Submit Product for Approval"}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}