// components/modals/EditUserModal.tsx
import React, { useEffect, useState } from "react";
import type { UserInfo } from "./ViewUserModal";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserInfo | null;
  onSave: (userId: string, data: { name: string; email: string; phone: string }) => Promise<void>;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Sync form khi user thay đổi
  useEffect(() => {
    if (user) {
      setForm({ name: user.name, email: user.email, phone: user.phone || "" });
      setErrors({});
      setSuccessMsg("");
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  // ── Validate ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Tên không được để trống";
    if (!form.email.trim()) {
      errs.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email không hợp lệ";
    }
    if (form.phone && !/^[0-9+\- ]{7,15}$/.test(form.phone)) {
      errs.phone = "Số điện thoại không hợp lệ";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave(user._id, form);
      setSuccessMsg("Cập nhật thành công!");
      setTimeout(() => {
        setSuccessMsg("");
        onClose();
      }, 1200);
    } catch (err: any) {
      setErrors({ email: err?.message || "Có lỗi xảy ra, thử lại sau." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
  let value = e.target.value;

  if (field === "phone") {
    value = value.replace(/[^0-9]/g, ""); 
    if (value.length > 10) return; 
  }

  setForm((prev) => ({ ...prev, [field]: value }));
  if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
};
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold text-lg tracking-tight">
              Chỉnh sửa người dùng
            </h2>
            <p className="text-blue-200 text-xs mt-0.5">ID: {user._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Success banner */}
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <span>✓</span> {successMsg}
            </div>
          )}

          {/* Name */}
          <Field
            label="Họ và tên"
            required
            error={errors.name}
          >
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Nguyễn Văn A"
              className={inputCls(!!errors.name)}
            />
          </Field>

          {/* Email */}
          <Field
            label="Email"
            required
            error={errors.email}
          >
            <input
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              placeholder="example@email.com"
              className={inputCls(!!errors.email)}
            />
          </Field>

          {/* Phone */}
          <Field
            label="Số điện thoại"
            error={errors.phone}
            hint="Không bắt buộc"
          >
            <input
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="0901 234 567"
              className={inputCls(!!errors.phone)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-medium transition-colors disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors disabled:opacity-60 flex items-center gap-2 min-w-[90px] justify-center"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              "Lưu thay đổi"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const inputCls = (hasError: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-300 ${
    hasError
      ? "border-red-300 bg-red-50 focus:border-red-400"
      : "border-slate-200 bg-slate-50 focus:border-blue-400 focus:bg-white"
  }`;

const Field: React.FC<{
  label: string;
  children: React.ReactNode;
  error?: string;
  hint?: string;
  required?: boolean;
}> = ({ label, children, error, hint, required }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-slate-600">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export default EditUserModal;