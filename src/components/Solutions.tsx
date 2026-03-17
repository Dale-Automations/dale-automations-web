import { Monitor, BarChart3, Workflow, Plug } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useInView } from "@/hooks/use-in-view";
import { useTilt } from "@/hooks/use-tilt";

const TiltCard = ({ children, className }: { children: React.ReactNode; className: string }) => {
  const ref = useTilt<HTMLDivElement>(6);
  return <div ref={ref} className={className}>{children}</div>;
};

const Solutions = () => {
  const { t } = useTranslation();
  const { ref, isInView } = useInView();

  const services = [
    { icon: Monitor, key: "systems", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BarChart3, key: "dashboards", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Workflow, key: "automations", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Plug, key: "integrations", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <section id="whatwedo" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-lines"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
            {t('whatWeDo.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('whatWeDo.subtitle')}
          </p>
        </div>

        <div
          ref={ref}
          className={`grid md:grid-cols-2 gap-6 max-w-5xl mx-auto stagger-lr ${isInView ? 'in-view' : ''}`}
        >
          {services.map((service, index) => (
            <TiltCard
              key={index}
              className="tilt-card group glass gradient-border rounded-2xl p-6 hover:shadow-elegant transition-all duration-500 glow-hover"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 ${service.bg} rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`h-6 w-6 ${service.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy mb-2">
                    {t(`whatWeDo.${service.key}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`whatWeDo.${service.key}.description`)}
                  </p>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Solutions;
