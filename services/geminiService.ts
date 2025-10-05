
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = "gemini-2.5-flash";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Un résumé global de la structure de la base de données en 2-3 phrases."
    },
    relationships: {
      type: Type.ARRAY,
      description: "Les relations identifiées entre les tables.",
      items: {
        type: Type.OBJECT,
        properties: {
          fromTable: { type: Type.STRING },
          fromColumn: { type: Type.STRING },
          toTable: { type: Type.STRING },
          toColumn: { type: Type.STRING },
          type: { type: Type.STRING, description: "Type de relation (ex: 'one-to-many')" },
          description: { type: Type.STRING, description: "Explication de la relation." }
        },
        required: ["fromTable", "fromColumn", "toTable", "toColumn", "type", "description"]
      }
    },
    keyVariables: {
      type: Type.ARRAY,
      description: "Les variables (colonnes) les plus importantes pour une analyse.",
      items: {
        type: Type.OBJECT,
        properties: {
          table: { type: Type.STRING },
          column: { type: Type.STRING },
          reason: { type: Type.STRING, description: "Pourquoi cette variable est importante." }
        },
        required: ["table", "column", "reason"]
      }
    }
  },
  required: ["summary", "relationships", "keyVariables"]
};

export const analyzeSchema = async (schema: string): Promise<AnalysisResult> => {
  const prompt = `Vous êtes un expert analyste de données. Analysez le schéma de base de données JSON suivant. Identifiez les relations entre les tables, les variables clés pour l'analyse, et fournissez un résumé. Répondez en français et structurez votre réponse selon le schéma JSON fourni. Schéma: ${schema}`;
  
  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });
  
  const jsonText = response.text;
  return JSON.parse(jsonText) as AnalysisResult;
};

export const suggestQuestions = async (schema: string): Promise<string[]> => {
  const prompt = `Vous êtes un mentor pour analystes de données. Basé sur le schéma suivant, générez 5 questions pertinentes et actionnables en français qu'un analyste devrait explorer pour trouver des insights business. Ne générez que les questions. Répondez avec un tableau JSON de chaînes de caractères. Schéma: ${schema}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
    },
  });

  const jsonText = response.text;
  return JSON.parse(jsonText) as string[];
};

export const interpretQueryResults = async (query: string, schema: string): Promise<string> => {
  const prompt = `Vous êtes un analyste de données senior. Un analyste junior a écrit la requête SQL suivante. Expliquez en français ce que cette requête cherche à accomplir, quels types d'insights elle pourrait révéler, et suggérez une prochaine étape logique dans l'analyse. Soyez un mentor, pas seulement un validateur.
  Schéma de la BDD :
  ${schema}

  Requête de l'analyste :
  ${query}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};


export const checkQueryCoherence = async (query: string, schema: string): Promise<string> => {
    const prompt = `Vous êtes un expert SQL et un mentor pour analyste de données. Vérifiez la cohérence et la logique de la requête SQL suivante par rapport au schéma de base de données fourni. Donnez votre feedback en français. Indiquez si la logique est saine, si les jointures sont correctes, et s'il existe une meilleure façon de l'écrire. Soyez constructif.
    
    Schéma de la BDD :
    ${schema}

    Requête à vérifier :
    ${query}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    return response.text;
};
