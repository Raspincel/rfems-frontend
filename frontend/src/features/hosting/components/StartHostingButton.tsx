import { Activity } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { startHostingThunk } from "../store/thunks";

interface Props {
  selectedFolder: string | null;
  isPublic: boolean;
}

export default function StartHostingButton({ selectedFolder, isPublic }: Props) {
  const dispatch = useAppDispatch();

  const handleStartHosting = () => {
    if (!selectedFolder) return;
    dispatch(
      startHostingThunk({
        folderPath: selectedFolder,
        isPublic,
      })
    );
  }

  return (
    <div className="pt-4">
      <button
        onClick={handleStartHosting}
        disabled={!selectedFolder}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
          selectedFolder
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <Activity className="w-5 h-5" />
        Start Hosting
      </button>
    </div>
  );
}
