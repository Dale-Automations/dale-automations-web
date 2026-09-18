// Cliente HTTP de la herramienta /cv (backend en n8n).
// Contrato canonico: ver plan "daleautomations.com/cv". Los errores del servidor
// llegan como {ok:false, error:"<codigo>", message:"<texto>"} y se traducen a CvApiError.

export const CV_API = "https://n8n.daleautomations.com/webhook";

export const CV_ENDPOINTS = {
  upload: `${CV_API}/cv-upload`,
  status: `${CV_API}/cv-status`,
  checkout: `${CV_API}/cv-checkout`,
  payVerify: `${CV_API}/cv-pay-verify`,
  more: `${CV_API}/cv-more`,
  rebuild: `${CV_API}/cv-rebuild`,
  download: `${CV_API}/cv-download`,
  feedback: `${CV_API}/cv-feedback`,
} as const;

export const CV_MAX_BYTES = 5 * 1024 * 1024;
export const CV_EXTENSIONS = [".pdf", ".doc", ".docx"];
export const CV_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

export const PRECIO_ARS = 10000;
export const PRECIO_TEXTO = `$${PRECIO_ARS.toLocaleString("es-AR")}`; // "$10.000"
export const RETENCION_DIAS = 30;

export type JobStatus =
  | "recibido"
  | "extrayendo"
  | "analizando_ats"
  | "buscando_puestos"
  | "rankeando"
  | "listo"
  | "error";
export type MoreStatus = "idle" | "buscando" | "listo" | "error";
export type RebuildStatus = "idle" | "generando" | "listo" | "error";
export type FeedbackStep = "ats" | "puestos" | "pago" | "general";

export type AtsProblema = { prioridad: "alta" | "media" | "baja"; texto: string };
export type AtsReport = {
  score: number;
  veredicto: string;
  resumen?: string;
  fortalezas: string[];
  problemas: AtsProblema[];
  sugerencias: string[];
  secciones: { detectadas: string[]; faltantes: string[] };
};
export type Profile = { titulos_objetivo: string[]; ubicacion: string; seniority: string };
export type JobMatch = {
  job_id: string;
  title: string;
  company: string;
  location: string;
  posted_at: string | null;
  days_ago: number | null;
  job_url: string;
  score: number;
  motivo: string;
  alerta?: string;
  tier: "free" | "paid";
};
export type CvJob = {
  ok: true;
  job_id: string;
  status: JobStatus;
  progress: number;
  step_label: string;
  error_message: string | null;
  created_at?: string;
  ats: AtsReport | null;
  profile: Profile | null;
  matches: JobMatch[];
  free_limit: number;
  paid: boolean;
  paid_quota: number;
  paid_used: number;
  more_status: MoreStatus;
  rebuild_status: RebuildStatus;
  download_url: string | null;
};

export type UploadRespuesta = { ok: true; job_id: string };
export type CheckoutRespuesta = { ok: true; init_point: string; preference_id: string };
export type PagoVerificado = { ok: true; paid: boolean; status: string; status_detail: string };
export type OkRespuesta = { ok: true };
export type FeedbackPayload = {
  job_id: string | null;
  step: FeedbackStep;
  rating: number;
  areas: string[];
  comment: string;
};

export class CvApiError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message || code);
    this.name = "CvApiError";
    this.code = code;
  }
}

export const MENSAJES_ERROR: Record<string, string> = {
  archivo_invalido: "El archivo no es válido. Subí un PDF o Word (.doc o .docx).",
  archivo_grande: "El archivo pesa más de 5 MB. Comprimilo o exportalo de nuevo y volvé a intentar.",
  pdf_sin_texto:
    "Tu PDF parece ser una imagen o un escaneo: no tiene texto seleccionable. Exportalo como PDF desde Word o Google Docs (no lo escanees ni lo guardes como foto) y volvé a intentar.",
  word_no_convertible: "No pudimos leer ese archivo de Word. Guardalo como PDF con texto y volvé a intentar.",
  limite_diario: "Alcanzamos el límite de análisis gratuitos de hoy. Probá de nuevo mañana.",
  ia_no_disponible: "El motor de IA no está disponible en este momento, probá de nuevo en un rato.",
  no_encontrado: "No encontramos ese análisis. Puede haber vencido (se borra a los 30 días). Subí tu CV de nuevo.",
  no_pagado: "Este análisis todavía no tiene el pago confirmado.",
  sin_cupo: "Ya usaste los 50 puestos adicionales de este análisis.",
  ya_en_proceso: "Esa acción ya está en curso. Esperá a que termine.",
  no_listo: "Todavía estamos procesando tu CV. Esperá a que termine el análisis.",
  ya_pagado: "Este análisis ya tiene el pago confirmado.",
  red: "No pudimos conectar con el servidor. Revisá tu conexión y probá de nuevo.",
};

