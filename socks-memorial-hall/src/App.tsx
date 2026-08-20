import React, { useState, useEffect } from 'react';
import './App.css';
import { SockMemorial, ViewMode } from './types/sock';
import { INITIAL_SOCKS } from './data/initialSocks';
import { HomeView } from './components/home/HomeView';
import { GalleryView } from './components/gallery/GalleryView';
import { UploadForm } from './components/upload/UploadForm';
import { LetterResultView } from './components/letter/LetterResultView';
import { CardDetailView } from './components/detail/CardDetailView';
import { SharedSockView } from './components/shared/SharedSockView';
import { SettingsView } from './components/settings/SettingsView';
import { BottomTabBar } from './components/common/BottomTabBar';

const STORAGE_KEY = 'socks_memorial_hall_data_v1';

function App() {
  const [socks, setSocks] = useState<SockMemorial[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_SOCKS;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedSock, setSelectedSock] = useState<SockMemorial | null>(null);
  const [latestCreatedSock, setLatestCreatedSock] = useState<SockMemorial | null>(null);

  // 친구 공유 링크(?shared=sockId)로 들어온 경우 감지
  const [sharedSockId] = useState<string | null>(() => {
    try {
      return new URLSearchParams(window.location.search).get('shared');
    } catch {
      return null;
    }
  });
  const [showShared, setShowShared] = useState<boolean>(!!sharedSockId);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(socks));
    } catch {
      // ignore
    }
  }, [socks]);

  // Handle new sock creation
  const handleAddNewSuccess = (newSock: SockMemorial) => {
    setSocks((prev) => [newSock, ...prev]);
    setLatestCreatedSock(newSock);
    setViewMode('letter_result');
  };

  // Handle sock updates (tribute count, reunited status)
  const handleUpdateSock = (updated: SockMemorial) => {
    setSocks((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (selectedSock?.id === updated.id) {
      setSelectedSock(updated);
    }
    if (latestCreatedSock?.id === updated.id) {
      setLatestCreatedSock(updated);
    }
  };

  // Handle sock deletion
  const handleDeleteSock = (sockId: string) => {
    setSocks((prev) => prev.filter((s) => s.id !== sockId));
    if (selectedSock?.id === sockId) {
      setSelectedSock(null);
    }
  };

  // Handle full data reset
  const handleResetData = () => {
    setSocks([]);
    setSelectedSock(null);
    setLatestCreatedSock(null);
  };

  if (showShared && sharedSockId) {
    return (
      <div className="memorial-app-wrapper">
        <main className="memorial-main-frame">
          <SharedSockView
            sockId={sharedSockId}
            onClose={() => {
              setShowShared(false);
              window.history.replaceState({}, '', window.location.pathname);
            }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="memorial-app-wrapper">
      <main className="memorial-main-frame">
        {viewMode === 'home' && (
          <HomeView
            socks={socks}
            onAddNew={() => setViewMode('upload')}
            onSelectSock={(sock) => {
              setSelectedSock(sock);
              setViewMode('detail');
            }}
            onViewGallery={() => setViewMode('gallery')}
          />
        )}

        {viewMode === 'gallery' && (
          <GalleryView
            socks={socks}
            onBack={() => setViewMode('home')}
            onAddNew={() => setViewMode('upload')}
            onSelectSock={(sock) => {
              setSelectedSock(sock);
              setViewMode('detail');
            }}
          />
        )}

        {viewMode === 'upload' && (
          <UploadForm
            onBack={() => setViewMode('home')}
            onSubmitSuccess={handleAddNewSuccess}
          />
        )}

        {viewMode === 'letter_result' && latestCreatedSock && (
          <LetterResultView
            sock={latestCreatedSock}
            onGoToGallery={() => setViewMode('gallery')}
            onViewDetail={(sock) => {
              setSelectedSock(sock);
              setViewMode('detail');
            }}
          />
        )}

        {viewMode === 'detail' && selectedSock && (
          <CardDetailView
            sock={selectedSock}
            onBack={() => setViewMode('gallery')}
            onUpdateSock={handleUpdateSock}
            onDeleteSock={handleDeleteSock}
          />
        )}

        {viewMode === 'settings' && (
          <SettingsView socks={socks} onResetData={handleResetData} />
        )}

        {(viewMode === 'home' || viewMode === 'gallery' || viewMode === 'settings') && (
          <BottomTabBar
            activeTab={viewMode}
            onNavigate={(tab) => setViewMode(tab)}
            onAddNew={() => setViewMode('upload')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
