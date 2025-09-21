import { Bot } from "lucide-react";
import { useScroll } from "@/hooks/use-scroll";

const FloatingRobot = () => {
  const { scrollY, scrollProgress } = useScroll();
  
  // Calcular transformaciones más dinámicas basadas en el scroll
  const robotTransform = {
    x: Math.sin(scrollProgress * Math.PI * 4) * 15, // Movimiento horizontal más frecuente
    y: Math.cos(scrollProgress * Math.PI * 3) * 10, // Movimiento vertical ondulante
    rotate: scrollProgress * 720, // Rotación más rápida (2 vueltas completas)
    scale: 1 + Math.sin(scrollProgress * Math.PI * 6) * 0.15, // Pulsación más frecuente
  };

  return (
    <div 
      className="fixed top-20 right-8 z-40 pointer-events-none"
      style={{
        transform: `translateX(${robotTransform.x}px) translateY(${robotTransform.y}px) rotate(${robotTransform.rotate}deg) scale(${robotTransform.scale})`,
        transition: 'transform 0.1s ease-out',
      }}
    >
      <Bot className="h-8 w-8 text-brand-blue drop-shadow-lg" />
    </div>
  );
};

export default FloatingRobot;