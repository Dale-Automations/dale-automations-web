import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Header = () => {
  const { t } = useTranslation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full bg-background/90 backdrop-blur-sm border-b border-border z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <img
            src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png"
            alt="Dale Automations Logo"
            className="h-10 md:h-14 w-auto cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => scrollToSection('whatwedo')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              {t('header.whatWeDo')}
            </button>
            <button
              onClick={() => scrollToSection('cases')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              {t('header.cases')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors duration-300 text-sm font-medium"
            >
              {t('header.aboutUs')}
            </button>
            <LanguageSelector />
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-sm"
              size="sm"
            >
              {t('header.contact')}
            </Button>
          </nav>

          {/* Mobile: language + CTA */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSelector />
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-xs"
              size="sm"
            >
              {t('header.contact')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
