import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";
import { ContextMenuData } from "../types"

interface Props {
  contextMenu: ContextMenuData | null;
  setContextMenu: (data: ContextMenuData | null) => void;
}
export default function ContextMenu({ contextMenu, setContextMenu }: Props) {
  const currentPath = useAppSelector(selectCurrentPath);
  const dispatch = useAppDispatch();

  if (!contextMenu) return null;

    
  const handleOpenFolder = (folderName: string) => {
    const newPath = [...currentPath, folderName];
    dispatch(requestFilesListThunk({ path: newPath }));
  };

  return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu(null)}
        />
        <div
          className="fixed z-50 bg-white rounded-lg shadow-lg border py-1 min-w-[180px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
        >
          {contextMenu.item.isDir ? (
            <>
              <button
                onClick={() => handleOpenFolder(contextMenu.item.name)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Open folder
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Rename
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Download
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                Rename
              </button>
              <button
                onClick={() => setContextMenu(null)}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </>
  )
}