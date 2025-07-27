import { Bot, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png" 
                alt="Dale Automations Logo" 
                className="h-10 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-primary-foreground/80 leading-relaxed">
              Transformamos negocios con soluciones de inteligencia artificial que trabajan 24/7. 
              Más eficiencia, menos costos, mejores resultados.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">Enlaces Rápidos</h4>
            <div className="space-y-2">
              <button 
                onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Soluciones
              </button>
              <button 
                onClick={() => document.getElementById('benefits')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Beneficios
              </button>
              <button 
                onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Casos de Éxito
              </button>
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="block text-primary-foreground/80 hover:text-primary-foreground transition-colors duration-300"
              >
                Contacto
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-primary-foreground">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">daleautomations00@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">+541136626658 (WhatsApp)</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-brand-blue" />
                <span className="text-primary-foreground/80">Buenos Aires, Argentina</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Bot className="h-5 w-5 text-brand-blue" />
            <span className="text-primary-foreground/80">
              © 2024 Dale Automations. Todos los derechos reservados.
            </span>
          </div>
          <p className="text-sm text-primary-foreground/60">
            Potenciado por Inteligencia Artificial
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;