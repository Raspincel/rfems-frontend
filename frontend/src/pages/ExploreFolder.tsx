import { useEffect, useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  requestFilesListThunk,
  selectIsConnectedToHost,
  selectLoadingStatus,
  FoldersSection,
  ContextMenuData,
  FilesSection,
  ContextMenu,
  ExplorerHeader,
} from "../features/explorer";
import { useNavigate } from "react-router-dom";
import {
  File as FileIcon,
  FolderOpen,
  Loader2,
} from "lucide-react";

export function ExploreFolderPage() {
  const isConnectedToHost = useAppSelector(selectIsConnectedToHost);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectLoadingStatus);

  const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    if (!isConnectedToHost) {
      navigate("/dashboard/access-files");
    }
  }, [isConnectedToHost, navigate]);

  useEffect(() => {
    dispatch(requestFilesListThunk({ path: [] }));
  }, [dispatch]);

  const handleContextMenu = (
    e: React.MouseEvent,
    item: ContextMenuData["item"]
  ) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      item,
    });
  };

  const handleItemClick = (name: string) => {
    setSelectedItem(name);
  };

  if (isLoading) {
    return (
      <DashboardLayout currentRoute="explore-folder">
        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-gray-600">Loading folder contents...</p>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentRoute="explore-folder">
      <ExplorerHeader />

      <div className="relative min-h-[400px]">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Folders
          </h2>

          <FoldersSection
            handleItemClick={handleItemClick}
            selectedItem={selectedItem}
            handleContextMenu={handleContextMenu}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileIcon className="w-5 h-5" />
            Files
          </h2>

          <FilesSection
            handleItemClick={handleItemClick}
            selectedItem={selectedItem}
            handleContextMenu={handleContextMenu}
          />
        </div>
      </div>

      <ContextMenu contextMenu={contextMenu} setContextMenu={setContextMenu} />
    </DashboardLayout>
  );
}
