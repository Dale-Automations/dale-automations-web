import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

const ContactForm = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const handleWhatsApp = () => {
    const phone = i18n.language === 'en' ? '13464929025' : '5491136626658';
    const msg = i18n.language === 'en'
      ? "Hey Pablo! I found you on daleautomations.com"
      : "Hola Pablo! Los encontré por daleautomations.com";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !whatsapp) return;

    const phone = i18n.language === 'en' ? '13464929025' : '5491136626658';
    const msg = i18n.language === 'en'
      ? `Hey Pablo! I'm ${name} (${whatsapp}). Found you on daleautomations.com`
      : `Hola Pablo! Soy ${name} (${whatsapp}). Los encontré por daleautomations.com`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    setName('');
    setWhatsapp('');
  };

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-40 h-40 bg-brand-navy/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="max-w-md mx-auto space-y-8">
          {/* WhatsApp directo */}
          <Button
            size="lg"
            onClick={handleWhatsApp}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-lg py-7 group"
          >
            <MessageCircle className="mr-2 h-6 w-6" />
            {t('contact.whatsappBtn')}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>

          {/* Separador */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">{t('contact.orFillForm')}</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Mini formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('contact.form.name')}
              className="border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20 py-6 text-base"
              required
            />
            <Input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder={t('contact.form.whatsapp')}
              className="border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20 py-6 text-base"
              required
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6 group"
            >
              {t('contact.form.send')}
              <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
