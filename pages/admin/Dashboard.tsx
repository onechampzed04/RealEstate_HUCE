import {
  Users,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useState, useEffect } from "react";
import adminApi from "../../lib/adminApi";

function StatCard({ label, value, trend, icon: Icon, trendUp }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-100 rounded-xl text-indigo-600">
          <Icon size={22} />
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg ${
              trendUp
                ? "text-emerald-600 bg-emerald-50"
                : "text-rose-600 bg-rose-50"
            }`}
          >
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>

      <h3 className="text-slate-500 text-sm">{label}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const year = new Date().getFullYear();
      
      const [revRes, usersRes] = await Promise.all([
        adminApi.get(`/payments/revenue-stats?year=${year}`),
        adminApi.get("/users?limit=5&sort[createdAt]=desc")
      ]);

      if (revRes.data.success) {
        const revData = revRes.data.data;
        setRevenueData(revData);
        const currMonthIndex = new Date().getMonth();
        setMonthlyRevenue(revData[currMonthIndex]?.value || 0);
      }
      if (usersRes?.data) {
        if (usersRes.data.users) {
          setRecentUsers(usersRes.data.users.slice(0, 5));
        }
        if (usersRes.data.pagination) {
          setTotalUsers(usersRes.data.pagination.total || 0);
        } else if (usersRes.data.users) {
          setTotalUsers(usersRes.data.users.length);
        }
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu dashboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          label="Tổng người dùng"
          value={totalUsers.toLocaleString("vi-VN")}
          trend=""
          icon={Users}
          trendUp={true}
        />
        <StatCard
          label="Doanh thu tháng này"
          value={monthlyRevenue.toLocaleString("vi-VN") + " đ"}
          trend=""
          icon={BarChart3}
          trendUp={true}
        />
      </div>

      {/* Chart + New Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-6">Biểu đồ doanh thu</h2>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                   tickFormatter={(val) => {
                     if (val >= 1000000) return (val / 1000000) + 'M';
                     if (val >= 1000) return (val / 1000) + 'K';
                     return val;
                   }} 
                />
                <Tooltip 
                  formatter={(value: any) => [value?.toLocaleString("vi-VN") + " đ", "Doanh thu"]}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="url(#colorValue)"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#4f46e5", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-6">Người dùng mới</h2>

          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user._id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {user.name?.[0] || 'U'}
                </div>

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && !loading && (
              <p className="text-sm text-slate-500 text-center py-4">Chưa có người dùng mới</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
