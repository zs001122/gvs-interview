import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Descriptions, Input, Rate, Result, Space, Spin, Tag, message } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import PublicLayout from '../../components/PublicLayout';
import request from '../../utils/request';

interface ResumeData {
  id: string;
  candidate_name: string;
  email: string;
  contact: string;
  match_score: number;
  ai_review: string;
  resume_markdown: string;
  parsed_data: any;
  position: { id: string; title: string; description: string; requirements: string };
  status: string;
  department_reviews: any[];
}

const PublicReview: React.FC = () => {
  const { resumeId, reviewerId } = useParams<{ resumeId: string; reviewerId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [existingReview, setExistingReview] = useState<any>(null);
  const [technicalScore, setTechnicalScore] = useState(0);
  const [experienceScore, setExperienceScore] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [recommendation, setRecommendation] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => { fetchResume(); }, [resumeId]);

  const fetchResume = async () => {
    setLoading(true);
    try {
      const res = await request.get(`/public/review/${resumeId}?reviewer_id=${reviewerId}`);
      setResume(res.resume);
      setExistingReview(res.existing_review);
      if (res.existing_review) {
        setTechnicalScore(res.existing_review.technical_score || 0);
        setExperienceScore(res.existing_review.experience_score || 0);
        setOverallScore(res.existing_review.overall_score || 0);
        setRecommendation(res.existing_review.recommendation || '');
        setComment(res.existing_review.comment || '');
      }
    } catch (e: any) { message.error(e?.response?.data?.detail || '获取简历信息失败'); } finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!recommendation) { message.warning('请选择推荐意见'); return; }
    setSubmitting(true);
    try {
      await request.post(`/public/review/${resumeId}/submit`, { reviewer_id: reviewerId, technical_score: technicalScore, experience_score: experienceScore, overall_score: overallScore, recommendation, comment });
      message.success('审核已提交');
      fetchResume();
    } catch (e: any) { message.error(e?.response?.data?.detail || '提交失败'); } finally { setSubmitting(false); }
  };

  if (loading) return <PublicLayout><div className="public-state"><Spin size="large" /></div></PublicLayout>;
  if (!resume) return <PublicLayout><div className="public-card"><Result status="404" title="简历不存在" subTitle="该简历可能已被删除或链接无效" /></div></PublicLayout>;
  if (existingReview?.is_completed) return <PublicLayout><div className="public-card public-result"><Result status="success" title="评审已完成" subTitle="您已完成该候选人的评审，感谢您的专业判断与参与。" extra={<Button type="primary" onClick={() => navigate('/')}>返回首页</Button>} /></div></PublicLayout>;

  return (
    <PublicLayout title="候选人协同评审" subtitle="请仔细阅读候选人资料与 AI 初筛意见，给出独立、客观的评审结论。">
      <div className="review-public-layout">
        <div className="review-public-content">
          <Card title="候选人信息" className="surface-panel"><Descriptions bordered column={{ xs: 1, sm: 2 }}><Descriptions.Item label="姓名">{resume.candidate_name}</Descriptions.Item><Descriptions.Item label="应聘岗位">{resume.position?.title}</Descriptions.Item><Descriptions.Item label="邮箱">{resume.email}</Descriptions.Item><Descriptions.Item label="联系电话">{resume.contact}</Descriptions.Item><Descriptions.Item label="岗位匹配度"><Tag color={resume.match_score >= 80 ? 'green' : resume.match_score >= 60 ? 'blue' : 'orange'}>{resume.match_score} 分</Tag></Descriptions.Item></Descriptions></Card>
          {resume.ai_review && <Card title="AI 初筛意见" className="surface-panel"><div className="review-document">{resume.ai_review}</div></Card>}
          {resume.resume_markdown && <Card title="简历详情" className="surface-panel"><div className="review-document review-document--scroll">{resume.resume_markdown}</div></Card>}
        </div>
        <Card title="我的评审" className="surface-panel review-score-card">
          <div className="review-score-list">
            {[{ label: '技术能力', value: technicalScore, onChange: setTechnicalScore }, { label: '经验匹配', value: experienceScore, onChange: setExperienceScore }, { label: '综合评价', value: overallScore, onChange: setOverallScore }].map(field => <div className="review-score-item" key={field.label}><div><strong>{field.label}</strong><span>{field.value} / 10 分</span></div><Rate value={field.value} onChange={field.onChange} count={10} /></div>)}
          </div>
          <div className="review-field"><label>推荐意见</label><Space wrap><Button type={recommendation === 'recommend' ? 'primary' : 'default'} icon={<CheckCircleOutlined />} onClick={() => setRecommendation('recommend')}>推荐</Button><Button type={recommendation === 'not_recommend' ? 'primary' : 'default'} danger={recommendation === 'not_recommend'} icon={<CloseCircleOutlined />} onClick={() => setRecommendation('not_recommend')}>不推荐</Button><Button type={recommendation === 'pending' ? 'primary' : 'default'} icon={<ClockCircleOutlined />} onClick={() => setRecommendation('pending')}>待定</Button></Space></div>
          <div className="review-field"><label>详细评价</label><Input.TextArea rows={5} value={comment} onChange={e => setComment(e.target.value)} placeholder="记录候选人的优势、风险点与建议关注方向" maxLength={1000} showCount /></div>
          <Button type="primary" size="large" block onClick={handleSubmit} loading={submitting}>提交评审</Button>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default PublicReview;
