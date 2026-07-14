import { ChevronLeft, Home } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCurrentPath } from "../store/slices";
import { requestFilesListThunk } from "../store/thunks";

export default function HeaderNavigation() {
  const currentPath = useAppSelector(selectCurrentPath);
  const dispatch = useAppDispatch();

  const handleGoBack = () => {
    if (!currentPath) return;

    const pathParts = currentPath.slice();
    pathParts.pop();
    dispatch(requestFilesListThunk({ path: pathParts }));
  };

  const handleGoToRoot = () => {
    dispatch(requestFilesListThunk({ path: [] }));
  };

  return (
    <>
      <button
        onClick={handleGoToRoot}
        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
        title="Go to root"
      >
        <Home size={16} />
        <span>Root</span>
      </button>

      <button
        onClick={handleGoBack}
        disabled={!currentPath}
        className={`flex items-center gap-1 text-sm ${
          !currentPath
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-blue-600"
        }`}
        title="Go back"
      >
        <ChevronLeft size={16} />
        Back
      </button>
    </>
  );
}
