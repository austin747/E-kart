// src/pages/VerifyEmailPage.tsx
import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { RiCheckLine, RiCloseLine, RiShoppingBag3Line } from "react-icons/ri";
import { apiVerifyEmail } from "../services/api";

type Status = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<Status>(() =>
    token ? "verifying" : "error"
  );
  const [message, setMessage] = useState(() =>
    token ? "Verifying your email…" : "No verification token was found in this link."
  );

  const hasRun = useRef(false);

  useEffect(() => {
    if (!token) return;
    if (hasRun.current) return; // StrictMode runs effects twice in dev — only call once
    hasRun.current = true;

    apiVerifyEmail(token)
      .then((res) => {
        if (res.success) {
          setStatus("success");
          setMessage("Your email has been verified. You can now log in.");
        } else {
          setStatus("error");
          setMessage(res.message || "This verification link is invalid or has expired.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong while verifying your email.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
          <RiShoppingBag3Line size={28} />
        </div>

        {status === "verifying" && (
          <>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="bg-green-100 text-green-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiCheckLine size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification successful</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link
              to="/login"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              Go to login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <RiCloseLine size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Verification failed</h2>
            <p className="text-gray-500 text-sm mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all"
            >
              Back to register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}