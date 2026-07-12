// src/pages/ShopPage.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiStarFill, RiShoppingCartLine, RiHeartLine } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";
import { type Product } from "../constant/HeroLink";
import { apiGetPublicProducts, type ApiBackendProduct } from "../services/api";

export default function ShopPage() {
  const { user, addToCart, cart } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load database items dynamically 
  useEffect(() => {
    async function fetchShopItems() {
      try {
        const data = await apiGetPublicProducts();
        if (data.success) {
          const sanitized: Product[] = data.products.map((p: ApiBackendProduct) => ({
            id: p._id, // Map backend string ObjectId safely
            name: p.name,
            category: p.category,
            image: p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
            price: p.price,
            description: p.description,
            rating: p.rating || 4.5,
            reviews: p.reviews || 0,
          }));
          setProducts(sanitized);

          // Generate dynamic category lists based on real database presence
          const uniqueCategories = ["all", ...Array.from(new Set(sanitized.map((p) => p.category)))];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching live shop items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchShopItems();
  }, []);

  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(null), 2000);
  };

  // ✅ FIXED: Parameter updated from 'number' to 'string' to resolve type error
  const inCart = (id: string) => cart.some((i) => i.id === id);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-blue-600 font-semibold">
        Loading storefront...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50">

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

      {/* PAGE CONTENT */}
      <div className="relative z-10">
        {/* Hero banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white py-12 px-4 text-center">
          <h2 className="text-3xl font-bold mb-2">Summer Sale — Up to 40% off</h2>
          <p className="text-blue-100 text-sm">Free delivery on orders above ₹2,000</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white shadow"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center text-gray-400 py-12">No products available in this category.</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-44 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                      <RiHeartLine size={16} />
                    </button>
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full capitalize">
                      {product.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{product.name}</h3>
                    <p className="text-gray-400 text-xs mt-0.5 truncate">{product.description}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <RiStarFill className="text-yellow-400" size={13} />
                      <span className="text-xs font-medium text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>

                    {/* Price + CTA */}
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${
                          inCart(product.id)
                            ? "bg-green-100 text-green-700 border border-green-300"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <RiShoppingCartLine size={13} />
                        {inCart(product.id) ? "Added" : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
}