import { AlertTriangle, Clock, CreditCard, Loader2, RefreshCw, Search, Sparkles, WandSparkles } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { PRECIO_TEXTO } from "@/lib/cv-api";
import type { PagoEstado } from "@/hooks/use-cv-job";

const BENEFICIOS = [
  {
    Icono: WandSparkles,
    titulo: "Rearmá mi CV optimizado para ATS (PDF)",
    detalle: "Reescribimos tu CV con la estructura y las palabras clave que los sistemas ATS esperan, listo para descargar.",
  },
  {
    Icono: Search,
    titulo: "Buscar hasta 50 puestos más",
    detalle: "Ampliamos la búsqueda en LinkedIn con hasta 50 coincidencias adicionales para tu perfil.",
  },
];

type Props = { pago: PagoEstado; pagando: boolean; onPagar: () => void; onVerificar: () => void };

const Paywall = ({ pago, pagando, onPagar, onVerificar }: Props) => (
  <section className="glass gradient-border rounded-2xl p-6 md:p-8" aria-labelledby="paywall-titulo">
    <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-brand-navy">
      <Sparkles className="h-4 w-4" aria-hidden="true" />
      Versión completa
    </div>
    <h2 id="paywall-titulo" className="mt-3 text-2xl font-bold tracking-tight">
      Llevá tu búsqueda al siguiente nivel
    </h2>
    <p className="mt-2 flex flex-wrap items-baseline gap-x-2">
      <span className="text-3xl font-bold text-brand-navy">{PRECIO_TEXTO}</span>
      <span className="text-sm text-muted-foreground">pago único, en pesos, con MercadoPago</span>
    </p>

    <ul className="mt-5 space-y-3">
      {BENEFICIOS.map((b) => {
        const Icono = b.Icono;
        return (
          <li key={b.titulo} className="flex gap-3 rounded-xl border border-border bg-background/60 p-4">
            <Icono className="h-5 w-5 mt-0.5 shrink-0 text-brand-blue" aria-hidden="true" />
            <div className="min-w-0">
              <p className="font-medium">{b.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.detalle}</p>
            </div>
          </li>
        );
      })}
    </ul>

    {pago === "verificando" ? (
      <p role="status" aria-live="polite" className="mt-5 flex items-center gap-2 text-sm font-medium">
        <Loader2 className="h-5 w-5 animate-spin text-brand-blue shrink-0" aria-hidden="true" />
        Verificando tu pago con MercadoPago
      </p>
    ) : pago === "pendiente" ? (
      <div className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
        <p role="status" aria-live="polite" className="flex items-start gap-2 text-sm text-amber-800">
          <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
          <span>
            Estamos confirmando tu pago con MercadoPago. Puede tardar unos minutos; no hace falta que vuelvas a
            pagar.
          </span>
        </p>
        <Button type="button" variant="outline" className="mt-3 h-10 w-full sm:w-auto" onClick={onVerificar}>
          <RefreshCw /> Ya pagué, verificar de nuevo
        </Button>
      </div>
    ) : (
      <>
        {pago === "rechazado" && (
          <Alert variant="destructive" className="mt-5">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>MercadoPago no aprobó el pago. Podés intentarlo de nuevo con otro medio.</AlertDescription>
          </Alert>
        )}
        <div className="mt-5">
          <Button
            type="button"
            className="h-11 w-full sm:w-auto"
            onClick={onPagar}
            disabled={pagando}
            aria-busy={pagando}
          >
            {pagando ? (
              <>
                <Loader2 className="animate-spin" /> Creando el pago
              </>
            ) : (
              <>
                <CreditCard /> Pagar con MercadoPago
              </>
            )}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Te redirigimos a MercadoPago para pagar de forma segura. Al volver, vas a ver las opciones desbloqueadas en
          esta misma página. Guardá este link por si cerrás la pestaña.
        </p>
      </>
    )}
  </section>
);

export default Paywall;
