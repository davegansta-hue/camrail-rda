"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { apiFetch } from "@/lib/api";

type DashboardSummary = {
  documents_total: number;
  documents_by_status: Record<string, number>;
  documents_active: number;
  questions_total: number;
  questions_today: number;
  confidence_breakdown: Record<string, number>;
  recent_audit_count: number;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);
        const data = await apiFetch("/dashboard/summary");
        setSummary(data as DashboardSummary);
      } catch (err) {
        setError("Impossible de charger les données du tableau de bord.");
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  return (
    <AuthGuard>
      <div className="max-w-6xl mx-auto pb-12">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-camrail-red mb-1">
            CAMRAIL RailMind
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Tableau de Bord
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-2xl">
            Aperçu global de l'activité de l'assistant IA et du système de gestion documentaire.
          </p>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-16 flex flex-col items-center justify-center shadow-sm">
            <div className="h-8 w-8 rounded-full border-2 border-camrail-red border-t-transparent animate-spin mb-4"></div>
            <p className="text-sm font-medium text-slate-500">Chargement des statistiques...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
            <p className="text-sm font-bold text-red-700">Erreur de chargement</p>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {!loading && !error && summary && (
          <div className="space-y-6">
            
            {/* Section IA */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-camrail-red"></span>
                Activité de l'Assistant IA
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-camrail-red transition-colors">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Requêtes (Aujourd'hui)</p>
                  <p className="text-4xl font-bold text-slate-900">{summary.questions_today}</p>
                  <p className="text-xs text-slate-400 mt-2">Sur un total historique de {summary.questions_total}</p>
                </div>
                
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-4">Score de confiance global</p>
                  <div className="flex flex-col sm:flex-row gap-4 h-full">
                    <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-100 p-4">
                      <p className="text-xs font-semibold text-emerald-700 uppercase">Élevé</p>
                      <p className="text-2xl font-bold text-emerald-800 mt-1">{summary.confidence_breakdown["high"] || 0}</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-amber-50 border border-amber-100 p-4">
                      <p className="text-xs font-semibold text-amber-700 uppercase">Moyen</p>
                      <p className="text-2xl font-bold text-amber-800 mt-1">{summary.confidence_breakdown["medium"] || 0}</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-red-50 border border-red-100 p-4">
                      <p className="text-xs font-semibold text-red-700 uppercase">Insuffisant (Abstention)</p>
                      <p className="text-2xl font-bold text-red-800 mt-1">{summary.confidence_breakdown["insufficient"] || 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section Documents & Système */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                  Référentiel Documentaire
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Documents Actifs</p>
                    <p className="text-3xl font-bold text-slate-900">{summary.documents_active}</p>
                    <p className="text-xs text-slate-400 mt-2">Prêts pour la recherche</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-1">Documents au total</p>
                    <p className="text-3xl font-bold text-slate-700">{summary.documents_total}</p>
                    <p className="text-xs text-slate-400 mt-2">Tous statuts confondus</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-800"></span>
                  Sécurité & Audit
                </h2>
                <div className="rounded-xl border border-slate-200 bg-slate-900 text-white p-5 shadow-sm h-[124px] flex flex-col justify-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400 mb-1 relative z-10">Activité (24h)</p>
                  <p className="text-3xl font-bold text-white relative z-10">{summary.recent_audit_count}</p>
                  <p className="text-xs text-slate-400 mt-2 relative z-10">Événements d'audit sécurisés</p>
                </div>
              </div>

            </div>

          </div>
        )}
      </div>
    </AuthGuard>
  );
}