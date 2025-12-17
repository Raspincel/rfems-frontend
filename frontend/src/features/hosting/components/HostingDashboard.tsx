import {
  AlertCircle,
  Check,
  Download,
  Folder,
  FolderOpen,
  Globe,
  Lock,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { DashboardLayout } from "../../../layouts/DashboardLayout";
import { stopHostingThunk } from "../store/thunks";
import { selectFolderPath, selectIsPublic, selectActiveUsers, selectPendingUsers } from "../store/slice";

export default function HostingDashboard() {
  const dispatch = useAppDispatch();
  const folderPath = useAppSelector(selectFolderPath);
  const isPublic = useAppSelector(selectIsPublic);
  const activeUsers = useAppSelector(selectActiveUsers);
  const pendingUsers = useAppSelector(selectPendingUsers);
  
  const handleStopHosting = () => {
    dispatch(stopHostingThunk());
  };

  const handleApprove = (userId: string) => {};

  const handleReject = (userId: string) => {};

  return (
    <DashboardLayout currentRoute="host-folder">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hosting Folder</h1>
            <p className="text-gray-600 mt-1">Managing active folder sharing</p>
          </div>
          <button
            onClick={handleStopHosting}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            Stop Hosting
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Folder className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-gray-900">
                  {folderPath}
                </h3>
                {isPublic ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    <Globe className="w-3 h-3" />
                    Public
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                    <Lock className="w-3 h-3" />
                    Private
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {activeUsers.length} active users • {pendingUsers.length}{" "}
                pending approval
              </p>
            </div>
          </div>
        </div>

        {pendingUsers.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 bg-orange-50 border-b border-orange-100">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h2 className="font-semibold text-gray-900">
                  Pending Approval
                </h2>
                <span className="ml-auto text-sm text-gray-600">
                  {pendingUsers.length} users
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {pendingUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      Requested {user.requestedAt}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(user.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-700" />
              <h2 className="font-semibold text-gray-900">Active Users</h2>
              <span className="ml-auto text-sm text-gray-600">
                {activeUsers.length} connected
              </span>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {activeUsers.map((user) => (
              <div key={user.id} className="px-6 py-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FolderOpen className="w-4 h-4" />
                        {user.currentFolder}
                      </div>
                    </div>
                  </div>
                </div>
                {user.action && (
                  <div className="mt-3 ml-13 bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      {user.action.type === "downloading" ? (
                        <Download className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Upload className="w-4 h-4 text-green-600" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {user.action.type === "downloading"
                          ? "Downloading"
                          : "Uploading"}
                        : {user.action.file}
                      </span>
                    </div>
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-full ${
                          user.action.type === "downloading"
                            ? "bg-blue-600"
                            : "bg-green-600"
                        }`}
                        style={{ width: `${user.action.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1 text-right">
                      {user.action.progress}%
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
