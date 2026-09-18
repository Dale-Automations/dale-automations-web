import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Loader2, MessageSquare, Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { FeedbackStep } from "@/lib/cv-api";

const AREAS = ["Análisis ATS", "Búsqueda de puestos", "Velocidad", "Diseño", "Pago", "Otro"];
const ESTRELLAS = [1, 2, 3, 4, 5];

export type EnviarFeedback = (rating: number, areas: string[], comment: string) => Promise<boolean>;

type Props = {
  step: FeedbackStep;
  titulo?: string;
  enviado: boolean;
  onEnviar: EnviarFeedback;
  permitirOtra?: boolean;
  className?: string;
};

const FeedbackWidget = ({ step, titulo, enviado, onEnviar, permitirOtra = false, className }: Props) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [areas, setAreas] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [errorValidacion, setErrorValidacion] = useState<string | null>(null);
  const [listoLocal, setListoLocal] = useState(false);
  const [otra, setOtra] = useState(false);

  const mostrarGracias = (enviado || listoLocal) && !otra;

  const toggleArea = (area: string, activa: boolean) =>
    setAreas((prev) => (activa ? (prev.includes(area) ? prev : [...prev, area]) : prev.filter((a) => a !== area)));

  const onTeclaEstrella = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setRating((r) => Math.min(5, r + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setRating((r) => Math.max(1, r - 1));
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setErrorValidacion("Elegí una puntuación de 1 a 5.");
      return;
    }
    setErrorValidacion(null);
    setEnviando(true);
    const ok = await onEnviar(rating, areas, comment.trim());
    setEnviando(false);
    if (ok) {
      setListoLocal(true);
      setOtra(false);
      setRating(0);
      setAreas([]);
      setComment("");
    } else {
      toast.error("No pudimos enviar tu opinión. Probá de nuevo.");
    }
  };

  if (mostrarGracias) {
    return (
      <div className={cn("flex flex-col gap-3 text-sm sm:flex-row sm:items-center", className)}>
        <p className="flex items-center gap-2">
          <ThumbsUp className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
          Gracias por tu opinión, nos ayuda a mejorar.
        </p>
        {permitirOtra && (
          <Button type="button" variant="ghost" className="h-10 w-full sm:w-auto" onClick={() => setOtra(true)}>
            Enviar otra opinión
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-4", className)} aria-busy={enviando}>
      <div>
        {titulo && <p className="font-semibold">{titulo}</p>}
        <p className="text-sm text-muted-foreground">Tu opinión nos ayuda a mejorar la herramienta.</p>
      </div>

      <div role="radiogroup" aria-label="Puntuación" className="flex gap-1" onMouseLeave={() => setHover(0)}>
        {ESTRELLAS.map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={rating === n}
            aria-label={`${n} de 5`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onKeyDown={onTeclaEstrella}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Star
              className={cn("h-6 w-6", n <= (hover || rating) ? "fill-current text-amber-500" : "text-muted-foreground/70")}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>
      {errorValidacion && (
        <p role="alert" className="text-sm text-destructive">
          {errorValidacion}
        </p>
      )}

      <fieldset>
        <legend className="text-sm font-medium">¿Qué mejorarías? (opcional)</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {AREAS.map((area, i) => {
            const id = `fb-${step}-${i}`;
            return (
              <div key={area} className="flex min-h-[2.5rem] items-center gap-2">
                <Checkbox
                  id={id}
                  className="h-5 w-5"
                  checked={areas.includes(area)}
                  onCheckedChange={(v) => toggleArea(area, v === true)}
                />
                <Label htmlFor={id} className="cursor-pointer text-sm font-normal leading-tight">
                  {area}
                </Label>
              </div>
            );
          })}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor={`fb-comment-${step}`}>Contanos más (opcional)</Label>
        <Textarea
          id={`fb-comment-${step}`}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={500}
          rows={3}
          className="resize-y rounded-xl bg-muted/30"
        />
      </div>

      <Button type="submit" className="h-10 w-full sm:w-auto" disabled={enviando}>
        {enviando ? (
          <>
            <Loader2 className="animate-spin" /> Enviando
          </>
        ) : (
          "Enviar opinión"
        )}
      </Button>
    </form>
  );
};

type FabProps = { enviado: boolean; onEnviar: EnviarFeedback };

const FeedbackFab = ({ enviado, onEnviar }: FabProps) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-6 left-6 z-40">
        <Button
          type="button"
          size="lg"
          aria-label="Dejá tu opinión"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-full bg-brand-navy px-5 py-6 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-brand-navy/90"
        >
          <MessageSquare className="h-6 w-6" />
          <span className="hidden font-medium sm:inline">Dejá tu opinión</span>
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle>Dejá tu opinión</DialogTitle>
            <DialogDescription>Contanos qué te pareció la herramienta.</DialogDescription>
          </DialogHeader>
          <FeedbackWidget step="general" enviado={enviado} onEnviar={onEnviar} permitirOtra />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackWidget;
export { FeedbackFab };
