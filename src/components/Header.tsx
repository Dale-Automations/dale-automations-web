import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();
  const [showIntro, setShowIntro] = useState(true);
  
  useEffect(() => {
    // Terminar la animación después de 2.5 segundos
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Logo Intro Overlay */}
      {showIntro && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <img 
            src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png" 
            alt="Dale Automations Logo" 
            className="logo-intro h-20 md:h-24 w-auto"
          />
        </div>
      )}
      
      <header className={`fixed top-0 w-full bg-background/90 backdrop-blur-sm border-b border-border z-40 transition-all duration-300 ${showIntro ? 'opacity-0' : 'page-intro'}`}>
        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Logo centrado y más grande */}
          <div className="flex justify-center mb-3 md:mb-4">
            <img 
              src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png" 
              alt="Dale Automations Logo" 
              className="h-16 md:h-20 w-auto"
            />
          </div>
        
        {/* Menú de navegación debajo del logo */}
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-8">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            <button 
              onClick={() => scrollToSection('solutions')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {t('header.solutions')}
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {t('header.benefits')}
            </button>
            <button 
              onClick={() => scrollToSection('cases')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-xs sm:text-sm font-medium whitespace-nowrap"
            >
              {t('header.successCases')}
            </button>
            <LanguageSelector />
          </div>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-xs sm:text-sm mt-2 sm:mt-0"
            size="sm"
          >
            {t('header.contact')}
          </Button>
        </nav>
      </div>
    </header>
    </>
  );
};

export default Header;