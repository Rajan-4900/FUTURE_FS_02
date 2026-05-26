import { createContext, useContext, useState } from 'react';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />,
  error: <AlertCircle size={18} className="text-red-600 shrink-0" />,
  info: <Info size={18} className="text-blue-600 shrink-0" />,
  warning: <AlertTriangle size={18} className="text-amber-600 shrink-0" />,
};

const TOAST_STYLES = {
  success: 'border-emerald-100 bg-emerald-50/95 text-emerald-900',
  error: 'border-red-100 bg-red-50/95 text-red-900',
  info: 'border-blue-100 bg-blue-50/95 text-blue-900',
  warning: 'border-amber-100 bg-amber-50/95 text-amber-900',
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md animate-slide-in ${TOAST_STYLES[t.type]}`}
            role="alert"
          >
            <div className="flex gap-2.5 items-start">
              {TOAST_ICONS[t.type]}
              <p className="text-sm font-medium leading-relaxed">{t.message}</p>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100/50 hover:text-slate-700 transition-colors shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
