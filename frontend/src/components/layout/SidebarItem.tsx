import { ChevronRight, LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  onClick: (path: string) => void;
  collapsed?: boolean;
}

export function SidebarItem({ icon: Icon, label, path, active, onClick, collapsed }: Props) {
  return (
    <button
      onClick={() => onClick(path)}
      className={`
        w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
      `}
    >
      <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      {!collapsed && active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
};
