import { useState } from 'react';
import { Table, Tag, Button, Input, InputNumber, Alert, Space } from 'antd';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';

export default function StaffInventoryPage() {
  const { products: productList, updateProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState(null);

  const handleUpdateStock = (id) => {
    updateProduct(id, { stock: Number(newStock) });
    setEditingId(null);
    setNewStock(null);
  };

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Hết hàng', color: 'red' };
    if (stock < 10) return { label: 'Sắp hết', color: 'orange' };
    return { label: 'Còn hàng', color: 'green' };
  };

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );
  const lowStockCount = productList.filter(p => p.stock < 10).length;

  const columns = [
    { title: 'Sản phẩm', key: 'product', render: (_, r) => (
      <div className="flex items-center gap-2.5">
        <img src={r.thumbnail} alt={r.name} className="w-9 h-9 rounded object-cover bg-gray-100" />
        <span className="font-medium">{r.name}</span>
      </div>
    )},
    { title: 'Danh mục', key: 'cat', render: (_, r) => <span className="text-sm text-gray-500">{getCatName(r.categoryId)}</span> },
    { title: 'Giá', dataIndex: 'basePrice', key: 'price', render: v => formatPrice(v) },
    { title: 'Tồn kho', dataIndex: 'stock', key: 'stock', render: v => <span className="font-semibold">{v}</span> },
    { title: 'Trạng thái', key: 'status', render: (_, r) => {
      const s = getStockStatus(r.stock);
      return <Tag color={s.color}>{s.label}</Tag>;
    }},
    { title: 'Cập nhật kho', key: 'action', render: (_, r) => (
      editingId === r.id ? (
        <Space>
          <InputNumber
            value={newStock}
            onChange={v => setNewStock(v)}
            min={0}
            className="w-20"
            size="small"
            autoFocus
          />
          <Button size="small" type="primary" onClick={() => handleUpdateStock(r.id)}>Lưu</Button>
          <Button size="small" onClick={() => setEditingId(null)}>Hủy</Button>
        </Space>
      ) : (
        <Button size="small" onClick={() => { setEditingId(r.id); setNewStock(r.stock); }}>Cập nhật</Button>
      )
    )},
  ];

  return (
    <div className="flex flex-col gap-4">
      {lowStockCount > 0 && (
        <Alert
          icon={<WarningOutlined />}
          message={<><strong>{lowStockCount} sản phẩm</strong> đang sắp hết hoặc đã hết hàng. Cần nhập thêm!</>}
          type="warning"
          showIcon
        />
      )}

      <Input
        prefix={<SearchOutlined />}
        placeholder="Tìm sản phẩm..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <Table columns={columns} dataSource={filtered} rowKey="id" scroll={{ x: true }} size="small" pagination={{ pageSize: 10 }} />
    </div>
  );
}
