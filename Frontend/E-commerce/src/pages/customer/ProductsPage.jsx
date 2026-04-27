import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';
import './ProductsPage.css';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star${s > Math.round(rating) ? ' empty' : ''}`}>★</span>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null;
  const query = searchParams.get('q') || '';

  const [sort, setSort] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [brand, setBrand] = useState('');
  const { products } = useProducts();

  const brands = [...new Set(products.map(p => p.brand))];

  const filtered = useMemo(() => {
    let list = [...products];
    if (categoryId) list = list.filter(p => p.categoryId === categoryId);
    if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
    if (brand) list = list.filter(p => p.brand === brand);
    if (priceRange.min) list = list.filter(p => p.basePrice >= Number(priceRange.min));
    if (priceRange.max) list = list.filter(p => p.basePrice <= Number(priceRange.max));
    if (sort === 'price-asc') list.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') list.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [categoryId, query, sort, priceRange, brand]);

  const selectedCategory = categories.find(c => c.id === categoryId);

  const resetFilters = () => {
    setBrand('');
    setPriceRange({ min: '', max: '' });
    setSort('default');
    setSearchParams({});
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Trang chủ</span>
          <span>›</span>
          <span className="active">{selectedCategory ? selectedCategory.name : query ? `Tìm: "${query}"` : 'Tất cả sản phẩm'}</span>
        </div>

        <div className="products-layout">
          {/* Sidebar filter */}
          <aside className="filter-sidebar">
            <div className="card">
              <div className="card-header">
                <span className="font-semibold">Bộ lọc</span>
                <button className="btn btn-sm btn-secondary" onClick={resetFilters}>Xóa lọc</button>
              </div>
              <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Category */}
                <div>
                  <p className="filter-label">Danh mục</p>
                  <div className="filter-list">
                    <label className="filter-item">
                      <input type="radio" name="cat" checked={!categoryId} onChange={() => setSearchParams(query ? { q: query } : {})} />
                      <span>Tất cả</span>
                    </label>
                    {categories.map(cat => (
                      <label key={cat.id} className="filter-item">
                        <input type="radio" name="cat" checked={categoryId === cat.id} onChange={() => setSearchParams({ category: cat.id })} />
                        <span>{cat.name} ({cat.productCount})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brand */}
                <div>
                  <p className="filter-label">Thương hiệu</p>
                  <div className="filter-list">
                    <label className="filter-item">
                      <input type="radio" name="brand" checked={brand === ''} onChange={() => setBrand('')} />
                      <span>Tất cả</span>
                    </label>
                    {brands.map(b => (
                      <label key={b} className="filter-item">
                        <input type="radio" name="brand" checked={brand === b} onChange={() => setBrand(b)} />
                        <span>{b}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="filter-label">Khoảng giá (VND)</p>
                  <div className="price-inputs">
                    <input className="form-control" placeholder="Từ" value={priceRange.min} onChange={e => setPriceRange(p => ({ ...p, min: e.target.value }))} type="number" />
                    <span>—</span>
                    <input className="form-control" placeholder="Đến" value={priceRange.max} onChange={e => setPriceRange(p => ({ ...p, max: e.target.value }))} type="number" />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Product list */}
          <div className="products-main">
            <div className="products-toolbar">
              <p className="products-count">
                {query && <span>Kết quả cho <strong>"{query}"</strong> – </span>}
                <strong>{filtered.length}</strong> sản phẩm
              </p>
              <select className="form-control" style={{ width: 'auto' }} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá thấp → cao</option>
                <option value="price-desc">Giá cao → thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="popular">Phổ biến nhất</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-text">Không tìm thấy sản phẩm phù hợp</p>
                <button className="btn btn-primary mt-4" onClick={resetFilters}>Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="product-grid">
                {filtered.map(p => (
                  <div key={p.id} className="product-card" onClick={() => navigate(`/products/${p.slug}`)}>
                    <div className="product-card-img">
                      <img src={p.thumbnail} alt={p.name} />
                      {p.featured && <span className="product-badge">Nổi bật</span>}
                    </div>
                    <div className="product-card-body">
                      <p className="product-card-brand">{p.brand}</p>
                      <p className="product-card-name">{p.name}</p>
                      <p className="product-card-price">{formatPrice(p.basePrice)}</p>
                      <div className="product-card-rating">
                        <StarRating rating={p.rating} />
                        <span>({p.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
