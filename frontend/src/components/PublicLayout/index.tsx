import type { ReactNode } from 'react';
import { SafetyCertificateOutlined } from '@ant-design/icons';

interface PublicLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  focus?: boolean;
  wide?: boolean;
}

const PublicLayout = ({ children, title, subtitle, focus = false, wide = false }: PublicLayoutProps) => (
  <div className={`public-shell${focus ? ' public-shell--focus' : ''}`}>
    <header className="public-header">
      <div className={`public-header__inner${wide ? ' public-header__inner--wide' : ''}`}>
        <div className="brand" aria-label="AI Interview">
          <span className="brand__mark">AI</span>
          <span className="brand__name">Interview</span>
        </div>
        <div className="public-header__trust">
          <SafetyCertificateOutlined />
          <span>{focus ? '专注作答 · 自动保存' : '安全可靠的智能招聘体验'}</span>
        </div>
      </div>
    </header>
    <main className={`public-main${wide ? ' public-main--wide' : ''}`}>
      {(title || subtitle) && (
        <div className="public-heading">
          {title && <h1>{title}</h1>}
          {subtitle && <p>{subtitle}</p>}
        </div>
      )}
      {children}
    </main>
    {!focus && (
      <footer className="public-footer">
        <span>AI Interview</span>
        <span>让每一次人才选择更清晰</span>
      </footer>
    )}
  </div>
);

export default PublicLayout;
