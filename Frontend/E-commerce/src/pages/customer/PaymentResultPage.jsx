import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const responseCode = searchParams.get('vnp_ResponseCode');
  const orderId = searchParams.get('vnp_TxnRef');
  const amount = searchParams.get('vnp_Amount');
  const isSuccess = responseCode === '00';

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
      .format(Number(p) / 100);

  return (
    <div className="container py-16 flex justify-center">
      <div className="max-w-md w-full">
        {isSuccess ? (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle={
              <div className="text-left mt-4 space-y-2">
                <p>Mã đơn hàng: <strong>{orderId}</strong></p>
                {amount && <p>Số tiền: <strong>{formatPrice(amount)}</strong></p>}
              </div>
            }
            extra={[
              <Button type="primary" key="orders"
                onClick={() => navigate('/orders')}>
                Xem đơn hàng
              </Button>,
              <Button key="home"
                onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            ]}
          />
        ) : (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle={`Mã lỗi: ${responseCode} — Vui lòng thử lại hoặc chọn phương thức khác.`}
            extra={[
              <Button type="primary" key="retry"
                onClick={() => navigate(-1)}>
                Thử lại
              </Button>,
              <Button key="home"
                onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            ]}
          />
        )}
      </div>
    </div>
  );
}
