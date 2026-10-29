// Genera un enlace firmado y temporal (60 s) a un archivo del bucket privado de Supabase Storage.
// Usa la API REST directamente: no hace falta instalar el SDK de Supabase.

export async function enlaceFirmado(ruta: string, segundos = 60): Promise<string> {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_BUCKET || "productos";
  if (!url || !key) throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY");

  const rutaCodificada = ruta.split("/").map(encodeURIComponent).join("/");
  const res = await fetch(`${url}/storage/v1/object/sign/${bucket}/${rutaCodificada}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      apikey: key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn: segundos }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const { signedURL } = (await res.json()) as { signedURL: string };
  const nombre = ruta.split("/").pop() || "descarga";
  return `${url}/storage/v1${signedURL}&download=${encodeURIComponent(nombre)}`;
}
