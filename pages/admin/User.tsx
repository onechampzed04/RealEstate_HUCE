import { Download, Filter, MoreVertical, UserPlus } from "lucide-react";
import { cn } from "../../lib/utils";
import React from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
const Users: React.FC = () => {
  const { getAllUsers } = useAdminAuth();
  const [users, setUsers] = React.useState<any[]>([]);
  const [pagination, setPagination] = React.useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 8,
  });
  
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers({ page: pagination.page });
        setUsers(res.data.users);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [pagination.page, getAllUsers]);
  
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
                key={user._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
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
                      user.isActive === true
                        ? "bg-emerald-50 text-emerald-600"
                        : user.isActive === false
                          ? "bg-slate-100 text-slate-500"
                          : "bg-amber-50 text-amber-600",
                    )}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.currentPackage?.package.name || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
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
        <span>
          Hiển thị{" "}
          {(pagination.page - 1) * pagination.limit + 1} -{" "}
          {Math.min(
            pagination.page * pagination.limit,
            pagination.total
          )}{" "}
          trong số {pagination.total} người dùng
        </span>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Trước
          </button>

          <button
            className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-slate-50"
            disabled={pagination.page === pagination.totalPages}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
};

export default Users;
