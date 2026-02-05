import { Navigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children }) => {
  const [searchParams] = useSearchParams();

  const urlToken = searchParams.get("token");
  const cookieToken = Cookies.get("jwtToken");

  // Save token from URL → cookie (only once)
  useEffect(() => {
    if (urlToken && !cookieToken) {
      Cookies.set("jwtToken", urlToken, { expires: 7 });
    }
  }, [urlToken, cookieToken]);

  const token = urlToken || cookieToken;

  // Block access if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
