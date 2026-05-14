import { useNavigate } from 'react-router-dom';
import { Button, Card, Divider, InputNumber, Empty, Tag } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

export default function CartPage() {
  const { items, removeFromCart, updateQty, subtotal } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();
  const shipping = subtotal >= 5000000 ? 0 : 30000;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="py-8 pb-16">
        <div className="container">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng</h1>
          <Empty
            image={<ShoppingOutlined className="text-6xl text-gray-300" />}
            description={user ? 'Giỏ hàng của bạn đang trống' : 'Vui lòng đăng nhập để xem giỏ hàng.'}
            className="py-16"
          >
            <Button type="primary" onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 pb-16">
      <div className="container">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Giỏ hàng ({items.length} sản phẩm)</h1>

        <div className="grid grid-cols-[1fr_320px] gap-6 md:grid-cols-1">
          {/* Items */}
          <div className="flex flex-col gap-3">
            {items.map(item => (
              <div key={item.variantId} className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                <img
                  src={item.thumbnail}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.variant}</p>
                  <p className="text-blue-600 font-bold mt-1">{formatPrice(item.price)}</p>
                </div>
                <InputNumber
                  min={1}
                  value={item.qty}
                  onChange={v => updateQty(item.variantId, v || 1)}
                  className="w-20"
                  size="small"
                />
                <p className="font-bold text-gray-800 w-24 text-right">{formatPrice(item.price * item.qty)}</p>
                <Button
                  type="text"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => removeFromCart(item.variantId)}
                />
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="self-start">
            <Card title="Tóm tắt đơn hàng">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>
                    {shipping === 0
                      ? <Tag color="green">Miễn phí</Tag>
                      : formatPrice(shipping)
                    }
                  </span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600">✓ Miễn phí vận chuyển đơn từ 5 triệu</p>
                )}
                <Divider className="my-2" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(total)}</span>
                </div>
                <Button type="primary" size="large" block className="mt-4" onClick={() => navigate('/checkout')}>
                  Thanh toán →
                </Button>
                <Button block onClick={() => navigate('/products')}>
                  Tiếp tục mua sắm
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
