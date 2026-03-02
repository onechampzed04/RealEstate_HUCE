import { Routes, Route, BrowserRouter } from "react-router-dom";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Users from "./pages/admin/User";
import Plans from "./pages/admin/Plans";
import Revenue from "./pages/admin/Revenue";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import ListingsPage from "./pages/ListingsPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import ValuationPage from "./pages/ValuationPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SubmitPropertyPage from "./pages/SubmitPropertyPage";
import NotFoundPage from "./pages/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import AdminPrivateRoute from "./pages/admin/AdminPrivateRoute";
import { AdminAuthProvider } from "./context/AdminAuthContext";

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/listings" element={<ListingsPage />} />
              <Route path="/listings/:id" element={<PropertyDetailPage />} />
              <Route path="/valuation" element={<ValuationPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/submit-property"
                element={
                  <PrivateRoute>
                    <SubmitPropertyPage />
                  </PrivateRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <AdminPrivateRoute>
                  <AdminLayout />
                </AdminPrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="plans" element={<Plans />} />
              <Route path="revenue" element={<Revenue />} />
            </Route>
            <Route path="admin/login" element={<AdminLoginPage />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
