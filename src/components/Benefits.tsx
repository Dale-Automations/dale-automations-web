import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Shield, Zap, Users } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: Clock,
      title: "Ahorro de Tiempo",
      description: "Automatiza tareas repetitivas y libera tiempo para actividades estratégicas"
    },
    {
      icon: DollarSign,
      title: "Reducción de Costos",
      description: "Disminuye gastos operativos hasta en un 60% con automatización inteligente"
    },
    {
      icon: TrendingUp,
      title: "Escalabilidad",
      description: "Crece sin límites. Nuestras soluciones se adaptan al crecimiento de tu negocio"
    },
    {
      icon: Shield,
      title: "Disponibilidad 24/7",
      description: "Servicios que nunca duermen. Atención continua para tus clientes"
    },
    {
      icon: Zap,
      title: "Respuesta Instantánea",
      description: "Tiempos de respuesta en segundos, no en horas o días"
    },
    {
      icon: Users,
      title: "Mejor Experiencia",
      description: "Clientes más satisfechos con atención personalizada e inmediata"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            ¿Por qué Automatizar con IA?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubre los beneficios que transformarán tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card 
              key={index}
              className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/5 hover:scale-105"
            >
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-4 bg-gradient-primary rounded-full shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-brand-navy mb-2">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;