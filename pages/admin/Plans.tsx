import { useState, useEffect } from "react";
import {
  CreditCard,
  UserPlus,
  X,
  Edit,
  PowerOff,
  Power,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import adminApi from "../../lib/adminApi";

export default function Plans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "STANDARD",
    description: "",
    price: 0,
    durationDays: 30,
    maxPostsPerDay: 5,
    maxTotalPosts: 50,
    priority: 0,
    allowHotPost: false,
    autoApprove: false,
  });

  const [displayPrice, setDisplayPrice] = useState("0");

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/packages/admin");
      if (res.data.success) {
        setPlans(res.data.data);
      }
    } catch (err) {
      alert("Lỗi tải danh sách gói cước.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = plans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(plans.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      type: "STANDARD",
      description: "",
      price: 0,
      durationDays: 30,
      maxPostsPerDay: 5,
      maxTotalPosts: 50,
      priority: 0,
      allowHotPost: false,
      autoApprove: false,
    });
    setDisplayPrice("0");
    setIsModalOpen(true);
  };

  const openEdit = (plan: any) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name || "",
      type: plan.type || "STANDARD",
      description: plan.description || "",
      price: plan.price || 0,
      durationDays: plan.durationDays || 30,
      maxPostsPerDay: plan.maxPostsPerDay || 0,
      maxTotalPosts: plan.maxTotalPosts || 0,
      priority: plan.priority || 0,
      allowHotPost: plan.allowHotPost || false,
      autoApprove: plan.autoApprove || false,
    });
    setDisplayPrice((plan.price || 0).toLocaleString("vi-VN"));
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setDisplayPrice("");
      setFormData(prev => ({ ...prev, price: 0 }));
      return;
    }
    const num = parseInt(value, 10);
    setDisplayPrice(num.toLocaleString("vi-VN"));
    setFormData(prev => ({ ...prev, price: num }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPlan) {
        const res = await adminApi.put(`/packages/${editingPlan._id}`, formData);
        if (res.data?.success) alert("Cập nhật thành công");
      } else {
        const res = await adminApi.post(`/packages`, formData);
        if (res.data?.success) alert("Thêm mới thành công");
      }
      setIsModalOpen(false);
      fetchPlans();
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggle = async (id: string) => {
    if (!window.confirm("Xác nhận thay đổi trạng thái gói cước?")) return;
    try {
      await adminApi.patch(`/packages/${id}/toggle`);
      fetchPlans();
    } catch (err) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Xác nhận xóa gói cước này? Hành động này không thể hoàn tác.")) return;
    try {
      await adminApi.delete(`/packages/${id}`);
      fetchPlans();
    } catch (err) {
      alert("Lỗi xóa gói cước");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quản lý Gói cước</h2>
          <p className="text-sm text-slate-500 mt-1">Danh sách các gói cước và dịch vụ trên hệ thống</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
        >
          <UserPlus size={18} />
          Tạo gói mới
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase text-xs font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tên gói</th>
                <th className="px-6 py-4">Giá</th>
                <th className="px-6 py-4">Thời hạn</th>
                <th className="px-6 py-4">Tin/Ngày</th>
                <th className="px-6 py-4 text-center">Nổi bật</th>
                <th className="px-6 py-4 text-center">Tự duyệt</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((plan) => (
                <tr key={plan._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        plan.isActive ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                      )}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{plan.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 max-w-[150px] truncate" title={plan.description}>
                          {plan.description || "Không có mô tả"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {plan.price.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {plan.durationDays} ngày
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {plan.maxPostsPerDay || "∞"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {plan.allowHotPost ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <XCircle size={18} className="text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      {plan.autoApprove ? (
                        <CheckCircle2 size={18} className="text-emerald-500" />
                      ) : (
                        <XCircle size={18} className="text-slate-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-medium rounded-full",
                      plan.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-600"
                    )}>
                      {plan.isActive ? "Hoạt động" : "Đã khóa"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggle(plan._id)}
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          plan.isActive
                            ? "text-rose-500 hover:bg-rose-50"
                            : "text-emerald-500 hover:bg-emerald-50"
                        )}
                        title={plan.isActive ? "Khoá gói" : "Mở gói"}
                      >
                        {plan.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                      <button
                        onClick={() => openEdit(plan)}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                        <CreditCard size={32} />
                      </div>
                      <p>Chưa có gói cước nào. Hãy tạo một gói mới.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Details */}
        {plans.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Hiển thị <span className="font-medium text-slate-900">{indexOfFirstItem + 1}</span> - <span className="font-medium text-slate-900">{Math.min(indexOfLastItem, plans.length)}</span> trong số <span className="font-medium text-slate-900">{plans.length}</span> gói cước
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-colors border",
                    currentPage === idx + 1
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal is kept exactly the same form to ensure form fields are valid */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800">
                {editingPlan ? "Chỉnh sửa Gói Cước" : "Tạo Gói Mới"}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-6">
              <form id="plan-form" onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tên gói <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      placeholder="vd: Gói Tiêu Chuẩn"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Loại gói <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="type"
                        required
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none uppercase"
                      >
                        <option value="FREE">Free</option>
                        <option value="BASIC">Basic</option>
                        <option value="STANDARD">Standard</option>
                        <option value="PREMIUM">Premium</option>
                        <option value="VIP">VIP</option>
                        <option value="PRO">Pro</option>
                        <option value="ENTERPRISE">Enterprise</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400">
                        <ChevronRight className="rotate-90" size={16} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Giá tiền (VNĐ) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="price"
                        required
                        value={displayPrice}
                        onChange={handlePriceChange}
                        className="w-full pl-4 pr-12 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-medium">
                        đ
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Thời hạn sử dụng <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="durationDays"
                        required
                        min={1}
                        value={formData.durationDays}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-16 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-slate-400 font-medium">
                        ngày
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Giới hạn tin / ngày
                    </label>
                    <input
                      type="number"
                      name="maxPostsPerDay"
                      min={0}
                      value={formData.maxPostsPerDay}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Tổng tin tối đa
                    </label>
                    <input
                      type="number"
                      name="maxTotalPosts"
                      min={0}
                      value={formData.maxTotalPosts}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Độ ưu tiên hiển thị
                    </label>
                    <input
                      type="number"
                      name="priority"
                      min={0}
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mô tả gói cước
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400 resize-none"
                    placeholder="Mô tả các quyền lợi của gói cước..."
                  ></textarea>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="allowHotPost"
                        checked={formData.allowHotPost}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Cho phép đăng tin Nổi bật</span>
                      <p className="text-xs text-slate-500 mt-0.5">Xếp hạng tin cao hơn</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        name="autoApprove"
                        checked={formData.autoApprove}
                        onChange={handleInputChange}
                        className="peer sr-only"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">Duyệt tự động</span>
                      <p className="text-xs text-slate-500 mt-0.5">Tin đăng tự lên ngay</p>
                    </div>
                  </label>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 mt-auto">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors focus:ring-4 focus:ring-slate-100"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                form="plan-form"
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all focus:ring-4 focus:ring-indigo-100"
              >
                {editingPlan ? "Lưu thay đổi" : "Tạo gói"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
