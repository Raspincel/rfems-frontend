import { FileIcon } from "lucide-react";
import { useAppSelector } from "../../../app/hooks";
import { selectFiles } from "../store/slices";
import { ContextMenuData } from "../types";

interface Props {
  onItemClick: (item: string) => void;
  selectedItem: string | null;
  onContextMenu: (
    e: React.MouseEvent,
    item: ContextMenuData['item']
  ) => void;
} 

const logBase1024 = (n: number) => {
  return Math.log(n) / Math.log(1024);
};

const formatFileSize = (bytes: number): string => {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];

  const bracketIndex = Math.floor(logBase1024(bytes));
  const sizeInCorrectBracket = bytes / Math.pow(k, bracketIndex);

  return sizeInCorrectBracket.toFixed(2) + " " + sizes[bracketIndex];
};

export default function FilesSection({ onContextMenu, onItemClick, selectedItem }: Props) {
  const files = useAppSelector(selectFiles);

  if (!files.length) null;

  const handleItemClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    onItemClick(name);
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Name
            </th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Size
            </th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr
              key={file.name}
              className={`border-t cursor-pointer ${
                selectedItem === file.name ? "bg-blue-50 hover:bg-blue-100" : ""
              }`}
              onClick={(e) => handleItemClick(e, file.name)}
              onContextMenu={(e) =>
                onContextMenu(e, { name: file.name, isDir: false })
              }
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <FileIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-900">{file.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">
                {formatFileSize(file.size)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
