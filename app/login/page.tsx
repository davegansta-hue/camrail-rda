"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(username, password);
      router.push("/assistant");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la connexion.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="mb-10 text-center">
          <img 
            src="/camrail-logo.png" 
            alt="CAMRAIL Logo" 
            className="mx-auto h-16 w-auto object-contain mb-6"
          />

          <p className="text-xs font-bold uppercase tracking-widest text-camrail-red mb-2">
            CAMRAIL
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            RailMind
          </h1>
          <p className="mt-3 text-sm text-slate-500 font-medium">
            Assistant documentaire
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8 relative overflow-hidden">
          {/* Subtle top border accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-camrail-red"></div>

          <h2 className="text-xl font-bold text-slate-900">
            Connexion
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Utilisez vos identifiants d'entreprise CAMRAIL.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-700">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Adresse email
              </label>

              <input
                id="username"
                type="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="prenom.nom@camrail.net"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-camrail-red focus:ring-1 focus:ring-camrail-red disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Mot de passe
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-camrail-red focus:ring-1 focus:ring-camrail-red disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full mt-2 rounded-xl bg-camrail-red px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-camrail-red-dark disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading ? "Vérification en cours..." : "Accéder à l'Assistant"}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 flex flex-col gap-1">
          <p>© {new Date().getFullYear()} CAMRAIL</p>
          <p>Propulsé par la technologie d'Intelligence Artificielle</p>
        </div>
      </div>
    </main>
  );
}