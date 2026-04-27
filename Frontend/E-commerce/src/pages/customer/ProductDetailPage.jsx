import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReviewsByProduct, getCategoryById, formatPrice } from '../../data/mockData';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useToast, ToastContainer } from '../../hooks/useToast';
import './ProductDetailPage.css';

function StarRating({ rating, size = 14 }) {
  return (
    <div className="stars">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={`star${s > Math.round(rating) ? ' empty' : ''}`} style={{ fontSize: size }}>★</span>
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toasts, show: showToast } = useToast();
  const { getProductBySlug } = useProducts();

  const product = getProductBySlug(slug);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0] || null);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <p style={{ marginTop: 16, fontSize: 18 }}>Không tìm thấy sản phẩm</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate('/products')}>Quay lại</button>
      </div>
    );
  }

  const reviews = getReviewsByProduct(product.id);
  const category = getCategoryById(product.categoryId);
  const allImages = [product.thumbnail, ...(product.images || [])];

  const handleAddToCart = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để thêm vào giỏ hàng', 'warning');
      return;
    }
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, qty);
    setAdded(true);
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) {
      showToast('Vui lòng đăng nhập để mua hàng', 'warning');
      return;
    }
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, qty);
    navigate('/cart');
  };

  return (
    <>
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')}>Trang chủ</span>
          <span>›</span>
          <span onClick={() => navigate(`/products?category=${product.categoryId}`)}>{category?.name}</span>
          <span>›</span>
          <span className="active">{product.name}</span>
        </div>

        <div className="detail-grid">
          {/* Images */}
          <div className="detail-images">
            <div className="main-image">
              <img src={allImages[activeImg]} alt={product.name} />
            </div>
            <div className="thumb-list">
              {allImages.map((img, i) => (
                <div key={i} className={`thumb${activeImg === i ? ' active' : ''}`} onClick={() => setActiveImg(i)}>
                  <img src={img} alt={`${product.name} ${i+1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="detail-info">
            <p className="detail-brand">{product.brand}</p>
            <h1 className="detail-name">{product.name}</h1>

            <div className="detail-rating">
              <StarRating rating={product.rating} size={16} />
              <span className="rating-score">{product.rating}</span>
              <span className="text-gray text-sm">({product.reviewCount} đánh giá)</span>
              <span className="detail-stock">{selectedVariant ? `Còn ${selectedVariant.stock} sản phẩm` : `Còn ${product.stock} sản phẩm`}</span>
            </div>

            <div className="detail-price">
              {formatPrice(selectedVariant?.price || product.basePrice)}
            </div>

            <p className="detail-desc">{product.description}</p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="detail-variants">
                <p className="variant-label">Phiên bản: <strong>{selectedVariant?.label}</strong></p>
                <div className="variant-list">
                  {product.variants.map(v => (
                    <button
                      key={v.id}
                      className={`variant-btn${selectedVariant?.id === v.id ? ' active' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="detail-qty">
              <p className="variant-label">Số lượng:</p>
              <div className="qty-control">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}>+</button>
              </div>
            </div>

            {/* Actions */}
            <div className="detail-actions">
              <button className={`btn btn-lg btn-primary${added ? ' btn-success' : ''}`} onClick={handleAddToCart} style={{ flex: 1 }}>
                {added ? '✓ Đã thêm vào giỏ' : '🛒 Thêm vào giỏ hàng'}
              </button>
              <button className="btn btn-lg btn-outline" onClick={handleBuyNow} style={{ flex: 1 }}>
                Mua ngay
              </button>
            </div>

            {/* Policies */}
            <div className="detail-policies">
              {[['✅', 'Chính hãng 100%'], ['🔄', 'Đổi trả 30 ngày'], ['🛡️', 'Bảo hành 12 tháng'], ['🚚', 'Miễn phí giao hàng']].map(([icon, text]) => (
                <div key={text} className="policy-item"><span>{icon}</span><span>{text}</span></div>
              ))}
            </div>
          </div>
        </div>

        {/* Specs + Reviews */}
        <div className="detail-bottom">
          {/* Specs */}
          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="card detail-specs">
              <div className="card-header"><span className="font-semibold text-lg">Thông số kỹ thuật</span></div>
              <div className="card-body">
                <table className="specs-table">
                  <tbody>
                    {Object.entries(product.specs).map(([k, v]) => (
                      <tr key={k}>
                        <td className="specs-key">{k}</td>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card">
            <div className="card-header"><span className="font-semibold text-lg">Đánh giá từ khách hàng</span></div>
            <div className="card-body">
              {reviews.length === 0 ? (
                <div className="empty-state"><div className="empty-state-icon">💬</div><p>Chưa có đánh giá nào</p></div>
              ) : (
                <div className="reviews-list">
                  {reviews.map(r => (
                    <div key={r.id} className="review-item">
                      <div className="review-header">
                        <div className="review-avatar">{r.customerName[0]}</div>
                        <div>
                          <p className="review-name">{r.customerName} {r.verified && <span className="badge badge-green text-sm">Đã mua</span>}</p>
                          <StarRating rating={r.rating} />
                        </div>
                        <span className="review-date text-sm text-gray">{r.date}</span>
                      </div>
                      <p className="review-comment">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    <ToastContainer toasts={toasts} />
    </>
  );
}
