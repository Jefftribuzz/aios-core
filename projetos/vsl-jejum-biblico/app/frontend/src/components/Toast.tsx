import { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const toasts = new Map<string, Toast>();

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = 'toast-' + Date.now();
    const toast = { id, message, type };
    
    toasts.set(id, toast);
    setToastList(Array.from(toasts.values()));

    setTimeout(() => {
      toasts.delete(id);
      setToastList(Array.from(toasts.values()));
    }, duration);
  };

  const success = (message: string) => addToast(message, 'success');
  const error = (message: string) => addToast(message, 'error', 5000);
  const info = (message: string) => addToast(message, 'info');

  return { addToast, success, error, info, toasts: toastList };
}

interface ToastContainerProps {
  toasts: Toast[];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  const typeStyles = {
    success: 'bg-green-500',
    error: 'bg-accent',
    info: 'bg-primary',
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${typeStyles[toast.type]} text-white px-4 py-3 rounded-lg shadow-lg max-w-sm animate-bounce`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
