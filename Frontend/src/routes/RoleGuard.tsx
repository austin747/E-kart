import { Navigate } from "react-router-dom";
import { type ReactNode } from "react";
import { useAuth } from "../constant/useAuth";

interface Props {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: Props) {
  const { user, loading } = useAuth();

  // Must wait for context to settle — if loading, ProtectedRoute (parent)
  // already returns null so this never renders. Belt-and-suspenders guard.
  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}