export interface Product {
  id: number;
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
    id: 1,
    name: "Headphone",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    price: 2499,
    description: "Premium wireless headphones",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "fitness",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
    price: 3999,
    description: "Lightweight running shoes",
    rating: 4.7,
    reviews: 84,
  },
  {
    id: 3,
    name: "Shoes",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80",
    price: 1999,
    description: "Stylish casual shoes",
    rating: 4.3,
    reviews: 66,
  },
  {
    id: 4,
    name: "Backpack",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
    price: 1499,
    description: "Durable backpack",
    rating: 4.6,
    reviews: 95,
  },
  {
    id: 5,
    name: "Water Bottle",
    category: "fitness",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663694486547/cLuPauhiz5JLyPA6ArGiRu/water-bottle-3h2auJNKGTzztUSv5cJcKH.webp",
    price: 799,
    description: "Insulated bottle",
    rating: 4.4,
    reviews: 72,
  },
  {
    id: 6,
    name: "Yoga Mat",
    category: "fitness",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&q=80",
    price: 1299,
    description: "Premium yoga mat",
    rating: 4.8,
    reviews: 210,
  },
  {
    id: 7,
    name: "Coffee Maker",
    category: "home",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663694486547/cLuPauhiz5JLyPA6ArGiRu/coffee-maker-cmHzTLq6RvXiRgck7MxPz7.webp",
    price: 2999,
    description: "Programmable coffee maker",
    rating: 4.5,
    reviews: 188,
  },
  {
    id: 8,
    name: "Table Lamp",
    category: "home",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663694486547/cLuPauhiz5JLyPA6ArGiRu/table-lamp-BABQ6F8gn6ezxSktS2YeTr.webp",
    price: 1599,
    description: "Modern table lamp",
    rating: 4.9,
    reviews: 312,
  },
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