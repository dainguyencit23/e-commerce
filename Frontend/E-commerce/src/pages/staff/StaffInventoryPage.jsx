import { useState } from 'react';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';
import '../admin/AdminPage.css';

export default function StaffInventoryPage() {
  const { products: productList, updateProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState('');

  const handleUpdateStock = (id) => {
    updateProduct(id, { stock: Number(newStock) });
    setEditingId(null);
    setNewStock('');
  };

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Hết hàng', cls: 'badge-red' };
    if (stock < 10) return { label: 'Sắp hết', cls: 'badge-yellow' };
    return { label: 'Còn hàng', cls: 'badge-green' };
  };

  const filtered = productList.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
  );
  const lowStockCount = productList.filter(p => p.stock < 10).length;

  return (
    <div className="admin-page">
      {lowStockCount > 0 && (
        <div style={{ background: '#fef3c7', color: '#92400e', padding: '12px 16px', borderRadius: 'var(--radius-lg)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          ⚠️ <strong>{lowStockCount} sản phẩm</strong> đang sắp hết hoặc đã hết hàng. Cần nhập thêm!
        </div>
      )}

      <div className="admin-toolbar">
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input className="form-control" placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Sản phẩm</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái</th><th>Cập nhật kho</th></tr></thead>
            <tbody>
              {filtered.map(p => {
                const stockStatus = getStockStatus(p.stock);
                return (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={p.thumbnail} alt={p.name} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="text-sm text-gray">{getCatName(p.categoryId)}</td>
                    <td>{formatPrice(p.basePrice)}</td>
                    <td className="font-semibold">{p.stock}</td>
                    <td><span className={`badge ${stockStatus.cls}`}>{stockStatus.label}</span></td>
                    <td>
                      {editingId === p.id ? (
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          <input className="form-control" type="number" value={newStock} onChange={e => setNewStock(e.target.value)} style={{ width: 80 }} min={0} autoFocus />
                          <button className="btn btn-sm btn-primary" onClick={() => handleUpdateStock(p.id)}>Lưu</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>Hủy</button>
                        </div>
                      ) : (
                        <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(p.id); setNewStock(p.stock); }}>Cập nhật</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
