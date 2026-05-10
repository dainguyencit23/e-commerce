import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [form] = Form.useForm();

  if (!user) { navigate('/login'); return null; }

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const sideNav = [
    { key: 'profile', icon: <UserOutlined />, label: 'Thông tin cá nhân' },
    { key: 'security', icon: <LockOutlined />, label: 'Bảo mật' },
    { key: 'orders', icon: <ShoppingOutlined />, label: 'Đơn hàng' },
  ];

  return (
    <div className="py-8 pb-16">
      <div className="container">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>

        <div className="grid grid-cols-[220px_1fr] gap-6 md:grid-cols-1">
          {/* Sidebar */}
          <Card className="self-start">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center mx-auto mb-2">
                {user.name[0]}
              </div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <nav className="flex flex-col gap-1">
              {sideNav.map(item => (
                <button
                  key={item.key}
                  onClick={() => item.key === 'orders' ? navigate('/orders') : setTab(item.key)}
                  className={`flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    tab === item.key ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogoutOutlined /> Đăng xuất
              </button>
            </nav>
          </Card>

          {/* Content */}
          <div>
            {tab === 'profile' && (
              <Card title="Thông tin cá nhân">
                {saved && <Alert message="Lưu thành công!" type="success" showIcon className="mb-4" />}
                <Form form={form} layout="vertical" initialValues={{ name: user.name }} onFinish={handleSave}>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
                    <Form.Item label="Họ và tên" name="name">
                      <Input />
                    </Form.Item>
                    <Form.Item label="Email">
                      <Input value={user.email} disabled />
                      <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone">
                      <Input placeholder="09xxxxxxxx" />
                    </Form.Item>
                    <Form.Item label="Địa chỉ" name="address">
                      <Input placeholder="Địa chỉ của bạn" />
                    </Form.Item>
                  </div>
                  <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
                </Form>
              </Card>
            )}

            {tab === 'security' && (
              <Card title="Đổi mật khẩu">
                <div className="max-w-sm">
                  <Form layout="vertical">
                    <Form.Item label="Mật khẩu hiện tại">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item label="Mật khẩu mới">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Form.Item label="Xác nhận mật khẩu mới">
                      <Input.Password placeholder="••••••••" />
                    </Form.Item>
                    <Button type="primary" onClick={() => alert('Demo: Chưa kết nối backend')}>
                      Đổi mật khẩu
                    </Button>
                  </Form>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
