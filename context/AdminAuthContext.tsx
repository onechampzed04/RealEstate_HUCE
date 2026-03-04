import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import adminApi from "../lib/adminApi";

interface Admin {
  _id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
}

interface AdminAuthType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getAllUsers: (params?: GetUsersParams) => Promise<any>;
}

const AdminAuthContext = createContext<AdminAuthType | null>(null);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("admin_accessToken"),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await adminApi.get("/users/profile");
        console.log("Admin profile response:", res.data); // ✅ Debug log
        setAdmin(res.data.data);
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadAdmin();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await adminApi.post("/users/login", {
      email,
      password,
    });
    console.log("Admin login response:", res.data); // ✅ Debug log

    const { user, accessToken } = res.data.data;
    console.log("Admin user data:", user);
    console.log("Admin access token:", accessToken); // ✅ Debug log

    if (user.role !== "ADMIN") {
      throw new Error("Not admin");
    }

    localStorage.setItem("admin_accessToken", accessToken);
    console.log(
      "Admin token stored in localStorage:",
      localStorage.getItem("admin_accessToken"),
    ); // ✅ Debug log

    setToken(accessToken);
    setAdmin(user);
  };

  const logout = () => {
    localStorage.removeItem("admin_accessToken");
    setToken(null);
    setAdmin(null);
  };

  const getAllUsers = async (params?: GetUsersParams) => {
    return adminApi.get("/admin/users", { params });
  };
  
  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, login, logout, getAllUsers }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return context;
};
