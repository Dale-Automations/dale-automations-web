import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import { useState } from "react";

const ContactForm = () => {
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

    // Here you would typically send the data to your backend
    toast({
      title: "¡Mensaje enviado!",
      description: "Nos pondremos en contacto contigo pronto.",
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
            ¿Listo para Automatizar?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Contáctanos y descubre cómo podemos transformar tu negocio con IA
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
                Hablemos de tu Proyecto
              </CardTitle>
              <CardDescription className="text-lg">
                Completa el formulario y nuestro equipo te contactará
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-brand-navy font-medium">
                    Nombre *
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tu nombre completo"
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-brand-navy font-medium">
                    Teléfono <span className="text-muted-foreground">(opcional si querés probar Ascend)</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Tu teléfono"
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-brand-navy font-medium">
                    Email *
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      className="pl-10 border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                      required
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-brand-blue" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-brand-navy font-medium">
                    Mensaje <span className="text-muted-foreground">(opcional)</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Cuéntanos sobre tu proyecto o qué automatización necesitas..."
                    className="min-h-[120px] border-brand-blue/30 focus:border-brand-blue focus:ring-brand-blue/20"
                    rows={5}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg py-6 group"
                >
                  Enviar Mensaje
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