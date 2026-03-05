export default function SidebarButton({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="
        flex items-center w-full gap-3 px-4 py-3 
        rounded-xl transition-all duration-200
        text-slate-500 hover:bg-slate-100 hover:text-slate-900
      "
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
}
