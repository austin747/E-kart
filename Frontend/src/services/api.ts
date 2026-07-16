// ✅ FIXED: Changed to absolute URL pointing explicitly to your Express backend port
const BASE = "http://localhost:5000/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  cart?: T;
}

// ── DATA INTERFACES ───────────────────────────────────
export interface Product {
  id: string; 
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;   
  rating?: number;
  reviews?: number;
}

export interface ApiBackendProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  ownerId?: string;
  isApproved?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminOrder {
  _id: string;
  orderId?: string;
  totalAmount: number;
  status: string;
}

interface MeUser {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "retailer" | "customer";
}

// ── AUTH ──────────────────────────────────────────────
export async function apiRegister(name: string, email: string, password: string, role: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });
  return res.json();
}

// ── ADD THIS to services/api.ts, in the AUTH section ──

export async function apiVerifyEmail(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/auth/verify-email/${token}`);
  return res.json();
}

export async function apiLogin(email: string, password: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function apiGetMe(token: string): Promise<{
  success: boolean;
  user?: MeUser;
  message?: string;
}> {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ── RETAILER DASHBOARD ENDPOINTS ──────────────────────
export interface RetailerProductsResponse {
  success: boolean;
  products: ApiBackendProduct[]; 
  message?: string;
}

// Ensure this matches your backend route layout (e.g., router.get("/products" or router.get("/")))
export async function apiGetRetailerProducts(token: string): Promise<RetailerProductsResponse> {
  const res = await fetch(`${BASE}/retailer/products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ✅ FIXED: Route pointing targets /retailer/add to perfectly fit your router backend file structure
export async function apiAddProduct(token: string, formData: FormData): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/retailer/add`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData, // Browser sets the correct multipart/form-data headers automatically
  });
  return res.json();
}

export async function apiDeleteProduct(token: string, id: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/retailer/products/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ── ADMIN DASHBOARD ENDPOINTS ─────────────────────────
export interface AdminUsersResponse {
  success: boolean;
  users: AdminUser[];
  message?: string;
}

export interface AdminOrdersResponse {
  success: boolean;
  orders: AdminOrder[];
  message?: string;
}

export async function apiGetAdminUsers(token: string): Promise<AdminUsersResponse> {
  const res = await fetch(`${BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function apiGetAdminOrders(token: string): Promise<AdminOrdersResponse> {
  const res = await fetch(`${BASE}/admin/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function apiUpdateUserRole(token: string, userId: string, role: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/admin/users/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ role }),
  });
  return res.json();
}

export async function apiApproveOrder(token: string, orderId: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/admin/orders/${orderId}/approve`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ── CART ──────────────────────────────────────────────
export async function apiGetCart(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function apiAddToCart(
  token: string,
  item: { productId: string; name: string; image: string; price: number; quantity?: number }
): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  return res.json();
}

export async function apiUpdateCart(token: string, productId: string, quantity: number): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/cart/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId, quantity }),
  });
  return res.json();
}

export async function apiRemoveFromCart(token: string, productId: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/cart/remove/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function apiClearCart(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/cart/clear`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ── PAYMENTS ──────────────────────────────────────────
export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: {
    orderId: string;
    items: unknown[];
    totalAmount: number;
    totalItems: number;
    placedAt: string;
  };
}

export async function apiCheckout(token: string): Promise<OrderResponse> {
  const res = await fetch(`${BASE}/checkout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export interface PaymentInitiateResponse {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  paymentData?: {
    amount: number;
    tax_amount: number;
    total_amount: number;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: number;
    product_delivery_charge: number;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
    signature: string;
  };
}

export async function apiInitiatePayment(token: string): Promise<PaymentInitiateResponse> {
  const res = await fetch(`${BASE}/payment/initiate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ── PUBLIC CATALOGUE GATEWAY ────────────────
export async function apiGetPublicProducts(): Promise<{ success: boolean; products: ApiBackendProduct[] }> {
  const res = await fetch(`${BASE}/products`);
  return res.json();
}