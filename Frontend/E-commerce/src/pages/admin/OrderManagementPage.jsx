import { useState } from 'react';
import { Table, Tag, Button, Modal, Input, Tabs, Descriptions } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { orders as initOrders, ORDER_STATUS_LABEL, formatPrice } from '../../data/mockData';

const STATUS_TAG_COLOR = { pending:'orange', confirmed:'blue', shipping:'cyan', delivered:'green', cancelled:'red' };
const STATUSES = ['all', 'pending', 'confirmed', 'shipping', 'delivered', 'cancelled'];

export default function OrderManagementPage() {
  const [orderList, setOrderList] = useState(initOrders);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = orderList.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = o.id.includes(search) || o.customerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

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
      <div><p className="font-medium">{r.customerName}</p><p className="text-xs text-gray-500">{r.customerPhone}</p></div>
    )},
    { title: 'Ngày đặt', dataIndex: 'date', key: 'date', render: v => <span className="text-gray-500">{v}</span> },
    { title: 'Sản phẩm', key: 'items', render: (_, r) => <span className="text-sm">{r.items.length} sản phẩm</span> },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: v => <span className="font-semibold">{formatPrice(v)}</span> },
    { title: 'Thanh toán', key: 'payment', render: (_, r) => (
      <Tag color={r.paymentStatus === 'paid' ? 'green' : 'orange'}>
        {r.paymentStatus === 'paid' ? 'Đã TT' : 'Chưa TT'} · {r.paymentMethod}
      </Tag>
    )},
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => <Tag color={STATUS_TAG_COLOR[v]}>{ORDER_STATUS_LABEL[v]}</Tag> },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Button size="small" onClick={() => setSelected(r)}>Chi tiết</Button>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <Tabs activeKey={statusFilter} onChange={setStatusFilter} items={tabItems} />

      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm mã đơn, tên khách..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table columns={columns} dataSource={filtered} rowKey="id" scroll={{ x: true }} size="small"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '🛒 Không có đơn hàng' }}
      />

      <Modal
        title={`Chi tiết đơn #${selected?.id}`}
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        width={700}
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Khách hàng</p>
                <p className="font-semibold">{selected.customerName}</p>
                <p className="text-sm text-gray-500">{selected.customerPhone} · {selected.customerEmail}</p>
                <p className="text-sm text-gray-500">{selected.shippingAddress}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Thanh toán</p>
                <p className="text-sm">{selected.paymentMethod}</p>
                <Tag color={selected.paymentStatus === 'paid' ? 'green' : 'orange'}>
                  {selected.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </Tag>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sản phẩm</p>
              {selected.items.map((item, i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 text-sm">
                  <span className="flex-1">{item.name} - {item.variant}</span>
                  <span className="text-gray-500 mx-4">x{item.qty}</span>
                  <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="mt-3 text-right">
                <div className="flex justify-between text-sm py-1"><span>Tạm tính</span><span>{formatPrice(selected.subtotal)}</span></div>
                {selected.discount > 0 && <div className="flex justify-between text-sm text-green-600 py-1"><span>Giảm giá</span><span>−{formatPrice(selected.discount)}</span></div>}
                <div className="flex justify-between text-sm py-1"><span>Phí ship</span><span>{selected.shippingFee === 0 ? 'Miễn phí' : formatPrice(selected.shippingFee)}</span></div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200"><span>Tổng cộng</span><span className="text-blue-600">{formatPrice(selected.total)}</span></div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Cập nhật trạng thái</p>
              <div className="flex gap-2 flex-wrap">
                {Object.entries(ORDER_STATUS_LABEL).map(([key, label]) => (
                  <Button
                    key={key}
                    size="small"
                    type={selected.status === key ? 'primary' : 'default'}
                    onClick={() => updateStatus(selected.id, key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
