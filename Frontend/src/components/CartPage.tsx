// src/pages/CartPage.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiShoppingCartLine,
  RiArrowLeftLine,
  RiDeleteBin2Line,
  RiAddLine,
  RiSubtractLine,
} from "react-icons/ri";
import { useAuth } from "../constant/useAuth";

export default function CartPage() {
  const { user, cart, removeFromCart, updateQty, cartTotal } = useAuth();
  const navigate = useNavigate();

  // if not logged in, go to login page
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === null) return null;

  // delivery charge logic
  let delivery = 99;
  if (cartTotal >= 2000) {
    delivery = 0;
  }
  const orderTotal = cartTotal + delivery;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-2xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-blue-600 hover:underline text-sm mb-6"
        >
          <RiArrowLeftLine size={16} />
          Continue shopping
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <RiShoppingCartLine size={22} />
          Your Cart
          <span className="text-sm font-normal text-gray-400">
            ({cart.length} {cart.length === 1 ? "item" : "items"})
          </span>
        </h2>

        {/* Empty cart */}
        {cart.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center text-gray-400">
            <RiShoppingCartLine size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">Your cart is empty.</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700"
            >
              Browse products
            </button>
          </div>
        )}

        {/* Cart items */}
        {cart.length > 0 && (
          <div>
            <div className="flex flex-col gap-3 mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
                >
                  {/* Product image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg shrink-0"
                  />

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                      {item.name}
                    </p>
                    <p className="text-gray-400 text-xs capitalize">
                      {item.category}
                    </p>
                    <p className="text-blue-600 font-bold text-sm mt-1">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  {/* Quantity controls */}
                  <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}  // ✅ no change needed — async onClick works fine
                      className="px-2 py-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <RiSubtractLine size={14} />
                    </button>
                    <span className="px-2 text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                      className="px-2 py-1.5 hover:bg-gray-100 text-gray-600"
                    >
                      <RiAddLine size={14} />
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-400 hover:text-red-600 ml-1"
                  >
                    <RiDeleteBin2Line size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h3 className="font-semibold text-gray-700 mb-3">
                Order Summary
              </h3>

              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Subtotal</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>Delivery</span>
                {delivery === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>₹{delivery}</span>
                )}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold text-gray-800">
                <span>Total</span>
                <span>₹{orderTotal.toLocaleString()}</span>
              </div>

              {cartTotal < 2000 && (
                <p className="text-xs text-gray-400 mt-2">
                  Add ₹{(2000 - cartTotal).toLocaleString()} more for free delivery!
                </p>
              )}

              <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}