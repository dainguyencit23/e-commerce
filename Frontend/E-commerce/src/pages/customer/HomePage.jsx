import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Rate } from 'antd';
import { categories, promotions, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="product-card-img">
        <img src={product.thumbnail} alt={product.name} />
      </div>
      <div className="p-3.5">
        <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
        <p className="font-semibold text-sm text-gray-800 mb-1.5 line-clamp-2">{product.name}</p>
        <p className="text-base font-bold text-blue-600">{formatPrice(product.basePrice)}</p>
        <div className="flex items-center gap-1 mt-1.5">
          <Rate disabled defaultValue={product.rating} allowHalf className="text-xs" />
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>
      </div>
    </div>
  );
}

const SLIDES = [
  { id: 1, title: 'iPhone 15 Pro Max', sub: 'Chip A17 Pro – Camera 48MP chuyên nghiệp', cta: 'Mua ngay', link: '/products/iphone-15-pro-max', bg: 'linear-gradient(135deg,#1e3a5f,#2563eb)' },
  { id: 2, title: 'MacBook Pro M3', sub: 'Hiệu năng vượt trội – Pin 18 giờ', cta: 'Khám phá', link: '/products/macbook-pro-14-m3-pro', bg: 'linear-gradient(135deg,#111827,#374151)' },
  { id: 3, title: 'Samsung S24 Ultra', sub: 'S Pen tích hợp – Camera 200MP', cta: 'Xem ngay', link: '/products/samsung-galaxy-s24-ultra', bg: 'linear-gradient(135deg,#1e40af,#7c3aed)' },
];

const CAT_ICON = { 'dien-thoai':'📱','laptop':'💻','may-tinh-bang':'📟','tai-nghe':'🎧','dong-ho-thong-minh':'⌚','phu-kien':'🔌','man-hinh':'🖥️','ban-phim-chuot':'⌨️' };

export default function HomePage() {
  const { getFeaturedProducts } = useProducts();
  const featured = getFeaturedProducts();
  const [slide, setSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4000);
    return () => clearInterval(t);
  }, []);

  const activePromos = promotions.filter(p => p.status === 'active');

  return (
    <div>
      {/* Hero Slider */}
      <section className="py-16 px-4 transition-all duration-500" style={{ background: SLIDES[slide].bg }}>
        <div className="container text-center text-white">
          <h1 className="text-4xl font-bold mb-3 md:text-2xl">{SLIDES[slide].title}</h1>
          <p className="text-lg text-blue-100 mb-6">{SLIDES[slide].sub}</p>
          <Link to={SLIDES[slide].link}>
            <Button size="large" className="bg-white text-blue-600 border-0 font-semibold hover:bg-blue-50 px-8">
              {SLIDES[slide].cta}
            </Button>
          </Link>
          <div className="flex justify-center gap-2 mt-8">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === slide ? 'bg-white w-6' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Bar */}
      {activePromos.length > 0 && (
        <section className="bg-blue-50 py-3 border-b border-blue-100">
          <div className="container flex gap-6 overflow-x-auto">
            {activePromos.map(p => (
              <div key={p.code} className="flex items-center gap-2 whitespace-nowrap text-sm">
                <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{p.code}</span>
                <span className="text-gray-600">{p.description}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Danh mục <span className="text-blue-600">sản phẩm</span></h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center"
              >
                <div className="text-3xl">{CAT_ICON[cat.slug] || '📦'}</div>
                <p className="text-sm font-medium text-gray-700">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.productCount} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sản phẩm <span className="text-blue-600">nổi bật</span></h2>
            <Link to="/products">
              <Button>Xem tất cả →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12">
        <div className="container">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Tại sao chọn <span className="text-blue-600">TechShop?</span></h2>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {[
              { icon: '✅', title: 'Hàng chính hãng 100%', desc: 'Cam kết tất cả sản phẩm có nguồn gốc rõ ràng, tem chính hãng' },
              { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Giao hàng trong 24h tại TP.HCM, 2-3 ngày toàn quốc' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Chính sách đổi trả linh hoạt trong vòng 30 ngày' },
              { icon: '🛡️', title: 'Bảo hành tận nơi', desc: 'Hỗ trợ bảo hành tận nhà, không cần mang máy đến shop' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
