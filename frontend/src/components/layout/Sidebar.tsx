import {
  LucideIcon,
  Home,
  Settings,
  User,
  X,
  LogOut,
  BarChart2,
  Bell,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../hooks/contexts";

interface Props {
  currentRoute: string;
}

interface NavItemConfig {
  icon: LucideIcon;
  label: string;
  path: string;
}

export function Sidebar({ currentRoute }: Props) {
  const navItems: NavItemConfig[] = [
    { icon: Home, label: "Dashboard", path: "dashboard" },
    { icon: BarChart2, label: "Analytics", path: "analytics" },
    { icon: User, label: "Profile", path: "profile" },
    { icon: Bell, label: "Notifications", path: "notifications" },
    { icon: Settings, label: "Settings", path: "settings" },
  ];

  return (
    <>
      <MobileOverlay />
      <SidebarContainer>
        <LogoArea />
        <NavItems currentRoute={currentRoute} navItems={navItems} />
        <Footer />
      </SidebarContainer>
    </>
  );
}

function MobileOverlay() {
  const { setIsMenuOpen, shouldShowOverlay } = useMenu();

  if (!shouldShowOverlay) return null;

  return (
    <div
      className="fixed inset-0 z-20 bg-black/50 transition-opacity"
      onClick={() => setIsMenuOpen(false)}
    />
  );
}

function SidebarContainer({ children }: { children: React.ReactNode }) {
  const { isMenuOpen } = useMenu();
  
  return (
    <aside
      className={`
        relative inset-y-0 z-30 w-64 
        bg-white border-r border-slate-200 
        flex flex-col transition-[width] duration-300 ease-in-out
        overflow-hidden max-w-[300px]
        ${isMenuOpen ? "w-full" : "w-0"}
        `}
    >
      {children}
    </aside>
  );
}

function LogoArea() {
  const { setIsMenuOpen } = useMenu();

  return (
    <div className="h-16 flex items-center px-6 border-b border-slate-100">
      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
        <span className="text-white font-bold text-lg">A</span>
      </div>
      <span className="text-xl font-bold text-slate-800 tracking-tight">
        AppLayout
      </span>

      <button
        onClick={() => setIsMenuOpen(false)}
        className="ml-auto p-1 text-slate-400 hover:text-slate-600"
      >
        <X size={20} />
      </button>
    </div>
  );
}

function NavItems({
  navItems,
  currentRoute,
}: {
  navItems: NavItemConfig[];
  currentRoute: string;
}) {
  const { setIsMenuOpen } = useMenu();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
        Menu
      </div>
      {navItems.map((item) => (
        <SidebarItem
          key={item.path}
          icon={item.icon}
          label={item.label}
          path={item.path}
          active={currentRoute === item.path}
          onClick={(path) => {
            navigate(path);
            setIsMenuOpen(false); // Close mobile menu on click
          }}
        />
      ))}
    </div>
  );
}

function Footer() {
  return (
    <div className="p-4 border-t border-slate-100">
      <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-slate-50 transition-colors">
        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
          <User size={16} className="text-slate-500" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-slate-700">John Doe</p>
          <p className="text-xs text-slate-400">View Profile</p>
        </div>
        <LogOut size={16} className="text-slate-400" />
      </button>
    </div>
  );
}
