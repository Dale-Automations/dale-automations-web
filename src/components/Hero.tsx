import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Bot } from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-light/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-blue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-navy/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Bot className="h-12 w-12 text-brand-blue mr-4 animate-bounce" />
            <Zap className="h-8 w-8 text-brand-navy animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
            Automatiza tu Negocio
            <br />
            con Inteligencia Artificial
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transformamos tu empresa con soluciones de IA que trabajan 24/7. 
            Más eficiencia, menos costos, mejores resultados.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-blue via-brand-navy to-brand-blue rounded-lg blur-sm opacity-75 animate-spin"></div>
              <Button 
                size="lg" 
                asChild
                className="relative bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-4 group"
              >
                <a href="https://creator.voiceflow.com/prototype/687c300e0dde4cc3e9cbab8c" target="_blank" rel="noopener noreferrer">
                  Hablar con un Agente
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </a>
              </Button>
            </div>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById('solutions')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-brand-blue text-brand-navy hover:bg-brand-blue/10 transition-all duration-300 text-lg px-8 py-4"
            >
              Ver Soluciones
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;