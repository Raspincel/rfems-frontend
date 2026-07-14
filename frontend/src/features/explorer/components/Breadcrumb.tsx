import { ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath, selectRootFolder } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";

export default function Breadcrumb() {
  const currentPath = useAppSelector(selectCurrentPath);
  const rootFolder = useAppSelector(selectRootFolder);
  const dispatch = useAppDispatch();

  const handleGoToRoot = () => {
    dispatch(requestFilesListThunk({ path: [] }));
  }

  const handleClickPathPart = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    dispatch(requestFilesListThunk({ path: newPath }));
  }

  const handleRootKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    dispatch(requestFilesListThunk({ path: [] }))
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    handleClickPathPart(index); 
  }

  return (
    <div className="flex items-center gap-1 ml-auto">
      <span className="text-sm text-gray-500">Path:</span>
      <div className="flex items-center gap-1">
        <button
          onClick={handleGoToRoot}
          onKeyDown={handleRootKeyDown}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          {rootFolder}
        </button>
        {currentPath.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            <button
              onKeyDown={(e) => handleKeyDown(e, index)}
              onClick={() => handleClickPathPart(index)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              {part}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
