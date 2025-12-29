import { ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";

export default function Breadcrumb() {
  const currentPath = useAppSelector(selectCurrentPath);
  const dispatch = useAppDispatch();

  const handleGoToRoot = () => {
    dispatch(requestFilesListThunk({ path: [] }));
  }

  const handleClickPathPart = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    dispatch(requestFilesListThunk({ path: newPath }));
  }

  return (
    <div className="flex items-center gap-1 ml-auto">
      <span className="text-sm text-gray-500">Path:</span>
      <div className="flex items-center gap-1">
        <span
          onClick={handleGoToRoot}
          className="text-sm text-blue-600 hover:underline cursor-pointer"
        >
          /
        </span>
        {currentPath.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-gray-400" />
            <span
              onClick={() => handleClickPathPart(index)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              {part}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
