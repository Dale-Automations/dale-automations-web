import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Activity,
  BarChart3,
  Users,
  Server,
  RefreshCw,
  ShieldCheck,
  Rocket,
  Loader2,
  Check,
  Cloud,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import Footer from "@/components/Footer";

const API_GET = "https://n8n.daleautomations.com/webhook/cobros-uom-data";
const API_SAVE = "https://n8n.daleautomations.com/webhook/cobros-uom-save";
const POLL_MS = 20000;
const DEBOUNCE_MS = 1000;

type Pregunta = { id: string; label: string };
type Seccion = { id: string; titulo: string; icon: React.ReactNode; preguntas: Pregunta[] };

const SECCIONES: Seccion[] = [
  {
    id: "estado",
    titulo: "Estado y producción",
    icon: <Activity className="h-5 w-5" />,
    preguntas: [
      {
        id: "estado_produccion",
        label:
          "¿El sistema está en producción hoy corriendo para la UOM, o todavía es piloto o está por salir? ¿Desde cuándo?",
      },
      {
        id: "plantillas_whatsapp",
        label:
          "Las plantillas de WhatsApp de la campaña, ¿ya están aprobadas por Meta/Twilio y cargadas, o eso está pendiente?",
      },
      {
        id: "cron_campana",
        label:
          "La campaña de cobranza automática (los mensajes escalonados por WhatsApp y email), ¿ya corre con un cron configurado? ¿Dónde?",
      },
      {
        id: "pendientes",
        label:
          "¿Hay algo hoy roto, a medias o pendiente que sepan? Por ejemplo, la validación de pagos por Trello, ¿quedó activa o fue una prueba?",
      },
    ],
  },
  {
    id: "volumen",
    titulo: "Volumen y operación",
    icon: <BarChart3 className="h-5 w-5" />,
    preguntas: [
      {
        id: "afiliados",
        label:
          "¿Cuántas empresas afiliadas maneja el sistema hoy y cuántas esperan a futuro? ¿Cuántos F931 y pagos por mes en promedio?",
      },
      {
        id: "cantidad_usuarios",
        label:
          "¿Cuántas personas operan el sistema del lado UOM y cuántos usuarios de tipo empresa tienen acceso?",
      },
      {
        id: "picos",
        label:
          "¿Qué fechas del mes son las más críticas? Suponemos el vencimiento del aporte y el cierre del F931, pero confírmennos.",
      },
    ],
  },
  {
    id: "soporte",
    titulo: "Soporte a usuarios",
    icon: <Users className="h-5 w-5" />,
    preguntas: [
      {
        id: "soporte_primera_linea",
        label:
          "Cuando a un usuario le falla algo, ¿quién lo atiende hoy? ¿Hay una primera línea del lado de ustedes, o escriben directo a quien desarrolla?",
      },
      {
        id: "soporte_modelo",
        label:
          "¿Prefieren que nosotros seamos la mesa de ayuda directa, o filtrar ustedes y escalarnos solo lo técnico?",
      },
      {
        id: "soporte_volumen",
        label:
          "¿Por qué canal llegan los pedidos de ayuda (mail, WhatsApp, teléfono) y cuántos por mes estiman?",
      },
      {
        id: "sla",
        label:
          "¿Hay un tiempo de respuesta esperado? ¿Necesitan guardia fuera de horario para caídas del cobro, o alcanza con horario hábil?",
      },
    ],
  },
  {
    id: "infra",
    titulo: "Infraestructura, accesos y costos",
    icon: <Server className="h-5 w-5" />,
    preguntas: [
      {
        id: "infra_donde",
        label:
          "¿Dónde corre todo (Vercel y Supabase confirmados)? ¿Las cuentas son de ustedes o de la UOM? ¿Nos dan acceso admin para operar y desplegar?",
      },
      {
        id: "credenciales",
        label:
          "¿Nos van a dar las credenciales para mantener (OpenAI, Twilio/Meta, email, Supabase, Vercel)? ¿Cómo las comparten de forma segura?",
      },
      {
        id: "costos_servicios",
        label:
          "Los costos de los servicios (OpenAI, WhatsApp, email, Supabase, Vercel), ¿los paga el cliente? ¿Quién administra esas cuentas y sus límites?",
      },
      {
        id: "staging",
        label: "¿Hay un entorno de staging o pruebas separado del de producción, o solo producción?",
      },
    ],
  },
  {
    id: "traspaso",
    titulo: "Traspaso y monitoreo",
    icon: <RefreshCw className="h-5 w-5" />,
    preguntas: [
      {
        id: "traspaso_inicial",
        label:
          "¿Pueden hacernos un traspaso o recorrida del sistema al inicio (una o dos sesiones con Juanchi)? ¿Cuánto pueden acompañar las primeras semanas?",
      },
      {
        id: "monitoreo_hoy",
        label:
          "Hoy, ¿cómo se enteran si una campaña no salió o si un cobro falló? ¿Les molesta si armamos un monitoreo mínimo con alertas?",
      },
      {
        id: "documentacion",
        label:
          "¿Hay documentación operativa además del README? Por ejemplo, cómo reejecutar una campaña o corregir un F931 mal leído por la IA.",
      },
    ],
  },
  {
    id: "datos",
    titulo: "Datos y cumplimiento",
    icon: <ShieldCheck className="h-5 w-5" />,
    preguntas: [
      {
        id: "compliance",
        label:
          "El sistema guarda datos personales de afiliados y datos financieros. ¿Hay algún requisito de cumplimiento, retención o auditoría a respetar?",
      },
      {
        id: "backups",
        label: "¿Cómo están los backups de la base de datos? ¿Quién los hace y cada cuánto?",
      },
    ],
  },
  {
    id: "futuro",
    titulo: "Futuro y modalidad",
    icon: <Rocket className="h-5 w-5" />,
    preguntas: [
      {
        id: "evolutivo",
        label: "¿Qué mejoras o features nuevas imaginan en los próximos 6 a 12 meses?",
      },
      {
        id: "facturacion",
        label:
          "¿Prefieren un fee fijo mensual, o un esquema de horas con bolsa y excedente?",
      },
    ],
  },
];

