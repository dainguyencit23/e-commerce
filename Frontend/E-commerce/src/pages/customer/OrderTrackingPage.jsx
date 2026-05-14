import { useLocation } from 'react-router-dom';
import { Tag, Alert, Empty, Steps } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { orders, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatPrice } from '../../data/mockData';

const TIMELINE_STATUS = ['pending', 'confirmed', 'shipping', 'delivered'];

const STATUS_TAG_COLOR = {
  pending: 'orange', confirmed: 'blue', shipping: 'cyan', delivered: 'green', cancelled: 'red',
};

export default function OrderTrackingPage() {
  const { user } = useAuth();
  const location = useLocation();
  const justOrdered = location.state?.justOrdered;

  const userOrders = user
    ? orders.filter(o => o.customerEmail === user.email)
    : orders.slice(0, 2);

  return (
    <div className="py-8 pb-16">
      <div className="container">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>

        {justOrdered && (
          <Alert
            message="Đặt hàng thành công!"
            description="Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể."
            type="success"
            showIcon
            className="mb-6"
          />
        )}

        {userOrders.length === 0 ? (
          <Empty description="Bạn chưa có đơn hàng nào" className="py-16" />
        ) : (
          <div className="flex flex-col gap-4">
            {userOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="font-bold text-blue-600">#{order.id}</span>
                    <span className="text-sm text-gray-500"> · {order.date}</span>
                  </div>
                  <Tag color={STATUS_TAG_COLOR[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Tag>
                </div>

                {order.status !== 'cancelled' && (
                  <Steps
                    size="small"
                    current={TIMELINE_STATUS.indexOf(order.status)}
                    items={TIMELINE_STATUS.map(s => ({ title: ORDER_STATUS_LABEL[s] }))}
                    className="mb-4"
                  />
                )}

                <div className="flex flex-col gap-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} - {item.variant}</span>
                      <div className="flex gap-4">
                        <span className="text-gray-400">x{item.qty}</span>
                        <span className="font-semibold">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div>
                    <span className="text-sm text-gray-500">{order.paymentMethod} · </span>
                    <span className={`text-sm font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}`}>
                      {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                  <div className="text-sm">
                    Tổng: <strong className="text-lg text-blue-600">{formatPrice(order.total)}</strong>
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
