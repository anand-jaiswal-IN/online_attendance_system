// PublicRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ isAuthenticated, redirectPath = "/", children }) => {
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default PublicRoute;
