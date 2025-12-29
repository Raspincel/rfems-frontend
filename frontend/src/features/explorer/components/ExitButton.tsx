import { useAppDispatch } from "../../../app/hooks";
import { exitHostingSessionThunk } from "../store/thunks";

export default function ExitButton() {
  const dispatch = useAppDispatch();

  const handleExit = () => {
    dispatch(exitHostingSessionThunk());  
  };

  return (
    <button
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 max-w-32"
      onClick={handleExit}
      aria-label="Exit application"
    >
      Exit
    </button>
  );
}
