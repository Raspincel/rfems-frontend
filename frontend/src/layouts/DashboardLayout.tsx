import { ReactNode, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchUserThunk, selectProfileStatus } from "../features/user";

interface Props {
  children: ReactNode;
  currentRoute: string;
  onClick?: (e: React.MouseEvent) => void
}

export function DashboardLayout({ children, currentRoute, onClick }: Props) {
  const dispatch = useAppDispatch();
  const profileStatus = useAppSelector(selectProfileStatus);
  
  useEffect(() => {
    if (profileStatus !== "idle") return
    dispatch(fetchUserThunk());
  }, [profileStatus])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans" onClick={onClick}>
      <Sidebar currentRoute={currentRoute} />

      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
