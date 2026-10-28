import React from 'react';
import { Button, Form, Input, message } from 'antd';
import { CheckCircleOutlined, LockOutlined, SafetyCertificateOutlined, ThunderboltOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/dashboard', { replace: true });
  }, [authLoading, isAuthenticated, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('username', values.email);
      formData.append('password', values.password);
      const res = await request.post('/auth/token', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      await login((res as any).access_token);
      message.success('登录成功');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      message.error('登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-shell">
      <section className="login-intro">
        <div className="brand login-brand"><span className="brand__mark">AI</span><span className="brand__name">Interview</span></div>
        <div className="login-intro__content">
          <div className="login-kicker"><ThunderboltOutlined /> 智能招聘工作台</div>
          <h1>让人才决策，<br /><span>更清晰。</span></h1>
          <p>将简历筛选、协同面试与招聘分析连接在同一个工作空间，让团队专注于真正重要的判断。</p>
          <div className="login-benefits">
            <div><CheckCircleOutlined /><span><strong>AI 辅助人才洞察</strong><small>从简历解析到面试总结，信息始终连贯</small></span></div>
            <div><SafetyCertificateOutlined /><span><strong>安全可靠的团队协作</strong><small>清晰的角色分工与完整招聘流程</small></span></div>
          </div>
        </div>
        <div className="login-intro__footer">AI Interview · 智能招聘管理系统</div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="login-card__heading"><span className="login-card__eyebrow">WELCOME BACK</span><h2>欢迎回来</h2><p>登录您的账号，继续今天的招聘工作</p></div>
          <Form name="login" onFinish={onFinish} size="large" layout="vertical" requiredMark={false}>
            <Form.Item name="email" label="工作邮箱" rules={[{ required: true, message: '请输入邮箱' }]}>
              <Input prefix={<UserOutlined />} placeholder="admin@example.com" autoComplete="username" />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true, message: '请输入密码' }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" autoComplete="current-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="login-submit">登录工作台</Button>
          </Form>
          <div className="login-credentials"><span>演示账号</span><code>admin@example.com</code><code>admin123</code></div>
          <div className="login-security"><SafetyCertificateOutlined /> 登录即表示您同意遵守企业的数据安全规范</div>
        </div>
      </section>
    </main>
  );
};

export default Login;
