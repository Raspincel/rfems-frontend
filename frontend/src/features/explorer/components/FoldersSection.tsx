import {
  Folder,
  MoreVertical,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath, selectFolders, selectLoadingStatus } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";
import { ContextMenuData } from "../types";

interface Props {
  onItemClick: (item: string) => void;
  selectedItem: string | null;
  onContextMenu: (
    e: React.MouseEvent,
    item: ContextMenuData['item']
  ) => void;
} 

export default function FoldersSection({ onItemClick, selectedItem, onContextMenu }: Props) {
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
    e.stopPropagation();
    onItemClick(name);
  }

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {folders.map((folder) => (
          <div
            key={folder.name}
            className={`relative group border rounded-lg p-4 transition-colors cursor-pointer ${
              selectedItem === folder.name
                ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                : "border-gray-200"
            }`}
            onClick={(e) => handleFolderClick(e, folder.name)}
            onDoubleClick={(e) => handleFolderDoubleClick(e, folder.name)}
            onContextMenu={(e) =>
              onContextMenu(e, { name: folder.name, isDir: true })
            }
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Folder className="w-8 h-8 text-blue-500" />
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {folder.name}
                  </p>
                </div>
              </div>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onContextMenu(e, {
                    name: folder.name,
                    isDir: true,
                  });
                }}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => handleFolderDoubleClick(e, folder.name)}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                title="Open folder"
              >
                Open
              </button>
            </div>
          </div>
        ))}
      </div>
  )
}