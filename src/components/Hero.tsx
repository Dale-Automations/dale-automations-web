
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Bot } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useScroll } from "@/hooks/use-scroll";
import CallMeForm from "./CallMeForm";

const Hero = () => {
  const { t } = useTranslation();
  const { scrollY, scrollProgress } = useScroll();
  
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Calcular transformaciones basadas en el scroll
  const robotTransform = {
    x: Math.sin(scrollProgress * Math.PI * 2) * 20, // Movimiento horizontal ondulante
    y: scrollY * 0.1, // Movimiento vertical suave
    rotate: scrollProgress * 360, // Rotación completa
    scale: 1 + Math.sin(scrollProgress * Math.PI) * 0.2, // Escalado dinámico
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-light/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-navy/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div 
              className="transition-transform duration-75 ease-out"
              style={{
                transform: `translateX(${robotTransform.x}px) translateY(${robotTransform.y}px) rotate(${robotTransform.rotate}deg) scale(${robotTransform.scale})`,
              }}
            >
              <Bot className="h-12 w-12 text-brand-blue mr-4" />
            </div>
            <Zap className="h-8 w-8 text-brand-navy animate-pulse ml-2" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            {t('hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="btn-orbit">
              <CallMeForm>
                <Button 
                  size="lg"
                  className="relative bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4 group"
                >
                  {t('hero.talkToAgent')}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CallMeForm>

              {/* Punto de luz animado recorriendo el borde */}
              <svg
                className="btn-orbit-svg"
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <rect
                  x="2"
                  y="2"
                  width="96"
                  height="36"
                  rx="8"
                  ry="8"
                  className="btn-orbit-stroke"
                />
              </svg>
            </div>

            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-brand-blue text-brand-navy hover:bg-brand-blue/10 transition-all duration-300 text-lg px-8 py-4"
            >
              {t('hero.viewSolutions')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
