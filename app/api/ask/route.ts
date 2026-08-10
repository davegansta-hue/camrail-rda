import { NextResponse } from "next/server";
import { searchDemoKnowledgeBase } from "@/lib/demo-rag";

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

    const result = searchDemoKnowledgeBase(question);

    if (!result) {
      return NextResponse.json({
        answer:
          "Je n'ai pas trouvé d'information suffisamment pertinente dans les documents disponibles.",
        confidence: "insuffisante",
        source: null,
      });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      {
        error: "Une erreur est survenue lors du traitement de la question.",
      },
      {
        status: 500,
      },
    );
  }
}