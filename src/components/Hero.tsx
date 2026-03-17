import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import DashboardMockup from "./DashboardMockup";

const Hero = () => {
  const { t, i18n } = useTranslation();

  const handleWhatsApp = () => {
    const phone = i18n.language === 'en' ? '13464929025' : '5491136626658';
    const msg = i18n.language === 'en'
      ? "Hey Pablo! I found you on daleautomations.com"
      : "Hola Pablo! Los encontré por daleautomations.com";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <section className="relative overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-60"></div>

      {/* Gradient line accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-blue/30 to-transparent"></div>

      <div className="container mx-auto px-4 pt-28 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass gradient-border text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            {i18n.language === 'en' ? 'Building systems in production' : 'Construyendo sistemas en producción'}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animated-gradient-text leading-tight tracking-tight">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="animated-gradient text-primary-foreground hover:shadow-glow transition-all duration-500 text-lg px-8 py-6 group rounded-xl"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass gradient-border text-brand-navy hover:bg-brand-blue/10 transition-all duration-300 text-lg px-8 py-6 rounded-xl"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>

        {/* Dashboard mockup */}
        <DashboardMockup />
      </div>
    </section>
  );
};

export default Hero;
