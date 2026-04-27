import { useState } from 'react';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';
import './AdminPage.css';

const emptyForm = () => ({ name: '', brand: '', categoryId: '', basePrice: '', stock: '', description: '' });
const emptyVariant = () => ({ id: Date.now() + Math.random(), label: '', price: '', stock: '' });

export default function ProductManagementPage() {
  const { products: productList, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [variants, setVariants] = useState([]);

  const filtered = productList.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter ? p.categoryId === Number(catFilter) : true;
    return matchSearch && matchCat;
  });

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setVariants([emptyVariant()]);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, brand: p.brand, categoryId: p.categoryId, basePrice: p.basePrice, stock: p.stock, description: p.description });
    setVariants(p.variants.length > 0 ? p.variants.map(v => ({ ...v })) : [emptyVariant()]);
    setShowModal(true);
  };

  const handleDelete = (id) => { if (confirm('Xóa sản phẩm này?')) deleteProduct(id); };

  // Variant helpers
  const addVariant = () => setVariants(v => [...v, emptyVariant()]);
  const removeVariant = (id) => setVariants(v => v.filter(vt => vt.id !== id));
  const updateVariant = (id, field, value) => setVariants(v => v.map(vt => vt.id === id ? { ...vt, [field]: value } : vt));

  const handleSave = (e) => {
    e.preventDefault();
    const cleanVariants = variants
      .filter(v => v.label.trim())
      .map(v => ({ ...v, price: Number(v.price) || Number(form.basePrice), stock: Number(v.stock) || 0 }));

    if (editing) {
      updateProduct(editing, { ...form, categoryId: Number(form.categoryId), basePrice: Number(form.basePrice), stock: Number(form.stock), variants: cleanVariants });
    } else {
      addProduct({
        id: Date.now(),
        ...form,
        categoryId: Number(form.categoryId),
        basePrice: Number(form.basePrice),
        stock: Number(form.stock),
        thumbnail: `https://placehold.co/400x400?text=${encodeURIComponent(form.name)}`,
        variants: cleanVariants,
        rating: 0, reviewCount: 0, featured: false, images: [],
        slug: form.name.toLowerCase().replace(/\s+/g, '-'),
      });
    }
    setShowModal(false);
  };

  const getCatName = (id) => categories.find(c => c.id === id)?.name || '—';

  return (
    <div className="admin-page">
      {/* Toolbar */}
      <div className="admin-toolbar">
        <div className="search-bar">
          <span className="search-bar-icon">🔍</span>
          <input className="form-control" placeholder="Tìm sản phẩm..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ width: 180 }} value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="">Tất cả danh mục</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={openAdd}>+ Thêm sản phẩm</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>#</th><th>Sản phẩm</th><th>Danh mục</th><th>Thương hiệu</th><th>Giá</th><th>Kho</th><th>Biến thể</th><th>Đánh giá</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className="text-gray text-sm">{p.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img src={p.thumbnail} alt={p.name} style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover', background: 'var(--gray-100)' }} />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td>{getCatName(p.categoryId)}</td>
                  <td>{p.brand}</td>
                  <td className="font-semibold">{formatPrice(p.basePrice)}</td>
                  <td>{p.stock}</td>
                  <td><span className="badge badge-blue">{p.variants.length} biến thể</span></td>
                  <td>⭐ {p.rating} ({p.reviewCount})</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-sm btn-secondary" onClick={() => openEdit(p)}>Sửa</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="empty-state"><div className="empty-state-icon">📦</div><p>Không có sản phẩm nào</p></div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
            <div className="modal-header">
              <span className="font-semibold">{editing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>

                {/* Thông tin cơ bản */}
                <p className="font-semibold text-sm" style={{ marginBottom: 10, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Thông tin sản phẩm</p>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Tên sản phẩm *</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Thương hiệu *</label>
                    <input className="form-control" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Danh mục *</label>
                    <select className="form-control" value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))} required>
                      <option value="">Chọn danh mục</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giá cơ bản (VND) *</label>
                    <input className="form-control" type="number" value={form.basePrice} onChange={e => setForm(p => ({ ...p, basePrice: e.target.value }))} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tồn kho tổng</label>
                    <input className="form-control" type="number" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Mô tả</label>
                    <textarea className="form-control" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                </div>

                {/* Variants */}
                <div style={{ borderTop: '1px solid var(--gray-100)', marginTop: 20, paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Biến thể ({variants.length})
                    </p>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={addVariant}>+ Thêm biến thể</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Header row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 36px', gap: 8 }}>
                      <span className="text-sm text-gray">Tên biến thể (vd: 128GB - Đen)</span>
                      <span className="text-sm text-gray">Giá (VND)</span>
                      <span className="text-sm text-gray">Kho</span>
                      <span />
                    </div>

                    {variants.map((v, idx) => (
                      <div key={v.id} style={{ display: 'grid', gridTemplateColumns: '1fr 140px 100px 36px', gap: 8, alignItems: 'center' }}>
                        <input
                          className="form-control"
                          placeholder={`Biến thể ${idx + 1}`}
                          value={v.label}
                          onChange={e => updateVariant(v.id, 'label', e.target.value)}
                        />
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Giá"
                          value={v.price}
                          onChange={e => updateVariant(v.id, 'price', e.target.value)}
                        />
                        <input
                          className="form-control"
                          type="number"
                          placeholder="Kho"
                          value={v.stock}
                          onChange={e => updateVariant(v.id, 'stock', e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(v.id)}
                          disabled={variants.length === 1}
                          style={{ background: 'none', color: 'var(--danger)', fontSize: 18, padding: 0, cursor: variants.length === 1 ? 'not-allowed' : 'pointer', opacity: variants.length === 1 ? 0.3 : 1 }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Lưu thay đổi' : 'Thêm sản phẩm'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
