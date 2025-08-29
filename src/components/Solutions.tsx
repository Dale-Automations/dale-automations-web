import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Instagram, MessageCircle, Calendar, TrendingUp, Users } from "lucide-react";
import ascendAiImage from "@/assets/ascend-ai-hero.jpg";
import socialMediaImage from "@/assets/social-media-automation.jpg";

const Solutions = () => {
  return (
    <section id="solutions" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Nuestras Soluciones
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluciones pre-armadas de IA diseñadas para potenciar tu negocio
          </p>
        </div>

        {/* Soluciones a Medida - Full Width */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-brand-navy mb-4">
                Soluciones a Medida
              </CardTitle>
              <CardDescription className="text-xl max-w-3xl mx-auto">
                Integramos herramientas de IA personalizadas en tus procesos específicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">Automatización de Procesos</h3>
                  <p className="text-muted-foreground text-sm">
                    Identificamos procesos repetitivos y los automatizamos con IA
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">Optimización de Recursos</h3>
                  <p className="text-muted-foreground text-sm">
                    Mejoramos la eficiencia de tu equipo con herramientas inteligentes
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <div className="mx-auto w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-brand-blue" />
                  </div>
                  <h3 className="font-semibold text-brand-navy">Reducción de Costos</h3>
                  <p className="text-muted-foreground text-sm">
                    Disminuimos gastos operativos mediante automatización inteligente
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
                  ¿Tienes procesos únicos en tu empresa? Creamos soluciones de IA completamente personalizadas 
                  para automatizar tareas específicas, mejorar la productividad y reducir costos operativos. 
                  Desde análisis de datos hasta integración con sistemas existentes.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ascend AI */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={ascendAiImage} 
                alt="Ascend AI - Sistema de llamadas inteligente" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <Phone className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-brand-navy mb-2">
                Ascend AI
              </CardTitle>
              <CardDescription className="text-lg">
                Sistema inteligente para llamadas entrantes y salientes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Atención al Cliente</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Ventas Automatizadas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">24/7 Disponible</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Múltiples Idiomas</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                Maneja llamadas entrantes y salientes con IA conversacional avanzada. 
                Perfecta para atención al cliente, ventas y seguimiento de leads.
              </p>
            </CardContent>
          </Card>

          {/* Social Media Automation */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10 overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={socialMediaImage} 
                alt="Automatización de Redes Sociales con IA" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                  <Instagram className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-brand-navy mb-2">
                Redes Sociales IA
              </CardTitle>
              <CardDescription className="text-lg">
                Automatización completa de contenido social
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Posts Automáticos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Stories Diarias</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Reels Virales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-brand-blue" />
                  <span className="text-sm">Programación</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-4">
                Genera y publica contenido único todos los días: posts, reels y stories. 
                Mantén tu presencia digital activa sin esfuerzo manual.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Solutions;