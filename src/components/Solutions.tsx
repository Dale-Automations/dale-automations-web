import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Instagram, MessageCircle, Calendar, TrendingUp, Users } from "lucide-react";

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

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Ascend AI */}
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-primary rounded-full shadow-glow">
                  <Phone className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
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
          <Card className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-4 bg-gradient-primary rounded-full shadow-glow">
                  <Instagram className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
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