type Estado = "cargando" | "ok" | "guardando" | "guardado" | "error";

const Cobros = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);
  const [estado, setEstado] = useState<Estado>("cargando");
  const [ultima, setUltima] = useState<string | null>(null);

  const dirty = useRef<Record<string, string>>({});
  const focusedId = useRef<string | null>(null);
  const saveTimer = useRef<number | null>(null);
  const saving = useRef(false);

  const marcarUltima = () => {
    const ahora = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setUltima(ahora);
  };

  const traer = async (esInicial: boolean) => {
    try {
      const res = await fetch(API_GET, { cache: "no-store" });
      if (!res.ok) throw new Error("bad status");
      const json = await res.json();
      const data = (json && json.data) || {};
      setAnswers((prev) => {
        const next = { ...prev };
        Object.keys(data).forEach((k) => {
          if (esInicial) {
            next[k] = data[k];
          } else if (k !== focusedId.current && !(k in dirty.current)) {
            next[k] = data[k];
          }
        });
        return next;
      });
      if (esInicial) {
        setLoaded(true);
        setEstado("ok");
      }
      marcarUltima();
    } catch (e) {
      if (esInicial) {
        setLoaded(true);
        setEstado("error");
      }
    }
  };

  const guardar = async () => {
    if (saving.current) return;
    const pend = dirty.current;
    const keys = Object.keys(pend);
    if (keys.length === 0) return;

    dirty.current = {};
    saving.current = true;
    setEstado("guardando");
    const updates: Record<string, string> = {};
    keys.forEach((k) => (updates[k] = pend[k]));

    try {
      const res = await fetch(API_SAVE, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("bad status");
      setEstado("guardado");
      marcarUltima();
    } catch (e) {
      // Reintentar: devolver los cambios a la cola
      keys.forEach((k) => {
        if (!(k in dirty.current)) dirty.current[k] = updates[k];
      });
      setEstado("error");
    } finally {
      saving.current = false;
      if (Object.keys(dirty.current).length > 0) {
        programarGuardado();
      }
    }
  };

  const programarGuardado = () => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(guardar, DEBOUNCE_MS);
  };

  const onChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    dirty.current[id] = value;
    programarGuardado();
  };

  useEffect(() => {
    traer(true);
    const poll = window.setInterval(() => traer(false), POLL_MS);
    const flush = () => {
      if (Object.keys(dirty.current).length > 0) guardar();
    };
    window.addEventListener("beforeunload", flush);
    return () => {
      window.clearInterval(poll);
      window.removeEventListener("beforeunload", flush);
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StatusPill = () => {
    const base =
      "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium";
    if (estado === "guardando")
      return (
        <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
          <Loader2 className="h-4 w-4 animate-spin" /> Guardando
        </span>
      );
    if (estado === "error")
      return (
        <span className={`${base} bg-amber-500/10 text-amber-600`}>
          <AlertTriangle className="h-4 w-4" /> Sin conexión, reintentando
        </span>
      );
    if (estado === "cargando")
      return (
        <span className={`${base} bg-muted text-muted-foreground`}>
          <Loader2 className="h-4 w-4 animate-spin" /> Cargando
        </span>
      );
    return (
      <span className={`${base} bg-brand-blue/10 text-brand-navy`}>
        <Check className="h-4 w-4" /> Guardado{ultima ? ` · ${ultima}` : ""}
      </span>
    );
  };

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
          <StatusPill />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-24 -right-24 w-72 h-72 bg-brand-blue/8 orb orb-1" />
        <div className="absolute bottom-24 -left-24 w-64 h-64 bg-brand-navy/5 orb orb-2" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 max-w-3xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-5">
              <ClipboardList className="h-4 w-4" />
              Relevamiento para el mantenimiento
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
              Sistema de Cobros UOM
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Para cotizar el mantenimiento con precisión, necesitamos entender bien cómo está el
              sistema hoy. Cuanta más info nos den, mejor. Respondan lo que puedan; lo que no sepan
              o no aplique, déjenlo en blanco.
            </p>
          </div>

          <div className="glass rounded-2xl p-4 md:p-5 mb-8 flex items-start gap-3">
            <Cloud className="h-5 w-5 text-brand-blue mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              Se guarda solo, a medida que escriben. Pueden completarlo entre varios y en distintos
              momentos: al abrir este link siempre ven lo último cargado, así uno empieza y otro
              continúa.
            </p>
          </div>

          {!loaded ? (
            <div className="glass gradient-border rounded-2xl p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto" />
              <p className="text-muted-foreground mt-4">Cargando lo que ya respondieron</p>
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={SECCIONES.map((s) => s.id)}
              className="space-y-4"
            >
              {SECCIONES.map((seccion) => (
                <AccordionItem
                  key={seccion.id}
                  value={seccion.id}
                  className="glass gradient-border rounded-2xl px-6 border-none"
                >
                  <AccordionTrigger className="hover:no-underline py-5">
                    <span className="flex items-center gap-3 text-left">
                      <span className="text-brand-blue">{seccion.icon}</span>
                      <span className="text-lg font-semibold">{seccion.titulo}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 space-y-5">
                    {seccion.preguntas.map((p) => (
                      <div key={p.id} className="space-y-2">
                        <Label
                          htmlFor={p.id}
                          className="text-sm font-normal leading-relaxed text-foreground/90"
                        >
                          {p.label}
                        </Label>
                        <Textarea
                          id={p.id}
                          value={answers[p.id] || ""}
                          onChange={(e) => onChange(p.id, e.target.value)}
                          onFocus={() => (focusedId.current = p.id)}
                          onBlur={() => {
                            focusedId.current = null;
                            if (Object.keys(dirty.current).length > 0) guardar();
                          }}
                          placeholder="Escriban acá"
                          rows={3}
                          className="bg-muted/30 rounded-xl resize-y"
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}

          <div className="text-center mt-8">
            <StatusPill />
            <p className="text-xs text-muted-foreground mt-3">
              No hace falta enviar nada: todo lo que escriben queda guardado automáticamente.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cobros;
