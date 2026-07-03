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
  Rocket,
  CreditCard,
  LayoutGrid,
  Server,
  Loader2,
  Check,
  Cloud,
  ClipboardList,
  AlertTriangle,
} from "lucide-react";
import Footer from "@/components/Footer";

const API_GET = "https://n8n.daleautomations.com/webhook/patastay-data";
const API_SAVE = "https://n8n.daleautomations.com/webhook/patastay-save";
const POLL_MS = 20000;
const DEBOUNCE_MS = 1000;

type Pregunta = { id: string; label: string };
type Seccion = { id: string; titulo: string; icon: React.ReactNode; preguntas: Pregunta[] };

const SECCIONES: Seccion[] = [
  {
    id: "proyecto",
    titulo: "El proyecto y el momento",
    icon: <Rocket className="h-5 w-5" />,
    preguntas: [
      {
        id: "estado",
        label:
          "¿En qué estado está PataStay hoy? El MVP en Google Sheets, ¿sigue corriendo y captando cuidadores? ¿Cuántos cuidadores y cuántos tutores tenés cargados aproximadamente?",
      },
      {
        id: "deadline",
        label:
          "El lanzamiento operativo lo tenés previsto para agosto 2026. ¿Qué es lo que sí o sí tiene que estar listo para esa fecha? ¿Hay margen para que algunas cosas (por ejemplo reseñas o cancelaciones) entren un poco después del lanzamiento?",
      },
      {
        id: "volumen",
        label:
          "¿Qué volumen imaginás en los primeros meses? Por ejemplo reservas por mes y cuidadores activos. Nos sirve para dimensionar la infraestructura y los costos.",
      },
    ],
  },
  {
    id: "pagos",
    titulo: "Pagos con Mercado Pago",
    icon: <CreditCard className="h-5 w-5" />,
    preguntas: [
      {
        id: "mp_cuenta",
        label:
          "¿Ya tenés una cuenta de Mercado Pago de empresa para PataStay? ¿Y tenés contacto con algún ejecutivo comercial de Mercado Pago? Nos va a servir para el tema de la liberación de fondos.",
      },
      {
        id: "mp_modelo",
        label:
          "Sobre cobrar y liberar la plata, ¿qué preferís desde el negocio? Opción A: PataStay recibe el total y le paga al cuidador cuando el servicio se completa. Opción B: cada cuidador cobra directo su parte con su propia cuenta de Mercado Pago. Las dos funcionan y te las explicamos en detalle, pero queremos saber tu preferencia.",
      },
      {
        id: "mp_cuidadores",
        label:
          "¿Los cuidadores estarían dispuestos a crear y conectar su propia cuenta de Mercado Pago durante el alta? (Hace falta para el cobro directo, la opción B.)",
      },
      {
        id: "fiscal",
        label:
          "¿Tu contador ya definió quién factura al tutor y quién al cuidador con el esquema de comisión? Nos confirmaron que se puede con monotributo; necesitamos entender el circuito completo. ¿Podemos hacerle una consulta puntual si hace falta?",
      },
      {
        id: "comision",
        label:
          "La comisión de PataStay, ¿arranca en 10% y después sube a 18%, o ya lanzás con 18%?",
      },
    ],
  },
  {
    id: "alcance",
    titulo: "Alcance del sistema",
    icon: <LayoutGrid className="h-5 w-5" />,
    preguntas: [
      {
        id: "frontend",
        label:
          "¿Querés que hagamos todo (el backend más la app o web nueva), o preferís que hagamos el backend y la parte visual la manejás vos?",
      },
      {
        id: "chat",
        label:
          "El chat interno entre tutor y cuidador, ¿lo querés en esta etapa, o por ahora se mantiene el contacto por WhatsApp como hoy?",
      },
      {
        id: "verificacion",
        label:
          "La verificación de DNI y selfie, ¿te alcanza con seguir aprobándola a mano desde un panel de administración, o querés verificación automática desde el arranque?",
      },
      {
        id: "cancelacion",
        label:
          "¿Tenés definida la política de cancelación (con cuánta anticipación se puede cancelar y qué porcentaje se devuelve), o la cerramos juntos?",
      },
    ],
  },
  {
    id: "trabajo",
    titulo: "Cómo trabajamos, accesos y presupuesto",
    icon: <Server className="h-5 w-5" />,
    preguntas: [
      {
        id: "infra",
        label:
          "¿Preferís que todo corra en infraestructura nuestra (nos encargamos de servidores y base de datos) o en cuentas propias de PataStay?",
      },
      {
        id: "accesos",
        label:
          "Para migrar lo que ya tenés, más adelante vamos a necesitar acceso a la planilla de Google actual, a Cloudinary y al dominio. ¿Hay algún problema con eso?",
      },
      {
        id: "presupuesto",
        label:
          "¿Con qué presupuesto o modalidad pensás encarar el proyecto (por ejemplo bolsa de horas o precio cerrado por etapa)? Aunque sea un rango nos ayuda a ajustar la propuesta.",
      },
    ],
  },
];

type Estado = "cargando" | "ok" | "guardando" | "guardado" | "error";

const Patastay = () => {
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
              Relevamiento para la plataforma v2
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
              PataStay
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Para cotizar la plataforma con precisión, necesitamos entender bien cómo está PataStay
              hoy y qué necesitás. Cuanta más info nos des, mejor. Respondé lo que puedas; lo que no
              sepas o no aplique, dejalo en blanco.
            </p>
          </div>

          <div className="glass rounded-2xl p-4 md:p-5 mb-8 flex items-start gap-3">
            <Cloud className="h-5 w-5 text-brand-blue mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground text-left">
              Se guarda solo, a medida que escribís. Podés completarlo en distintos momentos: al abrir
              este link siempre ves lo último que quedó cargado, así arrancás y seguís cuando quieras.
            </p>
          </div>

          {!loaded ? (
            <div className="glass gradient-border rounded-2xl p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-blue mx-auto" />
              <p className="text-muted-foreground mt-4">Cargando lo que ya respondiste</p>
            </div>
          ) : (
            <>
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
                          placeholder="Escribí acá"
                          rows={3}
                          className="bg-muted/30 rounded-xl resize-y"
                        />
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="glass gradient-border rounded-2xl p-6 md:p-8 mt-4 space-y-3">
              <Label htmlFor="comentarios" className="text-base font-semibold text-foreground">
                Comentarios adicionales
              </Label>
              <p className="text-sm text-muted-foreground">
                Cualquier cosa que se te ocurra y nos ayude a entender mejor PataStay o el contexto:
                dolores de cabeza actuales, algo que no preguntamos, prioridades, lo que sea.
              </p>
              <Textarea
                id="comentarios"
                value={answers["comentarios"] || ""}
                onChange={(e) => onChange("comentarios", e.target.value)}
                onFocus={() => (focusedId.current = "comentarios")}
                onBlur={() => {
                  focusedId.current = null;
                  if (Object.keys(dirty.current).length > 0) guardar();
                }}
                placeholder="Escribí acá lo que quieras sumar"
                rows={5}
                className="bg-muted/30 rounded-xl resize-y"
              />
            </div>
            </>
          )}

          <div className="text-center mt-8">
            <StatusPill />
            <p className="text-xs text-muted-foreground mt-3">
              No hace falta enviar nada: todo lo que escribís queda guardado automáticamente.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Patastay;
