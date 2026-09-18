import { useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from "react";
import { AlertTriangle, ArrowRight, FileText, Loader2, ScanText, ShieldCheck, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CV_ACCEPT, formatoTamano, validarArchivo } from "@/lib/cv-api";
import type { ErrorSubida } from "@/hooks/use-cv-job";

type Props = {
  subiendo: boolean;
  error: ErrorSubida | null;
  onSubir: (file: File) => void;
  onLimpiarError: () => void;
};

const CvUpload = ({ subiendo, error, onSubir, onLimpiarError }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errorLocal, setErrorLocal] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);

  const abrirSelector = () => {
    if (!subiendo && inputRef.current) inputRef.current.click();
  };

  const elegir = (f: File | null | undefined) => {
    if (!f) return;
    onLimpiarError();
    setErrorLocal(validarArchivo(f));
    setArchivo(f);
  };

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    elegir(e.target.files && e.target.files[0]);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setArrastrando(false);
    if (subiendo) return;
    elegir(e.dataTransfer.files && e.dataTransfer.files[0]);
  };

  const onDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    if (!arrastrando) setArrastrando(true);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrirSelector();
    }
  };

  const mensaje = errorLocal || (error ? error.message : null);
  const IconoError = error && error.code === "pdf_sin_texto" && !errorLocal ? ScanText : AlertTriangle;
  const puedeIniciar = Boolean(archivo) && !errorLocal && !subiendo;

  return (
    <section
      className="glass gradient-border rounded-2xl p-6 md:p-8"
      aria-labelledby="cv-upload-titulo"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={() => setArrastrando(false)}
    >
      <h2 id="cv-upload-titulo" className="sr-only">
        Subir CV
      </h2>
      <input
        ref={inputRef}
        type="file"
        accept={CV_ACCEPT}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={onInput}
      />

      {!archivo ? (
        <>
          <div
            role="button"
            tabIndex={0}
            aria-describedby="cv-hint"
            onClick={abrirSelector}
            onKeyDown={onKey}
            className={cn(
              "rounded-xl border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              arrastrando ? "border-brand-blue bg-brand-blue/10" : "border-brand-blue/40 bg-muted/30 hover:bg-muted/60",
            )}
          >
            <Upload className="h-8 w-8 text-brand-blue mx-auto" aria-hidden="true" />
            <p className="mt-3 font-medium text-foreground">Arrastrá tu CV acá o hacé clic para elegirlo</p>
            <p id="cv-hint" className="mt-1 text-sm text-muted-foreground">
              PDF, DOC o DOCX, hasta 5 MB. Tiene que tener texto seleccionable (no una foto ni un escaneo).
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            <Button type="button" variant="outline" className="h-11 w-full sm:w-auto" onClick={abrirSelector}>
              <Upload /> Elegir archivo
            </Button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-brand-blue/30 bg-muted/30 p-4 flex items-center gap-3">
          <FileText className="h-6 w-6 text-brand-blue shrink-0" aria-hidden="true" />
          <div className="min-w-0 flex-1 text-left">
            <p className="font-medium break-words">{archivo.name}</p>
            <p className="text-sm text-muted-foreground">{formatoTamano(archivo.size)}</p>
          </div>
          <Button type="button" variant="ghost" className="h-10 shrink-0" onClick={abrirSelector} disabled={subiendo}>
            Cambiar
          </Button>
        </div>
      )}

      {mensaje && (
        <Alert variant="destructive" className="mt-4 text-left">
          <IconoError className="h-4 w-4" />
          <AlertDescription>{mensaje}</AlertDescription>
        </Alert>
      )}

      {archivo && (
        <div className="mt-5 flex justify-center">
          <Button
            type="button"
            className="h-11 w-full sm:w-auto"
            disabled={!puedeIniciar}
            aria-busy={subiendo}
            onClick={() => {
              if (archivo) onSubir(archivo);
            }}
          >
            {subiendo ? (
              <>
                <Loader2 className="animate-spin" /> Leyendo tu CV
              </>
            ) : (
              <>
                Iniciar <ArrowRight />
              </>
            )}
          </Button>
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 text-xs text-muted-foreground text-left">
        <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-brand-blue" aria-hidden="true" />
        <span>
          Tu CV se procesa en los servidores propios de Dale Automations. No lo compartimos con nadie y se borra
          automáticamente a los 30 días.
        </span>
      </p>
    </section>
  );
};

export default CvUpload;
