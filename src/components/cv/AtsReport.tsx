import type { ReactNode } from "react";
import { AlertTriangle, Briefcase, CheckCircle2, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { nivelAts, type AtsReport as AtsData, type NivelAts, type Profile } from "@/lib/cv-api";
import ScoreRing from "@/components/cv/ScoreRing";

const CLASE_VEREDICTO: Record<NivelAts, string> = {
  alto: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  medio: "border-brand-blue/60 bg-brand-blue/20 text-brand-navy",
  regular: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  bajo: "border-destructive/40 bg-destructive/10 text-red-700",
};

// El backend manda el veredicto ya traducido; si llega el enum crudo, se traduce igual.
const TEXTO_VEREDICTO: Record<string, string> = {
  optimizado: "Optimizado para ATS",
  mejorable: "Mejorable",
  no_optimizado: "No optimizado",
};
const textoVeredicto = (v: string) => TEXTO_VEREDICTO[(v || "").toLowerCase()] || v || "";

const CLASE_PRIORIDAD: Record<string, string> = {
  alta: "border-destructive/40 bg-destructive/10 text-red-700",
  media: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  baja: "border-border bg-muted text-muted-foreground",
};
const TEXTO_PRIORIDAD: Record<string, string> = { alta: "Alta", media: "Media", baja: "Baja" };

const capitalizar = (s: string) => {
  const t = (s || "").replace(/_/g, " ").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
};

const Titulo = ({ icono, children }: { icono: ReactNode; children: ReactNode }) => (
  <h3 className="flex items-center gap-2 font-semibold">
    {icono}
    {children}
  </h3>
);

type Props = { ats: AtsData; profile: Profile | null; pie?: ReactNode };

const AtsReport = ({ ats, profile, pie }: Props) => {
  const score = Math.max(0, Math.min(100, Math.round(Number(ats.score) || 0)));
  const nivel = nivelAts(score);
  const fortalezas = ats.fortalezas || [];
  const problemas = ats.problemas || [];
  const sugerencias = ats.sugerencias || [];
  const detectadas = (ats.secciones && ats.secciones.detectadas) || [];
  const faltantes = (ats.secciones && ats.secciones.faltantes) || [];
  const perfil = profile
    ? [(profile.titulos_objetivo || []).join(", "), capitalizar(profile.seniority), profile.ubicacion]
        .filter(Boolean)
        .join(" · ")
    : "";

  return (
    <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-labelledby="ats-titulo">
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-navy">
        Paso 1 de 2: estructura
      </div>
      <h2 id="ats-titulo" className="mt-3 text-2xl font-bold tracking-tight">
        Cómo lee tu CV un sistema ATS
      </h2>

      <div className="mt-6 flex flex-col sm:flex-row items-center gap-5">
        <ScoreRing score={score} />
        <div className="min-w-0 text-center sm:text-left">
          <Badge variant="outline" className={cn("px-3 py-1 text-sm", CLASE_VEREDICTO[nivel])}>
            {textoVeredicto(ats.veredicto)}
          </Badge>
          {ats.resumen && <p className="mt-3 text-sm text-muted-foreground break-words">{ats.resumen}</p>}
        </div>
      </div>

      {perfil && (
        <p className="mt-5 flex items-start gap-2 text-sm">
          <Briefcase className="h-4 w-4 mt-0.5 shrink-0 text-brand-blue" aria-hidden="true" />
          <span className="break-words">
            <span className="font-medium">Perfil detectado:</span> {perfil}
          </span>
        </p>
      )}

      {fortalezas.length > 0 && (
        <div className="mt-6">
          <Titulo icono={<CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />}>Fortalezas</Titulo>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
            {fortalezas.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" aria-hidden="true" />
                <span className="break-words">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6">
        <Titulo icono={<AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />}>
          Problemas a corregir
        </Titulo>
        {problemas.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">No encontramos problemas importantes.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {problemas.map((p, i) => (
              <li key={i} className="flex items-start gap-2">
                <Badge variant="outline" className={cn("shrink-0", CLASE_PRIORIDAD[p.prioridad] || CLASE_PRIORIDAD.baja)}>
                  {TEXTO_PRIORIDAD[p.prioridad] || "Media"}
                </Badge>
                <span className="break-words">{p.texto}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <Titulo icono={<Lightbulb className="h-5 w-5 text-brand-navy" aria-hidden="true" />}>Sugerencias</Titulo>
        {sugerencias.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Sin sugerencias adicionales.</p>
        ) : (
          <ul className="mt-2 space-y-1.5 text-sm text-foreground/90">
            {sugerencias.map((s, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden="true" />
                <span className="break-words">{s}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {(detectadas.length > 0 || faltantes.length > 0) && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Secciones detectadas</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {detectadas.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-700"
                >
                  {s}
                </span>
              ))}
              {detectadas.length === 0 && <span className="text-xs text-muted-foreground">Ninguna</span>}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium">Secciones que faltan</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {faltantes.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs text-amber-700"
                >
                  {s}
                </span>
              ))}
              {faltantes.length === 0 && <span className="text-xs text-muted-foreground">Ninguna</span>}
            </div>
          </div>
        </div>
      )}

      {pie && <div className="mt-8 border-t border-border pt-6">{pie}</div>}
    </section>
  );
};

export default AtsReport;
