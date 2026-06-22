import { useState } from "react";
import { PRODUCTS, CATEGORIES, type Product, type Category } from "../../constant/HeroLink";
import { RiShoppingBagLine, RiMagicLine } from "react-icons/ri";

interface Props {
  onAddToCart: (product: Product) => void;
}

export default function HeroSection({ onAddToCart }: Props) {
  const [category, setCategory] = useState<Category>("all");

  const filteredProducts =
    category === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === category);

  // Dynamically calculate product counts for sidebar badges
  const getProductCount = (cat: Category) => {
    if (cat === "all") return PRODUCTS.length;
    return PRODUCTS.filter((p) => p.category === cat).length;
  };

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#0d0d1a] py-12 text-white selection:bg-pink-500 selection:text-white">
      
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

      {/* MAIN CONTAINER */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* SIDEBAR */}
          <div className="w-full lg:w-64 flex-shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl shadow-2xl h-fit">
            <div className="flex items-center gap-2 mb-5 px-1">
              <RiMagicLine className="text-purple-400 text-lg animate-pulse" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-400">
                Discover Styles
              </h2>
            </div>

            <div className="flex lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none">
              {CATEGORIES.map((item: Category) => {
                const isActive = category === item;
                return (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`flex items-center justify-between min-w-[120px] lg:w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 capitalize border ${
                      isActive
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white/20 shadow-lg shadow-purple-500/10"
                        : "bg-white/[0.04] text-white/70 border-white/5 hover:bg-white/[0.1] hover:text-white"
                    }`}
                  >
                    <span>{item}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isActive ? "bg-white/20 text-white" : "bg-white/5 text-white/40"
                    }`}>
                      {getProductCount(item)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* PROMO SPOTLIGHT BANNER */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-r from-purple-900/40 via-pink-900/20 to-transparent p-6 sm:p-8 backdrop-blur-md shadow-xl">
              <div className="max-w-md relative z-10">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500/10 px-3 py-1 text-xs font-bold tracking-wider text-pink-400 border border-pink-500/20 mb-3">
                  🔥 LIMITED SEASON OFFER
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                  Elevate Your Daily Setup
                </h1>
                <p className="text-sm text-white/60 mb-4">
                  Experience premium hand-picked essentials engineered for modern aesthetics and unparalleled durability.
                </p>
              </div>
              <div className="absolute top-1/2 right-6 -translate-y-1/2 text-white/5 hidden md:block select-none pointer-events-none">
                <RiShoppingBagLine size={140} />
              </div>
            </div>

            {/* DYNAMIC PRODUCTS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product: Product) => (
                <div
                  key={product.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.06] to-white/[0.01] backdrop-blur-md overflow-hidden transition-all duration-300 hover:border-white/[0.18] hover:shadow-[0_22px_45px_rgba(0,0,0,0.45)]"
                >
                  {/* Clean Product Image Container */}
                  <div className="relative h-56 w-full overflow-hidden bg-white/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Minimal Top-Left Category Badge */}
                    <div className="absolute top-3 left-3 rounded-md bg-black/50 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-300 border border-white/5">
                      {product.category}
                    </div>
                  </div>

                  {/* Meta/Content Information */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors duration-200 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-white/50 mt-1.5 line-clamp-2 leading-relaxed">
                        {product.description || "Premium standard item created using environmentally friendly, high-grade materials."}
                      </p>
                    </div>

                    <div className="mt-5">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-white/30 uppercase font-bold tracking-wider">Price</span>
                          <span className="text-xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            ₹{product.price.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 shadow-sm">
                          ⭐ {product.rating}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => onAddToCart(product)}
                        className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/10 transition-all duration-300 hover:from-purple-600 hover:to-pink-600 active:scale-[0.97] border-t border-white/20"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}