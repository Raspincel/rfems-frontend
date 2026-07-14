import { Globe, Lock } from "lucide-react";

interface Props {
  onChange: (isPublic: boolean) => void;
  isPublic: boolean;
}

export default function PickVisibility({ onChange, isPublic }: Props) {
  return (
    <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">Visibility</label>
    <div className="grid grid-cols-2 gap-4">
      <button
        onClick={() => onChange(true)}
        className={`p-4 rounded-lg border-2 transition-all ${
          isPublic
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isPublic ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Globe className={`w-6 h-6 ${isPublic ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Public</h3>
            <p className="text-sm text-gray-600">Anyone can access</p>
          </div>
        </div>
      </button>

      <button
        onClick={() => onChange(false)}
        className={`p-4 rounded-lg border-2 transition-all ${
          !isPublic
            ? 'border-blue-600 bg-blue-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${!isPublic ? 'bg-blue-100' : 'bg-gray-100'}`}>
            <Lock className={`w-6 h-6 ${!isPublic ? 'text-blue-600' : 'text-gray-600'}`} />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Private</h3>
            <p className="text-sm text-gray-600">Approval required</p>
          </div>
        </div>
      </button>
    </div>
  </div>

  )
}