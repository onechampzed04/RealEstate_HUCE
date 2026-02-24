import { LayoutDashboard, Users, CreditCard, BarChart3 } from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-white p-6 fixed h-full">
      <div className="mb-10 font-bold text-xl">Admin</div>

      <nav className="space-y-2">
        <SidebarItem to="/admin" icon={LayoutDashboard} label="Tổng quan" />
        <SidebarItem to="/admin/users" icon={Users} label="Người dùng" />
        <SidebarItem to="/admin/plans" icon={CreditCard} label="Gói dịch vụ" />
        <SidebarItem to="/admin/revenue" icon={BarChart3} label="Doanh thu" />
      </nav>
    </aside>
  );
}
