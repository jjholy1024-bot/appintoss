import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { DDayBadge } from '../common/Badge';
import { SockMemorial, SockTone } from '../../types/sock';
import { calculateDDay } from '../../utils/date';

interface GalleryViewProps {
  socks: SockMemorial[];
  onAddNew: () => void;
  onSelectSock: (sock: SockMemorial) => void;
}

type FilterType = 'all' | 'missing' | '49days' | 'reunited';

export const GalleryView: React.FC<GalleryViewProps> = ({
  socks,
  onAddNew,
  onSelectSock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedTone, setSelectedTone] = useState<SockTone | 'all'>('all');

  const totalCount = socks.length;
  const reunitedCount = socks.filter((s) => s.isReunited).length;

  const maxMissingDays = socks.reduce((max, sock) => {
    if (sock.isReunited) return max;
    const d = calculateDDay(sock.lastSeenDate);
    return Math.max(max, d);
  }, 0);

  const filteredSocks = socks.filter((sock) => {
    const dDay = calculateDDay(sock.lastSeenDate);

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sock.name.toLowerCase().includes(q);
      const matchLoc = sock.location.toLowerCase().includes(q);
      const matchLetter = sock.letter.toLowerCase().includes(q);
      if (!matchName && !matchLoc && !matchLetter) return false;
    }

    // Tone filter
    if (selectedTone !== 'all' && sock.tone !== selectedTone) {
      return false;
    }

    // Status filter
    if (filterType === 'missing') return !sock.isReunited;
    if (filterType === '49days') return !sock.isReunited && dDay >= 49;
    if (filterType === 'reunited') return sock.isReunited;

    return true;
  });

  return (
    <div className="view-container gallery-view">
      {/* 1. TOP STATS BANNER */}
      <div className="memorial-stat-card">
        <div className="stat-main-row">
          <div className="stat-box">
            <span className="stat-label">총 추모 양말</span>
            <span className="stat-value">{totalCount}<small>짝</small></span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-label">최장 미제 실종</span>
            <span className="stat-value highlight-days">{maxMissingDays}<small>일째</small></span>
          </div>
          <div className="stat-divider" />
          <div className="stat-box">
            <span className="stat-label">기적의 재회</span>
            <span className="stat-value text-reunited">{reunitedCount}<small>짝</small></span>
          </div>
        </div>

        <div className="stat-sub-notice">
          🧦 잃어버린 한 짝을 위한 디지털 추모 공간
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="gallery-filter-bar">
        <div className="search-input-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="gallery-search-input"
            placeholder="양말 이름, 실종 장소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-pills-row">
          <button
            type="button"
            className={`filter-pill ${filterType === 'all' && selectedTone === 'all' ? 'active' : ''}`}
            onClick={() => {
              setFilterType('all');
              setSelectedTone('all');
            }}
          >
            전체 보기
          </button>
          <button
            type="button"
            className={`filter-pill ${filterType === 'missing' ? 'active' : ''}`}
            onClick={() => setFilterType('missing')}
          >
            실종 중 🔍
          </button>
          <button
            type="button"
            className={`filter-pill ${filterType === '49days' ? 'active' : ''}`}
            onClick={() => setFilterType('49days')}
          >
            49재 🕯️
          </button>
          <button
            type="button"
            className={`filter-pill ${filterType === 'reunited' ? 'active' : ''}`}
            onClick={() => setFilterType('reunited')}
          >
            재회 완료 🎉
          </button>
          <button
            type="button"
            className={`filter-pill ${selectedTone === '신파' ? 'active' : ''}`}
            onClick={() => setSelectedTone(selectedTone === '신파' ? 'all' : '신파')}
          >
            신파 톤
          </button>
          <button
            type="button"
            className={`filter-pill ${selectedTone === '코믹' ? 'active' : ''}`}
            onClick={() => setSelectedTone(selectedTone === '코믹' ? 'all' : '코믹')}
          >
            코믹 톤
          </button>
          <button
            type="button"
            className={`filter-pill ${selectedTone === '시적' ? 'active' : ''}`}
            onClick={() => setSelectedTone(selectedTone === '시적' ? 'all' : '시적')}
          >
            시적 톤
          </button>
        </div>
      </div>

      {/* 3. 2-COLUMN GRID OF MEMORIAL CARDS */}
      <div className="memorial-grid">
        {/* ADD NEW SOCK CARD */}
        <div
          className="memorial-grid-card add-new-card"
          onClick={onAddNew}
        >
          <div className="add-icon-circle">
            <Plus size={24} strokeWidth={2.5} />
          </div>
          <span className="add-card-label">+ 새 양말 등록</span>
          <span className="add-card-sub">사진 1장으로 추모하기</span>
        </div>

        {/* LIST OF CARDS */}
        {filteredSocks.map((sock) => {
          const dDay = calculateDDay(sock.lastSeenDate);
          const is49 = dDay >= 49 && !sock.isReunited;

          return (
            <div
              key={sock.id}
              className={`memorial-grid-card ${is49 ? 'card-status-49' : ''} ${sock.isReunited ? 'card-status-reunited' : ''}`}
              onClick={() => onSelectSock(sock)}
            >
              {is49 && <span className="card-ribbon">49재</span>}
              {sock.isReunited && <span className="card-ribbon reunited">재회</span>}

              <div className="grid-card-thumb-wrap">
                <img
                  src={sock.photoUrl}
                  alt={sock.name}
                  className="grid-card-thumb"
                />
              </div>

              <div className="grid-card-body">
                <div className="grid-card-name">{sock.name}</div>
                <div className="grid-card-badge-wrap">
                  <DDayBadge dDay={dDay} isReunited={sock.isReunited} compact />
                </div>
                <div className="grid-card-location">{sock.location}</div>
              </div>

              <div className="grid-card-footer">
                <span className="tribute-counter">🌼 {sock.tributeCount}</span>
                <span className="grid-tone-tag">{sock.tone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSocks.length === 0 && (
        <div className="empty-gallery-state">
          <p className="empty-title">조건에 맞는 양말이 없습니다</p>
          <p className="empty-desc">검색어나 필터를 변경해보세요.</p>
        </div>
      )}
    </div>
  );
};
