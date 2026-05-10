import { useState } from 'react';
import { Table, Button, Tag, Modal, Form, Input, Select, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { staffList as initStaff } from '../../data/mockData';

export default function StaffManagementPage() {
  const [staffs, setStaffs] = useState(initStaff);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setShowModal(true); };
  const openEdit = (s) => { setEditing(s.id); form.setFieldsValue({ name: s.name, email: s.email, phone: s.phone, department: s.department }); setShowModal(true); };

  const handleDelete = (id) => {
    Modal.confirm({ title: 'Xóa nhân viên này?', onOk: () => setStaffs(l => l.filter(s => s.id !== id)), okButtonProps: { danger: true } });
  };

  const toggleStatus = (id) => setStaffs(l => l.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));

  const handleSave = (values) => {
    if (editing) {
      setStaffs(l => l.map(s => s.id === editing ? { ...s, ...values } : s));
    } else {
      setStaffs(l => [...l, { id: Date.now(), ...values, role: 'Staff', joinDate: new Date().toISOString().slice(0,10), status: 'active' }]);
    }
    setShowModal(false);
  };

  const columns = [
    { title: 'Nhân viên', key: 'name', render: (_, r) => (
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{r.name[0]}</div>
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { title: 'Email', dataIndex: 'email', key: 'email', render: v => <span className="text-sm">{v}</span> },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', render: v => <span className="text-sm">{v}</span> },
    { title: 'Phòng ban', dataIndex: 'department', key: 'department' },
    { title: 'Ngày vào', dataIndex: 'joinDate', key: 'joinDate', render: v => <span className="text-sm text-gray-500">{v}</span> },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => (
      <Tag color={v === 'active' ? 'green' : 'default'}>{v === 'active' ? 'Đang làm' : 'Nghỉ việc'}</Tag>
    )},
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>Sửa</Button>
        <Button size="small" type={r.status === 'active' ? 'default' : 'primary'} onClick={() => toggleStatus(r.id)}>
          {r.status === 'active' ? 'Nghỉ' : 'Kích hoạt'}
        </Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>Xóa</Button>
      </Space>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">Tổng <strong>{staffs.length}</strong> nhân viên</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm nhân viên</Button>
      </div>

      <Table columns={columns} dataSource={staffs} rowKey="id" size="small" pagination={{ pageSize: 10 }} />

      <Modal
        title={editing ? 'Sửa nhân viên' : 'Thêm nhân viên mới'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Họ và tên *" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Email *" name="email" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item label="Số điện thoại *" name="phone" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="Phòng ban" name="department">
            <Select placeholder="Chọn phòng ban" allowClear>
              {['Kho hàng','Chăm sóc KH','Vận hành','Marketing'].map(d => <Select.Option key={d} value={d}>{d}</Select.Option>)}
            </Select>
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">{editing ? 'Lưu' : 'Thêm'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
