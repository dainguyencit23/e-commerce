import { useLocation } from 'react-router-dom';

const TITLE_MAP = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Quản lý sản phẩm',
  '/admin/orders': 'Quản lý đơn hàng',
  '/admin/customers': 'Quản lý khách hàng',
  '/admin/categories': 'Quản lý danh mục',
  '/admin/promotions': 'Quản lý khuyến mãi',
  '/admin/reports': 'Báo cáo doanh thu',
  '/admin/payment-methods': 'Phương thức thanh toán',
  '/admin/staff': 'Quản lý nhân viên',
  '/staff/orders': 'Xử lý đơn hàng',
  '/staff/support': 'Hỗ trợ khách hàng',
  '/staff/inventory': 'Quản lý kho',
};

export default function AdminHeader() {
  const { pathname } = useLocation();
  const title = TITLE_MAP[pathname] || 'Admin';
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-6 h-16">
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <span className="text-sm text-gray-500">
        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
    </header>
  );
}
