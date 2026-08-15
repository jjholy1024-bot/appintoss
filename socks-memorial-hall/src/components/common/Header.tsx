import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, onBack, rightAction }) => {
  return (
    <header className="memorial-header">
      <div className="header-left">
        {onBack && (
          <button 
            type="button"
            className="header-back-btn" 
            onClick={onBack}
            aria-label="뒤로 가기"
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
        )}
        <h1 className="header-title">{title}</h1>
      </div>
      {rightAction && <div className="header-right">{rightAction}</div>}
    </header>
  );
};
