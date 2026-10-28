import type { ReactNode } from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  eyebrow?: ReactNode;
  breadcrumb?: ReactNode;
  onBack?: () => void;
}

const PageHeader = ({ title, description, extra, eyebrow, breadcrumb, onBack }: PageHeaderProps) => (
  <div className="page-header">
    <div className="page-header__main">
      {onBack && (
        <Button className="page-header__back" type="text" icon={<ArrowLeftOutlined />} onClick={onBack} aria-label="返回" />
      )}
      <div className="page-header__copy">
        {breadcrumb}
        {eyebrow && <div className="page-header__eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <div className="page-header__description">{description}</div>}
      </div>
    </div>
    {extra && <div className="page-header__extra">{extra}</div>}
  </div>
);

export default PageHeader;
