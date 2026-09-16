import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // Check tab-isolated sessionStorage first
  let token = sessionStorage.getItem("token");
  let role = sessionStorage.getItem("role");

  // If this tab doesn't have an active session yet, check if there is a saved session for the requested role
  if (!token && allowedRoles && allowedRoles.length > 0) {
    for (const r of allowedRoles) {
      const savedToken = localStorage.getItem(`token_${r}`);
      if (savedToken) {
        token = savedToken;
        role = r;
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("role", role);
        const savedUser = localStorage.getItem(`user_${r}`);
        if (savedUser) sessionStorage.setItem("user", savedUser);
        break;
      }
    }
  }

  // Fallback to legacy un-scoped storage if present
  if (!token) {
    token = localStorage.getItem("token");
    role = localStorage.getItem("role");
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (role === "team") return <Navigate to="/team/dashboard" replace />;
    return <Navigate to="/user/browse" replace />;
  }

  return children;
}

export default ProtectedRoute;
