import { CheckCircle, XCircle, Info, X } from "lucide-react";
import useToastStore from "../../store/toastStore";

const icons = {
  success: <CheckCircle size={18} className="text-green-500 flex-shrink-0" />,
  error: <XCircle size={18} className="text-red-500 flex-shrink-0" />,
  info: <Info size={18} className="text-blue-500 flex-shrink-0" />,
};

export default function Toaster() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 bg-white shadow-2xl border border-gray-100 rounded-2xl px-5 py-4 min-w-[300px] max-w-sm pointer-events-auto"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          {icons[toast.type] || icons.info}
          <span className="flex-1 text-sm font-medium text-gray-800">
            {toast.message}
          </span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-300 hover:text-gray-500 transition ml-2 flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
