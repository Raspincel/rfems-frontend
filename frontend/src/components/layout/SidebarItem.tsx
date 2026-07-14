import { ChevronRight, LucideIcon } from "lucide-react";
import { useMenu } from "../../hooks/contexts";

interface Props {
  icon: LucideIcon;
  label: string;
  path: string;
  active: boolean;
  onClick: (path: string) => void;
  collapsed?: boolean;
}

export function SidebarItem({ icon: Icon, label, path, active, onClick, collapsed }: Props) {
  const { isMenuOpen } = useMenu();

  return (
    <button
    onClick={() => onClick(path)}
    title={!isMenuOpen ? label : undefined}
      className={`
        relative w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
        ${active 
          ? 'bg-blue-600 text-white shadow-md shadow-blue-200/20' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }
        ${!isMenuOpen && 'justify-center'}
      `}
    >
      <Icon size={20} className={`shrink-0 transition-colors duration-200 ${active ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
      {!collapsed && (
        <div className={`
          flex items-center flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out
          ${isMenuOpen 
            ? "w-full ml-3 opacity-100" 
            : "w-0 ml-0 opacity-0"
          }
        `}><span className="font-medium">{label}</span></div>
      )}
      {!collapsed && active && <ChevronRight size={16} className="ml-auto opacity-50" />}
    </button>
  );
};
