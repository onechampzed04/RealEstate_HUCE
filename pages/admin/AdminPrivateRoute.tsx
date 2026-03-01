import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminPrivateRoute({ children }: any) {
  const { admin, token, loading } = useAdminAuth();
  console.log("AdminPrivateRoute - admin:", admin);
  console.log("AdminPrivateRoute - token:", token);
  console.log("AdminPrivateRoute - loading:", loading);

  if (loading) return null;

  if (!token || !admin || admin.role !== "ADMIN") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
