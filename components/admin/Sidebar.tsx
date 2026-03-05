import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  LogOut,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import SidebarButton from "./SidebarButton";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function Sidebar() {
  const { logout } = useAdminAuth();
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-6 flex flex-col fixed h-full">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
          A
        </div>
        <span className="text-xl font-bold tracking-tight">AdminPro</span>
      </div>

      <nav className="space-y-2 flex-1">
        <SidebarItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
        <SidebarItem to="/admin/users" icon={Users} label="Người dùng" />
        <SidebarItem to="/admin/plans" icon={CreditCard} label="Gói dịch vụ" />
        <SidebarItem to="/admin/revenue" icon={BarChart3} label="Doanh thu" />
      </nav>

      <div className="pt-6 border-t border-slate-100 space-y-2">
        {/* <SidebarItem icon={Settings} label="Cài đặt" onClick={() => {}} /> */}
        <SidebarButton icon={LogOut} label="Đăng xuất" onClick={logout} />
      </div>
    </aside>
  );
}
