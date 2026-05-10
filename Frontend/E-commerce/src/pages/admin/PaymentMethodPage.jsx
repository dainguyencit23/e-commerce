import { useState } from 'react';
import { Card, Switch, Tag } from 'antd';
import { paymentMethods as initMethods } from '../../data/mockData';

export default function PaymentMethodPage() {
  const [methods, setMethods] = useState(initMethods);

  const toggle = (id) => setMethods(l => l.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m));

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-500">Quản lý các phương thức thanh toán hiển thị cho khách hàng.</p>
      <div className="flex flex-col gap-3">
        {methods.map(m => (
          <Card key={m.id} size="small">
            <div className="flex items-center gap-4">
              <span className="text-3xl flex-shrink-0">{m.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{m.name}</p>
                <p className="text-sm text-gray-500">{m.description}</p>
              </div>
              <div className="flex items-center gap-3">
                <Tag color={m.enabled ? 'green' : 'default'}>{m.enabled ? 'Đang hoạt động' : 'Tắt'}</Tag>
                <Switch checked={m.enabled} onChange={() => toggle(m.id)} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
