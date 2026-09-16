import React from "react";
import { Navigate } from "react-router-dom";

function UserDashboard() {
  return <Navigate to="/user/browse" replace />;
}

export default UserDashboard;
