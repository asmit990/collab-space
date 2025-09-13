import { Navigate, Outlet } from "react-router-dom";

// Fake auth check – replace with your real logic
const useAuth = () => {
  const token = localStorage.getItem("authToken"); // or check context/state
  return !!token;
};

export const Protected = () => {
  const isAuth = useAuth();

  if (!isAuth) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};

export default Protected;