import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../constant/useAuth";
import {
  LuUsers,
  LuShoppingBag,
  LuCircleCheck,
  LuShieldCheck,
  LuPackage,
  LuLogOut,
  LuStore,
  LuTrendingUp,
  LuClock,
  LuBadgeCheck,
  LuRefreshCw,
  LuImage,
} from "react-icons/lu";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Order {
  _id: string;
  orderId?: string;
  totalAmount: number;
  status: string;
  orderStatus?: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isApproved: boolean;
  ownerId?: string;
}

type Tab = "overview" | "users" | "orders" | "products";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { token, logout } = useAuth(); // ✅ Use context token + logout — not localStorage directly

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── FETCHERS ──────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setUsers(data.users);
  }, [token]);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setOrders(data.orders);
  }, [token]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    const res = await fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setProducts(data.products);
  }, [token]);

  const fetchAll = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchUsers(), fetchOrders(), fetchProducts()]);
    setRefreshing(false);
  }, [fetchUsers, fetchOrders, fetchProducts]);

  useEffect(() => {
    if (!token) return;
    const timer = setTimeout(() => fetchAll(), 0);
    return () => clearTimeout(timer);
  }, [fetchAll, token]);

  // ── ACTIONS ───────────────────────────────────────────────
  async function updateRole(userId: string, role: string) {
    if (!token) return;
    await fetch(`/api/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role }),
    });
    fetchUsers();
  }

  async function approveOrder(orderId: string) {
    if (!token) return;
    setLoadingOrderId(orderId);
    await fetch(`/api/admin/orders/${orderId}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoadingOrderId(null);
    fetchOrders();
  }

  async function approveProduct(productId: string) {
    if (!token) return;
    setLoadingProductId(productId);
    await fetch(`/api/admin/products/${productId}/approve`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    setLoadingProductId(null);
    fetchProducts();
  }

  // ✅ FIXED: Call context logout() which clears user + token + cart atomically.
  // Old code called localStorage.removeItem("token") directly, leaving stale user
  // in context state — caused ProtectedRoute (/login) and RoleGuard (/) to both
  // fire simultaneously, producing the double-redirect crash on logout.
  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // ── DERIVED STATS ─────────────────────────────────────────
  function isOrderSettled(o: Order) {
    return o.status === "approved" || o.status === "completed" || o.orderStatus === "APPROVED";
  }

  const pendingProducts = products.filter((p) => !p.isApproved);
  const approvedProducts = products.filter((p) => p.isApproved);
  const pendingOrders = orders.filter((o) => !isOrderSettled(o));
  const retailerCount = users.filter((u) => u.role === "retailer").length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "overview",  label: "Overview",  icon: <LuTrendingUp className="w-4 h-4" /> },
    { id: "users",     label: "Users",     icon: <LuUsers className="w-4 h-4" />,        badge: users.length },
    { id: "orders",    label: "Orders",    icon: <LuShoppingBag className="w-4 h-4" />,  badge: pendingOrders.length },
    { id: "products",  label: "Products",  icon: <LuPackage className="w-4 h-4" />,      badge: pendingProducts.length },
  ];

  return (
    <div className="relative min-h-screen bg-[#080812] text-white font-sans overflow-hidden">
      <style>{`
        @keyframes drift-slow { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(60px,-40px) scale(1.15)} }
        @keyframes drift-reverse { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-40px,60px) scale(1.05)} }
        .drift-1{animation:drift-slow 18s ease-in-out infinite}
        .drift-2{animation:drift-reverse 22s ease-in-out infinite}
        .drift-3{animation:drift-slow 15s ease-in-out infinite 3s}
      `}</style>
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-violet-600/15 blur-[130px] -top-40 -left-20 drift-1" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-pink-600/15 blur-[110px] top-1/3 -right-32 drift-2" />
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[90px] -bottom-20 left-1/4 drift-3" />
      </div>
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none mix-blend-overlay z-0"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* TOP NAV */}
        <header className="border-b border-white/[0.08] bg-white/[0.02] backdrop-blur-xl sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-2 rounded-lg bg-violet-500/10 border border-violet-500/20">
                <LuShieldCheck className="w-5 h-5 text-violet-400" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-extrabold tracking-tight text-white leading-none">Admin Console</p>
                <p className="text-[10px] text-white/40 leading-none mt-0.5">ShopNow Control Center</p>
              </div>
            </div>

            <nav className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/25"
                      : "text-white/50 hover:text-white/80 hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className="ml-0.5 bg-pink-500 text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchAll}
                disabled={refreshing}
                className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
                title="Refresh all data"
              >
                <LuRefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white/50 hover:text-white/80 hover:bg-white/5 transition-all"
              >
                <LuStore className="w-4 h-4" />
                View Store
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-400/80 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
              >
                <LuLogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">System Overview</h2>
                <p className="text-sm text-white/40 mt-1">Live snapshot of your platform metrics.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Users",    value: users.length,           icon: <LuUsers className="w-5 h-5" />,       color: "blue",   sub: `${retailerCount} retailers` },
                  { label: "Total Orders",   value: orders.length,          icon: <LuShoppingBag className="w-5 h-5" />, color: "purple", sub: `${pendingOrders.length} pending` },
                  { label: "Products",       value: products.length,        icon: <LuPackage className="w-5 h-5" />,     color: "cyan",   sub: `${approvedProducts.length} live` },
                  { label: "Pending Review", value: pendingProducts.length, icon: <LuClock className="w-5 h-5" />,      color: "amber",  sub: "awaiting approval" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 backdrop-blur-sm">
                    <div className={`inline-flex p-2.5 rounded-xl mb-3 ${
                      stat.color === "blue"   ? "bg-blue-500/10 text-blue-400"     :
                      stat.color === "purple" ? "bg-purple-500/10 text-purple-400" :
                      stat.color === "cyan"   ? "bg-cyan-500/10 text-cyan-400"     :
                                                "bg-amber-500/10 text-amber-400"
                    }`}>{stat.icon}</div>
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                    <p className="text-xs font-semibold text-white/50 mt-0.5">{stat.label}</p>
                    <p className="text-[11px] text-white/30 mt-1">{stat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { tab: "products" as Tab, color: "amber", icon: <LuClock className="w-5 h-5" />, badge: pendingProducts.length, title: "Products Awaiting Approval", sub: "Click to review and publish →" },
                  { tab: "orders"   as Tab, color: "purple", icon: <LuShoppingBag className="w-5 h-5" />, badge: pendingOrders.length, title: "Orders Pending Approval", sub: "Click to process payments →" },
                  { tab: "users"    as Tab, color: "blue",  icon: <LuUsers className="w-5 h-5" />, badge: users.length, title: "Manage User Roles", sub: "Click to configure access →" },
                ].map((card) => (
                  <button
                    key={card.tab}
                    onClick={() => setActiveTab(card.tab)}
                    className={`group text-left bg-white/[0.03] hover:bg-${card.color}-500/5 border border-white/[0.08] hover:border-${card.color}-500/20 rounded-2xl p-5 transition-all`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2.5 rounded-xl bg-${card.color}-500/10 text-${card.color}-400`}>{card.icon}</div>
                      <span className={`bg-${card.color}-500 text-white text-xs font-bold rounded-full px-2 py-0.5`}>{card.badge}</span>
                    </div>
                    <p className="text-sm font-bold text-white">{card.title}</p>
                    <p className="text-xs text-white/40 mt-1">{card.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">User Management</h2>
                <p className="text-sm text-white/40 mt-1">Assign roles and configure access tiers across all accounts.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-white/40 border-b border-white/[0.08]">
                        <th className="py-3.5 px-6">Name</th>
                        <th className="py-3.5 px-6">Email</th>
                        <th className="py-3.5 px-6">Role</th>
                        <th className="py-3.5 px-6 text-right">Change Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-sm">
                      {users.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center text-white/30 text-sm">No users found.</td></tr>
                      ) : users.map((u) => (
                        <tr key={u._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 font-semibold text-white">{u.name}</td>
                          <td className="py-4 px-6 text-white/50 text-xs">{u.email}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${
                              u.role === "admin"    ? "bg-red-500/10 text-red-400 border-red-500/20" :
                              u.role === "retailer" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                      "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            }`}>{u.role}</span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <select
                              value={u.role}
                              onChange={(e) => updateRole(u._id, e.target.value)}
                              className="text-xs bg-white/5 text-gray-200 border border-white/10 rounded-lg py-1.5 px-3 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/30 font-medium transition-all"
                            >
                              <option className="bg-gray-900" value="customer">Customer</option>
                              <option className="bg-gray-900" value="retailer">Retailer</option>
                              <option className="bg-gray-900" value="admin">Admin</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Orders & Payments</h2>
                <p className="text-sm text-white/40 mt-1">Authorize incoming store payments and process fulfillment.</p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/[0.03] text-[11px] font-bold uppercase tracking-wider text-white/40 border-b border-white/[0.08]">
                        <th className="py-3.5 px-6">Order ID</th>
                        <th className="py-3.5 px-6">Amount</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05] text-sm">
                      {orders.length === 0 ? (
                        <tr><td colSpan={4} className="py-12 text-center text-white/30 text-sm">No orders found.</td></tr>
                      ) : orders.map((o) => (
                        <tr key={o._id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 font-mono text-xs text-white/40">#{o.orderId || o._id.slice(-8)}</td>
                          <td className="py-4 px-6 font-extrabold text-white">₹{o.totalAmount.toLocaleString("en-IN")}</td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize border ${
                              isOrderSettled(o)
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                            }`}>
                              {isOrderSettled(o) ? "Settled" : o.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              disabled={loadingOrderId === o._id || isOrderSettled(o)}
                              onClick={() => approveOrder(o._id)}
                              className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-all active:scale-[0.98]"
                            >
                              <LuCircleCheck className="w-3.5 h-3.5" />
                              {loadingOrderId === o._id ? "Processing..." : isOrderSettled(o) ? "Approved" : "Approve"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Product Approval</h2>
                <p className="text-sm text-white/40 mt-1">Review retailer submissions and publish approved items to the store.</p>
              </div>
              {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.02] p-20 text-center">
                  <LuPackage size={40} className="text-white/20 mb-3" />
                  <p className="text-sm font-medium text-white/40">No products submitted yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p._id} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col">
                      <div className="h-40 bg-white/[0.03] border-b border-white/[0.06] overflow-hidden flex items-center justify-center">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          : <LuImage className="w-8 h-8 text-white/20" />
                        }
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-bold text-white text-sm truncate">{p.name}</p>
                            <p className="text-xs text-white/40 truncate mt-0.5">{p.description}</p>
                          </div>
                          <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            p.isApproved
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}>
                            {p.isApproved ? "Live" : "Pending"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-white/40">
                          <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md capitalize">{p.category}</span>
                          <span className="font-extrabold text-white text-sm">₹{p.price.toLocaleString("en-IN")}</span>
                        </div>
                        <button
                          disabled={p.isApproved || loadingProductId === p._id}
                          onClick={() => approveProduct(p._id)}
                          className="mt-auto w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition-all active:scale-[0.98] disabled:cursor-not-allowed bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white"
                        >
                          <LuBadgeCheck className="w-3.5 h-3.5" />
                          {loadingProductId === p._id ? "Approving..." : p.isApproved ? "Already Live" : "Approve & Publish"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}