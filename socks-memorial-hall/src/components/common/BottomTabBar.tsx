import React from 'react';
import { Home, LayoutGrid, Settings } from 'lucide-react';

type TabDestination = 'home' | 'gallery' | 'settings';

interface BottomTabBarProps {
  activeTab: TabDestination;
  onNavigate: (tab: TabDestination) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onNavigate }) => {
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
