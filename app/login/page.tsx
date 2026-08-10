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
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-xl font-bold text-white shadow-sm">
            C
          </div>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">
            CAMRAIL AI
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Connectez-vous à votre espace documentaire.
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-bold text-slate-950">
            Connexion
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Utilisez vos identifiants CAMRAIL.
          </p>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
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
                Email
              </label>

              <input
                id="username"
                type="email"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
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
                placeholder="Votre mot de passe"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username.trim() || !password}
              className="w-full rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          CAMRAIL AI · Recherche documentaire
        </p>
      </div>
    </main>
  );
}