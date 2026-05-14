import { useState } from 'react';
import { Tabs, Form, Input, Button, Tag, Alert, Collapse, Card, Empty } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { supportTickets } from '../../data/mockData';

const STATUS_MAP = {
  open: { label: 'Chờ xử lý', color: 'orange' },
  in_progress: { label: 'Đang xử lý', color: 'blue' },
  resolved: { label: 'Đã giải quyết', color: 'green' },
};

const FAQ_ITEMS = [
  { q: 'Chính sách đổi trả như thế nào?', a: 'Sản phẩm được đổi trả trong vòng 30 ngày kể từ ngày nhận hàng nếu còn nguyên vẹn, đầy đủ phụ kiện và không có dấu hiệu sử dụng.' },
  { q: 'Sản phẩm có được bảo hành không?', a: 'Tất cả sản phẩm đều được bảo hành theo chính sách hãng, thông thường từ 12-24 tháng tùy sản phẩm.' },
  { q: 'Thời gian giao hàng là bao lâu?', a: 'TP.HCM: 24 giờ. Các tỉnh thành khác: 2-4 ngày làm việc.' },
  { q: 'Tôi có thể thanh toán bằng những hình thức nào?', a: 'Hiện tại hỗ trợ: COD (tiền mặt khi nhận), VNPay, MoMo và Chuyển khoản ngân hàng.' },
  { q: 'Làm sao để theo dõi đơn hàng?', a: 'Bạn có thể theo dõi đơn hàng trong mục "Đơn hàng của tôi" sau khi đăng nhập.' },
];

export default function SupportPage() {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();

  const myTickets = user ? supportTickets.filter(t => t.customerEmail === user?.email) : supportTickets;

  const handleSubmit = () => {
    setSubmitted(true);
    form.resetFields();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const tabItems = [
    {
      key: 'new',
      label: 'Gửi yêu cầu mới',
      children: (
        <Card>
          {submitted && (
            <Alert message="Yêu cầu đã được gửi! Chúng tôi sẽ phản hồi trong 24 giờ." type="success" showIcon className="mb-4" />
          )}
          <Form form={form} layout="vertical" onFinish={handleSubmit} className="max-w-xl">
            <Form.Item label="Mã đơn hàng (nếu có)" name="orderId">
              <Input placeholder="VD: ORD-001" />
            </Form.Item>
            <Form.Item label="Chủ đề *" name="subject" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Input placeholder="Mô tả ngắn vấn đề của bạn" />
            </Form.Item>
            <Form.Item label="Nội dung chi tiết *" name="message" rules={[{ required: true, message: 'Bắt buộc' }]}>
              <Input.TextArea rows={5} placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." />
            </Form.Item>
            <Button type="primary" htmlType="submit">Gửi yêu cầu</Button>
          </Form>
        </Card>
      ),
    },
    {
      key: 'history',
      label: 'Lịch sử hỗ trợ',
      children: myTickets.length === 0 ? (
        <Empty description="Chưa có yêu cầu hỗ trợ nào" className="py-12" />
      ) : (
        <div className="flex flex-col gap-4">
          {myTickets.map(ticket => (
            <Card key={ticket.id} size="small">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{ticket.subject}</p>
                  <p className="text-xs text-gray-500">{ticket.createdAt}{ticket.orderId && ` · Đơn #${ticket.orderId}`}</p>
                </div>
                <Tag color={STATUS_MAP[ticket.status].color}>{STATUS_MAP[ticket.status].label}</Tag>
              </div>
              <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
              {ticket.response && (
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Phản hồi từ {ticket.assignedTo}:</p>
                  <p className="text-sm text-gray-600">{ticket.response}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ),
    },
    {
      key: 'faq',
      label: 'Câu hỏi thường gặp',
      children: (
        <Collapse
          items={FAQ_ITEMS.map((item, i) => ({ key: i, label: item.q, children: <p className="text-gray-600">{item.a}</p> }))}
          className="bg-white"
        />
      ),
    },
  ];

  return (
    <div className="py-8 pb-16">
      <div className="container max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Hỗ trợ khách hàng</h1>
        <Tabs items={tabItems} />
      </div>
    </div>
  );
}
