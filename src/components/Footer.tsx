import { Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-brand-navy text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="space-y-4">
            <img
              src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png"
              alt="Dale Automations Logo"
              className="h-10 w-auto brightness-0 invert opacity-80"
            />
            <p className="text-primary-foreground/80 leading-relaxed">
              {t('footer.description')}
            </p>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              {t('footer.legalInfo')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              <button
                onClick={() => document.getElementById('whatwedo')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.whatWeDo')}
              </button>
              <button
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.cases')}
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.aboutUs')}
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.contact')}
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">{t('footer.contactInfo')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">daleautomations00@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">{t('footer.poweredBy')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <span className="text-primary-foreground/60 text-sm">
            {t('footer.copyright')}
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