// Codigo conocido -> texto fijo; si no, el mensaje que mando el servidor; nunca el codigo crudo.
export const mensajeDeError = (e: unknown): string => {
  if (!(e instanceof CvApiError)) return MENSAJES_ERROR.red;
  if (MENSAJES_ERROR[e.code]) return MENSAJES_ERROR[e.code];
  return e.message && e.message !== e.code ? e.message : MENSAJES_ERROR.red;
};

export const esUuid = (v: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export function formatoTamano(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
}

// Nivel del puntaje ATS: define colores del anillo y del veredicto en la UI.
export type NivelAts = "alto" | "medio" | "regular" | "bajo";
export function nivelAts(score: number): NivelAts {
  if (score >= 80) return "alto";
  if (score >= 60) return "medio";
  if (score >= 40) return "regular";
  return "bajo";
}

// Validacion local antes de subir (misma regla que el servidor: extension + 5 MB).
export function validarArchivo(f: File): string | null {
  const nombre = (f.name || "").toLowerCase();
  const extensionOk = CV_EXTENSIONS.some((ext) => nombre.endsWith(ext));
  if (!extensionOk) return "Ese formato no sirve. Subí un PDF o Word (.doc o .docx).";
  if (f.size > CV_MAX_BYTES) return MENSAJES_ERROR.archivo_grande;
  if (f.size === 0) return MENSAJES_ERROR.archivo_invalido;
  return null;
}

type Registro = Record<string, unknown>;
const esRegistro = (v: unknown): v is Registro => typeof v === "object" && v !== null;

async function leerJson<T>(res: Response): Promise<T> {
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  const cuerpo = esRegistro(json) ? json : null;
  const codigo = cuerpo && typeof cuerpo.error === "string" ? cuerpo.error : "";
  const mensaje = cuerpo && typeof cuerpo.message === "string" ? cuerpo.message : undefined;
  if (res.status === 404) throw new CvApiError("no_encontrado", mensaje);
  if (!res.ok || (cuerpo && cuerpo.ok === false)) {
    throw new CvApiError(codigo || `http_${res.status}`, mensaje);
  }
  return json as T;
}

async function conRed(pedido: () => Promise<Response>): Promise<Response> {
  try {
    return await pedido();
  } catch {
    throw new CvApiError("red");
  }
}

// Convencion del sitio: JSON como text/plain para evitar el preflight CORS.
async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await conRed(() =>
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify(body),
    }),
  );
  return leerJson<T>(res);
}

export async function uploadCv(file: File, email?: string): Promise<UploadRespuesta> {
  const fd = new FormData();
  fd.append("cv", file, file.name);
  if (email) fd.append("email", email);
  // Sin Content-Type manual: el navegador arma el boundary del multipart.
  const res = await conRed(() => fetch(CV_ENDPOINTS.upload, { method: "POST", body: fd }));
  return leerJson<UploadRespuesta>(res);
}

export async function fetchStatus(id: string): Promise<CvJob> {
  const res = await conRed(() =>
    fetch(`${CV_ENDPOINTS.status}?job_id=${encodeURIComponent(id)}`, { cache: "no-store" }),
  );
  return leerJson<CvJob>(res);
}

export const crearCheckout = (job_id: string, email?: string) =>
  postJson<CheckoutRespuesta>(CV_ENDPOINTS.checkout, email ? { job_id, email } : { job_id });

export const verificarPago = (job_id: string, payment_id: string) =>
  postJson<PagoVerificado>(CV_ENDPOINTS.payVerify, { job_id, payment_id });

export const pedirMasPuestos = (job_id: string) => postJson<OkRespuesta>(CV_ENDPOINTS.more, { job_id });

export const pedirRearmado = (job_id: string) => postJson<OkRespuesta>(CV_ENDPOINTS.rebuild, { job_id });

export const enviarFeedback = (payload: FeedbackPayload) =>
  postJson<OkRespuesta>(CV_ENDPOINTS.feedback, payload);

// El PDF se sirve desde el propio sitio (proxy PHP en public/cv-pdf/index.php) para no exponer la URL de n8n.
export const CV_DOWNLOAD_SITE = "https://daleautomations.com/cv-pdf/";
export const urlDeDescarga = (job_id: string) => `${CV_DOWNLOAD_SITE}?id=${encodeURIComponent(job_id)}`;
