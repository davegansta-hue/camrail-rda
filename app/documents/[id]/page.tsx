"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const pages = [
  {
    number: 1,
    title: "Objet et champ d’application",
    content:
      "Le présent document définit les principes généraux applicables à la sécurité ferroviaire et précise les responsabilités des différents acteurs.",
  },
  {
    number: 2,
    title: "Principes généraux",
    content:
      "La sécurité constitue une priorité permanente. Toute activité doit être réalisée conformément aux procédures, instructions et règles applicables.",
  },
  {
    number: 3,
    title: "Responsabilités du personnel",
    content:
      "Chaque agent est responsable du respect des consignes de sécurité correspondant à son activité et à son niveau de responsabilité.",
  },
  {
    number: 4,
    title: "Prévention des risques",
    content:
      "Les situations présentant un risque doivent être identifiées, signalées et traitées conformément aux procédures en vigueur.",
  },
  {
    number: 5,
    title: "Équipements de protection",
    content:
      "Les équipements de protection individuelle prévus pour chaque activité doivent être portés et utilisés conformément aux instructions applicables.",
  },
  {
    number: 6,
    title: "Signalement des situations dangereuses",
    content:
      "Tout agent doit signaler immédiatement toute situation susceptible de compromettre la sécurité des personnes, des installations ou des circulations.",
  },
  {
    number: 7,
    title: "Règles générales de sécurité",
    content:
      "Tout personnel doit respecter les règles et procédures de sécurité applicables à son activité et signaler toute situation susceptible de présenter un risque.",
    highlighted: true,
  },
  {
    number: 8,
    title: "Communication et information",
    content:
      "Les informations nécessaires à la sécurité doivent être communiquées aux personnes concernées de manière claire et dans les délais appropriés.",
  },
  {
    number: 9,
    title: "Formation et sensibilisation",
    content:
      "Le personnel doit recevoir les formations et informations nécessaires à l’exercice de ses missions dans des conditions garantissant la sécurité.",
  },
];

export default function DocumentViewerPage() {
  const params = useParams();
  const documentId = params.id;

  return (
    <main className="min-h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/documents"
            className="text-sm font-medium text-red-600 hover:text-red-700"
          >
            ← Retour aux documents
          </Link>

          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Document · {String(documentId)}
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
              Politique de sécurité ferroviaire
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Version 1.2 · 24 pages · Document de démonstration
            </p>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Télécharger
        </button>
      </div>

      {/* Viewer */}
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* Page navigation */}
        <aside className="hidden lg:block">
          <div className="sticky top-5 rounded-2xl border border-slate-200 bg-white p-3">
            <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pages
            </p>

            <div className="space-y-1">
              {pages.map((page) => (
                <a
                  key={page.number}
                  href={`#page-${page.number}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                    page.number === 7
                      ? "bg-red-50 font-semibold text-red-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>Page {page.number}</span>

                  {page.number === 7 && (
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Document */}
        <section className="rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-5 lg:p-8">
          <div className="mx-auto max-w-3xl space-y-5">
            {pages.map((page) => (
              <article
                key={page.number}
                id={`page-${page.number}`}
                className="scroll-mt-6 bg-white p-6 shadow-sm sm:p-10"
              >
                <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Politique de sécurité ferroviaire
                  </span>

                  <span className="text-xs text-slate-400">
                    Page {page.number}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {page.title}
                </h2>

                <p
                  className={`mt-5 text-sm leading-8 text-slate-700 ${
                    page.highlighted
                      ? "rounded-xl border border-red-200 bg-red-50 p-5"
                      : ""
                  }`}
                >
                  {page.highlighted && (
                    <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-red-600">
                      Passage cité par CAMRAIL AI
                    </span>
                  )}

                  {page.content}
                </p>

                <div className="mt-10 border-t border-slate-100 pt-4 text-right">
                  <span className="text-xs text-slate-400">
                    Politique de sécurité ferroviaire · v1.2
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}