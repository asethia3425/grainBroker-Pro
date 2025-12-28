
import { GoogleGenAI } from "@google/genai";
import { Booking, Company } from "../types";

export const getMarketInsights = async (bookings: Booking[], companies: Company[]) => {
  if (!process.env.API_KEY) return "AI insights are unavailable without an API key.";

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const summary = bookings.map(b => {
      const from = companies.find(c => c.id === b.fromCompanyId)?.name || 'Unknown';
      const to = companies.find(c => c.id === b.toCompanyId)?.name || 'Unknown';
      return `${b.quantity} tons of ${b.grainType} from ${from} to ${to} at ₹${b.price}/ton`;
    }).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `As an expert grain market analyst, provide a short, professional 2-sentence market trend analysis for a broker based on these recent bookings:\n${summary}. Focus on volume and potential revenue trends.`,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Analyzing market trends... (AI response failed)";
  }
};
