import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/Authcontext";

const ProtectedRoute = ({ roles, children }) => {
  const location = useLocation();
  const { user } = useContext(AuthContext);

if (!user) {
  sessionStorage.setItem(
    "postLoginRedirect",
    location.pathname + location.search
  );

  return <Navigate to="/" replace />;
}

  // ✅ FIXED ROLE FORMAT
  const userRole = user.role?.replace("ROLE_", "").toLowerCase();

  // Admin full access
  if (userRole === "admin") return children;

  // Role check
  if (roles && !roles.map(r => r.toLowerCase()).includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default ProtectedRoute;