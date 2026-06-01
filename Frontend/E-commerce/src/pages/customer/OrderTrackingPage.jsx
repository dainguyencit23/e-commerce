import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tag, Alert, Empty, Steps } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { useOrders } from '../../context/OrderContext';

const STATUS_LABEL = { 0: 'Chờ xử lý', 1: 'Đang xử lý', 2: 'Đang giao', 3: 'Đã giao', 4: 'Đã hủy' };
const STATUS_COLOR = { 0: 'orange', 1: 'blue', 2: 'cyan', 3: 'green', 4: 'red' };
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const location = useLocation();
  const justOrdered = location.state?.justOrdered;
  const { orders, loading, fetchMyOrders } = useOrders();
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => { if (user) fetchMyOrders(activeFilter!==null? {status : activeFilter} : {}); }, [user, activeFilter]);

  return (
    <div className="py-8 pb-16">
      <div className="container">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>
          <div className="flex gap-2 flex-wrap mb-6">
          {[
            { label: 'Tất cả', value: null },
            { label: 'Chờ xử lý', value: 0 },
            { label: 'Đang xử lý', value: 1 },
            { label: 'Đang giao', value: 2 },
            { label: 'Đã giao', value: 3 },
            { label: 'Đã hủy', value: 4 },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeFilter === value
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {justOrdered && (
          <Alert message="Đặt hàng thành công!" description="Chúng tôi sẽ xử lý đơn hàng sớm nhất." type="success" showIcon className="mb-6" />
        )}

        {loading ? (
          <div className="text-center py-16 text-gray-400">Đang tải...</div>
        ) : orders.length === 0 ? (
          <Empty description="Bạn chưa có đơn hàng nào" className="py-16" />
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="font-bold text-gray-800">#{order.id.slice(0,8).toUpperCase()}</span>
                    <span>·</span>
                    <span>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status !== 4 && (
                      <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {order.status < 3 ? '🚚 Đang vận chuyển' : ''}
                      </span>
                    )}
                    <Tag color={STATUS_COLOR[order.status]} className="m-0">
                      {STATUS_LABEL[order.status]}
                    </Tag>
                  </div>
                </div>

                {/* Product rows */}
                <div className="divide-y divide-gray-50">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {item.imageUrl
                          ? <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">🛍️</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{item.productName}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Phân loại: {item.variantName}</p>
                        <p className="text-xs text-gray-400">× {item.orderQuantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-gray-800">{formatPrice(item.unitPrice)}</p>
                        <p className="text-xs text-gray-400">/ sản phẩm</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                  <span className="text-sm text-gray-500">{order.paymentMethodName}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      {order.items?.length} sản phẩm · Tổng tiền:
                    </span>
                    <span className="text-lg font-bold text-blue-600">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}
