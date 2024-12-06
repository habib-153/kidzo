import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();

  // Root path redirect
  if (location.pathname === "/") {
    return <Navigate to="/shop/home" />;
  }

  // Auth pages handling (login/register)
  if (location.pathname.includes("/auth/")) {
    if (isAuthenticated) {
      return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} />;
    }
    return children;
  }

  // Admin routes protection
  if (location.pathname.includes("/admin")) {
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" />;
    }
    if (user?.role !== "admin") {
      return <Navigate to="/unauth-page" />;
    }
    return children;
  }

  // Shopping routes - accessible to all, but with user-specific features
  if (location.pathname.includes("/shop")) {
    return children;
  }

  return children;
}

CheckAuth.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    role: PropTypes.string,
  }),
  children: PropTypes.node,
};

export default CheckAuth;