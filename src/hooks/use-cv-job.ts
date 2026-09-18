import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  CvApiError,
  MENSAJES_ERROR,
  crearCheckout,
  enviarFeedback,
  fetchStatus,
  mensajeDeError,
  pedirMasPuestos,
  pedirRearmado,
  uploadCv,
  verificarPago,
  type CvJob,
  type FeedbackStep,
} from "@/lib/cv-api";

export type Fase = "inicio" | "subiendo" | "procesando" | "error" | "resultados";
export type PagoEstado = "idle" | "verificando" | "pendiente" | "rechazado";
export type ErrorSubida = { code: string; message: string };

const STORAGE_JOB = "dale_cv_job";
const STORAGE_FEEDBACK = "dale_cv_feedback_";
const POLL_MS = 3000;
const POLL_LENTO_MS = 30000;
const POLL_MAX_ESPERA_MS = 30000;
const PAGO_LENTO_DESPUES_MS = 3 * 60 * 1000;

type JobGuardado = { id: string; startedAt: number };

function leerJobGuardado(): JobGuardado | null {
  try {
    const raw = localStorage.getItem(STORAGE_JOB);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === "object" && parsed !== null && typeof (parsed as JobGuardado).id === "string") {
      const j = parsed as JobGuardado;
      return { id: j.id, startedAt: Number(j.startedAt) || Date.now() };
    }
    return null;
  } catch {
    return null;
  }
}

function guardarJob(id: string, startedAt: number) {
  try {
    localStorage.setItem(STORAGE_JOB, JSON.stringify({ id, startedAt }));
  } catch {
    // Sin storage (modo privado): el link con ?id= sigue funcionando.
  }
}

function borrarJobGuardado() {
  try {
    localStorage.removeItem(STORAGE_JOB);
  } catch {
    // Sin storage: nada que borrar.
  }
}

function leerListaFeedback(clave: string): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_FEEDBACK + clave);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function leerFeedbackEnviado(jobId: string | null): string[] {
  const general = leerListaFeedback("general");
  const delJob = jobId ? leerListaFeedback(jobId) : [];
  return Array.from(new Set([...general, ...delJob]));
}

function guardarFeedbackEnviado(jobId: string | null, step: FeedbackStep) {
  const clave = jobId || "general";
  try {
    const actual = leerListaFeedback(clave);
    if (!actual.includes(step)) localStorage.setItem(STORAGE_FEEDBACK + clave, JSON.stringify([...actual, step]));
  } catch {
    // Sin storage: el estado en memoria alcanza para esta sesion.
  }
}

const esTerminal = (j: CvJob) => j.status === "listo" || j.status === "error";

