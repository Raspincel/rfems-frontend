import {
  LucideIcon,
  Home,
  Settings,
  User,
  LogOut,
  BarChart2,
  Bell,
  Menu,
} from "lucide-react";
import { SidebarItem } from "./SidebarItem";
import { useNavigate } from "react-router-dom";
import { useMenu } from "../../hooks/contexts";
import { Modal } from "../ui/Modal";
import { useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import { logoutThunk } from "../../features/auth";

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
    { icon: Home, label: "Dashboard", path: "" },
    { icon: User, label: "Access Files", path: "access-files" },
    { icon: BarChart2, label: "Host folder", path: "host-folder" },
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
        ${isMenuOpen ? "w-full" : "w-[60px]"}
        `}
    >
      {children}
    </aside>
  );
}

function LogoArea() {
  const { setIsMenuOpen, isMenuOpen } = useMenu();

  return (
    <div className="h-16 relative flex items-center px-4 border-b border-slate-100 overflow-hidden shrink-0">
      <span className={`
        transition-all ease-in-out flex items-center whitespace-nowrap
        ${isMenuOpen ? "opacity-100 w-full duration-300 delay-100" : "opacity-0 w-0 duration-100 pointer-events-none" }
      `}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-sm">
          <span className="text-white font-bold text-lg">R</span>
        </div>
        <span className="text-xl font-bold text-slate-800 tracking-tight">
          RFEMS
        </span>
      </span>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="ml-auto text-slate-400 hover:text-slate-600"
      >
        <Menu size={20} />
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
  const { isMenuOpen, closeIfOpenOnMobile } = useMenu();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto py-6 px-2 space-y-1">
      <div className={`
        text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-4
        transition-all duration-300 ease-in-out overflow-hidden whitespace-nowrap
        ${isMenuOpen ? "opacity-100 w-auto" : "opacity-0 w-0"}
      `}>
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
            navigate(`/dashboard/${path}`);
            closeIfOpenOnMobile();
          }}
        />
      ))}
    </div>
  );
}

function Footer() {
  const { isMenuOpen } = useMenu();

  return (
    <div className="shrink-0 p-4 border-t border-slate-100 flex items-center overflow-hidden">
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden text-slate-500 shrink-0">
        <User size={16} />
      </div>
      <div
        className={`
          flex items-center justify-between flex-1 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out
          ${isMenuOpen 
            ? "w-full ml-3 opacity-100"
            : "w-0 ml-0 opacity-0"
          }
        `}
      >
        <div className="flex-1 text-left">
          <p className="text-sm font-medium text-slate-700">John Doe</p>
          <p className="text-xs text-slate-400">View Profile</p>
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}

function LogoutButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const onLogout = () => {
    dispatch(logoutThunk());
    closeModal();
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
        <div>
          <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
          <p className="mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300"
            >
              Cancel
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
      <span
        className="p-2 rounded-full hover:bg-slate-100 cursor-pointer"
        onClick={openModal}
      >
        <LogOut size={16} className="text-slate-400 hover:text-slate-600" />
      </span>
    </>
  );
}
