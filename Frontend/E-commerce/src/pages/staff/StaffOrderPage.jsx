import { useState } from 'react';
import { Table, Tag, Button, Modal, Tabs, Space } from 'antd';
import { orders as initOrders, ORDER_STATUS_LABEL, formatPrice } from '../../data/mockData';

const STATUS_TAG_COLOR = { pending:'orange', confirmed:'blue', shipping:'cyan', delivered:'green', cancelled:'red' };

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipping', 'cancelled'],
  shipping: ['delivered'],
  delivered: [],
  cancelled: [],
};

const STATUSES = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

export default function StaffOrderPage() {
  const [orderList, setOrderList] = useState(initOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = statusFilter === 'all' ? orderList : orderList.filter(o => o.status === statusFilter);

  const updateStatus = (orderId, newStatus) => {
    setOrderList(l => l.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelected(prev => prev ? { ...prev, status: newStatus } : null);
  };

  const tabItems = STATUSES.map(s => ({
    key: s,
    label: `${s === 'all' ? 'Tất cả' : ORDER_STATUS_LABEL[s]} (${s === 'all' ? orderList.length : orderList.filter(o => o.status === s).length})`,
  }));

  const columns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: v => <span className="text-blue-600 font-semibold">#{v}</span> },
    { title: 'Khách hàng', key: 'customer', render: (_, r) => (
      <div><p>{r.customerName}</p><p className="text-xs text-gray-500">{r.customerPhone}</p></div>
    )},
    { title: 'Ngày', dataIndex: 'date', key: 'date', render: v => <span className="text-sm text-gray-500">{v}</span> },
    { title: 'Tổng', dataIndex: 'total', key: 'total', render: v => <span className="font-semibold">{formatPrice(v)}</span> },
    { title: 'Thanh toán', key: 'payment', render: (_, r) => (
      <Tag color={r.paymentStatus === 'paid' ? 'green' : 'orange'}>{r.paymentStatus === 'paid' ? 'Đã TT' : 'COD'}</Tag>
    )},
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => <Tag color={STATUS_TAG_COLOR[v]}>{ORDER_STATUS_LABEL[v]}</Tag> },
    { title: 'Hành động', key: 'action', render: (_, r) => (
      <Space wrap>
        <Button size="small" onClick={() => setSelected(r)}>Chi tiết</Button>
        {ALLOWED_TRANSITIONS[r.status].map(next => (
          <Button key={next} size="small" type="primary" onClick={() => updateStatus(r.id, next)}>
            → {ORDER_STATUS_LABEL[next]}
          </Button>
        ))}
      </Space>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <Tabs activeKey={statusFilter} onChange={setStatusFilter} items={tabItems} />
      <Table columns={columns} dataSource={filtered} rowKey="id" scroll={{ x: true }} size="small" pagination={{ pageSize: 10 }} />

      <Modal
        title={`Chi tiết đơn #${selected?.id}`}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
      >
        {selected && (
          <div className="flex flex-col gap-3">
            <div>
              <p className="font-semibold">{selected.customerName} · {selected.customerPhone}</p>
              <p className="text-sm text-gray-500">{selected.shippingAddress}</p>
            </div>
            <div>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <span className="flex-1">{item.name} ({item.variant})</span>
                  <span className="text-gray-500 mx-3">×{item.qty}</span>
                  <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
              <span>Tổng cộng</span>
              <span className="text-blue-600">{formatPrice(selected.total)}</span>
            </div>
            {selected.notes && <p className="text-sm text-gray-500">Ghi chú: {selected.notes}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
