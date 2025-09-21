import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useState } from "react";

const ContactForm = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos (Nombre y Email)",
        variant: "destructive"
      });
      return;
    }

    // Construir el mensaje de WhatsApp
    let whatsappMessage = `Hola! Me interesa automatizar mi negocio con IA.\n\n`;
    whatsappMessage += `📝 *Datos de contacto:*\n`;
    whatsappMessage += `• Nombre: ${formData.name}\n`;
    whatsappMessage += `• Email: ${formData.email}\n`;
    
    if (formData.phone) {
      whatsappMessage += `• Teléfono: ${formData.phone}\n`;
    }
    
    if (formData.message) {
      whatsappMessage += `\n💬 *Mensaje:*\n${formData.message}`;
    }

    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Crear la URL de WhatsApp
    const whatsappURL = `https://wa.me/541136626658?text=${encodedMessage}`;
    
    // Abrir WhatsApp en una nueva pestaña
    window.open(whatsappURL, '_blank');

    toast({
      title: "¡Redirigiendo a WhatsApp!",
      description: "Se abrirá WhatsApp con tu mensaje listo para enviar.",
    });

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      message: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-20 w-40 h-40 bg-brand-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-20 w-40 h-40 bg-brand-navy/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('contact.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-elegant border-brand-blue/20 bg-gradient-to-br from-card to-brand-light/5">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-gradient-primary rounded-full shadow-glow">
                  <MessageCircle className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-brand-navy">
                {t('contact.title')}
              </CardTitle>
              <CardDescription className="text-lg">
                {t('contact.subtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-brand-navy font-medium">
                    {t('contact.form.name')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t('contact.form.name')}
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-brand-navy font-medium">
                    {t('contact.form.phone')} <span className="text-muted-foreground">({t('contact.form.optional')})</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder={t('contact.form.phone')}
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-brand-navy font-medium">
                    {t('contact.form.email')} *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder={t('contact.form.email')}
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-brand-navy font-medium">
                    Mensaje (opcional)
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.form.message')}
                    className="min-h-[120px] border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6 group"
                >
                  {t('contact.form.send')}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;