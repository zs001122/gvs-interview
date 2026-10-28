import React from 'react';
import { Form, Input, Select } from 'antd';

const REJECT_REASONS = [
  { value: 'skills_mismatch', label: '技能不符合要求' },
  { value: 'experience_insufficient', label: '经验不足' },
  { value: 'education_mismatch', label: '学历不符' },
  { value: 'salary_expectation', label: '薪资期望不符' },
  { value: 'culture_fit', label: '文化匹配度低' },
  { value: 'candidate_withdraw', label: '候选人放弃' },
  { value: 'other', label: '其他原因' },
];

interface RejectReasonSelectorProps {
  form?: any;
  layout?: 'horizontal' | 'vertical' | 'inline';
  showDetail?: boolean;
}

const RejectReasonSelector: React.FC<RejectReasonSelectorProps> = ({ showDetail = true }) => (
  <div className="reject-reason-panel">
    <p>请选择最符合实际情况的原因，便于后续分析招聘转化与人才匹配质量。</p>
    <Form.Item name="reject_reason_category" label="淘汰原因" rules={[{ required: true, message: '请选择淘汰原因' }]}>
      <Select placeholder="请选择淘汰原因" size="large" options={REJECT_REASONS} />
    </Form.Item>
    {showDetail && <Form.Item name="reject_reason_detail" label="详细说明"><Input.TextArea placeholder="补充具体原因或需要团队关注的信息（可选）" rows={3} maxLength={500} showCount /></Form.Item>}
  </div>
);

export default RejectReasonSelector;
export { REJECT_REASONS };
