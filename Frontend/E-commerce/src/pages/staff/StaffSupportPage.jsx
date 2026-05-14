import { useState } from 'react';
import { Table, Tag, Button, Modal, Input, Alert } from 'antd';
import { supportTickets as initTickets } from '../../data/mockData';

const STATUS_LABEL = { open: 'Chờ xử lý', in_progress: 'Đang xử lý', resolved: 'Đã giải quyết' };
const STATUS_COLOR = { open: 'orange', in_progress: 'blue', resolved: 'green' };
const PRIORITY_COLOR = { low: 'default', medium: 'blue', high: 'red' };
const PRIORITY_LABEL = { low: 'Thấp', medium: 'Trung bình', high: 'Cao' };

export default function StaffSupportPage() {
  const [tickets, setTickets] = useState(initTickets);
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');

  const handleRespond = () => {
    if (!response.trim()) return;
    setTickets(l => l.map(t => t.id === selected.id ? { ...t, status: 'resolved', response, resolvedAt: new Date().toLocaleString() } : t));
    setSelected(prev => ({ ...prev, status: 'resolved', response }));
    setResponse('');
  };

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'name', render: v => <span className="font-medium">{v}</span> },
    { title: 'Chủ đề', dataIndex: 'subject', key: 'subject' },
    { title: 'Đơn hàng', dataIndex: 'orderId', key: 'orderId', render: v => v ? `#${v}` : '—' },
    { title: 'Ưu tiên', dataIndex: 'priority', key: 'priority', render: v => <Tag color={PRIORITY_COLOR[v]}>{PRIORITY_LABEL[v]}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: v => <span className="text-sm text-gray-500">{v}</span> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v]}</Tag> },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Button size="small" onClick={() => { setSelected(r); setResponse(''); }}>Xử lý</Button>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <Table columns={columns} dataSource={tickets} rowKey="id" scroll={{ x: true }} size="small" pagination={{ pageSize: 10 }} />

      <Modal
        title="Xử lý yêu cầu hỗ trợ"
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={selected?.response ? null : [
          <Button key="close" onClick={() => setSelected(null)}>Đóng</Button>,
          <Button key="send" type="primary" onClick={handleRespond} disabled={!response.trim()}>Gửi phản hồi & Đóng ticket</Button>,
        ]}
        width={600}
      >
        {selected && (
          <div className="flex flex-col gap-4 py-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold mb-1">{selected.subject}</p>
              <p className="text-xs text-gray-500 mb-2">Từ: {selected.customerName}{selected.orderId && ` · Đơn #${selected.orderId}`}</p>
              <p className="text-sm text-gray-700">{selected.message}</p>
            </div>

            {selected.response ? (
              <Alert message="Phản hồi đã gửi" description={selected.response} type="success" showIcon />
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Phản hồi *</p>
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập nội dung phản hồi cho khách hàng..."
                  value={response}
                  onChange={e => setResponse(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
