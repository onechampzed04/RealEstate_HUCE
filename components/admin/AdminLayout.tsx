import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Header />
        <Outlet /> {/* 👈 Router sẽ render page con ở đây */}
      </main>
    </div>
  );
}
