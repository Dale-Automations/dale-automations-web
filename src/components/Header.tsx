import { Button } from "@/components/ui/button";

const Header = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 w-full bg-background/90 backdrop-blur-sm border-b border-border z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png" 
            alt="Dale Automations Logo" 
            className="h-10 w-auto"
          />
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('solutions')}
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            Soluciones
          </button>
          <button 
            onClick={() => scrollToSection('benefits')}
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            Beneficios
          </button>
          <button 
            onClick={() => scrollToSection('cases')}
            className="text-foreground hover:text-primary transition-colors duration-300"
          >
            Casos de Éxito
          </button>
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            Contacto
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;