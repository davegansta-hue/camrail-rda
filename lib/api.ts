import { clearSession, getSession } from "./auth";

export async function apiFetch(
  path: string,
  options: RequestInit = {},
) {
  const session = getSession();

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (session?.token) {
    headers.set("Authorization", `Bearer ${session.token}`);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL n'est pas configurée.");
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }

    throw new Error("Session expirée, veuillez vous reconnecter.");
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));

    throw new Error(
      errorBody.detail || "Erreur lors de l'appel à l'API.",
    );
  }

  return response.json();
}