import { useEffect, useState } from "react";
import { Check, Circle, Clock, Copy, FileText, ListChecks, Loader2, Search, Target } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { CvJob, JobStatus } from "@/lib/cv-api";

type Paso = { id: string; label: string; Icono: typeof FileText; estados: JobStatus[] };

const PASOS: Paso[] = [
  { id: "leyendo", label: "Leyendo tu CV", Icono: FileText, estados: ["recibido", "extrayendo"] },
  { id: "ats", label: "Analizando estructura ATS", Icono: ListChecks, estados: ["analizando_ats"] },
  { id: "buscando", label: "Buscando puestos en LinkedIn", Icono: Search, estados: ["buscando_puestos"] },
  { id: "ordenando", label: "Ordenando las coincidencias", Icono: Target, estados: ["rankeando"] },
];

const indicePaso = (status: JobStatus | undefined): number => {
  if (!status) return 0;
  if (status === "listo") return PASOS.length;
  const i = PASOS.findIndex((p) => p.estados.includes(status));
  return i < 0 ? 0 : i;
};

const formatoMmSs = (seg: number) => `${Math.floor(seg / 60)}:${String(seg % 60).padStart(2, "0")}`;

type Props = { job: CvJob | null; jobId: string; startedAt: number | null; compacto?: boolean };

const CvProgress = ({ job, jobId, startedAt, compacto = false }: Props) => {
  const [ahora, setAhora] = useState(() => Date.now());

  useEffect(() => {
    const t = window.setInterval(() => setAhora(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);

  const inicio = startedAt !== null ? startedAt : job && job.created_at ? Date.parse(job.created_at) : NaN;
  const transcurrido = Number.isFinite(inicio) ? Math.max(0, Math.floor((ahora - inicio) / 1000)) : null;
  const link = `${window.location.origin}/cv?id=${encodeURIComponent(jobId)}`;
  const etiqueta = (job && job.step_label) || "Analizando";
  const progreso = job ? Math.max(0, Math.min(100, Number(job.progress) || 0)) : 0;

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copiado");
    } catch {
      toast.error("No pudimos copiar el link. Copialo desde la barra de direcciones.");
    }
  };

  if (compacto) {
    return (
      <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-busy="true">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-brand-blue shrink-0" aria-hidden="true" />
          <p role="status" aria-live="polite" className="font-medium">
            {etiqueta}
          </p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Buscando puestos en LinkedIn y ordenándolos según tu perfil. Falta poco.
        </p>
        <Progress value={progreso} className="mt-4 h-2" aria-label="Progreso del análisis" />
        <div className="mt-5 space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const actual = indicePaso(job ? job.status : undefined);

  return (
    <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-busy="true">
      <h2 className="text-2xl font-bold tracking-tight">Estamos analizando tu CV</h2>

      <ol aria-label="Progreso del análisis" className="mt-6 space-y-3">
        {PASOS.map((paso, i) => {
          const hecho = i < actual;
          const enCurso = i === actual;
          const Icono = paso.Icono;
          return (
            <li
              key={paso.id}
              aria-current={enCurso ? "step" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3",
                enCurso
                  ? "border-brand-blue/50 bg-brand-blue/10"
                  : hecho
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-muted/20 text-muted-foreground",
              )}
            >
              <span className="shrink-0" aria-hidden="true">
                {hecho ? (
                  <Check className="h-5 w-5 text-emerald-600" />
                ) : enCurso ? (
                  <Loader2 className="h-5 w-5 animate-spin text-brand-navy" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/60" />
                )}
              </span>
              <Icono className="h-5 w-5 shrink-0 text-brand-blue" aria-hidden="true" />
              <span className={cn("text-sm", enCurso && "font-semibold")}>{paso.label}</span>
              {hecho && <span className="sr-only">(completado)</span>}
            </li>
          );
        })}
      </ol>

      <Progress value={progreso} className="mt-6 h-2" aria-label="Progreso del análisis" />
      <p role="status" aria-live="polite" className="mt-2 text-sm font-medium text-foreground">
        {etiqueta}
      </p>

      <p className="mt-4 text-sm text-muted-foreground">
        Esto puede tardar entre 2 y 5 minutos. Podés dejar esta pestaña abierta o volver más tarde con este mismo
        link: los resultados quedan guardados.
      </p>

      {transcurrido !== null && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>Transcurrido: {formatoMmSs(transcurrido)}</span>
        </p>
      )}

      <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
        <p className="text-sm font-medium">Tu link para volver:</p>
        <div className="mt-2 flex flex-col sm:flex-row gap-2">
          <input
            readOnly
            value={link}
            aria-label="Link para volver a este análisis"
            onFocus={(e) => e.currentTarget.select()}
            className="h-10 flex-1 min-w-0 rounded-md border border-input bg-background px-3 text-sm text-foreground"
          />
          <Button type="button" variant="outline" className="h-10 w-full sm:w-auto" onClick={copiarLink}>
            <Copy /> Copiar link
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CvProgress;
