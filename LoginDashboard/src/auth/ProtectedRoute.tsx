import { Navigate } from "react-router-dom";
import { UseAuth } from "./AuthContext";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = UseAuth();

  if (loading) {
    return <div>Checking authentication...</div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
