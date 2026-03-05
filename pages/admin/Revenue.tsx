import { ArrowUpRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useState, useEffect } from "react";
import adminApi from "../../lib/adminApi";

export default function Revenue() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPackage, setSelectedPackage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const params: any = { year: selectedYear };
      if (selectedPackage) {
        params.packageId = selectedPackage;
      }
      
      const [revRes, txRes, pkgRes] = await Promise.all([
        adminApi.get("/payments/revenue-stats", { params }),
        adminApi.get("/payments/recent"),
        adminApi.get("/packages/admin")
      ]);

      if (revRes.data.success) {
        setRevenueData(revRes.data.data);
      }
      if (txRes.data.success) {
        setRecentTransactions(txRes.data.data);
      }
      if (pkgRes.data.success) {
        setPackages(pkgRes.data.data);
      }
    } catch (err) {
      console.error("Lỗi tải thống kê", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [selectedYear, selectedPackage]);

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>Năm {year}</option>
          ))}
        </select>
        
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="">Tất cả các gói</option>
          {packages.map(pkg => (
            <option key={pkg._id} value={pkg._id}>{pkg.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Doanh thu theo tháng</h2>
            {loading && <div className="text-sm border-2 border-indigo-600 border-t-transparent w-4 h-4 rounded-full animate-spin"></div>}
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill="#4f46e5"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass-card p-6">
          <h2 className="text-lg font-bold mb-6">Giao dịch gần đây</h2>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Nâng cấp {tx.package?.name || "Gói"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(tx.createdAt).toLocaleDateString("vi-VN")} • #{tx.orderCode} - {tx.user?.name || "Khách"}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-slate-900">+{tx.amount.toLocaleString("vi-VN")}đ</span>
              </div>
            ))}
            {recentTransactions.length === 0 && !loading && (
              <p className="text-center text-slate-500 text-sm py-4">Chưa có giao dịch gần đây</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
