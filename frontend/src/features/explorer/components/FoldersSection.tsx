import { Folder } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCurrentPath,
  selectFolders,
  selectLoadingStatus,
} from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";
import { ContextMenuData } from "../types";

interface Props {
  onItemClick: (e: React.SyntheticEvent, item: string) => void;
  selectedItem: string | null;
  onContextMenu: (e: React.SyntheticEvent, item: ContextMenuData["item"]) => void;
}

export default function FoldersSection({
  onItemClick,
  selectedItem,
  onContextMenu,
}: Props) {
  const isLoading = useAppSelector(selectLoadingStatus);
  const folders = useAppSelector(selectFolders);
  const currentPath = useAppSelector(selectCurrentPath);
  const dispatch = useAppDispatch();

  if (folders.length === 0 || isLoading) return null;

  const handleFolderDoubleClick = (e: React.MouseEvent, folderName: string) => {
    e.stopPropagation();
    const newPath = [...currentPath, folderName];
    dispatch(requestFilesListThunk({ path: newPath }));
  };

  const handleFolderClick = (e: React.MouseEvent, name: string) => {
    onItemClick(e, name);
  };

  const handleKeyDown = (e: React.KeyboardEvent, name: string) => {
    if (e.key !== "Enter" && e.key !== " ") return;

    const newPath = [...currentPath, name];
    dispatch(requestFilesListThunk({ path: newPath }));
  }

  const handleContextMenu = (e: React.MouseEvent, name: string) => {
    onContextMenu(e, { name: name, isDir: true })
  }

  const handleFocus = (e: React.FocusEvent, name: string) => {
    onItemClick(e, name)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {folders.map((folder) => (
        <button
          key={folder.name}
          className={`relative border rounded-lg p-4 transition-colors cursor-pointer ${
            selectedItem === folder.name
              ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
              : "border-gray-200"
          }`}
          onClick={(e) => handleFolderClick(e, folder.name)}
          onFocusCapture={(e) => handleFocus(e, folder.name)}
          onKeyDown={(e) => handleKeyDown(e, folder.name)}
          onDoubleClick={(e) => handleFolderDoubleClick(e, folder.name)}
          onContextMenu={(e) => handleContextMenu(e, folder.name)}
        >
          <div className="flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-500" />
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {folder.name}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
