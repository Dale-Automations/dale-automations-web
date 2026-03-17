import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, FileText, Truck, Users, LayoutDashboard } from "lucide-react";
import { useTranslation } from 'react-i18next';

const SuccessCases = () => {
  const { t } = useTranslation();

  const cases = [
    { key: "factura", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { key: "hch", icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
    { key: "recruiting", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { key: "mymate", icon: LayoutDashboard, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <section id="cases" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('cases.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('cases.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {cases.map((c, index) => {
            const features = t(`cases.${c.key}.features`, { returnObjects: true }) as string[];
            return (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/5"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 ${c.bg} rounded-xl`}>
                        <c.icon className={`h-6 w-6 ${c.color}`} />
                      </div>
                      <CardTitle className="text-xl font-bold text-brand-navy">
                        {t(`cases.${c.key}.title`)}
                      </CardTitle>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.bg} ${c.color}`}>
                      {t(`cases.${c.key}.tag`)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`cases.${c.key}.description`)}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.isArray(features) && features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;
