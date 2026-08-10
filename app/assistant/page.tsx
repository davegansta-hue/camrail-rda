"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import AuthGuard from "@/components/AuthGuard";
import { apiFetch } from "@/lib/api";

type Citation = {
  document_title: string;
  page_start: number;
  page_end: number;
  excerpt: string;
};

type Message = {
  role: "user" | "assistant";
  content: string;
  confidence?: "high" | "medium" | "insufficient";
  citations?: Citation[];
};

const confidenceConfig = {
  high: {
    label: "élevée",
    className:
      "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700",
  },
  medium: {
    label: "moyenne",
    className:
      "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700",
  },
  insufficient: {
    label: "insuffisante",
    className:
      "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700",
  },
};

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Bonjour. Je suis l’assistant documentaire CAMRAIL. Posez-moi une question sur les documents disponibles.",
    },
  ]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || loading) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: trimmedQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await apiFetch("/assistant/query", {
        method: "POST",
        body: JSON.stringify({
          query: trimmedQuestion,
        }),
      });

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
          confidence: data.confidence,
          citations: data.citations ?? [],
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la recherche documentaire.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: errorMessage,
          confidence: "insufficient",
          citations: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-[calc(100vh-140px)] flex-col">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
              C
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                CAMRAIL AI
              </p>

              <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">
                Assistant documentaire
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Posez une question sur la documentation de l’entreprise.
              </p>
            </div>
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="space-y-6 p-4 sm:p-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "flex justify-end"
                    : "flex gap-3"
                }
              >
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
                    C
                  </div>
                )}

                <div className="max-w-3xl">
                  {/* Message */}
                  <div
                    className={
                      message.role === "user"
                        ? "rounded-2xl rounded-tr-md bg-red-600 p-4 text-white sm:p-5"
                        : "rounded-2xl rounded-tl-md bg-slate-50 p-4 sm:p-5"
                    }
                  >
                    <p
                      className={
                        message.role === "user"
                          ? "text-sm leading-7 text-white"
                          : "text-sm leading-7 text-slate-700"
                      }
                    >
                      {message.content}
                    </p>

                    {/* Confidence */}
                    {message.confidence && (
                      <div className="mt-4">
                        <span
                          className={
                            confidenceConfig[message.confidence].className
                          }
                        >
                          Confiance{" "}
                          {confidenceConfig[message.confidence].label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Citations */}
                  {message.citations &&
                    message.citations.length > 0 && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                          {message.citations.length > 1
                            ? "Sources"
                            : "Source"}
                        </p>

                        <div className="space-y-3">
                          {message.citations.map(
                            (citation, citationIndex) => (
                              <div
                                key={citationIndex}
                                className="rounded-xl border border-slate-200 bg-white p-4"
                              >
                                <p className="text-sm font-semibold text-slate-800">
                                  {citation.document_title}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                  {citation.page_start ===
                                  citation.page_end
                                    ? `Page ${citation.page_start}`
                                    : `Pages ${citation.page_start}-${citation.page_end}`}
                                </p>

                                <p className="mt-3 text-xs leading-5 text-slate-500">
                                  « {citation.excerpt} »
                                </p>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
                  C
                </div>

                <div className="rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-400">
                  Recherche dans les documents...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Posez votre question..."
                  rows={1}
                  disabled={loading}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 disabled:opacity-60"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white transition hover:bg-red-700 disabled:bg-slate-300"
                aria-label="Envoyer"
              >
                ↑
              </button>
            </form>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Les réponses sont générées à partir des documents autorisés.
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}