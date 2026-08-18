import React from 'react';
import { Home, LayoutGrid, Plus, Settings } from 'lucide-react';

type TabDestination = 'home' | 'gallery' | 'settings';

interface BottomTabBarProps {
  activeTab: TabDestination;
  onNavigate: (tab: TabDestination) => void;
  onAddNew: () => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onNavigate, onAddNew }) => {
  return (
    <nav className="bottom-tab-bar">
      <button
        type="button"
        className={`tab-bar-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <Home size={20} />
        <span>홈</span>
      </button>

      <button
        type="button"
        className={`tab-bar-item ${activeTab === 'gallery' ? 'active' : ''}`}
        onClick={() => onNavigate('gallery')}
      >
        <LayoutGrid size={20} />
        <span>전체 추모관</span>
      </button>

      <button type="button" className="tab-bar-item tab-bar-item-center" onClick={onAddNew}>
        <span className="tab-bar-center-btn">
          <Plus size={24} strokeWidth={2.5} />
        </span>
        <span>새로 등록</span>
      </button>

      <button
        type="button"
        className={`tab-bar-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <Settings size={20} />
        <span>설정</span>
      </button>
    </nav>
  );
};
