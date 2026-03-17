import { Search, PenTool, Code, Headphones, GraduationCap } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useInView } from "@/hooks/use-in-view";

const Benefits = () => {
  const { t } = useTranslation();
  const { ref: bioRef, isInView: bioInView } = useInView();
  const { ref: stepsRef, isInView: stepsInView } = useInView();

  const steps = [
    { icon: Search, key: "understand", num: "01", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: PenTool, key: "design", num: "02", color: "text-violet-500", bg: "bg-violet-500/10" },
    { icon: Code, key: "build", num: "03", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: Headphones, key: "deliver", num: "04", color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <section id="about" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-40"></div>
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-brand-blue/5 orb orb-3"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Quienes Somos */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
            {t('aboutUs.title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('aboutUs.subtitle')}
          </p>
        </div>

        <div
          ref={bioRef}
          className={`max-w-3xl mx-auto mb-20 reveal ${bioInView ? 'in-view' : ''}`}
        >
          <div className="glass gradient-border rounded-2xl p-8 md:p-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-blue/10 rounded-xl">
                <GraduationCap className="h-6 w-6 text-brand-blue" />
              </div>
              <div>
                <span className="font-semibold text-brand-navy text-lg block">Pablo Heckel</span>
                <span className="text-sm text-muted-foreground">MBA · Lic. en Administración de Empresas</span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              {t('aboutUs.bio')}
            </p>
            <div className="h-px bg-gradient-to-r from-transparent via-brand-blue/20 to-transparent"></div>
            <p className="text-muted-foreground leading-relaxed">
              {t('aboutUs.differentiator')}
            </p>
          </div>
        </div>

        {/* Como Trabajamos */}
        <h3 className="text-3xl font-bold text-center mb-12 text-brand-navy tracking-tight">
          {t('aboutUs.process.title')}
        </h3>

        <div
          ref={stepsRef}
          className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto stagger ${stepsInView ? 'in-view' : ''}`}
        >
          {steps.map((s, index) => (
            <div
              key={index}
              className="glass gradient-border rounded-2xl p-6 text-center hover:shadow-elegant transition-all duration-500 hover:-translate-y-1 glow-hover relative"
            >
              {/* Step number watermark */}
              <div className="absolute top-3 right-4 text-5xl font-black text-brand-blue/[0.06] leading-none select-none">
                {s.num}
              </div>

              <div className={`mx-auto p-3 ${s.bg} rounded-xl w-fit mb-4`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <h4 className="text-base font-semibold text-brand-navy mb-2">
                {t(`aboutUs.process.steps.${s.key}.title`)}
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t(`aboutUs.process.steps.${s.key}.description`)}
              </p>

              {/* Connector arrow (hidden on last + mobile) */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-px bg-brand-blue/30"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
