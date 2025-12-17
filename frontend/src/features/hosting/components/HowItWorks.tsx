import { AlertCircle } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
      <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
        <AlertCircle className="w-5 h-5" />
        How it works
      </h3>
      <ul className="space-y-2 text-sm text-blue-800">
        <li>• Choose a folder from your device to share with others</li>
        <li>
          • Select whether to make it publicly accessible or require approval
          for each user
        </li>
        <li>
          • Monitor active users, their activities, and manage access requests
          in real-time
        </li>
        <li>• Stop hosting at any time to revoke all access</li>
      </ul>
    </div>
  );
}
