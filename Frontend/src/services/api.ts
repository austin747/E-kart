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