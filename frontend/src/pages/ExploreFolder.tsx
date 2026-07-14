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
  ExitButton,
  selectNumberOfFiles,
  selectNumberOfFolders,
} from "../features/explorer";
import { useNavigate } from "react-router-dom";
import { File as FileIcon, FolderOpen, FolderX, Loader2 } from "lucide-react";
import { Transferences } from "../features/transference";

export function ExploreFolderPage() {
  const isConnectedToHost = useAppSelector(selectIsConnectedToHost);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectLoadingStatus);

  const [contextMenu, setContextMenu] = useState<ContextMenuData | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const numberOfFiles = useAppSelector(selectNumberOfFiles);
  const numberOfFolders = useAppSelector(selectNumberOfFolders);

  useEffect(() => {
    if (!isConnectedToHost) {
      navigate("/dashboard/access-files");
    }
  }, [isConnectedToHost, navigate]);

  useEffect(() => {
    dispatch(requestFilesListThunk({ path: [] }));
  }, [dispatch]);

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

  const handleContextMenu = (
    e: React.SyntheticEvent,
    item: ContextMenuData["item"] | null
  ) => {
    e.stopPropagation();
    e.preventDefault();

    if (!item) {
      setSelectedItem(null);
      return;
    }

    if (selectedItem !== item.name) {
      setSelectedItem(item.name);
    }

    if (e.type === "contextmenu") {
      const event = e as unknown as React.MouseEvent;
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        item,
      });
      return;
    }

    if (e.type === "keydown") {
      const target = e.target as HTMLElement;
      const rect = target.getBoundingClientRect();
      const x = rect.x + rect.width / 6;
      const y = rect.y + rect.height / 2;
      setContextMenu({ x, y, item });
    }
  };

  const handleItemClick = (e: React.SyntheticEvent, name: string) => {
    e.stopPropagation();
    setSelectedItem(name);

    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const handleBackgroundClick = () => {
    if (!selectedItem || contextMenu) return;
    setSelectedItem(null);
  };

  const showFolders = numberOfFolders > 0;
  const showFiles = numberOfFiles > 0;

  return (
    <DashboardLayout
      currentRoute="explore-folder"
      onClick={handleBackgroundClick}
    >
      <div className="flex flex-col gap-2">
        <ExitButton />
        <ExplorerHeader />
      </div>

      <Transferences />

      {showFolders || showFiles ? (
        <div className="relative min-h-[400px] select-none mb-16">
          {showFolders && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Folders
              </h2>

              <FoldersSection
                onItemClick={handleItemClick}
                selectedItem={selectedItem}
                onContextMenu={handleContextMenu}
              />
            </div>
          )}

          {showFiles && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileIcon className="w-5 h-5" />
                Files
              </h2>

              <FilesSection
                onItemClick={handleItemClick}
                selectedItem={selectedItem}
                onContextMenu={handleContextMenu}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="relative min-h-[200px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FolderX className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                No Files or Folders
              </h3>
              <p className="text-gray-600">
                This folder is empty. There are no files or folders to display.
              </p>
            </div>
          </div>
        </div>
      )}

      <ContextMenu
        contextMenu={contextMenu}
        onCloseContextMenu={() => setContextMenu(null)}
      />
    </DashboardLayout>
  );
}
