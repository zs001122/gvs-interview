import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, DatePicker, Descriptions, Input, Result, Space, Spin, Tag, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, MailOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import PublicLayout from '../../components/PublicLayout';
import request from '../../utils/request';

interface OfferData {
  id: string;
  candidate_name: string;
  candidate_email: string;
  position_title: string;
  department: string;
  report_to: string;
  work_location: string;
  work_hours: string;
  salary_monthly: number;
  salary_annual: number;
  salary_structure: string;
  onboard_date: string;
  probation_months: number;
  benefits: string;
  bonus: string;
  special_terms: string;
  valid_until: string;
  status: string;
  sent_at: string;
}

const OfferConfirm: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [offer, setOffer] = useState<OfferData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState<'accept' | 'reject' | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [acceptedSalary, setAcceptedSalary] = useState<number | null>(null);
  const [acceptedOnboardDate, setAcceptedOnboardDate] = useState<dayjs.Dayjs | null>(null);
  const [completed, setCompleted] = useState<{ success: boolean; action: string; message: string } | null>(null);

  useEffect(() => { fetchOffer(); }, [token]);

  const fetchOffer = async () => {
    try {
      setLoading(true);
      const response = await request.get(`/public/offers/confirm/${token}`);
      setOffer(response);
      if (response.onboard_date) setAcceptedOnboardDate(dayjs(response.onboard_date));
      if (response.salary_monthly) setAcceptedSalary(response.salary_monthly);
    } catch (err: any) { setError(err.response?.data?.detail || '获取 Offer 信息失败'); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!action) return;
    if (action === 'reject' && !rejectReason.trim()) { message.warning('请填写拒绝原因'); return; }
    try {
      setSubmitting(true);
      const response = await request.post(`/public/offers/confirm/${token}`, { action, reason: action === 'reject' ? rejectReason : null, accepted_salary: action === 'accept' ? acceptedSalary : null, accepted_onboard_date: action === 'accept' ? acceptedOnboardDate?.toISOString() : null });
      setCompleted({ success: response.success, action: response.action, message: response.message });
    } catch (err: any) { message.error(err.response?.data?.detail || '操作失败，请稍后重试'); } finally { setSubmitting(false); }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = { DRAFT: { color: 'default', text: '草稿' }, PENDING: { color: 'processing', text: '待发送' }, SENT: { color: 'blue', text: '已发送' }, ACCEPTED: { color: 'success', text: '已接受' }, REJECTED: { color: 'error', text: '已拒绝' }, EXPIRED: { color: 'warning', text: '已过期' }, WITHDRAWN: { color: 'default', text: '已撤回' } };
    const config = statusMap[status] || { color: 'default', text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  if (loading) return <PublicLayout><div className="public-state"><Spin size="large" /></div></PublicLayout>;
  if (completed) return <PublicLayout><div className="public-card public-result"><Result status={completed.success ? 'success' : 'error'} title={completed.success ? (completed.action === 'accepted' ? '已接受 Offer' : '已拒绝 Offer') : '操作失败'} subTitle={completed.message} icon={completed.success ? (completed.action === 'accepted' ? <CheckCircleOutlined /> : <CloseCircleOutlined />) : <CloseCircleOutlined />} />{completed.success && completed.action === 'accepted' && <p className="muted-text">感谢您接受我们的 Offer，我们将在近期与您联系后续入职事宜。</p>}</div></PublicLayout>;
  if (error) return <PublicLayout><div className="public-card"><Result status="error" title="获取 Offer 信息失败" subTitle={error} /></div></PublicLayout>;
  if (!offer) return null;
  if (offer.status !== 'sent' && offer.status !== 'SENT') return <PublicLayout><div className="public-card"><Result status="warning" title="Offer 状态已变更" subTitle={<span>当前 Offer 状态为：{getStatusTag(offer.status.toUpperCase())}</span>} /></div></PublicLayout>;
  const isExpired = offer.valid_until && dayjs(offer.valid_until).isBefore(dayjs());
  if (isExpired) return <PublicLayout><div className="public-card"><Result status="error" title="Offer 已过期" subTitle={`此 Offer 已于 ${dayjs(offer.valid_until).format('YYYY年MM月DD日')} 过期`} /></div></PublicLayout>;

  return (
    <PublicLayout title="录用通知确认" subtitle={<span><MailOutlined /> 尊敬的 {offer.candidate_name}，请核对录用信息并确认您的决定</span>}>
      <div className="offer-public-layout">
        <Card title="录用信息" className="surface-panel offer-details-card">
          <Descriptions bordered column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="岗位名称" span={2}><strong>{offer.position_title}</strong></Descriptions.Item>
            {offer.department && <Descriptions.Item label="所属部门">{offer.department}</Descriptions.Item>}
            {offer.report_to && <Descriptions.Item label="汇报对象">{offer.report_to}</Descriptions.Item>}
            {offer.work_location && <Descriptions.Item label="工作地点">{offer.work_location}</Descriptions.Item>}
            {offer.work_hours && <Descriptions.Item label="工作时间">{offer.work_hours}</Descriptions.Item>}
            {(offer.salary_monthly || offer.salary_annual) && <Descriptions.Item label="薪资待遇" span={2}><span className="offer-salary">{offer.salary_monthly && `月薪 ${offer.salary_monthly.toLocaleString()} 元`}{offer.salary_monthly && offer.salary_annual && ' / '}{offer.salary_annual && `年薪 ${offer.salary_annual.toLocaleString()} 元`}</span></Descriptions.Item>}
            {offer.salary_structure && <Descriptions.Item label="薪资结构" span={2}>{offer.salary_structure}</Descriptions.Item>}
            <Descriptions.Item label="入职日期">{dayjs(offer.onboard_date).format('YYYY年MM月DD日')}</Descriptions.Item><Descriptions.Item label="试用期">{offer.probation_months} 个月</Descriptions.Item>
            {offer.benefits && <Descriptions.Item label="福利待遇" span={2}>{offer.benefits}</Descriptions.Item>}
            {offer.bonus && <Descriptions.Item label="奖金" span={2}>{offer.bonus}</Descriptions.Item>}
            {offer.special_terms && <Descriptions.Item label="特别说明" span={2}>{offer.special_terms}</Descriptions.Item>}
            <Descriptions.Item label="Offer 有效期"><span className="offer-valid"><ClockCircleOutlined /> {dayjs(offer.valid_until).format('YYYY年MM月DD日')}</span></Descriptions.Item><Descriptions.Item label="发送时间">{dayjs(offer.sent_at).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
          </Descriptions>
        </Card>
        <Card title="确认您的决定" className="surface-panel offer-action-card">
          <p className="muted-text">接受后，招聘团队将与您联系后续入职安排。</p>
          <Space direction="vertical" size="middle" className="offer-action-buttons"><Button type={action === 'accept' ? 'primary' : 'default'} size="large" icon={<CheckCircleOutlined />} onClick={() => setAction('accept')} block>接受 Offer</Button><Button type={action === 'reject' ? 'primary' : 'default'} danger={action === 'reject'} size="large" icon={<CloseCircleOutlined />} onClick={() => setAction('reject')} block>拒绝 Offer</Button></Space>
          {action === 'accept' && <div className="offer-confirm-fields"><label>确认入职日期<DatePicker value={acceptedOnboardDate} onChange={setAcceptedOnboardDate} format="YYYY-MM-DD" /></label><label>确认月薪（元）<Input type="number" value={acceptedSalary || ''} onChange={(e) => setAcceptedSalary(e.target.value ? Number(e.target.value) : null)} placeholder="如有调整请填写" /></label></div>}
          {action === 'reject' && <div className="offer-confirm-fields"><label>拒绝原因<Input.TextArea rows={4} placeholder="请填写拒绝原因（必填）" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} /></label></div>}
          {action && <Button type="primary" size="large" loading={submitting} onClick={handleSubmit} block>确认提交</Button>}
          <div className="offer-contact">如有任何疑问，请随时与招聘团队联系</div>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default OfferConfirm;
