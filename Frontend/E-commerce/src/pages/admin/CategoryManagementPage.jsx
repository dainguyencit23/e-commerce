import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { categories as initCats } from '../../data/mockData';

export default function CategoryManagementPage() {
  const [catList, setCatList] = useState(initCats);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const openAdd = () => { setEditing(null); form.resetFields(); setShowModal(true); };
  const openEdit = (c) => { setEditing(c.id); form.setFieldsValue({ name: c.name, slug: c.slug }); setShowModal(true); };

  const handleDelete = (id) => {
    Modal.confirm({ title: 'Xóa danh mục này?', onOk: () => setCatList(l => l.filter(c => c.id !== id)), okButtonProps: { danger: true } });
  };

  const handleSave = (values) => {
    if (editing) {
      setCatList(l => l.map(c => c.id === editing ? { ...c, ...values } : c));
    } else {
      setCatList(l => [...l, { id: Date.now(), ...values, parentId: null, productCount: 0 }]);
    }
    setShowModal(false);
  };

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 60, render: v => <span className="text-gray-400">{v}</span> },
    { title: 'Tên danh mục', dataIndex: 'name', key: 'name', render: v => <span className="font-medium">{v}</span> },
    { title: 'Slug', dataIndex: 'slug', key: 'slug', render: v => <span className="text-xs text-gray-500 font-mono">{v}</span> },
    { title: 'Số sản phẩm', dataIndex: 'productCount', key: 'count' },
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
        <span className="text-sm text-gray-500">Tổng <strong>{catList.length}</strong> danh mục</span>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm danh mục</Button>
      </div>

      <Table columns={columns} dataSource={catList} rowKey="id" size="small" pagination={{ pageSize: 10 }} />

      <Modal
        title={editing ? 'Sửa danh mục' : 'Thêm danh mục'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="mt-4">
          <Form.Item label="Tên danh mục *" name="name" rules={[{ required: true }]}>
            <Input onChange={e => form.setFieldValue('slug', e.target.value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/\s+/g,'-'))} />
          </Form.Item>
          <Form.Item label="Slug" name="slug"><Input /></Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">{editing ? 'Lưu' : 'Thêm'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
