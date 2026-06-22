// src/pages/ShopPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiStarFill, RiShoppingCartLine, RiHeartLine } from "react-icons/ri";
import { useAuth } from "../constant/useAuth";
import { PRODUCTS, type Product } from "../constant/HeroLink";

const CATEGORIES = ["all", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

export default function ShopPage() {
  const { user, addToCart, cart } = useAuth();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product);
    setToast(`${product.name} added to cart!`);
    setTimeout(() => setToast(null), 2000);
  };

  const inCart = (id: number) => cart.some((i) => i.id === id);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero banner */}
      <div className="bg-linear-to-r from-blue-600 to-blue-400 text-white py-12 px-4 text-center">
        <h2 className="text-3xl font-bold mb-2">Summer Sale — Up to 40% off</h2>
        <p className="text-blue-100 text-sm">Free delivery on orders above ₹2,000</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Category pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
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
                <h3 className="font-semibold text-gray-800 text-sm truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-xs mt-0.5 truncate">
                  {product.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                  <RiStarFill className="text-yellow-400" size={13} />
                  <span className="text-xs font-medium text-gray-600">
                    {product.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({product.reviews})
                  </span>
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
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg animate-bounce z-50">
          {toast}
        </div>
      )}
    </div>
  );
}