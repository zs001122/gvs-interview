import type { ReactNode } from 'react';
import { Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface FilterBarProps {
  children: ReactNode;
  actions?: ReactNode;
  onReset?: () => void;
  resetText?: string;
}

const FilterBar = ({ children, actions, onReset, resetText = '重置' }: FilterBarProps) => (
  <section className="filter-bar" aria-label="筛选条件">
    <div className="filter-bar__fields">{children}</div>
    <div className="filter-bar__actions">
      {onReset && <Button icon={<ReloadOutlined />} onClick={onReset}>{resetText}</Button>}
      {actions}
    </div>
  </section>
);

export default FilterBar;
