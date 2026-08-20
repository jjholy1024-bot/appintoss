import React, { useEffect, useRef, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Header } from '../common/Header';
import { DDayBadge } from '../common/Badge';
import { SockMemorial, SockTone } from '../../types/sock';
import { calculateDDay } from '../../utils/date';
import { computeMemorialStats } from '../../utils/stats';

interface GalleryViewProps {
  socks: SockMemorial[];
  onBack: () => void;
  onAddNew: () => void;
  onSelectSock: (sock: SockMemorial) => void;
}

type FilterType = 'all' | 'missing' | '49days' | 'reunited';

export const GalleryView: React.FC<GalleryViewProps> = ({
  socks,
  onBack,
  onAddNew,
  onSelectSock,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedTone, setSelectedTone] = useState<SockTone | 'all'>('all');

  const filterScrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
  const [showRightFade, setShowRightFade] = useState(false);

  const updateFilterFade = () => {
    const el = filterScrollRef.current;
    if (!el) return;
    setShowLeftFade(el.scrollLeft > 4);
    setShowRightFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateFilterFade();
    window.addEventListener('resize', updateFilterFade);
    return () => window.removeEventListener('resize', updateFilterFade);
  }, []);

  const { totalCount, maxMissingDays } = computeMemorialStats(socks);

  const sortedSocks = [...socks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const filteredSocks = sortedSocks.filter((sock) => {
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
    <div className="view-container gallery-view has-tab-bar">
      {/* 0. HEADER */}
      <Header title="나의 추모관" onBack={onBack} />
      <p className="gallery-stat-line">
        총 실종 양말 {totalCount}짝 · 최장 미제 {maxMissingDays}일째
      </p>

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

        <div className="filter-pills-scroll-wrap">
          {showLeftFade && <span className="filter-fade filter-fade-left" />}
          <div className="filter-pills-row" ref={filterScrollRef} onScroll={updateFilterFade}>
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
          {showRightFade && <span className="filter-fade filter-fade-right" />}
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
              <div className="grid-card-thumb-wrap">
                <img
                  src={sock.photoUrl}
                  alt={sock.name}
                  className="grid-card-thumb"
                />
              </div>

              <div className="grid-card-badge-wrap-full">
                <DDayBadge dDay={dDay} isReunited={sock.isReunited} />
              </div>

              <div className="grid-card-body">
                <div className="grid-card-name">{sock.name}</div>
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
