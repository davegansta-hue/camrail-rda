
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { apiFetch } from "@/lib/api";

type DocumentPage = {
  id: string;
  page_number: number;
  extracted_text: string;
  extraction_method: string;
};

type DocumentDetail = {
  id: string;
  title: string;
  category: string;
  department: string;
  version: string;
  status: "processing" | "indexed" | "active" | "failed";
  checksum: string;
  uploaded_by: string;
  created_at: string;
  pages: DocumentPage[];
};

export default function DocumentViewerPage() {
  const params = useParams();
  const documentId = String(params.id);

  const [document, setDocument] =
    useState<DocumentDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [linkedPageNumber, setLinkedPageNumber] = useState<number | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocument() {
      try {
        setLoading(true);
        setError("");

        const data = await apiFetch(
          `/documents/${documentId}`,
        );

        setDocument(data as DocumentDetail);

        // Fetch file blob
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        let token = "";
        if (typeof window !== "undefined") {
          const { getAccessToken, getSession } = require("@/lib/auth");
          token = getAccessToken() || getSession()?.token || "";
        }

        try {
          const fileRes = await fetch(`${apiUrl}/documents/${documentId}/file`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
          if (fileRes.ok) {
            const rawBlob = await fileRes.blob();
            const contentType = fileRes.headers.get("content-type") || "application/pdf";
            const blob = new Blob([rawBlob], { type: contentType });
            setFileUrl(URL.createObjectURL(blob));
          } else {
            const errData = await fileRes.json().catch(() => ({}));
            setFileError(errData.detail || `Erreur serveur ${fileRes.status}`);
          }
        } catch (e) {
          console.error("Failed to load document file", e);
          setFileError(e instanceof Error ? e.message : "Erreur de connexion");
        }

        // Extract page number from URL hash (e.g., #page-5)
        if (typeof window !== "undefined") {
          const hash = window.location.hash;
          const pageMatch = hash.match(/page-(\d+)/);
          if (pageMatch) {
            setLinkedPageNumber(parseInt(pageMatch[1], 10));
          }
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de charger le document.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadDocument();
  }, [documentId]);

  return (
    <AuthGuard>
      <div>
        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-sm text-slate-500">
              Chargement du document...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-sm font-semibold text-red-700">
              Impossible de charger le document
            </p>

            <p className="mt-2 text-xs text-red-600">
              {error}
            </p>

            <Link
              href="/documents"
              className="mt-4 inline-flex rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Retour aux documents
            </Link>
          </div>
        )}

        {/* Document */}
        {!loading && !error && document && (
          <>
            {/* Header */}
            <div className="mb-6">
              <Link
                href="/documents"
                className="text-sm font-semibold text-red-600 transition hover:text-red-700"
              >
                ← Retour aux documents
              </Link>

              <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Document · {document.id}
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                    {document.title}
                  </h1>

                  <p className="mt-1 text-sm text-slate-500">
                    Version {document.version} ·{" "}
                    {document.pages.length} pages ·{" "}
                    {document.department}
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
                >
                  Télécharger
                </button>
              </div>
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
                    {document.pages.map((page) => (
                      <a
                        key={page.id}
                        href={`#page-${page.page_number}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-red-600"
                      >
                        <span>
                          Page {page.page_number}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Document File Viewer */}
              <section className="rounded-2xl border border-slate-200 bg-slate-100 p-3 sm:p-5 h-[800px] flex flex-col">
                <div className="flex-1 w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
                  {fileUrl ? (
                    <iframe src={fileUrl} className="w-full h-full border-0" title="Visionneuse de document" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-slate-400 flex-col gap-3">
                      {loading ? (
                        <p>Chargement du document...</p>
                      ) : (
                        <div>
                          <p>Impossible d'afficher le document original.</p>
                          {fileError && <p className="text-xs text-red-500 mt-2">Détail : {fileError}</p>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}

