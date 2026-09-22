import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, ArrowRight } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { abrirWhatsApp } from "@/config/contacto";

// Un teléfono real tiene entre 8 y 15 dígitos (el máximo del estándar E.164).
const MIN_DIGITOS = 8;
const MAX_DIGITOS = 15;
const soloDigitos = (v: string) => v.replace(/\D/g, '');

const ContactForm = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [error, setError] = useState('');
  const { ref, isInView } = useInView();

  const handleWhatsApp = () => abrirWhatsApp(i18n.language);

  // Mientras escribe: deja pasar solo lo que puede haber en un teléfono.
  // Las letras y los símbolos raros ni siquiera llegan a aparecer en el campo.
  const handleWhatsappChange = (valor: string) => {
    let limpio = valor.replace(/[^\d+\s().-]/g, '').slice(0, 20);
    // Corta al llegar al máximo de dígitos reales, sin contar espacios ni guiones,
    // así el campo no acepta un número imposible ni siquiera pegándolo.
    while (soloDigitos(limpio).length > MAX_DIGITOS) {
      limpio = limpio.slice(0, -1);
    }
    setWhatsapp(limpio);
    if (error) setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError(t('contact.form.errorName'));
      return;
    }

    const digitos = soloDigitos(whatsapp);
    if (digitos.length < MIN_DIGITOS || digitos.length > MAX_DIGITOS) {
      setError(t('contact.form.errorPhone'));
      return;
    }

    setError('');
    const msg = i18n.language === 'en'
      ? `Hey Pablo! I'm ${name.trim()} (${whatsapp.trim()}). Found you on daleautomations.com`
      : `Hola! Soy ${name.trim()} (${whatsapp.trim()}). Los encontré por daleautomations.com`;
    abrirWhatsApp(i18n.language, msg);
    setName('');
    setWhatsapp('');
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-56 h-56 bg-brand-blue/8 orb orb-1"></div>
      <div className="absolute bottom-1/4 -left-20 w-48 h-48 bg-brand-navy/5 orb orb-2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
            {t('contact.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div
          ref={ref}
          className={`max-w-md mx-auto reveal ${isInView ? 'in-view' : ''}`}
        >
          <div className="glass gradient-border rounded-2xl p-8 space-y-6">
            <Button
              size="lg"
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 text-lg py-7 group rounded-xl"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              {t('contact.whatsappBtn')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{t('contact.orFillForm')}</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value.slice(0, 60)); if (error) setError(''); }}
                placeholder={t('contact.form.name')}
                maxLength={60}
                autoComplete="name"
                className="border-brand-blue/20 focus:border-brand-blue focus:ring-brand-blue/20 py-6 text-base rounded-xl bg-muted/30"
                required
              />
              <Input
                type="tel"
                inputMode="tel"
                value={whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                placeholder={t('contact.form.whatsapp')}
                maxLength={20}
                autoComplete="tel"
                aria-invalid={error ? true : undefined}
                className="border-brand-blue/20 focus:border-brand-blue focus:ring-brand-blue/20 py-6 text-base rounded-xl bg-muted/30"
                required
              />
              {error && (
                <p role="alert" className="text-sm text-red-600 px-1">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full animated-gradient text-primary-foreground hover:shadow-glow transition-all duration-500 text-lg py-6 group rounded-xl"
              >
                {t('contact.form.send')}
                <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
