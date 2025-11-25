import { 
  Bell, 
  Menu, 
  Search,
} from 'lucide-react';
import { useMenu } from '../../hooks/contexts';

interface Props {
  title: string;
}

export function Header({ title }: Props) {
  const { setIsMenuOpen } = useMenu();
  
  const onMenuClick = () => {
    setIsMenuOpen(true);
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-slate-800 capitalize">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
          <Search size={16} className="text-slate-400 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm w-48 text-slate-600 placeholder:text-slate-400"
          />
        </div>
        <button className="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
}
