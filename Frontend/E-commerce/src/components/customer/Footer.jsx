import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-10 mt-auto">
      <div className="container">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:grid-cols-2 mb-8">
          <div>
            <div className="text-white font-bold text-xl mb-3">🛒 TechShop</div>
            <p className="text-sm leading-relaxed mb-4">Nền tảng mua sắm công nghệ uy tín hàng đầu Việt Nam. Cam kết chính hãng, bảo hành đầy đủ.</p>
            <div className="flex gap-3 text-xl">
              <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">📘</a>
              <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">📷</a>
              <a href="#" aria-label="YouTube" className="hover:text-white transition-colors">▶️</a>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold mb-1">Sản phẩm</h4>
            {[['1','Điện thoại'],['2','Laptop'],['4','Tai nghe'],['5','Đồng hồ thông minh'],['6','Phụ kiện']].map(([id,name]) => (
              <Link key={id} to={`/products?category=${id}`} className="text-sm hover:text-white transition-colors">{name}</Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold mb-1">Hỗ trợ</h4>
            <Link to="/support" className="text-sm hover:text-white transition-colors">Trung tâm hỗ trợ</Link>
            <Link to="/orders" className="text-sm hover:text-white transition-colors">Tra cứu đơn hàng</Link>
            <a href="#" className="text-sm hover:text-white transition-colors">Chính sách đổi trả</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Chính sách bảo hành</a>
            <a href="#" className="text-sm hover:text-white transition-colors">Hướng dẫn mua hàng</a>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-white font-semibold mb-1">Liên hệ</h4>
            <p className="text-sm">📍 123 Nguyễn Huệ, Q1, TP.HCM</p>
            <p className="text-sm">📞 1800 1234 (miễn phí)</p>
            <p className="text-sm">✉️ support@techshop.vn</p>
            <p className="text-sm">🕐 8:00 - 22:00 hàng ngày</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm">© 2024 TechShop. All rights reserved.</p>
          <div className="flex gap-2 text-xl">
            <span>💳</span><span>🏦</span><span>📱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