export function useCvJob() {
  const [, setSearchParams] = useSearchParams();

  const [jobId, setJobId] = useState<string | null>(null);
  const [job, setJob] = useState<CvJob | null>(null);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errorSubida, setErrorSubida] = useState<ErrorSubida | null>(null);
  const [pago, setPagoEstado] = useState<PagoEstado>("idle");
  const [pagando, setPagando] = useState(false);
  const [sinConexion, setSinConexion] = useState(false);
  const [feedbackEnviado, setFeedbackEnviado] = useState<string[]>([]);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  const jobIdRef = useRef<string | null>(null);
  const ultimoServidorRef = useRef<CvJob | null>(null);
  const pagoRef = useRef<PagoEstado>("idle");
  const pendienteDesdeRef = useRef<number>(0);
  const pagoAvisadoRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const fallosRef = useRef(0);
  const enVueloRef = useRef(false);
  const pollRef = useRef<() => void>(() => undefined);

  const limpiarTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const cambiarPago = (p: PagoEstado) => {
    pagoRef.current = p;
    if (p === "pendiente") pendienteDesdeRef.current = Date.now();
    setPagoEstado(p);
  };

  const actualizarJob = (fn: (j: CvJob) => CvJob) => {
    setJob((j) => (j ? fn(j) : j));
  };

  const marcarPagoConfirmado = () => {
    cambiarPago("idle");
    actualizarJob((j) => ({ ...j, paid: true }));
    if (!pagoAvisadoRef.current) {
      pagoAvisadoRef.current = true;
      toast.success("Pago confirmado. Ya podés rearmar tu CV y buscar más puestos.");
    }
  };

  const reset = () => {
    limpiarTimer();
    borrarJobGuardado();
    jobIdRef.current = null;
    ultimoServidorRef.current = null;
    fallosRef.current = 0;
    pagoAvisadoRef.current = false;
    setJobId(null);
    setJob(null);
    setStartedAt(null);
    setErrorSubida(null);
    cambiarPago("idle");
    setPagando(false);
    setSinConexion(false);
    setPaymentId(null);
    setFeedbackEnviado(leerFeedbackEnviado(null));
    setSearchParams({}, { replace: true });
  };

  const debeSeguir = (d: CvJob) =>
    !esTerminal(d) ||
    d.more_status === "buscando" ||
    d.rebuild_status === "generando" ||
    (pagoRef.current === "pendiente" && !d.paid);

  const intervaloPara = (d: CvJob) => {
    const soloPago = esTerminal(d) && d.more_status !== "buscando" && d.rebuild_status !== "generando";
    if (soloPago && Date.now() - pendienteDesdeRef.current > PAGO_LENTO_DESPUES_MS) return POLL_LENTO_MS;
    return POLL_MS;
  };

  const avisarTransiciones = (prev: CvJob | null, data: CvJob) => {
    if (data.paid && (pagoRef.current === "pendiente" || pagoRef.current === "verificando" || (prev && !prev.paid))) {
      marcarPagoConfirmado();
    }
    if (!prev) return;
    if (prev.more_status === "buscando" && data.more_status === "listo") {
      const antes = prev.matches.filter((m) => m.tier === "paid").length;
      const ahora = data.matches.filter((m) => m.tier === "paid").length;
      const nuevos = Math.max(0, ahora - antes);
      if (nuevos > 0) toast.success(`Encontramos ${nuevos} puestos más`);
      else toast.message("No encontramos puestos adicionales que coincidan con tu perfil.");
    }
    if (prev.rebuild_status === "generando" && data.rebuild_status === "listo") {
      toast.success("Tu CV optimizado está listo para descargar.");
    }
  };

  const poll = async () => {
    const id = jobIdRef.current;
    if (!id) return;
    limpiarTimer();
    if (enVueloRef.current) return;
    enVueloRef.current = true;
    try {
      const data = await fetchStatus(id);
      if (jobIdRef.current !== id) return;
      fallosRef.current = 0;
      setSinConexion(false);
      avisarTransiciones(ultimoServidorRef.current, data);
      ultimoServidorRef.current = data;
      setJob(data);
      if (debeSeguir(data)) {
        timerRef.current = window.setTimeout(() => pollRef.current(), intervaloPara(data));
      }
    } catch (e) {
      if (jobIdRef.current !== id) return;
      if (e instanceof CvApiError && e.code === "no_encontrado") {
        toast.error(MENSAJES_ERROR.no_encontrado);
        reset();
        return;
      }
      // Red caida o servidor con problemas: backoff 3s * 2^n hasta 30 s.
      fallosRef.current += 1;
      setSinConexion(true);
      const espera = Math.min(POLL_MS * Math.pow(2, fallosRef.current - 1), POLL_MAX_ESPERA_MS);
      timerRef.current = window.setTimeout(() => pollRef.current(), espera);
    } finally {
      enVueloRef.current = false;
    }
  };
  pollRef.current = poll;

  const verificar = async (id: string, pid: string) => {
    cambiarPago("verificando");
    try {
      const r = await verificarPago(id, pid);
      if (jobIdRef.current !== id) return;
      if (r.paid) {
        marcarPagoConfirmado();
      } else if (r.status === "rejected" || r.status === "cancelled") {
        cambiarPago("rechazado");
        toast.error("MercadoPago no aprobó el pago. Podés intentarlo de nuevo con otro medio.");
      } else {
        cambiarPago("pendiente");
      }
    } catch {
      if (jobIdRef.current !== id) return;
      // El IPN de MercadoPago marca el pago aunque esta verificacion falle: seguimos consultando.
      cambiarPago("pendiente");
    }
  };

  const cargarJob = (id: string, inicio: number | null) => {
    jobIdRef.current = id;
    ultimoServidorRef.current = null;
    fallosRef.current = 0;
    setJobId(id);
    setJob(null);
    setStartedAt(inicio);
    setFeedbackEnviado(leerFeedbackEnviado(id));
  };

  // Montaje: restaurar por ?id= o localStorage, procesar el retorno de MercadoPago y arrancar el polling.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let id = params.get("id");
    let inicio: number | null = null;
    const guardado = leerJobGuardado();
    if (!id && guardado) {
      id = guardado.id;
      inicio = guardado.startedAt;
      setSearchParams({ id }, { replace: true });
    } else if (id && guardado && guardado.id === id) {
      inicio = guardado.startedAt;
    }
    if (!id) {
      setFeedbackEnviado(leerFeedbackEnviado(null));
      return;
    }
    cargarJob(id, inicio);

    const mpStatus = (params.get("status") || params.get("collection_status") || "").toLowerCase();
    const mpPaymentRaw = params.get("payment_id") || params.get("collection_id") || "";
    const mpPayment = mpPaymentRaw && mpPaymentRaw !== "null" ? mpPaymentRaw : "";
    const pay = (params.get("pay") || "").toLowerCase();
    const huboRetorno = Boolean(mpStatus || mpPayment || pay || params.get("preference_id"));

    if (huboRetorno) {
      setSearchParams({ id }, { replace: true });
      const aprobadoOPendiente = mpStatus
        ? ["approved", "pending", "in_process", "authorized"].includes(mpStatus)
        : pay === "success" || pay === "pending";
      const rechazado = mpStatus ? ["rejected", "cancelled"].includes(mpStatus) : pay === "failure";
      if (aprobadoOPendiente && mpPayment) {
        setPaymentId(mpPayment);
        verificar(id, mpPayment).then(() => pollRef.current());
        return;
      }
      if (aprobadoOPendiente) {
        cambiarPago("pendiente");
      } else if (rechazado) {
        cambiarPago("rechazado");
        toast.error("MercadoPago no aprobó el pago. Podés intentarlo de nuevo con otro medio.");
      }
    }
    pollRef.current();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Al volver a la pestana, consultar de inmediato.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && jobIdRef.current) {
        fallosRef.current = 0;
        pollRef.current();
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      limpiarTimer();
    };
  }, []);

  const subir = async (file: File) => {
    setErrorSubida(null);
    setSubiendo(true);
    try {
      const r = await uploadCv(file);
      limpiarTimer();
      const inicio = Date.now();
      guardarJob(r.job_id, inicio);
      pagoAvisadoRef.current = false;
      cambiarPago("idle");
      setPaymentId(null);
      setSinConexion(false);
      cargarJob(r.job_id, inicio);
      setSearchParams({ id: r.job_id }, { replace: true });
      pollRef.current();
    } catch (e) {
      const code = e instanceof CvApiError ? e.code : "red";
      setErrorSubida({ code, message: mensajeDeError(e) });
    } finally {
      setSubiendo(false);
    }
  };

  const limpiarErrorSubida = () => setErrorSubida(null);

  const pagar = async () => {
    const id = jobIdRef.current;
    if (!id) return;
    setPagando(true);
    try {
      const r = await crearCheckout(id);
      if (!r.init_point) throw new CvApiError("red");
      window.location.assign(r.init_point);
    } catch (e) {
      if (e instanceof CvApiError && e.code === "ya_pagado") {
        marcarPagoConfirmado();
        pollRef.current();
      } else {
        toast.error(mensajeDeError(e));
      }
      setPagando(false);
    }
  };

  const verificarDeNuevo = async () => {
    const id = jobIdRef.current;
    if (!id) return;
    if (paymentId) {
      await verificar(id, paymentId);
    } else {
      cambiarPago("pendiente");
    }
    pollRef.current();
  };

  const buscarMas = async () => {
    const id = jobIdRef.current;
    if (!id) return;
    actualizarJob((j) => ({ ...j, more_status: "buscando" }));
    try {
      await pedirMasPuestos(id);
      pollRef.current();
    } catch (e) {
      const code = e instanceof CvApiError ? e.code : "red";
      if (code === "ya_en_proceso") {
        pollRef.current();
        return;
      }
      if (code === "sin_cupo") {
        actualizarJob((j) => ({ ...j, more_status: "listo", paid_used: j.paid_quota }));
      } else {
        actualizarJob((j) => ({ ...j, more_status: "error" }));
      }
      toast.error(mensajeDeError(e));
    }
  };

  const rearmar = async () => {
    const id = jobIdRef.current;
    if (!id) return;
    actualizarJob((j) => ({ ...j, rebuild_status: "generando" }));
    try {
      await pedirRearmado(id);
      pollRef.current();
    } catch (e) {
      const code = e instanceof CvApiError ? e.code : "red";
      if (code === "ya_en_proceso") {
        pollRef.current();
        return;
      }
      actualizarJob((j) => ({ ...j, rebuild_status: "error" }));
      toast.error(mensajeDeError(e));
    }
  };

  const mandarFeedback = async (step: FeedbackStep, rating: number, areas: string[], comment: string): Promise<boolean> => {
    const id = jobIdRef.current;
    try {
      await enviarFeedback({ job_id: id, step, rating, areas, comment });
    } catch {
      return false;
    }
    guardarFeedbackEnviado(id, step);
    setFeedbackEnviado((prev) => (prev.includes(step) ? prev : [...prev, step]));
    return true;
  };

  const fase: Fase = subiendo
    ? "subiendo"
    : !jobId
      ? "inicio"
      : !job
        ? "procesando"
        : job.status === "listo"
          ? "resultados"
          : job.status === "error"
            ? "error"
            : "procesando";

  return {
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
  };
}
