import { AxiosError, type AxiosResponse } from "axios";

/**
 * Rutas de reportes relativas a `NEXT_PUBLIC_API_URL`.
 * Esa variable debe apuntar al prefijo API del backend (p. ej. `http://host:5001/api`)
 * para que `/reportes/...` coincida con `{API_BASE}/api/reportes/...`.
 *
 * La ruta JSON lleva **barra final** (`/reportes/:slug/`) para alinear con Express.
 */
export function reportesJsonPath(reporteSlug: string): string {
  const slug = encodeURIComponent(reporteSlug);
  return `/reportes/${slug}/`;
}

/** Segmento `download` activa XLSX en el backend. */
export function reportesDownloadPath(reporteSlug: string): string {
  const slug = encodeURIComponent(reporteSlug);
  return `/reportes/${slug}/download`;
}

/** Extrae nombre de archivo de Content-Disposition; si no, usa el slug del reporte. */
export function filenameFromReportDownloadResponse(
  res: AxiosResponse<Blob>,
  reporteSlug: string
): string {
  const header =
    res.headers["content-disposition"] ?? res.headers["Content-Disposition"];
  const fallback = `${reporteSlug}.xlsx`;
  if (!header || typeof header !== "string") return fallback;

  const utf8 = /filename\*=UTF-8''([^;\s]+)/i.exec(header);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].replace(/^["']|["']$/g, ""));
    } catch {
      return utf8[1];
    }
  }
  const plain = /filename=(?:"([^"]+)"|([^;\s]+))/i.exec(header);
  const name = plain?.[1] ?? plain?.[2];
  return name?.trim() || fallback;
}

export function getReportesAxiosErrorMessage(
  err: unknown,
  messages: { auth: string; generic: string }
): string {
  if (!(err instanceof AxiosError) || !err.response) return messages.generic;
  const { status, data } = err.response;
  if (status === 401 || status === 403) return messages.auth;
  if (data && typeof data === "object" && data !== null && "error" in data) {
    const e = (data as { error?: unknown }).error;
    if (typeof e === "string" && e.trim()) return e;
  }
  return messages.generic;
}

/** Si el servidor respondió JSON de error en vez de XLSX, lanza Error con el mensaje. */
export async function parseReportDownloadOrThrow(
  res: AxiosResponse<Blob>,
  reporteSlug: string
): Promise<{ blob: Blob; filename: string }> {
  const ct = String(res.headers["content-type"] ?? "");
  if (ct.includes("application/json")) {
    let msg = "Error generando reportes";
    try {
      const j = JSON.parse(await res.data.text()) as { error?: string };
      if (typeof j?.error === "string" && j.error.trim()) msg = j.error;
    } catch {
      /* mensaje por defecto */
    }
    throw new Error(msg);
  }
  const filename = filenameFromReportDownloadResponse(res, reporteSlug);
  return { blob: res.data, filename };
}
