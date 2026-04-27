import { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export function ToastContainer({ toasts }) {
  return createPortal(
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span>{t.icon}</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, icon: icons[type] }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  return { toasts, show };
}
