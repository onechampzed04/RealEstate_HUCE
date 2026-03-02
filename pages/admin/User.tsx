import { Download, Filter, MoreVertical, UserPlus } from "lucide-react";
import { cn } from "../../lib/utils";

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    status: "Active",
    plan: "Premium",
    joined: "2024-01-15",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@example.com",
    status: "Inactive",
    plan: "Free",
    joined: "2024-02-10",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "vanc@example.com",
    status: "Active",
    plan: "Basic",
    joined: "2024-02-20",
  },
  {
    id: 4,
    name: "Phạm Minh D",
    email: "minhd@example.com",
    status: "Active",
    plan: "Premium",
    joined: "2024-03-01",
  },
  {
    id: 5,
    name: "Hoàng Anh E",
    email: "anhe@example.com",
    status: "Pending",
    plan: "Basic",
    joined: "2024-03-05",
  },
];

export default function Users() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Filter size={16} /> Bộ lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50">
            <Download size={16} /> Xuất file
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <UserPlus size={16} /> Thêm người dùng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Gói đăng ký
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Ngày tham gia
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                      {user.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-lg text-xs font-medium",
                      user.status === "Active"
                        ? "bg-emerald-50 text-emerald-600"
                        : user.status === "Inactive"
                          ? "bg-slate-100 text-slate-500"
                          : "bg-amber-50 text-amber-600",
                    )}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.plan}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.joined}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
        <span>Hiển thị 1-5 trong số 1,240 người dùng</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">
            Trước
          </button>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50">
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
