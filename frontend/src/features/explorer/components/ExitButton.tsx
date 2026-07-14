import { useAppDispatch } from "../../../app/hooks";
import { Button } from "../../../components/ui/Button";
import { exitHostingSessionThunk } from "../store/thunks";

export default function ExitButton() {
  const dispatch = useAppDispatch();

  const handleExit = () => {
    dispatch(exitHostingSessionThunk());
  };

  return (
    <Button
      ariaLabel="Exit hosting session"
      label="Exit"
      onClick={handleExit}
      maxWidth="sm"
      theme="danger"
    />
  );
}
