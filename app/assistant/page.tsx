"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

type Source = {
documentId: string;
documentName: string;
page: number;
version: string;
excerpt: string;
};

type Message = {
role: "user" | "assistant";
content: string;
confidence?: "élevée" | "moyenne" | "insuffisante";
source?: Source | null;
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
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question: trimmedQuestion,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  setMessages((current) => [
    ...current,
    {
      role: "assistant",
      content: data.answer,
      confidence: data.confidence,
      source: data.source,
    },
  ]);
} catch {
  setMessages((current) => [
    ...current,
    {
      role: "assistant",
      content:
        "Une erreur est survenue lors de la recherche documentaire.",
      confidence: "insuffisante",
      source: null,
    },
  ]);
} finally {
  setLoading(false);
}


}

return ( <main className="min-h-screen bg-slate-50 p-4 sm:p-6"> <header className="mx-auto mb-6 max-w-5xl"> <div className="flex items-center gap-3"> <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
C </div>


      <div>
        <p className="text-sm font-semibold text-red-600">
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
  </header>

  <section className="mx-auto flex min-h-[650px] max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-6 lg:p-8">
      {messages.map((message, index) => (
        <div key={index}>
          {message.role === "user" ? (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-br-md bg-red-600 px-4 py-3 text-sm text-white sm:max-w-2xl">
                {message.content}
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-600 text-sm font-bold text-white">
                C
              </div>

              <div className="max-w-3xl">
                <div className="rounded-2xl rounded-tl-md bg-slate-50 p-4 sm:p-5">
                  <p className="text-sm leading-7 text-slate-700">
                    {message.content}
                  </p>

                  {message.confidence && (
                    <div className="mt-4">
                      <span
                        className={
                          message.confidence === "élevée"
                            ? "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            : message.confidence === "moyenne"
                              ? "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                              : "inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                        }
                      >
                        Confiance {message.confidence}
                      </span>
                    </div>
                  )}
                </div>

                {message.source && (
                  <div className="mt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Source
                    </p>

                    <Link
                      href={`/documents/${message.source.documentId}#page-${message.source.page}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 transition hover:border-red-300 hover:bg-red-50"
                    >
                      <p className="text-sm font-semibold text-slate-800">
                        {message.source.documentName}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Page {message.source.page} · Version{" "}
                        {message.source.version}
                      </p>

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        « {message.source.excerpt} »
                      </p>

                      <p className="mt-3 text-xs font-semibold text-red-600">
                        Voir la source →
                      </p>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}

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

    <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
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
  </section>
</main>

);
}
