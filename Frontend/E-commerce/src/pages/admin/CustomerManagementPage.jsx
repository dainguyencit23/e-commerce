import { useState } from 'react';
import { Table, Button, Tag, Modal, Input, Space } from 'antd';
import { SearchOutlined, EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { customers as initCustomers, formatPrice } from '../../data/mockData';

export default function CustomerManagementPage() {
  const [customerList, setCustomerList] = useState(initCustomers);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = customerList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const toggleStatus = (id) => setCustomerList(l => l.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));

  const columns = [
    { title: 'Khách hàng', key: 'name', render: (_, r) => (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{r.name[0]}</div>
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { title: 'Liên hệ', key: 'contact', render: (_, r) => (
      <div><p className="text-sm">{r.email}</p><p className="text-xs text-gray-500">{r.phone}</p></div>
    )},
    { title: 'Ngày đăng ký', dataIndex: 'joinDate', key: 'joinDate', render: v => <span className="text-gray-500">{v}</span> },
    { title: 'Đơn hàng', dataIndex: 'totalOrders', key: 'orders', render: v => `${v} đơn` },
    { title: 'Tổng chi tiêu', dataIndex: 'totalSpent', key: 'spent', render: v => <span className="text-blue-600 font-semibold">{formatPrice(v)}</span> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => (
      <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}</Tag>
    )},
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EyeOutlined />} onClick={() => setSelected(r)}>Xem</Button>
        <Button size="small" danger={r.status === 'active'} icon={r.status === 'active' ? <LockOutlined /> : <UnlockOutlined />} onClick={() => toggleStatus(r.id)}>
          {r.status === 'active' ? 'Khóa' : 'Mở khóa'}
        </Button>
      </Space>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Input prefix={<SearchOutlined />} placeholder="Tìm tên, email, số điện thoại..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
        <span className="text-sm text-gray-500">Tổng: <strong>{customerList.length}</strong> khách hàng</span>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id" scroll={{ x: true }} size="small" pagination={{ pageSize: 10 }} />

      <Modal title="Thông tin khách hàng" open={!!selected} onCancel={() => setSelected(null)} footer={null}>
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center flex-shrink-0">{selected.name[0]}</div>
              <div>
                <p className="text-xl font-bold">{selected.name}</p>
                <Tag color={selected.status === 'active' ? 'green' : 'default'}>{selected.status === 'active' ? 'Đang hoạt động' : 'Ngưng hoạt động'}</Tag>
              </div>
            </div>
            {[['📧 Email', selected.email],['📞 Điện thoại', selected.phone],['📍 Địa chỉ', selected.address],['📅 Ngày đăng ký', selected.joinDate],['🛒 Số đơn hàng', `${selected.totalOrders} đơn`],['💰 Tổng chi tiêu', formatPrice(selected.totalSpent)]].map(([label, value]) => (
              <div key={label} className="flex gap-4 text-sm">
                <span className="w-36 text-gray-500">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
