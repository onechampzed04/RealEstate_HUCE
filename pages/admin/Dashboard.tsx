import {
  Users,
  CreditCard,
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

// --- Mock Data ---
const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Apr", value: 2780 },
  { name: "May", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
];

const newUsers = [
  { id: 1, name: "Nguyễn Văn A", email: "vana@example.com" },
  { id: 2, name: "Trần Thị B", email: "thib@example.com" },
  { id: 3, name: "Lê Văn C", email: "vanc@example.com" },
  { id: 4, name: "Phạm Minh D", email: "minhd@example.com" },
];

// --- Stat Card Component ---
function StatCard({ label, value, trend, icon: Icon, trendUp }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-100 rounded-xl text-indigo-600">
          <Icon size={22} />
        </div>

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
      </div>

      <h3 className="text-slate-500 text-sm">{label}</h3>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Tổng người dùng"
          value="12,543"
          trend="+12.5%"
          icon={Users}
          trendUp={true}
        />
        <StatCard
          label="Doanh thu tháng"
          value="45.2M đ"
          trend="+8.2%"
          icon={BarChart3}
          trendUp={true}
        />
        <StatCard
          label="Gói Premium"
          value="1,240"
          trend="-2.4%"
          icon={CreditCard}
          trendUp={false}
        />
        <StatCard
          label="Tỷ lệ chuyển đổi"
          value="3.2%"
          trend="+0.5%"
          icon={ArrowUpRight}
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
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4f46e5"
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-bold mb-6">Người dùng mới</h2>

          <div className="space-y-4">
            {newUsers.map((user) => (
              <div key={user.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
                  {user.name[0]}
                </div>

                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
