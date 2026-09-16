import React from "react";
import { Navigate } from "react-router-dom";

function AdminLogin() {
  return <Navigate to="/login" replace />;
}

export default AdminLogin;
