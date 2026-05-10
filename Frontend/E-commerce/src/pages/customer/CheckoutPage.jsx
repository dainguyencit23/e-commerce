import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Steps, Card, Form, Input, Select, Button, Divider, Tag, Radio } from 'antd';
import { useCart } from '../../context/CartContext';
import { paymentMethods, formatPrice } from '../../data/mockData';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form] = Form.useForm();
  const [payMethod, setPayMethod] = useState('COD');
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [formValues, setFormValues] = useState({});
  const shipping = subtotal >= 5000000 ? 0 : 30000;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    if (coupon === 'SALE10') { setDiscount(Math.min(subtotal * 0.1, 1000000)); setCouponMsg('✅ Áp dụng thành công: Giảm 10%'); }
    else if (coupon === 'FREESHIP') { setDiscount(30000); setCouponMsg('✅ Áp dụng thành công: Miễn phí ship'); }
    else if (coupon === 'WELCOME50') { setDiscount(50000); setCouponMsg('✅ Áp dụng thành công: Giảm 50,000đ'); }
    else setCouponMsg('❌ Mã giảm giá không hợp lệ');
  };

  const handleOrder = () => {
    clearCart();
    navigate('/orders', { state: { justOrdered: true } });
  };

  if (items.length === 0) { navigate('/cart'); return null; }

  const enabledPayMethods = paymentMethods.filter(p => p.enabled);
  const selectedPayMethod = enabledPayMethods.find(p => p.code === payMethod);

  const stepsItems = [
    { title: 'Thông tin giao hàng' },
    { title: 'Thanh toán' },
    { title: 'Xác nhận' },
  ];

  return (
    <div className="py-8 pb-16">
      <div className="container">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Thanh toán</h1>

        <Steps current={step} items={stepsItems} className="mb-8" />

        <div className="grid grid-cols-[1fr_340px] gap-6 md:grid-cols-1">
          {/* Form area */}
          <div>
            {step === 0 && (
              <Card title="Thông tin giao hàng">
                <Form form={form} layout="vertical" onFinish={values => { setFormValues(values); setStep(1); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item label="Họ và tên *" name="name" rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input placeholder="Nguyễn Văn A" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại *" name="phone" rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Input placeholder="09xxxxxxxx" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ *" name="address" rules={[{ required: true, message: 'Bắt buộc' }]} className="col-span-2">
                      <Input placeholder="Số nhà, tên đường" />
                    </Form.Item>
                    <Form.Item label="Tỉnh/Thành phố *" name="city" rules={[{ required: true, message: 'Bắt buộc' }]}>
                      <Select placeholder="Chọn tỉnh/thành">
                        {['TP. Hồ Chí Minh','Hà Nội','Đà Nẵng','Cần Thơ','Hải Phòng','Bình Dương'].map(c => (
                          <Select.Option key={c} value={c}>{c}</Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Ghi chú" name="note" className="col-span-2">
                      <Input.TextArea rows={3} placeholder="Ghi chú cho đơn hàng (không bắt buộc)" />
                    </Form.Item>
                  </div>
                  <Button type="primary" htmlType="submit" size="large">Tiếp tục →</Button>
                </Form>
              </Card>
            )}

            {step === 1 && (
              <Card title="Phương thức thanh toán">
                <Radio.Group value={payMethod} onChange={e => setPayMethod(e.target.value)} className="w-full">
                  <div className="flex flex-col gap-3">
                    {enabledPayMethods.map(p => (
                      <Radio key={p.code} value={p.code} className="w-full">
                        <label className={`flex items-center gap-3 ml-2 cursor-pointer p-3 rounded-lg border transition-colors w-full ${payMethod === p.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                          <span className="text-2xl">{p.icon}</span>
                          <div>
                            <p className="font-medium text-sm">{p.name}</p>
                            <p className="text-xs text-gray-500">{p.description}</p>
                          </div>
                        </label>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
                <div className="flex gap-3 mt-5">
                  <Button onClick={() => setStep(0)}>← Quay lại</Button>
                  <Button type="primary" size="large" onClick={() => setStep(2)}>Xem lại đơn →</Button>
                </div>
              </Card>
            )}

            {step === 2 && (
              <Card title="Xác nhận đơn hàng">
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2">Thông tin giao hàng</h4>
                    <p><strong>{formValues.name}</strong> · {formValues.phone}</p>
                    <p className="text-gray-600 text-sm">{formValues.address}, {formValues.city}</p>
                    {formValues.note && <p className="text-gray-500 text-xs mt-1">Ghi chú: {formValues.note}</p>}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-1">Thanh toán</h4>
                    <p className="text-sm">{selectedPayMethod?.icon} {selectedPayMethod?.name}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2">Sản phẩm ({items.length})</h4>
                    {items.map(item => (
                      <div key={item.variantId} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">{item.name} - {item.variant} × {item.qty}</span>
                        <span className="font-medium">{formatPrice(item.price * item.qty)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={() => setStep(1)}>← Quay lại</Button>
                    <Button type="primary" size="large" onClick={handleOrder}>✓ Đặt hàng</Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="self-start">
            <Card title={`Đơn hàng (${items.length})`}>
              <div className="flex flex-col gap-3 mb-4">
                {items.map(item => (
                  <div key={item.variantId} className="flex items-center gap-3">
                    <img src={item.thumbnail} alt={item.name} className="w-10 h-10 rounded object-cover bg-gray-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.variant} × {item.qty}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Mã giảm giá"
                  value={coupon}
                  onChange={e => { setCoupon(e.target.value.toUpperCase()); setCouponMsg(''); }}
                  size="small"
                />
                <Button size="small" onClick={applyCoupon}>Áp dụng</Button>
              </div>
              {couponMsg && (
                <p className={`text-xs mb-3 ${couponMsg.includes('❌') ? 'text-red-500' : 'text-green-600'}`}>{couponMsg}</p>
              )}

              <Divider className="my-3" />
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600">Tạm tính</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600">Vận chuyển</span>
                <span>{shipping === 0 ? <Tag color="green">Miễn phí</Tag> : formatPrice(shipping)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600 mb-1.5">
                  <span>Giảm giá</span><span>−{formatPrice(discount)}</span>
                </div>
              )}
              <Divider className="my-3" />
              <div className="flex justify-between font-bold text-lg">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
