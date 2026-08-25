import React, { useCallback, useState } from 'react';

export function WhiteChrysanthemum({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ verticalAlign: 'middle', display: 'inline-block' }}
    >
      <g filter="drop-shadow(0 1px 2px rgba(58,54,46,0.18))">
        {/* Layer 1: Outer Pure White Petals */}
        <ellipse cx="24" cy="9" rx="3.5" ry="8" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="24" cy="39" rx="3.5" ry="8" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="9" cy="24" rx="8" ry="3.5" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="39" cy="24" rx="8" ry="3.5" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />

        {/* Diagonal Petals */}
        <ellipse cx="13.4" cy="13.4" rx="3.5" ry="8" transform="rotate(-45 13.4 13.4)" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="34.6" cy="34.6" rx="3.5" ry="8" transform="rotate(-45 34.6 34.6)" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="34.6" cy="13.4" rx="3.5" ry="8" transform="rotate(45 34.6 13.4)" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />
        <ellipse cx="13.4" cy="34.6" rx="3.5" ry="8" transform="rotate(45 13.4 34.6)" fill="#FFFFFF" stroke="#DDD6CB" strokeWidth="1" />

        {/* Layer 2: Inner White Petals */}
        <ellipse cx="24" cy="14" rx="2.5" ry="5.5" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="24" cy="34" rx="2.5" ry="5.5" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="14" cy="24" rx="5.5" ry="2.5" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="34" cy="24" rx="5.5" ry="2.5" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />

        <ellipse cx="16.9" cy="16.9" rx="2.5" ry="5.5" transform="rotate(-45 16.9 16.9)" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="31.1" cy="31.1" rx="2.5" ry="5.5" transform="rotate(-45 31.1 31.1)" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="31.1" cy="16.9" rx="2.5" ry="5.5" transform="rotate(45 31.1 16.9)" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />
        <ellipse cx="16.9" cy="31.1" rx="2.5" ry="5.5" transform="rotate(45 16.9 31.1)" fill="#FAF8F5" stroke="#E5DFD5" strokeWidth="0.8" />

        {/* Center Golden Pistil Core */}
        <circle cx="24" cy="24" r="5" fill="#EAB308" stroke="#CA8A04" strokeWidth="0.5" />
        <circle cx="24" cy="24" r="3.5" fill="#FACC15" />
      </g>
    </svg>
  );
}

export function useFlowerPop() {
  const [pops, setPops] = useState<number[]>([]);

  const triggerFlowerPop = useCallback(() => {
    const id = Date.now() + Math.random();
    setPops((prev) => [...prev, id]);
    setTimeout(() => {
      setPops((prev) => prev.filter((p) => p !== id));
    }, 1000);
  }, []);

  return { pops, triggerFlowerPop };
}

export const FlowerPopLayer: React.FC<{ pops: number[] }> = ({ pops }) => (
  <>
    {pops.map((id) => (
      <span key={id} className="flower-pop">
        <WhiteChrysanthemum size={32} />
      </span>
    ))}
  </>
);

