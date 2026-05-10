import { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';

const emptyVariant = () => ({ id: Date.now() + Math.random(), label: '', price: '', stock: '' });

export default function ProductManagementPage() {
  const { products: productList, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [variants, setVariants] = useState([emptyVariant()]);
  const [form] = Form.useForm();

  const filtered = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter ? p.categoryId === Number(catFilter) : true;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setVariants([emptyVariant()]);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    form.setFieldsValue({ name: p.name, brand: p.brand, categoryId: p.categoryId, basePrice: p.basePrice, stock: p.stock, description: p.description });
    setVariants(p.variants.length > 0 ? p.variants.map(v => ({ ...v })) : [emptyVariant()]);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    Modal.confirm({ title: 'Xóa sản phẩm này?', onOk: () => deleteProduct(id), okButtonProps: { danger: true } });
  };

  const handleSave = (values) => {
    const cleanVariants = variants.filter(v => v.label.trim()).map(v => ({ ...v, price: Number(v.price) || Number(values.basePrice), stock: Number(v.stock) || 0 }));
    if (editing) {
      updateProduct(editing, { ...values, categoryId: Number(values.categoryId), basePrice: Number(values.basePrice), stock: Number(values.stock), variants: cleanVariants });
    } else {
      addProduct({
        id: Date.now(), ...values,
        categoryId: Number(values.categoryId), basePrice: Number(values.basePrice), stock: Number(values.stock),
        thumbnail: `https://placehold.co/400x400?text=${encodeURIComponent(values.name)}`,
        variants: cleanVariants, rating: 0, reviewCount: 0, featured: false, images: [],
        slug: values.name.toLowerCase().replace(/\s+/g, '-'),
      });
    }
    setShowModal(false);
  };

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';

  const columns = [
    { title: '#', dataIndex: 'id', key: 'id', width: 60, render: v => <span className="text-xs text-gray-400">{v}</span> },
    { title: 'Sản phẩm', key: 'product', render: (_, r) => (
      <div className="flex items-center gap-2.5">
        <img src={r.thumbnail} alt={r.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { title: 'Danh mục', key: 'cat', render: (_, r) => getCatName(r.categoryId) },
    { title: 'Thương hiệu', dataIndex: 'brand', key: 'brand' },
    { title: 'Giá', dataIndex: 'basePrice', key: 'price', render: v => <span className="font-semibold">{formatPrice(v)}</span> },
    { title: 'Kho', dataIndex: 'stock', key: 'stock' },
    { title: 'Biến thể', key: 'variants', render: (_, r) => <Tag color="blue">{r.variants.length} biến thể</Tag> },
    { title: 'Đánh giá', key: 'rating', render: (_, r) => <span>⭐ {r.rating} ({r.reviewCount})</span> },
    { title: 'Thao tác', key: 'action', render: (_, r) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>Sửa</Button>
        <Button size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>Xóa</Button>
      </Space>
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 flex-wrap">
        <Input prefix={<SearchOutlined />} placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} className="w-64" />
        <Select placeholder="Tất cả danh mục" value={catFilter || undefined} onChange={v => setCatFilter(v || '')} allowClear className="w-48">
          {categories.map(c => <Select.Option key={c.id} value={String(c.id)}>{c.name}</Select.Option>)}
        </Select>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm sản phẩm</Button>
      </div>

      <Table columns={columns} dataSource={filtered} rowKey="id" scroll={{ x: true }} size="small"
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: '📦 Không có sản phẩm nào' }}
      />

      <Modal
        title={editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        width={720}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label="Tên sản phẩm *" name="name" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Thương hiệu *" name="brand" rules={[{ required: true }]}><Input /></Form.Item>
            <Form.Item label="Danh mục *" name="categoryId" rules={[{ required: true }]}>
              <Select placeholder="Chọn danh mục">
                {categories.map(c => <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item label="Giá cơ bản (VND) *" name="basePrice" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Tồn kho tổng" name="stock"><InputNumber className="w-full" /></Form.Item>
            <Form.Item label="Mô tả" name="description" className="col-span-2"><Input.TextArea rows={2} /></Form.Item>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-2">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase">Biến thể ({variants.length})</p>
              <Button size="small" onClick={() => setVariants(v => [...v, emptyVariant()])}>+ Thêm biến thể</Button>
            </div>
            <div className="grid grid-cols-[1fr_140px_100px_32px] gap-2 mb-2">
              <span className="text-xs text-gray-400">Tên biến thể</span>
              <span className="text-xs text-gray-400">Giá (VND)</span>
              <span className="text-xs text-gray-400">Kho</span>
              <span />
            </div>
            {variants.map((v, idx) => (
              <div key={v.id} className="grid grid-cols-[1fr_140px_100px_32px] gap-2 mb-2 items-center">
                <Input placeholder={`Biến thể ${idx+1}`} value={v.label} onChange={e => setVariants(vl => vl.map(vt => vt.id === v.id ? { ...vt, label: e.target.value } : vt))} size="small" />
                <InputNumber placeholder="Giá" value={v.price} onChange={val => setVariants(vl => vl.map(vt => vt.id === v.id ? { ...vt, price: val } : vt))} size="small" className="w-full" />
                <InputNumber placeholder="Kho" value={v.stock} onChange={val => setVariants(vl => vl.map(vt => vt.id === v.id ? { ...vt, stock: val } : vt))} size="small" className="w-full" />
                <Button size="small" danger type="text" disabled={variants.length === 1} onClick={() => setVariants(vl => vl.filter(vt => vt.id !== v.id))}>✕</Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
            <Button onClick={() => setShowModal(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">{editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
