import { useEffect, useRef, useCallback } from "react";
import { useIsMobile } from "./use-mobile";

export function useTilt<T extends HTMLElement>(intensity: number = 8) {
  const ref = useRef<T>(null);
  const isMobile = useIsMobile();
  const raf = useRef(0);

  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - y) * intensity;
      const rotateY = (x - 0.5) * intensity;
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      el.style.setProperty("--mouse-x", `${x * 100}%`);
      el.style.setProperty("--mouse-y", `${y * 100}%`);
    });
  }, [intensity]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const el = ref.current;
    if (!el) return;

    el.style.transition = "transform 0.2s ease-out";
    el.style.willChange = "transform";
    el.addEventListener("mousemove", onMove, { passive: true });
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.style.willChange = "";
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [isMobile, onMove, onLeave]);

  return ref;
}
