import { Folder, FolderOpen } from "lucide-react";
import { pickFolder } from '../api'

interface Props {
  onFolderSelect: (folderPath: string) => void;
  selectedFolder: string | null;
}

export default function PickFolder({ onFolderSelect, selectedFolder }: Props) {

  const handleChooseFolder = async () => {
    const folderPath = await pickFolder();
    
    if (folderPath.success) {
      onFolderSelect(folderPath.data.path);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Select Folder to Host
      </label>
      <div className="flex gap-3">
        <button
          onClick={handleChooseFolder}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
        >
          <Folder className="w-5 h-5" />
          Choose Folder
        </button>
        {selectedFolder && (
          <div className="flex-1 flex items-center px-4 py-2 bg-blue-50 text-blue-900 rounded-lg border border-blue-200">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            <span className="truncate">{selectedFolder}</span>
          </div>
        )}
      </div>
    </div>
  );
}
