import { AlertTriangle } from "lucide-react";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
  danger = true,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${
            danger ? "bg-red-50" : "bg-blue-50"
          }`}
        >
          <AlertTriangle
            size={26}
            className={danger ? "text-red-500" : "text-blue-500"}
          />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-7">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Deleting..." : "Confirm"}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-xl font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
