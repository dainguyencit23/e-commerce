import { useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, InputNumber, Space, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { promotions as initPromos, PROMOTION_STATUS_LABEL, formatPrice } from '../../data/mockData';

const STATUS_COLOR = { active: 'green', expired: 'default', upcoming: 'blue' };

export default function PromotionManagementPage() {
  const [promoList, setPromoList] = useState(initPromos);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p.id);
    form.setFieldsValue({ ...p, startDate: dayjs(p.startDate), endDate: dayjs(p.endDate) });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({ title: 'Xóa mã giảm giá này?', onOk: () => setPromoList(l => l.filter(p => p.id !== id)), okButtonProps: { danger: true } });
  };

  const handleSave = (values) => {
    const startDate = values.startDate.format('YYYY-MM-DD');
    const endDate = values.endDate.format('YYYY-MM-DD');
    const today = new Date().toISOString().slice(0,10);
    const status = endDate < today ? 'expired' : startDate > today ? 'upcoming' : 'active';
    const data = { ...values, startDate, endDate, status };
    if (editing) {
      setPromoList(l => l.map(p => p.id === editing ? { ...p, ...data } : p));
    } else {
      setPromoList(l => [...l, { id: Date.now(), ...data, usedCount: 0 }]);
    }
    setShowModal(false);
  };

  const columns = [
    { title: 'Mã', dataIndex: 'code', key: 'code', render: v => (
      <span className="font-mono bg-gray-100 text-blue-600 font-bold px-2 py-0.5 rounded text-sm">{v}</span>
    )},
    { title: 'Loại', dataIndex: 'type', key: 'type', render: v => v === 'percent' ? 'Phần trăm' : 'Cố định' },
    { title: 'Giá trị', key: 'value', render: (_, r) => <span className="font-semibold">{r.type === 'percent' ? `${r.value}%` : formatPrice(r.value)}</span> },
    { title: 'Đơn tối thiểu', dataIndex: 'minOrderValue', key: 'min', render: v => <span className="text-sm">{formatPrice(v)}</span> },
    { title: 'Đã dùng', key: 'used', render: (_, r) => <span className="text-sm">{r.usedCount}/{r.usageLimit}</span> },
    { title: 'Hiệu lực', key: 'dates', render: (_, r) => <span className="text-xs text-gray-500">{r.startDate} → {r.endDate}</span> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => <Tag color={STATUS_COLOR[v]}>{PROMOTION_STATUS_LABEL[v]}</Tag> },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>Sửa</Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>Xóa</Button>
      </Space>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Tổng <strong>{promoList.length}</strong> mã</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Tạo mã giảm giá</Button>
      </div>

      <Table columns={columns} dataSource={promoList} rowKey="id" scroll={{ x: true }} size="small" pagination={{ pageSize: 10 }} />

      <Modal
        title={editing ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={640}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label="Mã giảm giá *" name="code" rules={[{ required: true }]}>
              <Input style={{ textTransform: 'uppercase' }} onChange={e => form.setFieldValue('code', e.target.value.toUpperCase())} />
            </Form.Item>
            <Form.Item label="Loại *" name="type" rules={[{ required: true }]} initialValue="percent">
              <Select>
                <Select.Option value="percent">Phần trăm (%)</Select.Option>
                <Select.Option value="fixed">Cố định (VND)</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Giá trị *" name="value" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Giảm tối đa (VND)" name="maxDiscount"><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Đơn tối thiểu (VND)" name="minOrderValue"><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Giới hạn sử dụng" name="usageLimit"><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Ngày bắt đầu *" name="startDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
            <Form.Item label="Ngày kết thúc *" name="endDate" rules={[{ required: true }]}><DatePicker className="w-full" /></Form.Item>
            <Form.Item label="Mô tả" name="description" className="col-span-2"><Input /></Form.Item>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button onClick={() => setShowModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">{editing ? 'Lưu thay đổi' : 'Tạo mã'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
