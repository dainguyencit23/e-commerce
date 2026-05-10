import { Link } from 'react-router-dom';
import { Card, Statistic, Table, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { dashboardStats, revenueByMonth, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR, formatPrice } from '../../data/mockData';

const STATUS_TAG_COLOR = { pending:'orange', confirmed:'blue', shipping:'cyan', delivered:'green', cancelled:'red' };

function StatCard({ icon, label, value, growth, color }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: color + '18', width: 52, height: 52 }}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
          {growth !== undefined && (
            <p className={`text-xs font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {growth >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(growth)}% so với tháng trước
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function RevenueBar({ month, revenue, max }) {
  const pct = (revenue / max) * 100;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-xs text-gray-500 w-10 flex-shrink-0">{month}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className="rev-bar-fill h-full" style={{ width: pct + '%' }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-24 text-right">{formatPrice(revenue)}</span>
    </div>
  );
}

export default function DashboardPage() {
  const s = dashboardStats;
  const maxRev = Math.max(...revenueByMonth.map(r => r.revenue));

  const topProductsColumns = [
    { title: '#', dataIndex: 'rank', key: 'rank', width: 40, render: (_, __, i) => (
      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{i+1}</div>
    )},
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name', render: v => <span className="font-medium">{v}</span> },
    { title: 'Đã bán', dataIndex: 'sold', key: 'sold' },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: v => <span className="text-blue-600 font-semibold">{formatPrice(v)}</span> },
  ];

  const recentOrderColumns = [
    { title: 'Mã đơn', dataIndex: 'id', key: 'id', render: v => <span className="text-blue-600 font-semibold">#{v}</span> },
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Ngày', dataIndex: 'date', key: 'date', render: v => <span className="text-gray-500">{v}</span> },
    { title: 'Tổng tiền', dataIndex: 'total', key: 'total', render: v => <span className="font-semibold">{formatPrice(v)}</span> },
    { title: 'Thanh toán', dataIndex: 'paymentStatus', key: 'paymentStatus', render: v => (
      <Tag color={v === 'paid' ? 'green' : 'orange'}>{v === 'paid' ? 'Đã TT' : 'Chưa TT'}</Tag>
    )},
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: v => (
      <Tag color={STATUS_TAG_COLOR[v]}>{ORDER_STATUS_LABEL[v]}</Tag>
    )},
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 lg:grid-cols-2">
        <StatCard icon="💰" label="Tổng doanh thu" value={formatPrice(s.totalRevenue)} growth={s.revenueGrowth} color="#2563eb" />
        <StatCard icon="🛒" label="Tổng đơn hàng" value={s.totalOrders} growth={s.ordersGrowth} color="#10b981" />
        <StatCard icon="👥" label="Khách hàng" value={s.totalCustomers} growth={s.customersGrowth} color="#f59e0b" />
        <StatCard icon="📦" label="Sản phẩm" value={s.totalProducts} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
        <Card title="Doanh thu theo tháng">
          <div className="flex flex-col">
            {revenueByMonth.map(r => <RevenueBar key={r.month} month={r.month} revenue={r.revenue} max={maxRev} />)}
          </div>
        </Card>

        <Card
          title="Top sản phẩm bán chạy"
          extra={<Link to="/admin/products" className="text-blue-600 text-sm">Xem tất cả</Link>}
        >
          <Table
            columns={topProductsColumns}
            dataSource={s.topProducts}
            rowKey="productId"
            pagination={false}
            size="small"
          />
        </Card>
      </div>

      <Card
        title="Đơn hàng gần đây"
        extra={<Link to="/admin/orders" className="text-blue-600 text-sm">Xem tất cả</Link>}
      >
        <Table
          columns={recentOrderColumns}
          dataSource={s.recentOrders}
          rowKey="id"
          pagination={false}
          size="small"
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
