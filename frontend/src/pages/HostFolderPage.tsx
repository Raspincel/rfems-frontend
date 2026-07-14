import { useState } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import {
  HostingDashboard,
  HowItWorks,
  PickFolder,
  PickVisibility,
  selectIsHosting,
  StartHostingButton,
} from "../features/hosting";
import { useAppSelector } from "../app/hooks";

export function HostFolderPage() {
  const isHosting = useAppSelector(selectIsHosting);

  const [selectedFolder, setSelectedFolder] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  if (isHosting) {
    return <HostingDashboard />;
  }


  return (
    <DashboardLayout currentRoute="host-folder">
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Host a Folder
          </h1>
          <p className="text-gray-600">
            Share files and folders with others by hosting them on your device
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <PickFolder
            onFolderSelect={setSelectedFolder}
            selectedFolder={selectedFolder}
          />
          <PickVisibility onChange={setIsPublic} isPublic={isPublic} />
          <StartHostingButton
            selectedFolder={selectedFolder}
            isPublic={isPublic}
          />
        </div>

        <HowItWorks />
      </div>
    </DashboardLayout>
  );
}
