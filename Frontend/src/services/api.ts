const BASE = "/api";

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  token?: string;
  user?: T;
  cart?: T;
}

// ── AUTH ──────────────────────────────────────────────
export async function apiRegister(name: string, email: string, password: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
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

export async function apiGetMe(token: string): Promise<ApiResponse> {
  const res = await fetch(`${BASE}/auth/me`, {
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