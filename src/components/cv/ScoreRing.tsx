import { cn } from "@/lib/utils";
import { nivelAts, type NivelAts } from "@/lib/cv-api";

const CLASE_ANILLO: Record<NivelAts, string> = {
  alto: "text-emerald-500",
  medio: "text-brand-blue",
  regular: "text-amber-500",
  bajo: "text-destructive",
};

type Props = { score: number; size?: number; className?: string };

const ScoreRing = ({ score, size = 120, className }: Props) => {
  const valor = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const grosor = 10;
  const radio = (size - grosor) / 2;
  const circunferencia = 2 * Math.PI * radio;
  const desplazamiento = circunferencia * (1 - valor / 100);

  return (
    <div
      role="img"
      aria-label={`Puntaje ATS ${valor} de 100`}
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radio}
          fill="none"
          stroke="currentColor"
          strokeWidth={grosor}
          className="text-brand-navy/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radio}
          fill="none"
          stroke="currentColor"
          strokeWidth={grosor}
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={desplazamiento}
          className={CLASE_ANILLO[nivelAts(valor)]}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-hidden="true">
        <span className="text-3xl font-bold leading-none text-foreground">{valor}</span>
        <span className="mt-1 text-xs text-muted-foreground">de 100</span>
      </div>
    </div>
  );
};

export default ScoreRing;
