import React, { useCallback, useState } from 'react';

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
      <span key={id} className="flower-pop">🌼</span>
    ))}
  </>
);
