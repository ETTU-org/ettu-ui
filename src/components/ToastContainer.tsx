import { useEffect } from "react";
import { type Toast } from "../hooks/useToast";

interface ToastNotificationProps {
  toast: Toast;
  onClose: (id: string) => void;
}

function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-600 border-green-500 text-green-100";
      case "error":
        return "bg-red-600 border-red-500 text-red-100";
      case "warning":
        return "bg-yellow-600 border-yellow-500 text-yellow-100";
      case "info":
      default:
        return "bg-blue-600 border-blue-500 text-blue-100";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`${getToastStyles()} border rounded-lg p-4 shadow-lg min-w-96 animate-slide-in`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getIcon()}</span>
          <span className="font-medium">{toast.message}</span>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="text-xl leading-none hover:opacity-75"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onClose,
}: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}
