import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 py-12">
        <div className="w-full">
          <div className="mx-auto max-w-3xl text-center">
            {/* Logo / identité */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white shadow-lg shadow-blue-600/20">
              C
            </div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
              CAMRAIL Innovation
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              L’intelligence documentaire
              <span className="block text-blue-600">
                au service de CAMRAIL
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Un assistant intelligent capable de rechercher, comprendre et
              expliquer l’information issue de la documentation de
              l’entreprise.
            </p>

            {/* Actions */}
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/assistant"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
              >
                Ouvrir l’assistant
              </Link>

              <Link
                href="/documents"
                className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Consulter les documents
              </Link>
            </div>

            {/* Prototype notice */}
            <div className="mx-auto mt-10 max-w-md rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
              <p className="text-xs leading-5 text-blue-700">
                Prototype de démonstration — les données présentées sont
                fictives et destinées au concours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}