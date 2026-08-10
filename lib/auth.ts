export type AuthSession = {
  token: string;
  role: string;
  email: string;
};

const SESSION_KEY = "camrail_session";

export function saveSession(session: AuthSession): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
      return null;
    }

    return JSON.parse(storedSession) as AuthSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
}

export async function login(
  username: string,
  password: string,
): Promise<AuthSession> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL n'est pas configurée.");
  }

  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  const response = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Email ou mot de passe incorrect");
    }

    const errorBody = await response.json().catch(() => ({}));

    throw new Error(
      errorBody.detail || "Erreur lors de la connexion.",
    );
  }

  const data = await response.json();

  const session: AuthSession = {
    token: data.access_token,
    role: data.role,
    email: username,
  };

  saveSession(session);

  return session;
}