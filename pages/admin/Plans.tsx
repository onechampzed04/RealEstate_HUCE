import {
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  UserPlus,
} from "lucide-react";
import { cn } from "../../lib/utils";

const plans = [
  { id: 1, name: "Free", price: "0đ", users: 1240, color: "bg-slate-100" },
  { id: 2, name: "Basic", price: "99.000đ", users: 850, color: "bg-blue-50" },
  {
    id: 3,
    name: "Premium",
    price: "299.000đ",
    users: 420,
    color: "bg-purple-50",
  },
];

const StatCard = ({
  label,
  value,
  trend,
  icon: Icon,
  trendUp,
}: {
  label: string;
  value: string;
  trend: string;
  icon: any;
  trendUp: boolean;
}) => (
  <div className="glass-card p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-xl text-indigo-600">
        <Icon size={24} />
      </div>
      <div
        className={cn(
          "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-lg",
          trendUp
            ? "text-emerald-600 bg-emerald-50"
            : "text-rose-600 bg-rose-50",
        )}
      >
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {trend}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{label}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default function Plans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="glass-card p-8 flex flex-col items-center text-center"
        >
          <div
            className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center text-indigo-600 mb-6",
              plan.color,
            )}
          >
            <CreditCard size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold text-indigo-600 mb-6">
            {plan.price}
          </p>
          <div className="w-full space-y-4 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Người dùng hiện tại</span>
              <span className="font-bold">{plan.users}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full"
                style={{ width: `${(plan.users / 2500) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="flex gap-3 w-full">
            <button className="flex-1 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              Chỉnh sửa
            </button>
            <button className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
              Chi tiết
            </button>
          </div>
        </div>
      ))}
      <button className="glass-card p-8 border-dashed border-2 flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all group">
        <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
          <UserPlus size={24} />
        </div>
        <span className="font-bold">Tạo gói mới</span>
      </button>
    </div>
  );
}
