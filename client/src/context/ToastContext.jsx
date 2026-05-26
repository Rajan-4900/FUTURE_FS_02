import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);

  const value = { success, error, info, warning };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 rounded-xl border p-4 shadow-lg backdrop-blur-md animate-in ${
              toast.type === 'success'
                ? 'bg-white/95 border-emerald-100 text-slate-800'
                : toast.type === 'error'
                ? 'bg-white/95 border-rose-100 text-slate-800'
                : toast.type === 'warning'
                ? 'bg-white/95 border-amber-100 text-slate-800'
                : 'bg-white/95 border-blue-100 text-slate-800'
            }`}
          >
            <div className="flex gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />}
              {toast.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />}
              {toast.type === 'warning' && <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />}
              {toast.type === 'info' && <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />}
              <span className="text-sm font-medium leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 rounded-lg p-1 hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Close notification"
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
