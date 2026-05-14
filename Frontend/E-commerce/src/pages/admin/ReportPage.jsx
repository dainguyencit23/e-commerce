import { Card, Table } from 'antd';
import { revenueByMonth, dashboardStats, formatPrice } from '../../data/mockData';

export default function ReportPage() {
  const s = dashboardStats;
  const maxRev = Math.max(...revenueByMonth.map(r => r.revenue));
  const totalRevenue = revenueByMonth.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = revenueByMonth.reduce((sum, r) => sum + r.orders, 0);

  const summaryStats = [
    { icon: '💰', label: 'Tổng doanh thu (năm 2024)', value: formatPrice(totalRevenue), color: '#2563eb' },
    { icon: '🛒', label: 'Tổng đơn hàng (năm 2024)', value: totalOrders, color: '#10b981' },
    { icon: '💡', label: 'Doanh thu trung bình / tháng', value: formatPrice(Math.round(totalRevenue / revenueByMonth.length)), color: '#f59e0b' },
  ];

  const monthlyColumns = [
    { title: 'Tháng', dataIndex: 'month', key: 'month' },
    { title: 'Đơn hàng', dataIndex: 'orders', key: 'orders', render: v => <span className="font-semibold">{v}</span> },
    { title: 'Khách mới', dataIndex: 'customers', key: 'customers' },
    { title: 'TB đơn', key: 'avg', render: (_, r) => formatPrice(Math.round(r.revenue / r.orders)) },
  ];

  const topProductsColumns = [
    { title: '#', key: 'rank', width: 40, render: (_, __, i) => (
      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">{i+1}</div>
    )},
    { title: 'Sản phẩm', dataIndex: 'name', key: 'name', render: v => <span className="font-medium">{v}</span> },
    { title: 'Số lượng bán', dataIndex: 'sold', key: 'sold', render: v => `${v} sản phẩm` },
    { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', render: v => <span className="text-blue-600 font-semibold">{formatPrice(v)}</span> },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
        {summaryStats.map(stat => (
          <Card key={stat.label}>
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 rounded-xl flex items-center justify-center text-2xl" style={{ background: stat.color + '18', width: 52, height: 52 }}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-1">
        <Card title="Doanh thu theo tháng">
          <div className="flex flex-col">
            {revenueByMonth.map(r => {
              const pct = (r.revenue / maxRev) * 100;
              return (
                <div key={r.month} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs text-gray-500 w-10 flex-shrink-0">{r.month}</span>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="rev-bar-fill h-full" style={{ width: pct + '%' }} />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-24 text-right">{formatPrice(r.revenue)}</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Đơn hàng & Khách hàng mới">
          <Table columns={monthlyColumns} dataSource={revenueByMonth} rowKey="month" pagination={false} size="small" />
        </Card>
      </div>

      <Card title="Top sản phẩm bán chạy">
        <Table columns={topProductsColumns} dataSource={s.topProducts} rowKey="productId" pagination={false} size="small" />
      </Card>
    </div>
  );
}
