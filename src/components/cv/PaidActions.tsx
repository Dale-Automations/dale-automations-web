import type { ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Download, Loader2, RefreshCw, Search, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { urlDeDescarga, type CvJob } from "@/lib/cv-api";

type Props = { job: CvJob; onRearmar: () => void; onBuscarMas: () => void; pie?: ReactNode };

const PaidActions = ({ job, onRearmar, onBuscarMas, pie }: Props) => {
  const cupo = Math.max(0, Number(job.paid_quota) || 0);
  const usados = Math.max(0, Number(job.paid_used) || 0);
  const restantes = Math.max(0, cupo - usados);
  const busquedaHecha = job.more_status === "listo";
  const descarga = job.download_url || urlDeDescarga(job.job_id);

  const textoCupo = busquedaHecha
    ? usados > 0
      ? `La búsqueda adicional ya se hizo: encontramos ${usados} puestos más.`
      : "La búsqueda adicional ya se hizo y no encontramos más puestos para tu perfil."
    : restantes > 0
      ? `Te quedan ${restantes} puestos adicionales de ${cupo}.`
      : `Ya usaste los ${cupo} puestos adicionales.`;
  const sinCupo = busquedaHecha || restantes <= 0;

  return (
    <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-labelledby="pagado-titulo">
      <h2 id="pagado-titulo" className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        <BadgeCheck className="h-6 w-6 shrink-0 text-emerald-600" aria-hidden="true" />
        Pago confirmado: opciones desbloqueadas
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="flex flex-col rounded-xl border border-border bg-background/60 p-5">
          <h3 className="font-semibold">Rearmar mi CV optimizado para ATS</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reescribimos tu CV con la estructura y las palabras clave que los sistemas ATS esperan, listo para
            descargar.
          </p>
          <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
            {job.rebuild_status === "generando" ? (
              <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="h-5 w-5 animate-spin text-brand-blue shrink-0" aria-hidden="true" />
                Generando tu CV optimizado, puede tardar un minuto
              </p>
            ) : job.rebuild_status === "listo" ? (
              <Button asChild className="h-11 w-full sm:w-auto">
                <a href={descarga} target="_blank" rel="noopener noreferrer">
                  <Download /> Descargar CV optimizado (PDF)
                </a>
              </Button>
            ) : (
              <>
                {job.rebuild_status === "error" && (
                  <p className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>No pudimos generar el CV. Probá de nuevo en un rato.</span>
                  </p>
                )}
                <Button type="button" className="h-11 w-full sm:w-auto" onClick={onRearmar}>
                  {job.rebuild_status === "error" ? (
                    <>
                      <RefreshCw /> Reintentar
                    </>
                  ) : (
                    <>
                      <WandSparkles /> Rearmar CV
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </article>

        <article className="flex flex-col rounded-xl border border-border bg-background/60 p-5">
          <h3 className="font-semibold">Buscar hasta 50 puestos más</h3>
          <p className="mt-1 text-sm text-muted-foreground">{textoCupo}</p>
          <div className="mt-4 flex flex-1 flex-col justify-end gap-3">
            {job.more_status === "buscando" ? (
              <p role="status" aria-live="polite" className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="h-5 w-5 animate-spin text-brand-blue shrink-0" aria-hidden="true" />
                Buscando puestos adicionales en LinkedIn
              </p>
            ) : (
              <>
                {job.more_status === "error" && (
                  <p className="flex items-start gap-2 text-sm text-destructive">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>No pudimos buscar más puestos. Probá de nuevo en un rato.</span>
                  </p>
                )}
                <Button type="button" className="h-11 w-full sm:w-auto" onClick={onBuscarMas} disabled={sinCupo}>
                  {job.more_status === "error" ? (
                    <>
                      <RefreshCw /> Reintentar
                    </>
                  ) : (
                    <>
                      <Search /> Buscar más puestos
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </article>
      </div>

      {pie && <div className="mt-8 border-t border-border pt-6">{pie}</div>}
    </section>
  );
};

export default PaidActions;
