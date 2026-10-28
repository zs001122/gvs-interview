import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Select, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';
import request from '../../utils/request';

const ResumeUpload: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);

  useEffect(() => {
    request.get('/positions').then(setPositions).catch(() => message.error('获取岗位列表失败'));
  }, []);

  const onFinish = async (values: any) => {
    if (!fileList.length) { message.error('请上传简历文件'); return; }
    const formData = new FormData();
    formData.append('position_id', values.position_id);
    formData.append('file', fileList[0]);
    setLoading(true);
    try {
      await request.post('/resumes', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      message.success('上传成功');
      navigate('/resumes');
    } catch (error) { message.error('上传失败'); } finally { setLoading(false); }
  };

  return (
    <div>
      <PageHeader title="上传简历" description="选择应聘岗位并导入候选人 PDF 简历，上传后将自动进入解析流程。" onBack={() => navigate('/resumes')} />
      <Card className="surface-panel upload-form-card">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <section className="form-section"><h3 className="form-section__title">投递信息</h3><p className="form-section__description">简历将关联到所选岗位，用于后续匹配分析和面试安排。</p>
            <Form.Item name="position_id" label="应聘岗位" rules={[{ required: true, message: '请选择应聘岗位' }]}><Select placeholder="请选择岗位" showSearch optionFilterProp="label" options={positions.map(position => ({ value: position.id, label: position.title }))} /></Form.Item>
          </section>
          <section className="form-section"><h3 className="form-section__title">简历文件</h3><p className="form-section__description">仅支持 PDF 格式，请确保文件内容清晰且包含候选人联系方式。</p>
            <Form.Item name="file" rules={[{ required: true, message: '请上传简历' }]}>
              <Upload.Dragger accept=".pdf" maxCount={1} fileList={fileList} onRemove={() => setFileList([])} beforeUpload={(file) => {
                if (!(file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'))) { message.error('只允许上传 PDF 格式的文件'); return Upload.LIST_IGNORE; }
                setFileList([file]); return false;
              }}><p className="ant-upload-drag-icon"><InboxOutlined /></p><p className="ant-upload-text">点击或拖拽 PDF 简历到这里</p><p className="ant-upload-hint">单次上传一份简历</p></Upload.Dragger>
            </Form.Item>
          </section>
          <div className="form-actions"><Button onClick={() => navigate('/resumes')}>取消</Button><Button type="primary" htmlType="submit" loading={loading}>开始上传</Button></div>
        </Form>
      </Card>
    </div>
  );
};

export default ResumeUpload;
