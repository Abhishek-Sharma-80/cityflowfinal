import { useState, useEffect, useRef } from 'react';

export function useCountUp(target: number, duration: number = 1200, decimals: number = 0): string {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startVal = useRef(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    startVal.current = value;
    startTime.current = null;
    const step = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(startVal.current + (target - startVal.current) * eased);
      if (progress < 1) animRef.current = requestAnimationFrame(step);
    };
    animRef.current = requestAnimationFrame(step);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [target, duration]);

  return value.toFixed(decimals);
}
