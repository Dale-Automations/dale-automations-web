import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, DollarSign, TrendingUp, Shield, Zap, Users } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Benefits = () => {
  const { t } = useTranslation();
  
  const benefits = [
    {
      icon: Clock,
      titleKey: "benefits.items.time.title",
      descriptionKey: "benefits.items.time.description"
    },
    {
      icon: DollarSign,
      titleKey: "benefits.items.cost.title",
      descriptionKey: "benefits.items.cost.description"
    },
    {
      icon: TrendingUp,
      titleKey: "benefits.items.scalability.title",
      descriptionKey: "benefits.items.scalability.description"
    },
    {
      icon: Shield,
      titleKey: "benefits.items.availability.title",
      descriptionKey: "benefits.items.availability.description"
    },
    {
      icon: Zap,
      titleKey: "benefits.items.response.title",
      descriptionKey: "benefits.items.response.description"
    },
    {
      icon: Users,
      titleKey: "benefits.items.experience.title",
      descriptionKey: "benefits.items.experience.description"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('benefits.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('benefits.subtitle')}
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
                  {t(benefit.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {t(benefit.descriptionKey)}
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