import { CheckCircle, FileText, Truck, Users, LayoutDashboard } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useInView } from "@/hooks/use-in-view";
import { useTilt } from "@/hooks/use-tilt";

const TiltCard = ({ children, className }: { children: React.ReactNode; className: string }) => {
  const ref = useTilt<HTMLDivElement>(5);
  return <div ref={ref} className={className}>{children}</div>;
};

const SuccessCases = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useInView();

  const cases = [
    { key: "factura", icon: FileText, color: "text-blue-500", bg: "bg-blue-500/10" },
    { key: "hch", icon: Truck, color: "text-orange-500", bg: "bg-orange-500/10" },
    { key: "recruiting", icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { key: "mymate", icon: LayoutDashboard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <section id="cases" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-brand-blue/5 orb orb-2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
            {t('cases.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('cases.subtitle')}
          </p>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-6 max-w-6xl mx-auto stagger ${isInView ? 'in-view' : ''}`}
        >
          {cases.map((c, index) => {
            const features = t(`cases.${c.key}.features`, { returnObjects: true }) as string[];
            return (
              <TiltCard
                key={index}
                className={`tilt-card glass gradient-border rounded-2xl p-6 hover:shadow-elegant transition-all duration-500 glow-hover ${
                  index === 0 ? 'md:col-span-2' : ''
                }`}
              >
                <div className={index === 0 ? 'md:flex md:gap-8 md:items-start' : ''}>
                  <div className={index === 0 ? 'md:flex-1' : ''}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 ${c.bg} rounded-xl`}>
                          <c.icon className={`h-5 w-5 ${c.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-navy">
                          {t(`cases.${c.key}.title`)}
                        </h3>
                      </div>
                      <span className={`tag-chip ${c.color}`}>
                        {t(`cases.${c.key}.tag`)}
                      </span>
                    </div>

                    <p className="text-muted-foreground leading-relaxed mb-4">
                      {t(`cases.${c.key}.description`)}
                    </p>
                  </div>

                  <div className={`grid grid-cols-2 gap-2 ${index === 0 ? 'md:w-80 md:shrink-0' : ''}`}>
                    {Array.isArray(features) && features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-muted/50">
                        <CheckCircle className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;
