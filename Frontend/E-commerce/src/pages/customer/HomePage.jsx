import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { categories, promotions, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';
import './HomePage.css';

function StarRating({ rating }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star${s > Math.round(rating) ? ' empty' : ''}`}>★</span>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.slug}`)}>
      <div className="product-card-img">
        <img src={product.thumbnail} alt={product.name} />
      </div>
      <div className="product-card-body">
        <p className="product-card-brand">{product.brand}</p>
        <p className="product-card-name">{product.name}</p>
        <p className="product-card-price">{formatPrice(product.basePrice)}</p>
        <div className="product-card-rating">
          <StarRating rating={product.rating} />
          <span>({product.reviewCount})</span>
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
    <div className="home-page">
      {/* Hero Slider */}
      <section className="hero-slider" style={{ background: SLIDES[slide].bg }}>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">{SLIDES[slide].title}</h1>
            <p className="hero-sub">{SLIDES[slide].sub}</p>
            <Link to={SLIDES[slide].link} className="btn btn-lg hero-btn">{SLIDES[slide].cta}</Link>
          </div>
          <div className="hero-dots">
            {SLIDES.map((_, i) => (
              <button key={i} className={`hero-dot${i === slide ? ' active' : ''}`} onClick={() => setSlide(i)} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      {activePromos.length > 0 && (
        <section className="promo-bar">
          <div className="container">
            <div className="promo-list">
              {activePromos.map(p => (
                <div key={p.code} className="promo-item">
                  <span className="promo-code">{p.code}</span>
                  <span>{p.description}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="home-section">
        <div className="container">
          <h2 className="section-title">Danh mục <span>sản phẩm</span></h2>
          <div className="category-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                <div className="category-icon">{getCatIcon(cat.slug)}</div>
                <p className="category-name">{cat.name}</p>
                <p className="category-count">{cat.productCount} sản phẩm</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="home-section bg-white">
        <div className="container">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title" style={{marginBottom:0}}>Sản phẩm <span>nổi bật</span></h2>
            <Link to="/products" className="btn btn-outline btn-sm">Xem tất cả →</Link>
          </div>
          <div className="product-grid">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="home-section">
        <div className="container">
          <h2 className="section-title text-center">Tại sao chọn <span>TechShop?</span></h2>
          <div className="features-grid">
            {[
              { icon: '✅', title: 'Hàng chính hãng 100%', desc: 'Cam kết tất cả sản phẩm có nguồn gốc rõ ràng, tem chính hãng' },
              { icon: '🚚', title: 'Giao hàng nhanh', desc: 'Giao hàng trong 24h tại TP.HCM, 2-3 ngày toàn quốc' },
              { icon: '🔄', title: 'Đổi trả 30 ngày', desc: 'Chính sách đổi trả linh hoạt trong vòng 30 ngày' },
              { icon: '🛡️', title: 'Bảo hành tận nơi', desc: 'Hỗ trợ bảo hành tận nhà, không cần mang máy đến shop' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function getCatIcon(slug) {
  const map = { 'dien-thoai': '📱', 'laptop': '💻', 'may-tinh-bang': '📟', 'tai-nghe': '🎧', 'dong-ho-thong-minh': '⌚', 'phu-kien': '🔌', 'man-hinh': '🖥️', 'ban-phim-chuot': '⌨️' };
  return map[slug] || '📦';
}
