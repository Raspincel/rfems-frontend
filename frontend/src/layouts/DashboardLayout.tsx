import { ReactNode, useEffect } from "react";
import { Sidebar } from "../components/layout/Sidebar";
import { Header } from "../components/layout/Header";
import { useAppDispatch } from "../app/hooks";
import { fetchUserThunk } from "../features/user";

interface Props {
  children: ReactNode;
  currentRoute: string;
}

export function DashboardLayout({ children, currentRoute }: Props) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUserThunk());
  }, [])

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
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
