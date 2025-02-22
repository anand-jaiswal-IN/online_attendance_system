// ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !allowedRoles.includes(user.userType)) {
    return <Navigate to="/auth/login" />;
  }

  return children;
};

export default ProtectedRoute;
