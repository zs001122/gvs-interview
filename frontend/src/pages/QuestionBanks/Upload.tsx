import React, { useState } from 'react';
import { Button, Card, Form, Input, Select, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import request from '../../utils/request';

const QuestionBankUpload: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const onFinish = async (values: any) => {
    if (!fileList.length) { message.error('请上传题库文件'); return; }
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('category', values.category);
    formData.append('difficulty', values.difficulty);
    if (values.tags) formData.append('tags', values.tags.join(','));
    formData.append('file', fileList[0].originFileObj);
    setLoading(true);
    try {
      await request.post('/question-banks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      message.success('上传成功');
      navigate('/question-banks');
    } catch (error) { message.error('上传失败'); } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="上传题库" description="导入面试题目资料，统一维护分类、难度与检索标签。" onBack={() => navigate('/question-banks')} />
      <Card className="surface-panel upload-form-card">
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ category: 'technical', difficulty: 'intermediate' }}>
          <section className="form-section">
            <h3 className="form-section__title">基本信息</h3><p className="form-section__description">清晰的命名和分类能帮助面试官快速找到合适的题目。</p>
            <Form.Item name="name" label="题库名称" rules={[{ required: true, message: '请输入题库名称' }]}><Input placeholder="例如：前端工程师核心面试题" /></Form.Item>
            <div className="form-grid">
              <Form.Item name="category" label="分类" rules={[{ required: true }]}><Select options={[{ value: 'technical', label: '技术' }, { value: 'management', label: '管理' }, { value: 'hr', label: '人力资源' }, { value: 'other', label: '其他' }]} /></Form.Item>
              <Form.Item name="difficulty" label="难度" rules={[{ required: true }]}><Select options={[{ value: 'junior', label: '初级' }, { value: 'intermediate', label: '中级' }, { value: 'senior', label: '高级' }]} /></Form.Item>
            </div>
            <Form.Item name="tags" label="标签"><Select mode="tags" placeholder="输入后回车创建标签" /></Form.Item>
          </section>
          <section className="form-section">
            <h3 className="form-section__title">题库文件</h3><p className="form-section__description">选择需要导入的文件，上传后可在题库详情中预览。</p>
            <Form.Item name="file" rules={[{ required: true, message: '请上传文件' }]}>
              <Upload.Dragger maxCount={1} fileList={fileList} onRemove={() => setFileList([])} beforeUpload={(file) => { setFileList([file]); return false; }}>
                <p className="ant-upload-drag-icon"><InboxOutlined /></p><p className="ant-upload-text">点击或拖拽文件到这里</p><p className="ant-upload-hint">单次上传一个题库文件</p>
              </Upload.Dragger>
            </Form.Item>
          </section>
          <div className="form-actions"><Button onClick={() => navigate('/question-banks')}>取消</Button><Button type="primary" htmlType="submit" loading={loading}>上传题库</Button></div>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionBankUpload;
