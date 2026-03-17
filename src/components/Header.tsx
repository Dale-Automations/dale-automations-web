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
    <header className="fixed top-0 w-full z-50 transition-all duration-300">
      <div className="glass-strong border-b border-brand-blue/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img
              src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png"
              alt="Dale Automations Logo"
              className="h-9 md:h-11 w-auto cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'whatwedo', label: t('header.whatWeDo') },
                { id: 'cases', label: t('header.cases') },
                { id: 'about', label: t('header.aboutUs') },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-muted/50 transition-all duration-200"
                >
                  {item.label}
                </button>
              ))}
              <div className="ml-2">
                <LanguageSelector />
              </div>
              <Button
                onClick={() => scrollToSection('contact')}
                className="ml-2 animated-gradient text-primary-foreground hover:shadow-glow transition-all duration-300 text-sm rounded-xl"
                size="sm"
              >
                {t('header.contact')}
              </Button>
            </nav>

            {/* Mobile */}
            <div className="flex md:hidden items-center gap-2">
              <LanguageSelector />
              <Button
                onClick={() => scrollToSection('contact')}
                className="animated-gradient text-primary-foreground text-xs rounded-xl"
                size="sm"
              >
                {t('header.contact')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
