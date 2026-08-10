"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { clearSession, getSession } from "@/lib/auth";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  function handleLogout() {
    clearSession();
    setSession(null);
    router.push("/login");
  }

  const email = session?.email || "Agent CAMRAIL";
  const role = session?.role || "Non connecté";

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white shadow-sm">
              C
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none text-slate-950">
                CAMRAIL AI
              </p>

              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Recherche documentaire
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/assistant"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              Assistant
            </Link>

            <Link
              href="/documents"
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            >
              Documents
            </Link>
          </nav>

          {/* User + mobile button */}
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-[180px] truncate text-xs font-semibold text-slate-700">
                {email}
              </p>

              <p className="text-[10px] text-slate-400">
                {role}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-xs font-bold text-red-600">
              {email.charAt(0).toUpperCase()}
            </div>

            {/* Logout */}
            {session && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:block"
              >
                Déconnexion
              </button>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Ouvrir le menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 md:hidden"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              <Link
                href="/assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
              >
                Assistant
              </Link>

              <Link
                href="/documents"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-red-50 hover:text-red-600"
              >
                Documents
              </Link>

              {session && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-1 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  Déconnexion
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
    </div>
  );
}