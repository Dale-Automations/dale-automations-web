import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const dot = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isMobile) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, input, textarea, [data-cursor]");
      setHovered(!!interactive);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });

    let animId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      dot.current.x = lerp(dot.current.x, mouse.current.x, 0.25);
      dot.current.y = lerp(dot.current.y, mouse.current.y, 0.25);
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x - 4}px, ${dot.current.y - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x - 20}px, ${ring.current.y - 20}px)`;
      }
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "hsl(var(--brand-navy))",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          ...(hovered ? { width: 6, height: 6, opacity: 0.5 } : {}),
        }}
      />
      <div
        ref={ringRef}
        className="custom-cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: "1.5px solid hsl(var(--brand-blue))",
          pointerEvents: "none",
          zIndex: 9998,
          willChange: "transform",
          transition: "width 0.4s, height 0.4s, border-color 0.3s, background 0.3s",
          ...(hovered
            ? {
                width: 56,
                height: 56,
                background: "hsl(var(--brand-blue) / 0.08)",
                borderColor: "hsl(var(--brand-blue) / 0.4)",
              }
            : {}),
        }}
      />
    </>
  );
};

export default CustomCursor;
