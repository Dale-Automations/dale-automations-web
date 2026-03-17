import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, PenTool, Code, Headphones, GraduationCap } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Benefits = () => {
  const { t } = useTranslation();

  const steps = [
    { icon: Search, key: "understand", step: "01" },
    { icon: PenTool, key: "design", step: "02" },
    { icon: Code, key: "build", step: "03" },
    { icon: Headphones, key: "deliver", step: "04" },
  ];

  return (
    <section id="about" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Quiénes Somos */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            {t('aboutUs.title')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            {t('aboutUs.subtitle')}
          </p>
          <div className="bg-card border border-brand-blue/20 rounded-2xl p-8 md:p-10 text-left space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-brand-blue/10 rounded-xl">
                <GraduationCap className="h-6 w-6 text-brand-blue" />
              </div>
              <span className="font-semibold text-brand-navy text-lg">Pablo Heckel</span>
              <span className="text-sm text-muted-foreground">MBA &bull; Lic. en Administración</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('aboutUs.bio')}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutUs.differentiator')}
            </p>
          </div>
        </div>

        {/* Cómo Trabajamos */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-brand-navy">
            {t('aboutUs.process.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, index) => (
              <Card
                key={index}
                className="group hover:shadow-elegant transition-all duration-500 border-brand-blue/20 hover:border-brand-blue/40 bg-gradient-to-br from-card to-brand-light/5 text-center hover:scale-105"
              >
                <CardHeader className="pb-3">
                  <div className="mx-auto mb-2">
                    <span className="text-4xl font-bold text-brand-blue/20">{s.step}</span>
                  </div>
                  <div className="mx-auto p-3 bg-gradient-primary rounded-full shadow-glow group-hover:scale-110 transition-transform duration-300 w-fit">
                    <s.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg font-bold text-brand-navy mt-3">
                    {t(`aboutUs.process.steps.${s.key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`aboutUs.process.steps.${s.key}.description`)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
