// PrivateRoute.jsx
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // Route logic (no UI here, so responsive is not needed)
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
}
