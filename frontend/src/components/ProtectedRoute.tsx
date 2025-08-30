import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => localStorage.getItem("isAuthenticated") === "true";

export const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};
