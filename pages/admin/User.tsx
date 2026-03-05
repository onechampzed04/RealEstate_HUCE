import { Download, UserPlus } from "lucide-react";
import { cn } from "../../lib/utils";
import React, { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ActionMenu from "../../components/admin/ActionMenu";
import ViewUserModal, { UserInfo } from "../../components/admin/ViewUserModal";
import EditUserModal from "../../components/admin/EditUserModal";

const Users: React.FC = () => {
  const { getAllUsers, softDeleteUser, restoreUser, editUser: editUserApi } = useAdminAuth();
  const [viewUser, setViewUser] = useState<UserInfo | null>(null);
  const [editUser, setEditUser] = useState<UserInfo | null>(null);
  const [viewPackage, setViewPackage] = useState<any>(null);
  type SortField = "name" | "isActive" | "createdAt" | "package";
  type SortOrder = "asc" | "desc";

  interface SortItem {
    field: SortField;
    order: SortOrder;
  }

  const [sorts, setSorts] = useState<SortItem[]>([
    { field: "createdAt", order: "desc" }
  ]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = React.useState({
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 8,
  });
  
  const handleSave = async (
  userId: string,
  data: { name: string; email: string; phone: string }
) => {
  try {
    await editUserApi(userId, data);  // ← gọi API qua context

    // Cập nhật local list không cần refetch
    setUsers((prev) =>
      prev.map((u) => (u._id === userId ? { ...u, ...data } : u))
    );
  } catch (error) {
    console.error("Lỗi khi cập nhật user:", error);
    throw error; // ← quan trọng: throw để EditUserModal bắt được lỗi và hiện thông báo
  }
};

  const fetchUsers = async () => {
    try {
      const sortQuery: Record<SortField, SortOrder> = sorts.reduce(
        (acc, item) => {
          acc[item.field] = item.order;
          return acc;
        },
        {} as Record<SortField, SortOrder>
      );

      const res = await getAllUsers({
        page: pagination.page,
        search,
        sort: sortQuery
      });

      if (res?.data?.users) {
        setUsers(res.data.users);
      }

      if (res?.data?.pagination) {
        setPagination(res.data.pagination);
      }
    } catch (error) {
      console.error(error);
    }
  };
  React.useEffect(() => {
    fetchUsers();
  }, [pagination.page, search, sorts]);

  const SINGLE_SORT_FIELDS: SortField[] = ["name", "createdAt"];

  const handleSort = (field: SortField) => {
    setSorts(prev => {
      const isSingleField = SINGLE_SORT_FIELDS.includes(field);
      const existing = prev.find(s => s.field === field);

      // ====== Nếu là SINGLE SORT FIELD ======
      if (isSingleField) {
        if (!existing) {
          // chưa có → thay toàn bộ bằng field này
          return [{ field, order: "asc" }];
        }

        if (existing.order === "asc") {
          return [{ field, order: "desc" }];
        }

        // nếu đang desc → bỏ luôn
        return [];
      }

      // ====== Nếu là MULTI SORT FIELD ======
      // Nếu trước đó đang có single sort thì clear nó
      const filteredPrev = prev.filter(
        s => !SINGLE_SORT_FIELDS.includes(s.field)
      );

      const existingMulti = filteredPrev.find(s => s.field === field);

      if (!existingMulti) {
        return [...filteredPrev, { field, order: "asc" }];
      }

      if (existingMulti.order === "asc") {
        return filteredPrev.map(s =>
          s.field === field ? { ...s, order: "desc" } : s
        );
      }

      return filteredPrev.filter(s => s.field !== field);
    });

    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const renderSortIcon = (field: SortField) => {
    const index = sorts.findIndex(s => s.field === field);
    if (index === -1) {
      return <span className="ml-1 text-slate-300">↕</span>;
    }

    const order = sorts[index].order;

    return (
      <span className="ml-1 flex items-center gap-1">
        {order === "asc" ? "↑" : "↓"}
        <span className="text-[10px] text-slate-400">{index + 1}</span>
      </span>
    );
  };

  
  const handleExportExcel = async () => {
    try {
      // build sort giống như khi fetch
      const sortQuery: Record<SortField, SortOrder> = sorts.reduce(
        (acc, item) => {
          acc[item.field] = item.order;
          return acc;
        },
        {} as Record<SortField, SortOrder>
      );

      // gọi API lấy toàn bộ user
      const res = await getAllUsers({
        page: 1,
        limit: pagination.total || 10000, // fallback nếu total chưa có
        sort: sortQuery,
      });

      const allUsers = res?.data?.users || [];

      if (!allUsers.length) {
        alert("Không có dữ liệu để xuất");
        return;
      }

      // format lại dữ liệu cho đẹp
      const formattedData = allUsers.map((user: any, index: number) => ({
        STT: index + 1,
        "Tên người dùng": user.name,
        Email: user.email,
        "Trạng thái": user.isActive ? "Active" : "Inactive",
        "Gói đăng ký": user.currentPackage?.package?.name || "N/A",
        "Ngày tham gia": user.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "N/A",
      }));

      // tạo worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData);

      // tạo workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

      // tạo file excel
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(fileData, `users_${Date.now()}.xlsx`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Xuất file thất bại");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  const handleSoftDelete = async (id: string) => {
    console.log("Soft delete clicked", id);
    try {
      await softDeleteUser(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: false } : u
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestore = async (id: string) => {
    console.log("Restore clicked", id);
    try {
      await restoreUser(id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isActive: true } : u
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50"
            onClick={handleExportExcel}>
            <Download size={16} /> Xuất file
          </button>
          <input
            type="text"
            placeholder="Tìm tên, email, phone..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          <UserPlus size={16} /> Thêm người dùng
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50">
              <th
                onClick={() => handleSort("name")}
                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center">
                  Người dùng
                  {renderSortIcon("name")}
                </div>
              </th>

              <th
                onClick={() => handleSort("isActive")}
                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center">
                  Trạng thái
                  {renderSortIcon("isActive")}
                </div>
              </th>

              <th
                onClick={() => handleSort("package")}
                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center">
                  Gói đăng ký
                  {renderSortIcon("package")}
                </div>
              </th>

              <th
                onClick={() => handleSort("createdAt")}
                className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer select-none"
              >
                <div className="flex items-center">
                  Ngày tham gia
                  {renderSortIcon("createdAt")}
                </div>
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
                  <ActionMenu
                    user={user}
                    onDelete={handleSoftDelete}
                    onRestore={handleRestore}
                    handleOpenView={(u) => {
                      setViewUser(u);
                      setViewPackage(u.currentPackage ?? null);  // ← lưu package kèm theo
                    }}
                    handleOpenEdit={(u) => setEditUser(u)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        <ViewUserModal
          isOpen={!!viewUser}
          user={viewUser}
          userPackage={viewPackage}
          onClose={() => { setViewUser(null); setViewPackage(null); }}
        />
        <EditUserModal
          isOpen={!!editUser}
          user={editUser}
          onSave={handleSave}
          onClose={() => setEditUser(null)}
        />
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
