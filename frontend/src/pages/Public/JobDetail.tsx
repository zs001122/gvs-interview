import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Form, Input, Result, Spin, Tag, Upload, message } from 'antd';
import { EnvironmentOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PublicLayout from '../../components/PublicLayout';
import request from '../../utils/request';

const PublicJobDetail: React.FC = () => {
  const { id } = useParams();
  const [position, setPosition] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => { if (id) fetchPosition(id); }, [id]);

  const fetchPosition = async (positionId: string) => {
    setLoading(true);
    try {
      const res = await request.get(`/positions/${positionId}`);
      if (res.status !== 'published') { message.error('该岗位已下架或不存在'); setPosition(null); } else setPosition(res);
    } catch (error) { message.error('获取岗位详情失败'); } finally { setLoading(false); }
  };

  const onFinish = async (values: any) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('position_id', id!);
      formData.append('candidate_name', values.name);
      formData.append('email', values.email);
      formData.append('contact', values.phone);
      formData.append('file', values.file.file);
      await request.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
    } catch (error) { message.error('投递失败，请稍后重试'); } finally { setSubmitting(false); }
  };

  if (loading) return <PublicLayout><div className="public-state"><Spin size="large" /></div></PublicLayout>;
  if (!position) return <PublicLayout><div className="public-card"><Result status="404" title="岗位不存在或已下架" subTitle="请联系招聘方确认岗位状态" /></div></PublicLayout>;
  if (submitted) return <PublicLayout><div className="public-card public-result"><Result status="success" title="简历投递成功" subTitle="我们已收到您的简历，招聘团队会尽快完成评估，请留意邮件或电话通知。" extra={<Button type="primary" onClick={() => window.location.reload()}>返回岗位详情</Button>} /></div></PublicLayout>;

  return (
    <PublicLayout>
      <div className="job-public-grid">
        <article className="public-card job-description">
          <div className="job-hero"><span className="job-hero__eyebrow">JOIN OUR TEAM</span><h1>{position.title}</h1><p>期待与优秀的你一起，创造有价值的产品与体验。</p><div className="job-tags"><Tag color="blue">{position.department || '综合部门'}</Tag><Tag icon={<EnvironmentOutlined />} color="default">{position.location || '地点面议'}</Tag><Tag color="gold">{position.salary_range || '薪资面议'}</Tag></div></div>
          <section className="job-section"><h2>岗位职责</h2><div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{position.description || '暂无描述'}</ReactMarkdown></div></section>
          <section className="job-section"><h2>任职要求</h2><div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]}>{position.requirements || '暂无详细要求'}</ReactMarkdown></div></section>
        </article>
        <aside className="public-card application-card"><div className="application-card__heading"><span>投递此岗位</span><h2>让我们认识你</h2><p>填写基本信息并上传简历，招聘团队将尽快与你联系。</p></div>
          <Form form={form} layout="vertical" onFinish={onFinish} size="large" requiredMark={false}>
            <Form.Item name="name" label="您的姓名" rules={[{ required: true, message: '请输入您的姓名' }]}><Input placeholder="请输入真实姓名" /></Form.Item>
            <Form.Item name="email" label="电子邮箱" rules={[{ required: true, message: '请输入电子邮箱' }, { type: 'email', message: '请输入有效邮箱' }]}><Input placeholder="用于接收面试通知" /></Form.Item>
            <Form.Item name="phone" label="联系电话" rules={[{ required: true, message: '请输入联系电话' }]}><Input placeholder="请输入手机号码" /></Form.Item>
            <Form.Item name="file" label="简历附件" rules={[{ required: true, message: '请上传简历文件' }]} extra="仅支持 PDF 格式，大小不超过 10MB">
              <Upload.Dragger maxCount={1} accept=".pdf" beforeUpload={(file) => { if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) { message.error('只允许上传 PDF 格式的文件'); return Upload.LIST_IGNORE; } return false; }}><p className="ant-upload-drag-icon"><InboxOutlined /></p><p className="ant-upload-text">上传 PDF 简历</p></Upload.Dragger>
            </Form.Item>
            <Button type="primary" htmlType="submit" icon={<UploadOutlined />} loading={submitting} block size="large">提交投递</Button>
          </Form>
        </aside>
      </div>
    </PublicLayout>
  );
};

export default PublicJobDetail;
