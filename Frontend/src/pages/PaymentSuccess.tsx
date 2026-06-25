import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 text-center max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800">Payment Successful!</h2>
        {orderId && (
          <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
        )}
        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}