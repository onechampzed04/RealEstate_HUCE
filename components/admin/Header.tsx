import { useLocation } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function Header() {
  const location = useLocation();
  const { admin, token, loading } = useAdminAuth();

  console.log("Header - admin:", admin);
  console.log("Header - token:", token);
  console.log("Header - loading:", loading);

  // Lấy phần sau /admin/
  const currentPath = location.pathname.split("/")[2] || "dashboard";

  const titleMap: Record<string, string> = {
    dashboard: "Bảng điều khiển",
    users: "Quản lý người dùng",
    plans: "Quản lý gói dịch vụ",
    revenue: "Báo cáo doanh thu",
  };

  const title = titleMap[currentPath] || "Admin Panel";

  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-slate-500">Chào mừng trở lại, Admin!</p>
      </div>

      <div className="flex items-center gap-4">
        
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
          <img
            src="https://picsum.photos/seed/admin/100/100"
            alt="Avatar"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
