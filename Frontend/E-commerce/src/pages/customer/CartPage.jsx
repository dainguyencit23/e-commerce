import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/mockData';
import {useAuth} from "../../context/AuthContext"
import './CartPage.css';

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();
  const shipping = subtotal >= 5000000 ? 0 : 30000;
  const total = subtotal + shipping;
  const {user} = useAuth();
  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1 className="page-title">Giỏ hàng</h1>
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <p className="empty-state-text">{user? "Giỏ hàng của bạn đang trống" : "Vui lòng đăng nhập để xem giỏ hàng."}</p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/products')}>Tiếp tục mua sắm</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng ({items.length} sản phẩm)</h1>
        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.variantId} className="cart-item">
                <img src={item.thumbnail} alt={item.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-variant text-sm text-gray">{item.variant}</p>
                  <p className="cart-item-price">{formatPrice(item.price)}</p>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(item.variantId, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item.variantId, item.qty + 1)}>+</button>
                </div>
                <p className="cart-item-total">{formatPrice(item.price * item.qty)}</p>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.variantId)}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary card">
            <div className="card-header"><span className="font-semibold">Tóm tắt đơn hàng</span></div>
            <div className="card-body">
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span>{shipping === 0 ? <span className="text-success">Miễn phí</span> : formatPrice(shipping)}</span>
              </div>
              {shipping === 0 && <p className="text-sm text-success" style={{marginBottom:8}}>✓ Miễn phí vận chuyển đơn từ 5 triệu</p>}
              <div className="divider" />
              <div className="summary-row summary-total">
                <span>Tổng cộng</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button className="btn btn-primary w-full btn-lg mt-4" onClick={() => navigate('/checkout')}>
                Thanh toán →
              </button>
              <button className="btn btn-secondary w-full mt-2" onClick={() => navigate('/products')}>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
