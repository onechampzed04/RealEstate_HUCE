import { Bell, Search } from "lucide-react";
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
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
          />
        </div>

        {/* Notification */}
        <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>

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
