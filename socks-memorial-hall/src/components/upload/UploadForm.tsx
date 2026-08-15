import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Check } from 'lucide-react';
import { Header } from '../common/Header';
import { SockMemorial, SockTone } from '../../types/sock';
import { SOCK_PRESETS } from '../../assets/sockPresets';
import { getTodayDateString } from '../../utils/date';
import { generateLetter } from '../../utils/letterGenerator';

interface UploadFormProps {
  onBack: () => void;
  onSubmitSuccess: (newSock: SockMemorial) => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onBack, onSubmitSuccess }) => {
  const [photoUrl, setPhotoUrl] = useState<string>(SOCK_PRESETS[0].svgDataUrl);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(SOCK_PRESETS[0].id);
  const [isCustomPhoto, setIsCustomPhoto] = useState<boolean>(false);

  const [name, setName] = useState<string>('노란 줄무늬 양말');
  const [wornSince, setWornSince] = useState<string>('2024년 봄부터');
  const [lastSeenDate, setLastSeenDate] = useState<string>(getTodayDateString());
  const [location, setLocation] = useState<string>('세탁기 배수구 뒤편');
  const [tone, setTone] = useState<SockTone>('신파');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadingMessages = [
    '양말의 영혼과 주파수를 맞추는 중...',
    '세탁기 차원 이동 포털을 수색하는 중...',
    '남겨진 반쪽을 위한 이별 편지를 작성하는 중...',
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
          setIsCustomPhoto(true);
          setSelectedPresetId('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (preset: typeof SOCK_PRESETS[0]) => {
    setPhotoUrl(preset.svgDataUrl);
    setSelectedPresetId(preset.id);
    setIsCustomPhoto(false);
    if (!name || SOCK_PRESETS.some(p => p.name === name)) {
      setName(preset.name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('양말의 이름을 입력해주세요!');
      return;
    }

    setIsGenerating(true);
    let step = 0;
    const intervalId = setInterval(() => {
      step = (step + 1) % loadingMessages.length;
      setLoadingTextIndex(step);
    }, 800);

    setTimeout(() => {
      clearInterval(intervalId);
      setIsGenerating(false);

      const generatedLetter = generateLetter({
        name,
        wornSince,
        lastSeenDate,
        location,
        tone,
      });

      const newSock: SockMemorial = {
        id: `sock_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: name.trim(),
        photoUrl,
        wornSince: wornSince.trim() || '알 수 없는 시간',
        lastSeenDate,
        location: location.trim() || '세탁기 주변',
        tone,
        letter: generatedLetter,
        createdAt: new Date().toISOString(),
        isReunited: false,
        tributeCount: 1,
      };

      onSubmitSuccess(newSock);
    }, 2200);
  };

  return (
    <div className="view-container upload-view">
      <Header title="새 양말 등록" onBack={onBack} />

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-intro-banner">
          <span className="step-tag">3단계로 간편 완성</span>
          <p className="intro-text">사진 1장 + 입력 2개면 끝! 양말의 마지막 편지를 받아보세요.</p>
        </div>

        {/* STEP 1: 사진 업로드 */}
        <section className="form-section">
          <div className="section-title-wrap">
            <span className="section-number">1</span>
            <label className="section-title">사진 업로드 (짝 잃은 양말 한 짝)</label>
          </div>

          <div className="photo-selection-container">
            <div className="photo-preview-box">
              <img src={photoUrl} alt="선택된 양말" className="preview-img" />
              {isCustomPhoto && (
                <button
                  type="button"
                  className="photo-remove-btn"
                  onClick={() => {
                    handleSelectPreset(SOCK_PRESETS[0]);
                  }}
                >
                  초기화
                </button>
              )}
            </div>

            <div className="photo-upload-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden-file-input"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="upload-btn-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera size={18} />
                <span>내 양말 사진 올리기</span>
              </button>

              <div className="preset-selector-label">또는 귀여운 캐릭터 선택:</div>
              <div className="preset-grid">
                {SOCK_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`preset-item ${selectedPresetId === preset.id ? 'active' : ''}`}
                    onClick={() => handleSelectPreset(preset)}
                    title={preset.name}
                  >
                    <img src={preset.svgDataUrl} alt={preset.name} className="preset-thumb" />
                    {selectedPresetId === preset.id && (
                      <span className="preset-check">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STEP 2: 정보 입력 */}
        <section className="form-section">
          <div className="section-title-wrap">
            <span className="section-number">2</span>
            <label className="section-title">추모 정보 입력</label>
          </div>

          <div className="input-group">
            <label className="input-label">양말 이름 / 애칭</label>
            <input
              type="text"
              className="toss-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 노란 스트라이프, 발목 늘어난 짝양말"
              maxLength={25}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">언제부터 신었나요? (대략)</label>
            <input
              type="text"
              className="toss-input"
              value={wornSince}
              onChange={(e) => setWornSince(e.target.value)}
              placeholder="예: 2023년 겨울부터, 약 1년 전, 3개월 전"
              maxLength={30}
            />
          </div>

          <div className="input-group">
            <label className="input-label">마지막으로 본 날</label>
            <input
              type="date"
              className="toss-input"
              value={lastSeenDate}
              onChange={(e) => setLastSeenDate(e.target.value)}
              max={getTodayDateString()}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">실종 추정 장소</label>
            <input
              type="text"
              className="toss-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="예: 세탁기 배수구 뒤편, 건조기 속, 침대 밑"
              maxLength={35}
            />
          </div>
        </section>

        {/* STEP 3: 톤 선택 */}
        <section className="form-section">
          <div className="section-title-wrap">
            <span className="section-number">3</span>
            <label className="section-title">편지 톤 선택</label>
          </div>

          <div className="tone-selector-grid">
            <button
              type="button"
              className={`tone-card ${tone === '신파' ? 'active tone-sinpa' : ''}`}
              onClick={() => setTone('신파')}
            >
              <div className="tone-emoji">😢</div>
              <div className="tone-title">신파 톤</div>
              <div className="tone-desc">눈물 콧물 쏙 빼는 절절한 이별</div>
            </button>

            <button
              type="button"
              className={`tone-card ${tone === '코믹' ? 'active tone-comic' : ''}`}
              onClick={() => setTone('코믹')}
            >
              <div className="tone-emoji">😆</div>
              <div className="tone-title">코믹 톤</div>
              <div className="tone-desc">자유를 찾아 떠난 유쾌한 해방선언</div>
            </button>

            <button
              type="button"
              className={`tone-card ${tone === '시적' ? 'active tone-poetic' : ''}`}
              onClick={() => setTone('시적')}
            >
              <div className="tone-emoji">✍️</div>
              <div className="tone-title">시적 톤</div>
              <div className="tone-desc">계절과 발자국을 읊는 감성 서정시</div>
            </button>
          </div>
        </section>

        {/* SUBMIT BUTTON */}
        <div className="form-submit-wrap">
          <button
            type="submit"
            className="toss-btn toss-btn-primary full-width submit-btn"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <div className="btn-loading-content">
                <span className="spinner-icon"></span>
                <span>{loadingMessages[loadingTextIndex]}</span>
              </div>
            ) : (
              <>
                <Sparkles size={20} />
                <span>이별 편지 받기</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
