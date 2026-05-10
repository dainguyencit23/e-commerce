import { App } from 'antd';

export function useToast() {
  const { message } = App.useApp();

  const show = (msg, type = 'info') => {
    const validTypes = { success: 'success', error: 'error', info: 'info', warning: 'warning' };
    const t = validTypes[type] || 'info';
    message[t](msg);
  };

  return { toasts: [], show };
}

export function ToastContainer() { return null; }
