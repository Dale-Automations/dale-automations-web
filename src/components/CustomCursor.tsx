import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Node {
  x: number;
  y: number;
  age: number;
  opacity: number;
}

const CustomCursor = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<Node[]>([]);
  const mouse = useRef({ x: -100, y: -100 });
  const lastNode = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (isMobile) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      // Drop a new node every ~40px of movement
      const dx = mouse.current.x - lastNode.current.x;
      const dy = mouse.current.y - lastNode.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 40) {
        nodes.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          age: 0,
          opacity: 1,
        });
        lastNode.current = { x: mouse.current.x, y: mouse.current.y };
        // Keep max ~12 nodes
        if (nodes.current.length > 12) {
          nodes.current.shift();
        }
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });

    let animId: number;
    const brandNavy = getComputedStyle(document.documentElement).getPropertyValue("--brand-navy").trim();
    const brandBlue = getComputedStyle(document.documentElement).getPropertyValue("--brand-blue").trim();

    // Parse HSL values
    const parseHSL = (hsl: string) => {
      const parts = hsl.split(/\s+/).map(Number);
      return { h: parts[0] || 210, s: parts[1] || 50, l: parts[2] || 15 };
    };
    const navy = parseHSL(brandNavy);
    const blue = parseHSL(brandBlue);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const arr = nodes.current;

      // Age and fade nodes
      for (let i = arr.length - 1; i >= 0; i--) {
        arr[i].age += 0.012;
        arr[i].opacity = Math.max(0, 1 - arr[i].age);
        if (arr[i].opacity <= 0) {
          arr.splice(i, 1);
        }
      }

      if (arr.length < 2) {
        animId = requestAnimationFrame(draw);
        return;
      }

      // Draw connections (lines between consecutive nodes)
      for (let i = 1; i < arr.length; i++) {
        const a = arr[i - 1];
        const b = arr[i];
        const lineOpacity = Math.min(a.opacity, b.opacity) * 0.3;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${blue.h}, ${blue.s}%, ${blue.l}%, ${lineOpacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Draw connection from last node to current mouse
      if (arr.length > 0) {
        const last = arr[arr.length - 1];
        const lineOpacity = last.opacity * 0.2;
        ctx.beginPath();
        ctx.moveTo(last.x, last.y);
        ctx.lineTo(mouse.current.x, mouse.current.y);
        ctx.strokeStyle = `hsla(${blue.h}, ${blue.s}%, ${blue.l}%, ${lineOpacity})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw nodes (circles like n8n workflow nodes)
      for (let i = 0; i < arr.length; i++) {
        const n = arr[i];
        const size = 4 + (i / arr.length) * 3;

        // Outer glow
        ctx.beginPath();
        ctx.arc(n.x, n.y, size + 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${blue.h}, ${blue.s}%, ${blue.l}%, ${n.opacity * 0.08})`;
        ctx.fill();

        // Node circle (filled)
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${blue.h}, ${blue.s}%, ${blue.l}%, ${n.opacity * 0.15})`;
        ctx.fill();

        // Node border
        ctx.beginPath();
        ctx.arc(n.x, n.y, size, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${navy.h}, ${navy.s}%, ${navy.l}%, ${n.opacity * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Small inner dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${navy.h}, ${navy.s}%, ${navy.l}%, ${n.opacity * 0.4})`;
        ctx.fill();
      }

      // Current position node (brighter, like the "active" node)
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${blue.h}, ${blue.s}%, ${blue.l}%, 0.12)`;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 5, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${navy.h}, ${navy.s}%, ${navy.l}%, 0.3)`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(mouse.current.x, mouse.current.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${navy.h}, ${navy.s}%, ${navy.l}%, 0.5)`;
      ctx.fill();

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      document.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animId);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="node-trail-canvas"
    />
  );
};

export default CustomCursor;
