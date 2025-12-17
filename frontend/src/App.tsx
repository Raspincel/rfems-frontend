import { useWailsEvents } from "./hooks/useWailsEvents";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useWailsEvents();

  return (
    <>
      <ToastContainer position="top-right" />
      <AppRoutes />
    </>
  );
}

export default App;
