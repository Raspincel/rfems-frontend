import { ChevronDown, ChevronUp, File, Loader2 } from "lucide-react";
import { useAppSelector } from "../../../app/hooks";
import { selectActiveTransferencesCount, selectTransferences } from "../store/slices";

export interface Props {
  isOpen: boolean;
  toggleHeader: () => void;
}
export default function TransferencesHeader({ isOpen, toggleHeader }: Props) {
  const activeCount = useAppSelector(selectActiveTransferencesCount)
  const transferences = useAppSelector(selectTransferences)
  
  return (
    <div
      onClick={toggleHeader}
      className="bg-gray-50 hover:bg-gray-100 cursor-pointer p-3 flex items-center justify-between border-b border-gray-200 h-14 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
          {activeCount > 0 ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <File size={18} />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 text-sm">Transfers</h3>
          <p className="text-xs text-gray-500">
            {activeCount > 0
              ? `${activeCount} in progress`
              : `${transferences.length} items history`}
          </p>
        </div>
      </div>

      <button
        className="text-gray-400 hover:text-gray-700 transition-colors p-1"
        aria-label="Open transferences list"
      >
        {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>
    </div>
  );
}
