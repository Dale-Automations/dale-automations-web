import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";
import {
  Activity,
  BarChart3,
  Users,
  Server,
  RefreshCw,
  ShieldCheck,
  Rocket,
  Send,
  Loader2,
  CheckCircle2,
  ClipboardList,
} from "lucide-react";
import Footer from "@/components/Footer";

const WEBHOOK_URL = "https://n8n.daleautomations.com/webhook/cobros-uom";

type Pregunta = { id: string; label: string; placeholder?: string };
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
        label:
          "¿Qué mejoras o features nuevas imaginan en los próximos 6 a 12 meses? Esto lo cotizamos aparte del mantenimiento, pero nos sirve para dimensionar.",
      },
      {
        id: "facturacion",
        label:
          "¿Quién factura y a quién en este acuerdo? ¿Prefieren un fee fijo mensual, o un esquema de horas con bolsa y excedente?",
      },
    ],
  },
];

const Cobros = () => {
  const [nombre, setNombre] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setAnswer = (id: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) {
      toast.error("Por favor completá tu nombre y tu email para poder responderte.");
      return;
    }

    const respuestas = SECCIONES.flatMap((s) =>
      s.preguntas.map((p) => ({
        id: p.id,
        pregunta: p.label,
        respuesta: (answers[p.id] || "").trim(),
      }))
    );

    const payload = {
      nombre: nombre.trim(),
      empresa: empresa.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
      respuestas,
    };

    setSubmitting(true);
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("bad status");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast.error(
        "No pudimos enviar el formulario. Probá de nuevo, o escribinos por WhatsApp al +54 9 11 3662 6658."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barra superior simple */}
      <header className="w-full border-b border-brand-blue/10 glass-strong">
        <div className="container mx-auto px-4 py-3">
          <Link to="/" aria-label="Ir al inicio">
            <img
              src="/lovable-uploads/926ffbee-3111-4061-8a88-9f82f6821269.png"
              alt="Dale Automations"
              className="h-9 md:h-11 w-auto"
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute top-24 -right-24 w-72 h-72 bg-brand-blue/8 orb orb-1" />
        <div className="absolute bottom-24 -left-24 w-64 h-64 bg-brand-navy/5 orb orb-2" />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10 max-w-3xl">
          {submitted ? (
            <div className="glass gradient-border rounded-2xl p-8 md:p-12 text-center space-y-5">
              <CheckCircle2 className="h-14 w-14 text-brand-blue mx-auto" />
              <h1 className="text-3xl md:text-4xl font-bold animated-gradient-text tracking-tight">
                Recibimos tus respuestas
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Gracias, {nombre.split(" ")[0] || "gracias"}. Con esto armamos la cotización del
                mantenimiento y te la acercamos. Si nos quedó alguna duda, te escribimos.
              </p>
              <Link to="/">
                <Button className="animated-gradient text-primary-foreground rounded-xl mt-2">
                  Volver al inicio
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-wider text-muted-foreground mb-5">
                  <ClipboardList className="h-4 w-4" />
                  Relevamiento para el mantenimiento
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animated-gradient-text tracking-tight">
                  Sistema de Cobros UOM
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Para cotizar el mantenimiento con precisión, necesitamos entender bien cómo está
                  el sistema hoy. Respondé lo que puedas; lo que no sepas o no aplique, dejalo en
                  blanco. No hace falta completarlo todo de una.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Datos de contacto */}
                <div className="glass gradient-border rounded-2xl p-6 md:p-8 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Tus datos</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="nombre">Nombre y apellido *</Label>
                      <Input
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="bg-muted/30 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="empresa">Empresa u organización</Label>
                      <Input
                        id="empresa"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="bg-muted/30 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-muted/30 rounded-xl"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">Teléfono o WhatsApp</Label>
                      <Input
                        id="telefono"
                        type="tel"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="bg-muted/30 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Secciones de preguntas */}
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
                            <Label htmlFor={p.id} className="text-sm font-normal leading-relaxed text-foreground/90">
                              {p.label}
                            </Label>
                            <Textarea
                              id={p.id}
                              value={answers[p.id] || ""}
                              onChange={(e) => setAnswer(p.id, e.target.value)}
                              placeholder="Tu respuesta"
                              rows={3}
                              className="bg-muted/30 rounded-xl resize-y"
                            />
                          </div>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="glass gradient-border rounded-2xl p-6 md:p-8 space-y-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Al enviar, nos llegan tus respuestas y te preparamos la cotización. Los campos
                    con * son los únicos obligatorios.
                  </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="w-full md:w-auto animated-gradient text-primary-foreground hover:shadow-glow transition-all duration-500 text-lg py-6 px-10 group rounded-xl"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Enviando
                      </>
                    ) : (
                      <>
                        Enviar respuestas
                        <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cobros;
