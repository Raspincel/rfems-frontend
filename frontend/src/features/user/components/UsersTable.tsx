import { useAppSelector } from "../../../app/hooks";
import { Loader } from "../../../components/common/Loader";
import { selectUsers, selectUsersStatus } from "../store/slice";
import { BasicUserInfos } from "../types";

export function UsersTable() {
  const users = useAppSelector(selectUsers);
  const usersStatus = useAppSelector(selectUsersStatus);

  if (usersStatus !== "succeeded") {
    return <Loader />;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Username
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Last Active
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Shared Folder
              </th>
              <th className="px-6 py-4 font-semibold text-gray-700">
                Visibility
              </th>
              <th className="px-6 py-4 font-semibold text-center text-gray-700">
                Active transferences
              </th>
              <th className="px-6 py-4 font-semibold text-right text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr
                key={user.name}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {user.name}
                </td>

                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>

                <td className="px-6 py-4 text-gray-600">
                  {formatDate(user.lastActiveAt, user.status)}
                </td>

                <td className="px-6 py-4 text-gray-600">
                  {user.folderBeingHosted ? (
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100 font-mono">
                        {user.folderBeingHosted}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">None</span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {user.status === "hosting" ? (
                    <span className="font-semibold text-gray-700">
                      {user.isPublic ? "Public" : "Private"}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                
                <td className="px-6 py-4 text-center">
                  {user.status === "hosting" ? (
                    <span className="font-semibold text-gray-700">
                      {user.activeTransfers ?? 0}
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  { user.status === "hosting" ? <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white transition-all bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 hover:shadow-md focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 active:scale-95">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-3.5 h-3.5 opacity-90"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v1H2V6z"
                        clipRule="evenodd"
                      />
                      <path d="M2.5 12a.5.5 0 01.5-.5h10a.5.5 0 01.5.5c0 .5-.5 1-.5 1H3a.5.5 0 01-.5-.5z" />
                      <path d="M2 15a2 2 0 002 2h12a2 2 0 002-2V9H2v6z" />
                    </svg>
                    Browse Files
                  </button>
                  : <span className="text-gray-300">-</span>  
                }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="p-8 text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
}

const formatDate = (dateString: string | undefined, status: string) => {
  if (status === "online" || status === "hosting")
    return <span className="text-green-600 font-medium">Active Now</span>;

  if (!dateString) return <span className="text-gray-400">-</span>;

  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: BasicUserInfos["status"]) => {
  const styles = {
    online: "bg-green-100 text-green-800 border-green-200",
    offline: "bg-red-100 text-red-800 border-red-200",
    hosting: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.offline}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
