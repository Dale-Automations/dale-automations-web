import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Monitor, BarChart3, Workflow, Plug } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Solutions = () => {
  const { t } = useTranslation();

  const services = [
    { icon: Monitor, key: "systems" },
    { icon: BarChart3, key: "dashboards" },
    { icon: Workflow, key: "automations" },
    { icon: Plug, key: "integrations" },
  ];

  return (
    <section id="whatwedo" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('whatWeDo.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('whatWeDo.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/10 hover:scale-[1.02]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-xl font-bold text-brand-navy">
                    {t(`whatWeDo.${service.key}.title`)}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`whatWeDo.${service.key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
