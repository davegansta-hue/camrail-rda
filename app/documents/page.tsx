
"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { apiFetch } from "@/lib/api";

type DocumentStatus =
  | "processing"
  | "indexed"
  | "active"
  | "failed";

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  department: string;
  version: string;
  status: DocumentStatus;
  checksum: string;
  uploaded_by: string;
  created_at: string;
}

const statusConfig: Record<
  DocumentStatus,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  processing: {
    label: "Traitement",
    className: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  indexed: {
    label: "Indexé",
    className: "bg-red-50 text-red-700",
    dot: "bg-red-500",
  },
  active: {
    label: "Actif",
    className: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  failed: {
    label: "Échec",
    className: "bg-red-100 text-red-800",
    dot: "bg-red-600",
  },
};

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return date;
  }
}

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch("/documents");

        setDocuments(data as DocumentItem[]);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Impossible de charger les documents.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((document) =>
    document.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AuthGuard>
      <div>
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
              CAMRAIL AI
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Documents
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Gérez les documents utilisés par le moteur de recherche
              documentaire.
            </p>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
          >
            <span className="text-lg">+</span>
            Ajouter un document
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Total</p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {documents.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Actifs</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {
                documents.filter(
                  (doc) => doc.status === "active",
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">Indexés</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {
                documents.filter(
                  (doc) => doc.status === "indexed",
                ).length
              }
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs text-slate-500">En traitement</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {
                documents.filter(
                  (doc) => doc.status === "processing",
                ).length
              }
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un document..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white"
            />

            <span className="absolute left-3 top-3 text-slate-400">
              ⌕
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">
              Chargement des documents...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger les documents
            </p>

            <p className="mt-2 text-xs text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Documents */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full">
                <thead className="border-b border-slate-200 bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Document
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Catégorie
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Département
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Version
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Statut
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredDocuments.map((document) => {
                    const status =
                      statusConfig[document.status];

                    return (
                      <tr
                        key={document.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-6 py-5">
                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {document.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Créé le{" "}
                              {formatDate(document.created_at)}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {document.category}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          {document.department}
                        </td>

                        <td className="px-6 py-5 text-sm text-slate-600">
                          v{document.version}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                            />

                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {filteredDocuments.map((document) => {
                const status =
                  statusConfig[document.status];

                return (
                  <div
                    key={document.id}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {document.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {document.category}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {document.department}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.className}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${status.dot}`}
                        />

                        {status.label}
                      </span>
                    </div>

                    <div className="mt-4 flex gap-4 text-xs text-slate-500">
                      <span>
                        Version {document.version}
                      </span>

                      <span>
                        {formatDate(document.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Aucun document trouvé
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Essayez une autre recherche.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

