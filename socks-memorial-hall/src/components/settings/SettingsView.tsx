import React, { useState } from 'react';
import { Header } from '../common/Header';
import { ConfirmModal } from '../common/ConfirmModal';
import { SockMemorial } from '../../types/sock';
import { computeMemorialStats, computeActivitySummary } from '../../utils/stats';

interface SettingsViewProps {
  socks: SockMemorial[];
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ socks, onResetData }) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const { totalCount, reunitedCount, maxMissingDays } = computeMemorialStats(socks);
  const { totalTributeCount, toneCounts, sharedCount } = computeActivitySummary(socks);

  return (
    <div className="view-container has-tab-bar">
      <Header title="설정" />

      {showResetConfirm && (
        <ConfirmModal
          title="전체 데이터 초기화"
          message="등록한 모든 양말 추모 카드가 삭제돼요. 되돌릴 수 없어요."
          confirmLabel="초기화"
          cancelLabel="취소"
          onConfirm={() => {
            onResetData();
            setShowResetConfirm(false);
          }}
          onCancel={() => setShowResetConfirm(false)}
        />
      )}


      <section className="form-section">
        <span className="section-title">나의 추모 활동</span>

        <div className="home-stats-row">
          <div className="home-stat-box">
            <span className="home-stat-value">{totalCount}</span>
            <span className="home-stat-label">총 추모</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-box">
            <span className="home-stat-value highlight">{maxMissingDays}일</span>
            <span className="home-stat-label">최장 미제</span>
          </div>
          <div className="home-stat-divider" />
          <div className="home-stat-box">
            <span className="home-stat-value">{reunitedCount}</span>
            <span className="home-stat-label">재회</span>
          </div>
        </div>

        <div className="settings-info-list">
          <div className="settings-info-row">
            <span>총 헌화 수</span>
            <span>🌼 {totalTributeCount}송이</span>
          </div>
          <div className="settings-info-row">
            <span>톤별 분포</span>
            <span>
              신파 {toneCounts.신파} · 코믹 {toneCounts.코믹} · 시적 {toneCounts.시적}
            </span>
          </div>
          <div className="settings-info-row">
            <span>친구에게 공유한 카드</span>
            <span>{sharedCount}개</span>
          </div>
        </div>
      </section>

      <section className="form-section">
        <span className="section-title">앱 정보</span>
        <p className="settings-app-desc">
          🧦 양말 추모관은 짝 잃은 양말을 위한, 실용성 제로의 감성 추모 공간이에요.
        </p>
        <div className="settings-info-row">
          <span>버전</span>
          <span>v1.0.0</span>
        </div>
      </section>

      <button
        type="button"
        className="settings-danger-btn"
        onClick={() => setShowResetConfirm(true)}
      >
        전체 데이터 초기화
      </button>
    </div>
  );
};

