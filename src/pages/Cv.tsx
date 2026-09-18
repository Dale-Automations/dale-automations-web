import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, FileSearch, Loader2, RotateCcw, Sparkles } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCvJob, type Fase } from "@/hooks/use-cv-job";
import type { FeedbackStep } from "@/lib/cv-api";
import CvUpload from "@/components/cv/CvUpload";
import CvProgress from "@/components/cv/CvProgress";
import AtsReport from "@/components/cv/AtsReport";
import JobMatches from "@/components/cv/JobMatches";
import Paywall from "@/components/cv/Paywall";
import PaidActions from "@/components/cv/PaidActions";
import FeedbackWidget, { FeedbackFab } from "@/components/cv/FeedbackWidget";

const TITULO = "Analizá tu CV gratis | Dale Automations";
const DESCRIPCION =
  "Subí tu CV en PDF o Word: te decimos si está optimizado para sistemas ATS y buscamos en LinkedIn los puestos donde más chances tenés. Gratis y sin registro.";

const StatusPill = ({ fase, sinConexion, stepLabel }: { fase: Fase; sinConexion: boolean; stepLabel: string }) => {
  const base = "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium";
  if (sinConexion) {
    return (
      <span className={`${base} bg-amber-500/10 text-amber-600`}>
        <AlertTriangle className="h-4 w-4" /> Sin conexión, reintentando
      </span>
    );
  }
  if (fase === "subiendo") {
    return (
      <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
        <Loader2 className="h-4 w-4 animate-spin" /> Leyendo tu CV
      </span>
    );
  }
  if (fase === "procesando") {
    return (
      <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
        <Loader2 className="h-4 w-4 animate-spin" /> {stepLabel || "Analizando"}
      </span>
    );
  }
  if (fase === "resultados") {
    return (
      <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
        <Check className="h-4 w-4" /> Análisis listo
      </span>
    );
  }
  if (fase === "error") {
    return (
      <span className={`${base} bg-amber-500/10 text-amber-600`}>
        <AlertTriangle className="h-4 w-4" /> Hubo un problema
      </span>
    );
  }
  return (
    <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
      <Sparkles className="h-4 w-4" /> Gratis y sin registro
    </span>
  );
};

const Cv = () => {
  const {
    fase,
    jobId,
    job,
    startedAt,
    subiendo,
    errorSubida,
    limpiarErrorSubida,
    pago,
    pagando,
    sinConexion,
    feedbackEnviado,
    subir,
    pagar,
    verificarDeNuevo,
    buscarMas,
    rearmar,
    reset,
    mandarFeedback,
  } = useCvJob();

  useEffect(() => {
    const tituloAnterior = document.title;
    document.title = TITULO;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const descripcionAnterior = meta ? meta.getAttribute("content") : null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", DESCRIPCION);
    return () => {
      document.title = tituloAnterior;
      if (meta && descripcionAnterior !== null) meta.setAttribute("content", descripcionAnterior);
    };
  }, []);

  const ocupado = fase === "procesando" || fase === "subiendo";
  const feedbackDe = (step: FeedbackStep, titulo: string) => (
    <FeedbackWidget
      step={step}
      titulo={titulo}
      enviado={feedbackEnviado.includes(step)}
      onEnviar={(rating, areas, comment) => mandarFeedback(step, rating, areas, comment)}
    />
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra superior */}
      <header className="w-full border-b border-brand-blue/10 glass-strong sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link to="/" aria-label="Ir al inicio">
            <img
              src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png"
              alt="Dale Automations"
              className="h-9 md:h-11 w-auto"
            />
          </Link>
          <StatusPill fase={fase} sinConexion={sinConexion} stepLabel={job ? job.step_label : ""} />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden" aria-busy={ocupado}>
        <div className="absolute top-24 -right-24 w-72 h-72 bg-brand-blue/8 orb orb-1" />
        <div className="absolute bottom-24 -left-24 w-64 h-64 bg-brand-navy/5 orb orb-2" />

        <div className="container mx-auto px-4 pt-12 md:pt-16 pb-28 relative z-10 max-w-3xl">
          {fase === "inicio" || fase === "subiendo" ? (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-5">
                  <FileSearch className="h-4 w-4" />
                  Herramienta gratuita
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
                  Subí tu CV (en PDF o Word)
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Te decimos cómo lo lee un sistema ATS y buscamos en LinkedIn los puestos donde más chances tenés.
                  Gratis y en unos minutos.
                </p>
              </div>
              <CvUpload subiendo={subiendo} error={errorSubida} onSubir={subir} onLimpiarError={limpiarErrorSubida} />
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-5">
                  <FileSearch className="h-4 w-4" />
                  Herramienta gratuita
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-3 animated-gradient-text tracking-tight">
                  Análisis de tu CV
                </h1>
                <p className="text-muted-foreground">Estructura ATS y puestos de LinkedIn para tu perfil.</p>
              </div>

              <div className="space-y-6">
                {fase === "error" && job && (
                  <section className="glass gradient-border rounded-2xl p-6 md:p-8 text-center" role="alert">
                    <AlertTriangle className="h-10 w-10 text-amber-600 mx-auto" aria-hidden="true" />
                    <h2 className="mt-3 text-2xl font-bold tracking-tight">No pudimos completar el análisis</h2>
                    <p className="mt-2 text-muted-foreground break-words">
                      {job.error_message || "Ocurrió un error inesperado. Probá de nuevo más tarde."}
                    </p>
                    <Button type="button" className="mt-5 h-11 w-full sm:w-auto" onClick={reset}>
                      <RotateCcw /> Analizar otro CV
                    </Button>
                  </section>
                )}

                {job && job.ats && (
                  <AtsReport ats={job.ats} profile={job.profile} pie={feedbackDe("ats", "¿Te sirvió el análisis ATS?")} />
                )}

                {fase === "procesando" && (
                  <CvProgress compacto={Boolean(job && job.ats)} job={job} jobId={jobId || ""} startedAt={startedAt} />
                )}

                {fase === "resultados" && job && (
                  <>
                    <JobMatches
                      matches={job.matches}
                      freeLimit={job.free_limit}
                      paid={job.paid}
                      pie={feedbackDe("puestos", "¿Te sirvieron los puestos que encontramos?")}
                    />
                    {job.paid ? (
                      <PaidActions
                        job={job}
                        onRearmar={rearmar}
                        onBuscarMas={buscarMas}
                        pie={feedbackDe("pago", "¿Cómo fue la experiencia con la versión completa?")}
                      />
                    ) : (
                      <Paywall pago={pago} pagando={pagando} onPagar={pagar} onVerificar={verificarDeNuevo} />
                    )}
                    <div className="text-center pt-2">
                      <Button type="button" variant="ghost" className="h-10" onClick={reset}>
                        <RotateCcw /> Analizar otro CV
                      </Button>
                      <p className="text-xs text-muted-foreground mt-3">
                        Los resultados quedan guardados 30 días en este link.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <FeedbackFab
        enviado={feedbackEnviado.includes("general")}
        onEnviar={(rating, areas, comment) => mandarFeedback("general", rating, areas, comment)}
      />
    </div>
  );
};

export default Cv;
