
import { Bot, Mail, Phone, MapPin } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-brand-navy text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">{t('footer.company')}</h4>
            <p className="text-primary-foreground/80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              <button 
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.solutions')}
              </button>
              <button 
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.benefits')}
              </button>
              <button 
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                {t('header.successCases')}
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
                <span className="text-primary-foreground/80">{t('footer.email')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">{t('footer.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">{t('footer.locations')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Bot className="h-5 w-5 text-brand-blue" />
            <span className="text-primary-foreground/80">
              {t('footer.copyright')}
            </span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            {t('footer.poweredBy')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
