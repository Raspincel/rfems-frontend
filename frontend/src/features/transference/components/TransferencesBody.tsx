import { File } from "lucide-react";
import { useAppSelector } from "../../../app/hooks";
import { selectTransferences } from "../store/slices";
import TransferencesList from "./TransferencesList";

interface Props {
  isOpen: boolean;
}

export default function TransferencesBody({ isOpen }: Props) {
  const transferences = useAppSelector(selectTransferences);

  return (
    <div
      className={`overflow-y-auto transition-all duration-300 ease-in-out 
      ${isOpen ? "h-[calc(80vh-3.5rem)]" : "h-0"}`}
    >
      {transferences.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
          <File size={48} className="mb-2 opacity-20" />
          <span className="text-sm">No recent transfers</span>
        </div>
      ) : (
        <TransferencesList />
      )}
    </div>
  );
}
