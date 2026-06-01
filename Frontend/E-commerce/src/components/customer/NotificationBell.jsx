import { useState, useRef, useEffect } from 'react';
import { Badge, Button } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNotifications } from '../../context/NotificationContext';

const typeColors = {
  ORDER_CONFIRMED: 'bg-green-50 border-green-200',
  ORDER_CANCELLED: 'bg-red-50 border-red-200',
  PAYMENT_FAILED:  'bg-orange-50 border-orange-200',
  TICKET_REPLY:    'bg-blue-50 border-blue-200',
};

const typeIcons = {
  ORDER_CONFIRMED: '✅',
  ORDER_CANCELLED: '❌',
  PAYMENT_FAILED:  '⚠️',
  TICKET_REPLY:    '💬',
};

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });
  };

  return (
    <div className="relative" ref={ref}>
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <button
          onClick={() => {
            const isOpening = !open;
            setOpen(prev => !prev);
            if (isOpening) fetchNotifications();
          }}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <BellOutlined style={{ fontSize: 20 }} />
        </button>
      </Badge>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <span className="font-semibold text-gray-800">Thông báo</span>
            {unreadCount > 0 && (
              <Button type="link" size="small" icon={<CheckOutlined />}
                onClick={markAllAsRead} className="text-xs p-0">
                Đọc tất cả
              </Button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <BellOutlined style={{ fontSize: 32 }} />
                <p className="mt-2 text-sm">Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markAsRead(n.id)}
                  className={`flex gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${!n.isRead ? 'bg-blue-50/40' : ''}`}
                >
                  <span className="text-xl flex-shrink-0 mt-0.5">
                    {typeIcons[n.type] ?? '🔔'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                      {n.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                  </div>
                  {!n.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
