import React, { useMemo, useState } from 'react';
import { Avatar, Button, Drawer, Dropdown, Grid, Layout, Menu, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  ApartmentOutlined, BankOutlined, CodeOutlined, DashboardOutlined,
  FileAddOutlined, FileTextOutlined, LogoutOutlined, MenuOutlined,
  SettingOutlined, SolutionOutlined, TeamOutlined, UserOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Header, Sider, Content } = Layout;

type NavItem = { key: string; icon: React.ReactNode; label: string; roles?: string[] };

const navItems: NavItem[] = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/positions', icon: <SolutionOutlined />, label: '岗位管理', roles: ['admin', 'hr'] },
  { key: '/question-banks', icon: <BankOutlined />, label: '题库管理', roles: ['admin', 'hr'] },
  { key: '/resumes', icon: <FileTextOutlined />, label: '简历管理' },
  { key: '/interviews', icon: <TeamOutlined />, label: '面试管理' },
  { key: '/coding-tests', icon: <CodeOutlined />, label: '笔试管理', roles: ['admin', 'hr'] },
  { key: '/offers', icon: <FileAddOutlined />, label: 'Offer 管理', roles: ['admin', 'hr'] },
  { key: '/offers/templates', icon: <FileTextOutlined />, label: 'Offer 模板', roles: ['admin', 'hr'] },
  { key: '/workflows', icon: <ApartmentOutlined />, label: '工作流' },
  { key: '/settings/users', icon: <SettingOutlined />, label: '用户管理', roles: ['admin'] },
];

const Brand = ({ compact = false }: { compact?: boolean }) => (
  <div className={`brand app-brand${compact ? ' app-brand--compact' : ''}`}>
    <span className="brand__mark">AI</span>
    {!compact && <span className="brand__name">Interview</span>}
  </div>
);

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.lg;
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = (user as any)?.role?.value ?? (user as any)?.role;
  const visibleItems = useMemo(() => navItems.filter(item => !item.roles || item.roles.includes(role)), [role]);
  const selectedKey = [...visibleItems].sort((a, b) => b.key.length - a.key.length)
    .find(item => location.pathname === item.key || location.pathname.startsWith(`${item.key}/`))?.key;
  const pageTitle = location.pathname.startsWith('/settings/profile') ? '个人设置'
    : location.pathname.startsWith('/settings/system') ? '系统设置'
      : location.pathname.startsWith('/workflows/') ? '工作流编辑'
        : visibleItems.find(item => item.key === selectedKey)?.label || 'AI Interview';
  const isWorkspace = /^\/interviews\/[^/]+\/score/.test(location.pathname) || /^\/workflows\/[^/]+/.test(location.pathname);

  const menuGroups = [
    { key: 'workspace', label: '工作台', items: visibleItems.filter(item => item.key === '/dashboard') },
    { key: 'recruitment', label: '招聘管理', items: visibleItems.filter(item => !['/dashboard', '/workflows', '/settings/users'].includes(item.key)) },
    { key: 'automation', label: '自动化与设置', items: visibleItems.filter(item => ['/workflows', '/settings/users'].includes(item.key)) },
  ];
  const menuItems: MenuProps['items'] = menuGroups.filter(group => group.items.length).map(group => ({
    type: 'group',
    key: group.key,
    label: group.label,
    children: group.items.map(({ key, icon, label }) => ({ key, icon, label })),
  }));

  const handleNavigate = (key: string) => {
    navigate(key);
    setMobileOpen(false);
  };
  const navigation = <Menu mode="inline" selectedKeys={selectedKey ? [selectedKey] : []} items={menuItems} onClick={({ key }) => handleNavigate(key)} className="app-menu" />;
  const userMenu: MenuProps = {
    items: [
      { key: 'profile', label: '个人中心', icon: <UserOutlined />, onClick: () => navigate('/settings/profile') },
      ...(role === 'admin' ? [{ key: 'settings', label: '系统设置', icon: <SettingOutlined />, onClick: () => navigate('/settings/system') }] : []),
      { type: 'divider' },
      { key: 'logout', label: '退出登录', icon: <LogoutOutlined />, onClick: () => { logout(); navigate('/login'); } },
    ],
  };
  const roleLabel = role === 'admin' ? '系统管理员' : role === 'hr' ? '招聘负责人' : '面试官';

  return (
    <Layout className="app-layout">
      {!isMobile && (
        <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={248} collapsedWidth={80} theme="light" className="app-sider">
          <Brand compact={collapsed} />
          {navigation}
          <div className="app-sider__footer">{!collapsed && <><span className="status-dot" /> 招聘系统运行中</>}</div>
        </Sider>
      )}
      <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} placement="left" width={280} closable={false} styles={{ body: { padding: 0 } }}>
        <Brand />
        {navigation}
      </Drawer>
      <Layout className={`app-main${collapsed && !isMobile ? ' app-main--collapsed' : ''}`}>
        <Header className="app-header">
          <div className="app-header__title">
            {isMobile && <Button type="text" icon={<MenuOutlined />} onClick={() => setMobileOpen(true)} aria-label="打开导航" />}
            <div><span className="app-header__caption">AI Interview</span><h2>{pageTitle}</h2></div>
          </div>
          <Space size="middle">
            <div className="app-workspace-label"><span className="status-dot" />招聘工作台</div>
            <Dropdown menu={userMenu} placement="bottomRight">
              <button className="app-user" type="button">
                <Avatar className="app-user__avatar">{user?.full_name?.slice(0, 1) || <UserOutlined />}</Avatar>
                <span className="app-user__copy"><strong>{user?.full_name || user?.email}</strong><small>{roleLabel}</small></span>
              </button>
            </Dropdown>
          </Space>
        </Header>
        <Content className={`app-content${isWorkspace ? ' app-content--workspace' : ''}`}>
          <div className="page-container"><Outlet /></div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
