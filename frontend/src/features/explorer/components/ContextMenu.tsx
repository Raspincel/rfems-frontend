import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";
import { ContextMenuData } from "../types";
import { requestFileDownloadThunk } from "../../transference";

interface Props {
  contextMenu: ContextMenuData | null;
  onCloseContextMenu: () => void;
}

const folderOptions = [
  { label: "Open folder", id: "open-folder", color: "gray" },
  { label: "Rename", id: "rename-folder", color: "gray" },
  { label: "Delete", id: "delete-folder", color: "red" },
] as const;

const fileOptions = [
  { label: "Download", id: "download-file", color: "gray" },
  { label: "Rename", id: "rename-file", color: "gray" },
  { label: "Delete", id: "delete-file", color: "red" },
] as const;

type action =
  | (typeof folderOptions)[number]["id"]
  | (typeof fileOptions)[number]["id"];
const assert = (_: never) => {
  throw new Error("Never arrives here");
};

export default function ContextMenu({
  contextMenu,
  onCloseContextMenu,
}: Props) {
  const currentPath = useAppSelector(selectCurrentPath);
  const dispatch = useAppDispatch();
  const menu = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElement = useRef<Element>(null);
  const options = contextMenu?.item.isDir ? folderOptions : fileOptions;

  useEffect(() => {
    if (!contextMenu) return;
    previouslyFocusedElement.current = document.activeElement;
  }, [contextMenu]);

  useEffect(() => {
    if (!contextMenu || !menu.current) return;
    menu.current.showModal();

    const rect = menu.current.getBoundingClientRect();
    const maxY = window.innerHeight;
    const maxX = window.innerWidth;

    let y = contextMenu.y;
    let x = contextMenu.x;

    if (contextMenu.y + rect.height > maxY) {
      y = y - rect.height;
    }

    if (contextMenu.x + rect.width > maxX) {
      x = x - rect.width;
    }

    menu.current.style.margin = `${y}px 0px 0px ${x}px`;
  }, [contextMenu, menu.current]);

  if (!contextMenu) return null;

  const handleOpenFolder = (folderName: string) => {
    const newPath = [...currentPath, folderName];
    dispatch(requestFilesListThunk({ path: newPath }));
  };

  const handleDownloadFile = (fileName: string) => {
    const path = [...currentPath, fileName];
    dispatch(requestFileDownloadThunk({ path }));
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "Tab") return;

    if (index !== 0 && index !== options.length - 1) return;
    if (index === 0 && !e.shiftKey) return;
    if (index === options.length - 1 && e.shiftKey) return;

    e.preventDefault();
    handleCloseMenu();
    (previouslyFocusedElement.current as HTMLButtonElement)!.focus();
  };

  const handleAction = (action: action) => {
    const actionId = action;
    switch (actionId) {
      case "open-folder":
        handleOpenFolder(contextMenu.item.name);
        break;
      case "delete-file":
        break;
      case "download-file":
        handleDownloadFile(contextMenu.item.name)
        break;
      case "rename-file":
        break;
      case "delete-folder":
        break;
      case "rename-folder":
        break;
      default:
        assert(actionId);
    }

    handleCloseMenu();
  };

  const handleCloseMenu = (e?: React.MouseEvent) => {
    e?.preventDefault();
    onCloseContextMenu();
    menu.current!.close();
  };

  return (
    <>
      <dialog
        className="fixed z-50 bg-white rounded-lg shadow-lg border py-1 min-w-[180px]"
        ref={menu}
        closedby="any"
        onClick={handleCloseMenu}
        onContextMenu={handleCloseMenu}
      >
        <>
          {options.map((option, index) => {
            return (
              <button
                key={option.id}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onClick={() => handleAction(option.id)}
                className={`w-full text-left px-4 py-2 hover:bg-gray-100
                    ${option.color === "red" ? "text-red-600" : "text-gray-700"}
                  `}
              >
                {option.label}
              </button>
            );
          })}
        </>
      </dialog>
    </>
  );
}
