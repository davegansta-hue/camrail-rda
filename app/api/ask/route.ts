import { NextResponse } from "next/server";

type BackendCitation = {
  document_title: string;
  page_start: number;
  page_end: number;
  excerpt: string;
};

type BackendResponse = {
  request_id: string;
  query: string;
  answer: string;
  confidence: "high" | "medium" | "insufficient";
  citations: BackendCitation[];
  duration_ms: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const question = body.question;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        {
          error: "Une question est requise.",
        },
        {
          status: 400,
        },
      );
    }

    const backendUrl = process.env.BACKEND_URL;
    const serviceEmail = process.env.BACKEND_SERVICE_EMAIL;
    const servicePassword = process.env.BACKEND_SERVICE_PASSWORD;

    if (!backendUrl || !serviceEmail || !servicePassword) {
      throw new Error("Variables BACKEND manquantes dans .env.local");
    }

    console.log("1. Backend URL :", backendUrl);
    console.log("2. Tentative de connexion au backend...");

    const loginBody = new URLSearchParams({
      username: serviceEmail,
      password: servicePassword,
    });

    const loginResponse = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: loginBody.toString(),
    });

    console.log("3. Réponse login :", loginResponse.status);

    if (!loginResponse.ok) {
      throw new Error(
        `Authentification backend échouée (HTTP ${loginResponse.status})`,
      );
    }

    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    if (!accessToken) {
      throw new Error("Aucun access_token reçu du backend.");
    }

    console.log("4. Authentification réussie.");
    console.log("5. Envoi de la question au backend...");

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 30000);

    let assistantResponse: Response;

    try {
      assistantResponse = await fetch(`${backendUrl}/assistant/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          query: question,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    console.log("6. Réponse assistant :", assistantResponse.status);

    if (!assistantResponse.ok) {
      throw new Error(
        `Erreur du backend assistant (HTTP ${assistantResponse.status})`,
      );
    }

    const backendData: BackendResponse = await assistantResponse.json();

    console.log("7. Réponse backend reçue.");

    const confidenceMap = {
      high: "élevée",
      medium: "moyenne",
      insufficient: "insuffisante",
    } as const;

    const confidence =
      confidenceMap[backendData.confidence] ?? "insuffisante";

    const firstCitation = backendData.citations?.[0];

    const source = firstCitation
      ? {
          documentId: firstCitation.document_title,
          documentName: firstCitation.document_title,
          page: firstCitation.page_start,
          version: "1.0",
          excerpt: firstCitation.excerpt,
        }
      : null;

    return NextResponse.json({
      answer: backendData.answer,
      confidence,
      source,
    });
  } catch (error) {
    console.error("ERREUR /api/ask :", error);

    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json({
      answer: `DIAGNOSTIC : ${message}`,
      confidence: "insuffisante",
      source: null,
    });
  }
}