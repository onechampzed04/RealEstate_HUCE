// components/modals/ViewUserModal.tsx
import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface PackageInfo {
  name: string;
  type: "BASIC" | "PREMIUM";
  description?: string;
  maxPostsPerDay: number;
  price: number;
  durationDays: number;
  allowHotPost: boolean;
  autoApprove: boolean;
}

export interface UserPackageInfo {
  _id: string;
  package: PackageInfo;
  startDate: string;
  endDate: string;
  remainingPosts: number;
  postsToday: number;
  lastPostDate?: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "USER" | "ADMIN";
  isActive: boolean;
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ViewUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  userPackage?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const daysLeft = (end: string) =>
  Math.max(0, Math.ceil((new Date(end).getTime() - Date.now()) / 86_400_000));

const fmtPrice = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// ─── Component ────────────────────────────────────────────────────────────────
const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onClose,
  user,
  userPackage,
}) => {
  if (!isOpen || !user) return null;

  const pkg = userPackage?.package;
  const isPremium = pkg?.type === "PREMIUM";

  const statusColor: Record<string, string> = {
    ACTIVE: "bg-emerald-100 text-emerald-700",
    EXPIRED: "bg-red-100 text-red-600",
    CANCELLED: "bg-gray-100 text-gray-500",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-[fadeUp_0.22s_ease]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-5 flex items-center justify-between">
          <h2 className="text-white font-semibold text-lg tracking-tight">
            Chi tiết người dùng
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Avatar + basic */}
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-slate-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-400 ring-2 ring-slate-200">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-semibold text-slate-800 text-lg">{user.name}</p>
              <p className="text-slate-500 text-sm">{user.email}</p>
              <div className="flex gap-2 mt-1.5 flex-wrap">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    user.role === "ADMIN"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.isActive ? "Hoạt động" : "Đã khoá"}
                </span>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "ID", value: user._id },
              { label: "Số điện thoại", value: user.phone || "—" },
              { label: "Ngày tạo", value: fmtDate(user.createdAt) },
              { label: "Cập nhật lần cuối", value: fmtDate(user.updatedAt) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-50 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-slate-700 truncate" title={value}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Package */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
              Gói dịch vụ
            </p>

            {pkg && userPackage ? (
              <div
                className={`rounded-xl border-2 p-4 space-y-3 ${
                  isPremium
                    ? "border-amber-300 bg-amber-50"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-slate-800">
                      {pkg.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isPremium
                          ? "bg-amber-200 text-amber-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {pkg.type}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                      statusColor[userPackage.status]
                    }`}
                  >
                    {userPackage.status}
                  </span>
                </div>

                {pkg.description && (
                  <p className="text-xs text-slate-500">{pkg.description}</p>
                )}

                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Bắt đầu", value: fmtDate(userPackage.startDate) },
                    {
                      label: "Kết thúc",
                      value: `${fmtDate(userPackage.endDate)} · còn ${daysLeft(userPackage.endDate)} ngày`,
                    },
                    { label: "Bài còn lại", value: `${userPackage.remainingPosts} bài` },
                    {
                      label: "Đăng hôm nay",
                      value: `${userPackage.postsToday} / ${pkg.maxPostsPerDay}`,
                    },
                    { label: "Giá gói", value: fmtPrice(pkg.price) },
                    { label: "Thời hạn gói", value: `${pkg.durationDays} ngày` },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="font-medium text-slate-700">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap pt-1">
                  <FeatureTag active={pkg.allowHotPost} label="Hot Post" />
                  <FeatureTag active={pkg.autoApprove} label="Auto Approve" />
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
                <p className="text-slate-400 text-sm">Chưa đăng ký gói nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureTag = ({ active, label }: { active: boolean; label: string }) => (
  <span
    className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
      active
        ? "bg-emerald-100 text-emerald-700"
        : "bg-slate-100 text-slate-400 line-through"
    }`}
  >
    {label}
  </span>
);

export default ViewUserModal;