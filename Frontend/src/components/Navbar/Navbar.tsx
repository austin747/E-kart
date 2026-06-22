// src/components/Navbar/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiShoppingCartLine, RiGiftLine, RiUserLine,
  RiLogoutBoxLine, RiSearchLine, RiCloseLine, RiStarFill,
} from "react-icons/ri";
import { BsCurrencyDollar } from "react-icons/bs";
import { useAuth } from "../../constant/useAuth";
import ResponsiveMenu from "./ResponsiveMenu";
import { NAV_LINKS } from "../../constant/NavLinks";
import { PRODUCTS, type Product } from "../../constant/HeroLink";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { user, logout, cartCount, cartTotal } = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // focus input when search opens
  useEffect(() => {
    if (searchOpen === true) {
      inputRef.current?.focus();
    }
  }, [searchOpen]);

  // close search on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setQuery("");
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // filter products based on search query
  const results: Product[] = [];
  if (query.trim() !== "") {
    for (let i = 0; i < PRODUCTS.length; i++) {
      const p = PRODUCTS[i];
      const q = query.toLowerCase();
      if (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      ) {
        results.push(p);
      }
    }
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function toggleMenu() {
    if (open === true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  return (
    <nav className="bg-blue-600 w-full sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">

          {/* LEFT — brand */}
          <div className="flex items-center gap-3 text-white">
            <img
    src="https://api.dicebear.com/7.x/identicon/svg?seed=ShopNow&backgroundColor=ffffff"
    alt="Shop Now Logo"
    className="w-9 h-9 rounded-xl bg-white p-1"
  />
            <h1
              className="font-bold uppercase tracking-wide cursor-pointer"
              onClick={() => navigate("/")}
            >
              Shop Now
            </h1>
          </div>

          {/* CENTER — nav links */}
          <div className="hidden md:flex gap-6 text-white">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:underline hover:opacity-80 transition-opacity"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 text-white">

            <RiGiftLine size={22} />

            {/* Cart total */}
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
              <BsCurrencyDollar size={14} />
              <span className="font-semibold text-sm">
                {cartTotal.toLocaleString()}
              </span>
            </div>

            {/* Search button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/40 px-3 py-1.5 rounded-full text-sm font-semibold"
            >
              <RiSearchLine size={16} />
              <span className="hidden sm:inline">Search</span>
            </button>

            {/* Cart button */}
            <button
              onClick={() => {
                if (user !== null) {
                  navigate("/cart");
                } else {
                  navigate("/login");
                }
              }}
              className="relative flex items-center gap-1.5 bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm"
            >
              <RiShoppingCartLine size={16} />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Login / Logout */}
            {user !== null ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-sm text-white/80">
                  Hi, {user.name.split(" ")[0]}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 bg-red-500 hover:bg-red-400 px-3 py-1.5 rounded-full text-sm font-semibold"
                >
                  <RiLogoutBoxLine size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 border border-white/40 px-3 py-1.5 rounded-full text-sm font-semibold"
              >
                <RiUserLine size={16} />
                <span className="hidden sm:inline">Login</span>
              </button>
            )}

            <ResponsiveMenu
              isOpen={open}
              onToggle={toggleMenu}
              onClose={() => setOpen(false)}
            />

          </div>
        </div>
      </div>

      {/* Search bar — slides down */}
      <div
        className={`overflow-hidden transition-all duration-300 ${searchOpen === true ? "max-h-96" : "max-h-0"
          }`}
      >
        <div className="bg-white border-t border-blue-500 px-4 py-3">
          <div className="max-w-2xl mx-auto">

            {/* Input */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-400 bg-white">
              <RiSearchLine className="text-gray-400" size={18} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories…"
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
              />
              {query !== "" && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <RiCloseLine size={18} />
                </button>
              )}
            </div>

            {/* Results list */}
            {query.trim() !== "" && (
              <div className="mt-2 rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">
                    No products found for "{query}"
                  </p>
                ) : (
                  results.map((product) => (
                    <button
                      key={product.id}
                      onClick={closeSearch}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-left"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 capitalize truncate">
                          {product.category} · {product.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-blue-600">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                          <RiStarFill className="text-yellow-400" size={11} />
                          {product.rating}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}