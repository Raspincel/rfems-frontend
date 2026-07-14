import { AlertCircle, CheckCircle2, Download, Upload } from "lucide-react";
import { useAppSelector } from "../../../app/hooks";
import { selectTransferences } from "../store/slices";

const getFileName = (path: string) =>
  path.split(/[/\\]/).pop() || "Unknown File";

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "error":
      return "text-red-500";
    case "requesting":
      return "text-yellow-500";
    default:
      return "text-blue-500";
  }
};

export default function TransferencesList() {
  const transferences = useAppSelector(selectTransferences)

  return (
    <ul className="divide-y divide-gray-100">
      {transferences.map((item) => {
        const isDownload = item.type === "download";
        const fileName = getFileName(
          isDownload ? item.origin : item.destination
        );

        return (
          <li
            key={item.id}
            className="p-4 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 ${isDownload ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}
              >
                {isDownload ? <Download size={18} /> : <Upload size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p
                    className="text-sm font-medium text-gray-800 truncate pr-2"
                    title={fileName}
                  >
                    {fileName}
                  </p>
                  <span
                    className={`text-xs capitalize font-semibold select-none ${getStatusColor(item.status)}`}
                  >
                    {item.status === "completed" && <CheckCircle2 size={14} />}
                    {item.status === "error" && <AlertCircle size={14} />}
                    {item.status === "requesting" && "..."}
                    {item.status === "progress" && `${(item.progress * 100 / item.totalBytes).toFixed(2)}%`}
                  </span>
                </div>

                {/* Path Info */}
                <p className="text-[10px] text-gray-400 truncate mb-2">
                  {isDownload
                    ? `From: ${item.origin}`
                    : `To: ${item.destination}`}
                </p>

                {/* Progress Bar */}
                {item.status !== "error" && (
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        item.status === "completed"
                          ? "bg-green-500"
                          : item.type === "download"
                            ? "bg-blue-500"
                            : "bg-purple-500"
                      }`}
                      style={{
                        width: `${item.status === "completed" ? 100 : Math.max(5, item.progress / item.totalBytes)}%`,
                      }}
                    />
                  </div>
                )}

                {item.error && (
                  <p className="text-xs text-red-500 mt-1">{item.error}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
