// Fechas de publicacion de los avisos: filtros "menos de N dias" y orden.
import type { JobMatch } from "@/lib/cv-api";

export type FiltroDias = 0 | 7 | 14 | 30;

// 0 = "Todos" (incluye avisos sin fecha). "Menos de N" es estrictamente < N.
export const FILTROS: { dias: FiltroDias; label: string }[] = [
  { dias: 0, label: "Todos" },
  { dias: 7, label: "Menos de 7 días" },
  { dias: 14, label: "Menos de 14 días" },
  { dias: 30, label: "Menos de 30 días" },
];

const DIA_MS = 24 * 60 * 60 * 1000;

export function diasDesde(iso: string | null | undefined, ahora: number = Date.now()): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.max(0, Math.floor((ahora - t) / DIA_MS));
}

export function textoHace(dias: number | null | undefined): string {
  if (typeof dias !== "number" || Number.isNaN(dias)) return "Fecha no disponible";
  if (dias <= 0) return "Publicado hoy";
  if (dias === 1) return "Publicado ayer";
  if (dias > 60) return "Publicado hace más de 2 meses";
  return `Publicado hace ${dias} días`;
}

// Deduplica por job_id (queda la primera aparicion) y completa days_ago
// a partir de posted_at cuando el servidor no lo mando.
export function conDias(matches: JobMatch[], ahora: number = Date.now()): JobMatch[] {
  const vistos = new Set<string>();
  const salida: JobMatch[] = [];
  for (const m of matches || []) {
    if (!m) continue;
    const id = String(m.job_id || m.job_url || "");
    if (id && vistos.has(id)) continue;
    if (id) vistos.add(id);
    const dias = typeof m.days_ago === "number" && !Number.isNaN(m.days_ago) ? m.days_ago : diasDesde(m.posted_at, ahora);
    salida.push({ ...m, days_ago: dias });
  }
  return salida;
}

const scoreDe = (m: JobMatch): number => (typeof m.score === "number" && !Number.isNaN(m.score) ? m.score : 0);

function compararMatches(a: JobMatch, b: JobMatch): number {
  const porScore = scoreDe(b) - scoreDe(a);
  if (porScore !== 0) return porScore;
  const da = typeof a.days_ago === "number" ? a.days_ago : Number.POSITIVE_INFINITY;
  const db = typeof b.days_ago === "number" ? b.days_ago : Number.POSITIVE_INFINITY;
  return da - db;
}

const pasaFiltro = (m: JobMatch, dias: FiltroDias): boolean =>
  dias === 0 || (typeof m.days_ago === "number" && m.days_ago < dias);

// Orden: score desc, luego dias asc (sin fecha al final).
export function filtrarYOrdenar(matches: JobMatch[], dias: FiltroDias): JobMatch[] {
  return matches.filter((m) => pasaFiltro(m, dias)).sort(compararMatches);
}

export function contarPorFiltro(matches: JobMatch[]): Record<FiltroDias, number> {
  const conteo: Record<FiltroDias, number> = { 0: 0, 7: 0, 14: 0, 30: 0 };
  for (const f of FILTROS) conteo[f.dias] = matches.filter((m) => pasaFiltro(m, f.dias)).length;
  return conteo;
}
