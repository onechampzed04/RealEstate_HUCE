import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function SidebarItem({ icon: Icon, label, to }: any) {
  return (
    <NavLink
      to={to}
      end={to === "/admin"} // để /admin không active khi ở /admin/users
      className={({ isActive }) =>
        cn(
          "flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all duration-200",
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            : "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        )
      }
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}
