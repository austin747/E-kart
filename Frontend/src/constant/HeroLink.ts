export interface Product {
  id: string; // 💡 Updated to string to support real MongoDB ObjectIds
  name: string;
  category: string;
  image: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
}

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Headphone",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    price: 2499,
    description: "Premium wireless headphones",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: "2",
    name: "Running Shoes",
    category: "fitness",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    price: 3999,
    description: "Lightweight running shoes",
    rating: 4.7,
    reviews: 84,
  },
  {
    id: "3",
    name: "Shoes",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
    price: 1999,
    description: "Stylish casual shoes",
    rating: 4.3,
    reviews: 66,
  },
  {
    id: "4",
    name: "Backpack",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    price: 1499,
    description: "Durable backpack",
    rating: 4.6,
    reviews: 95,
  }
];

export const CATEGORIES = [
  "all",
  "fitness",
  "fashion",
  "electronics",
  "home",
] as const;

export type Category = typeof CATEGORIES[number];

export interface CartItem extends Product {
  quantity: number;
}