import React, { useEffect, useRef, useState } from "react";
import { Eye, Pencil, Trash2, RotateCcw} from "lucide-react";

interface Props {
  user: any;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
    handleOpenView: (user: any) => void;
    handleOpenEdit: (user: any) => void;
}

const ActionMenu: React.FC<Props> = ({ user, onDelete, onRestore, handleOpenView, handleOpenEdit }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">

          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-50"
            onClick={() => {
              handleOpenView(user);
              setOpen(false);
            }}
          >
            <Eye size={16} />
            View
          </button>

          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-50"
            onClick={() => {
              handleOpenEdit(user);
              setOpen(false);
            }}
          >
            <Pencil size={16} />
            Edit
          </button>

          <div className="border-t border-slate-100" />

          {user.isActive ? (
            <button
              onClick={() => {
                onDelete(user._id);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <Trash2 size={16} />
              Soft Delete
            </button>
          ) : (
            <button
              onClick={() => {
                onRestore(user._id);
                setOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50"
            >
              <RotateCcw size={16} />
              Restore User
            </button>
          )}

        </div>
      )}
    </div>
  );
};

export default ActionMenu;