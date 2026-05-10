import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Select, Button, Rate, Empty, Radio, InputNumber, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { categories, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoryId = searchParams.get('category') ? Number(searchParams.get('category')) : null;
  const query = searchParams.get('q') || '';

  const [sort, setSort] = useState('default');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [brand, setBrand] = useState('');
  const { products } = useProducts();

  const brands = [...new Set(products.map(p => p.brand))];

  const filtered = useMemo(() => {
    let list = [...products];
    if (categoryId) list = list.filter(p => p.categoryId === categoryId);
    if (query) list = list.filter(p => p.name.toLowerCase().includes(query.toLowerCase()) || p.brand.toLowerCase().includes(query.toLowerCase()));
    if (brand) list = list.filter(p => p.brand === brand);
    if (priceMin) list = list.filter(p => p.basePrice >= Number(priceMin));
    if (priceMax) list = list.filter(p => p.basePrice <= Number(priceMax));
    if (sort === 'price-asc') list.sort((a, b) => a.basePrice - b.basePrice);
    if (sort === 'price-desc') list.sort((a, b) => b.basePrice - a.basePrice);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    if (sort === 'popular') list.sort((a, b) => b.reviewCount - a.reviewCount);
    return list;
  }, [categoryId, query, sort, priceMin, priceMax, brand, products]);

  const selectedCategory = categories.find(c => c.id === categoryId);

  const resetFilters = () => {
    setBrand(''); setPriceMin(''); setPriceMax(''); setSort('default');
    setSearchParams({});
  };

  return (
    <div className="py-6 pb-12">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
          <span onClick={() => navigate('/')} className="cursor-pointer hover:text-blue-600">Trang chủ</span>
          <span>›</span>
          <span className="text-gray-800 font-medium">
            {selectedCategory ? selectedCategory.name : query ? `Tìm: "${query}"` : 'Tất cả sản phẩm'}
          </span>
        </nav>

        <div className="grid grid-cols-[240px_1fr] gap-6 md:grid-cols-1">
          {/* Filter Sidebar */}
          <aside className="sticky top-20 self-start">
            <Card size="small" title={<span className="font-semibold flex items-center gap-2"><FilterOutlined /> Bộ lọc</span>}
              extra={<Button size="small" onClick={resetFilters}>Xóa lọc</Button>}
            >
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Danh mục</p>
                  <Radio.Group
                    value={categoryId}
                    onChange={e => e.target.value ? setSearchParams({ category: e.target.value }) : setSearchParams(query ? { q: query } : {})}
                    className="flex flex-col gap-1.5"
                  >
                    <Radio value={null}>Tất cả</Radio>
                    {categories.map(cat => <Radio key={cat.id} value={cat.id}>{cat.name} ({cat.productCount})</Radio>)}
                  </Radio.Group>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Thương hiệu</p>
                  <Radio.Group value={brand} onChange={e => setBrand(e.target.value)} className="flex flex-col gap-1.5">
                    <Radio value="">Tất cả</Radio>
                    {brands.map(b => <Radio key={b} value={b}>{b}</Radio>)}
                  </Radio.Group>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Khoảng giá (VND)</p>
                  <div className="flex items-center gap-2">
                    <InputNumber placeholder="Từ" value={priceMin} onChange={v => setPriceMin(v)} className="w-full" formatter={v => v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                    <span className="text-gray-400">—</span>
                    <InputNumber placeholder="Đến" value={priceMax} onChange={v => setPriceMax(v)} className="w-full" formatter={v => v?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                {query && <span>Kết quả cho <strong>"{query}"</strong> – </span>}
                <strong>{filtered.length}</strong> sản phẩm
              </p>
              <Select value={sort} onChange={setSort} className="w-44">
                <Select.Option value="default">Mặc định</Select.Option>
                <Select.Option value="price-asc">Giá thấp → cao</Select.Option>
                <Select.Option value="price-desc">Giá cao → thấp</Select.Option>
                <Select.Option value="rating">Đánh giá cao nhất</Select.Option>
                <Select.Option value="popular">Phổ biến nhất</Select.Option>
              </Select>
            </div>

            {filtered.length === 0 ? (
              <Empty description="Không tìm thấy sản phẩm phù hợp" className="py-16">
                <Button type="primary" onClick={resetFilters}>Xóa bộ lọc</Button>
              </Empty>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
                {filtered.map(p => (
                  <div key={p.id} className="product-card relative" onClick={() => navigate(`/products/${p.slug}`)}>
                    <div className="product-card-img">
                      <img src={p.thumbnail} alt={p.name} />
                      {p.featured && (
                        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">Nổi bật</span>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-xs text-gray-500 mb-1">{p.brand}</p>
                      <p className="font-semibold text-sm text-gray-800 mb-1.5 line-clamp-2">{p.name}</p>
                      <p className="text-base font-bold text-blue-600">{formatPrice(p.basePrice)}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Rate disabled defaultValue={p.rating} allowHalf className="text-xs" />
                        <span className="text-xs text-gray-400">({p.reviewCount})</span>
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
