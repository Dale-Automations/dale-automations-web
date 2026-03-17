import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollHeight > 0 ? scrollTop / scrollHeight : 0);
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60]">
      <div
        className="h-full bg-gradient-to-r from-brand-navy to-brand-blue"
        style={{ width: `${progress * 100}%`, transition: "width 0.1s linear" }}
      >
        <div className="absolute right-0 top-0 w-2 h-full bg-brand-blue rounded-full shadow-[0_0_8px_hsl(var(--brand-blue)/0.6)]" />
      </div>
    </div>
  );
};

export default ScrollProgress;
