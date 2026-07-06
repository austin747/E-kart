import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../constant/useAuth";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { user, token, loading } = useAuth();

  // Wait for AuthContext to finish resolving user from token
  // Without this, logout causes a double-redirect race between
  // ProtectedRoute (/login) and RoleGuard (/) firing on stale state
  if (loading) return null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}