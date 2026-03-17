import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';

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
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-light/20 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-navy/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6 group"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              {t('hero.cta')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-brand-blue text-brand-navy hover:bg-brand-blue/10 transition-all duration-300 text-lg px-8 py-6"
            >
              {t('hero.ctaSecondary')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
