import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-navy text-primary-foreground py-12 relative overflow-hidden">
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 grid-lines"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/lovable-uploads/05e1f05d-8d17-4b8c-ab80-62fb932ad3b6.png"
                alt="Dale Automations"
                className="h-9 w-auto"
                style={{ mixBlendMode: "lighten" }}
              />
              <div className="leading-none">
                <span className="text-lg font-bold text-primary-foreground/90 tracking-tight block">DALE</span>
                <span className="text-[10px] font-semibold text-primary-foreground/60 tracking-[0.2em] block">AUTOMATIONS</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 leading-relaxed text-sm">
              {t('footer.description')}
            </p>
            <p className="text-primary-foreground/40 text-xs leading-relaxed">
              {t('footer.legalInfo')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary-foreground/90 uppercase tracking-wider">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              {[
                { id: 'whatwedo', label: t('header.whatWeDo') },
                { id: 'cases', label: t('header.cases') },
                { id: 'about', label: t('header.aboutUs') },
                { id: 'contact', label: t('header.contact') },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })}
                  className="block text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-primary-foreground/90 uppercase tracking-wider">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-brand-blue" />
                <span className="text-sm text-primary-foreground/60">daleautomations00@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-brand-blue" />
                <span className="text-sm text-primary-foreground/60">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-brand-blue" />
                <span className="text-sm text-primary-foreground/60">{t('footer.poweredBy')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <span className="text-primary-foreground/40 text-xs">
            {t('footer.copyright')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
