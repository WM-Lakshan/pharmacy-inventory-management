import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ roles, children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.role;

    if (roles && !roles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
