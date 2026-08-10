export type RagResult = {
  answer: string;
  confidence: "élevée" | "moyenne" | "insuffisante";
  source: {
    documentId: string;
    documentName: string;
    page: number;
    version: string;
    excerpt: string;
  };
};

type KnowledgeItem = {
  keywords: string[];
  answer: string;
  page: number;
  excerpt: string;
};

const knowledgeBase: KnowledgeItem[] = [
  {
    keywords: [
      "règles",
      "regles",
      "sécurité",
      "securite",
      "règles générales",
      "regles generales",
    ],
    answer:
      "Tout personnel doit respecter les règles et procédures de sécurité applicables à son activité et signaler toute situation susceptible de présenter un risque.",
    page: 7,
    excerpt:
      "Tout personnel doit respecter les règles et procédures de sécurité applicables à son activité et signaler toute situation susceptible de présenter un risque.",
  },

  {
    keywords: [
      "situation dangereuse",
      "danger",
      "risque",
      "signaler",
      "signalement",
    ],
    answer:
      "Toute situation susceptible de compromettre la sécurité des personnes, des installations ou des circulations doit être signalée immédiatement.",
    page: 6,
    excerpt:
      "Toute situation susceptible de compromettre la sécurité des personnes, des installations ou des circulations doit être signalée immédiatement.",
  },

  {
    keywords: [
      "équipement",
      "equipement",
      "équipements",
      "equipements",
      "protection",
      "epi",
    ],
    answer:
      "Les équipements de protection individuelle prévus pour une activité doivent être utilisés conformément aux instructions applicables.",
    page: 5,
    excerpt:
      "Les équipements de protection individuelle prévus pour une activité doivent être utilisés conformément aux instructions applicables.",
  },

  {
    keywords: [
      "formation",
      "formations",
      "sensibilisation",
    ],
    answer:
      "Le personnel doit recevoir les informations et formations nécessaires à l'exercice de ses missions dans des conditions garantissant la sécurité.",
    page: 9,
    excerpt:
      "Le personnel doit recevoir les informations et formations nécessaires à l'exercice de ses missions dans des conditions garantissant la sécurité.",
  },
];

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchDemoKnowledgeBase(
  question: string,
): RagResult | null {
  const normalizedQuestion = normalize(question);

  let bestMatch: KnowledgeItem | null = null;
  let bestScore = 0;

  for (const item of knowledgeBase) {
    let score = 0;

    for (const keyword of item.keywords) {
      const normalizedKeyword = normalize(keyword);

      if (normalizedQuestion.includes(normalizedKeyword)) {
        score++;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  if (!bestMatch) {
    return null;
  }

  return {
    answer: bestMatch.answer,
    confidence: bestScore >= 2 ? "élevée" : "moyenne",
    source: {
      documentId: "politique-securite-001",
      documentName: "Politique de sécurité ferroviaire",
      page: bestMatch.page,
      version: "1.2",
      excerpt: bestMatch.excerpt,
    },
  };
}