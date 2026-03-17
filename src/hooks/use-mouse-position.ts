import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "./use-mobile";

interface MousePosition {
  x: number;
  y: number;
  nx: number; // normalized -1 to 1
  ny: number;
}

export function useMousePosition(): MousePosition {
  const isMobile = useIsMobile();
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, nx: 0, ny: 0 });
  const raf = useRef(0);
  const latest = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      latest.current = { x: e.clientX, y: e.clientY };
      if (!raf.current) {
        raf.current = requestAnimationFrame(() => {
          const { x, y } = latest.current;
          setPos({
            x,
            y,
            nx: (x / window.innerWidth - 0.5) * 2,
            ny: (y / window.innerHeight - 0.5) * 2,
          });
          raf.current = 0;
        });
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.removeEventListener("mousemove", onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isMobile]);

  return pos;
}
