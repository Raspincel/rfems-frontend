import { useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { useAppSelector } from "../app/hooks";
import { selectIsConnectedToHost } from "../features/explorer";
import { useNavigate } from "react-router-dom";

export function ExploreFolderPage() {
  const isConnectedToHost = useAppSelector(selectIsConnectedToHost);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isConnectedToHost) {
      navigate("/dashboard/access-files");
    }
  }, [isConnectedToHost]);

  return (
    <DashboardLayout currentRoute="explore-folder">
      <h1>Hello world</h1>
    </DashboardLayout>
  )
}