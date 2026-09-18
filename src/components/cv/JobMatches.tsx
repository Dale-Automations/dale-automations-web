import { useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, Building2, Clock, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { nivelAts, type JobMatch, type NivelAts } from "@/lib/cv-api";
import { FILTROS, conDias, contarPorFiltro, filtrarYOrdenar, textoHace, type FiltroDias } from "@/lib/cv-dates";

const CLASE_AFINIDAD: Record<NivelAts, string> = {
  alto: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700",
  medio: "border-brand-blue/60 bg-brand-blue/20 text-brand-navy",
  regular: "border-amber-500/40 bg-amber-500/10 text-amber-700",
  bajo: "border-border bg-muted text-muted-foreground",
};

const TarjetaPuesto = ({ m }: { m: JobMatch }) => {
  const score = Math.max(0, Math.min(100, Math.round(Number(m.score) || 0)));
  return (
    <article className="rounded-xl border border-border bg-background/60 p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="min-w-0 flex-1 text-base font-semibold break-words">{m.title}</h3>
        <div className="flex shrink-0 items-center gap-2">
          {m.tier === "paid" && <Badge variant="secondary">Adicional</Badge>}
          <Badge variant="outline" className={cn(CLASE_AFINIDAD[nivelAts(score)])}>
            {score}% de afinidad
          </Badge>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {m.company && (
          <span className="inline-flex items-center gap-1.5 break-words">
            <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            {m.company}
          </span>
        )}
        {m.location && (
          <span className="inline-flex items-center gap-1.5 break-words">
            <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            {m.location}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          {textoHace(m.days_ago)}
        </span>
      </div>

      {m.motivo && <p className="mt-3 text-sm break-words">{m.motivo}</p>}
      {m.alerta && (
        <p className="mt-2 flex items-start gap-1.5 text-sm text-amber-700 break-words">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
          <span>{m.alerta}</span>
        </p>
      )}

      <div className="mt-4">
        <Button asChild variant="outline" className="h-10 w-full sm:w-auto">
          <a href={m.job_url} target="_blank" rel="noopener noreferrer">
            Ver aviso y postularme <ExternalLink />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </a>
        </Button>
      </div>
    </article>
  );
};

type Props = { matches: JobMatch[]; freeLimit: number; paid: boolean; pie?: ReactNode };

const JobMatches = ({ matches, freeLimit, paid, pie }: Props) => {
  const [filtro, setFiltro] = useState<FiltroDias>(0);
  const lista = useMemo(() => conDias(matches || []), [matches]);
  const conteos = useMemo(() => contarPorFiltro(lista), [lista]);
  const visibles = useMemo(() => filtrarYOrdenar(lista, filtro), [lista, filtro]);

  const hayAdicionales = paid || lista.some((m) => m.tier === "paid");
  const total = lista.length;
  const subtitulo =
    total === 1
      ? "Mostramos 1 coincidencia para tu perfil."
      : hayAdicionales || total < freeLimit
        ? `Mostramos ${total} coincidencias, ordenadas por afinidad con tu perfil.`
        : `Mostramos tus ${freeLimit} mejores coincidencias, ordenadas por afinidad con tu perfil.`;

  return (
    <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-labelledby="puestos-titulo">
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-navy">
        Paso 2 de 2: puestos
      </div>
      <h2 id="puestos-titulo" className="mt-3 text-2xl font-bold tracking-tight">
        Puestos de LinkedIn donde tenés más chances
      </h2>

      {total === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No encontramos puestos publicados que coincidan con tu perfil en estos días. Probá de nuevo en unos días o
          ajustá el título de tu CV.
        </p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">{subtitulo}</p>

          <div role="group" aria-label="Filtrar por fecha de publicación" className="mt-5 flex flex-wrap gap-2">
            {FILTROS.map((f) => (
              <button
                key={f.dias}
                type="button"
                aria-pressed={filtro === f.dias}
                onClick={() => setFiltro(f.dias)}
                className={cn(
                  "h-10 rounded-full border px-4 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  filtro === f.dias
                    ? "border-brand-navy bg-brand-navy text-primary-foreground"
                    : "border-input bg-background hover:bg-muted",
                )}
              >
                {f.label} ({conteos[f.dias]})
              </button>
            ))}
          </div>

          {visibles.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">No hay puestos publicados en ese rango. Probá con otro filtro.</p>
          ) : (
            <ul className="mt-5 space-y-4">
              {visibles.map((m) => (
                <li key={m.job_id || m.job_url}>
                  <TarjetaPuesto m={m} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {pie && <div className="mt-8 border-t border-border pt-6">{pie}</div>}
    </section>
  );
};

export default JobMatches;
