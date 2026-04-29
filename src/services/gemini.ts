import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async translateText(text: string, targetLanguage: string) {
    if (!process.env.GEMINI_API_KEY) return text;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Translate the following text to ${targetLanguage}. Return ONLY the translated text.\n\nText: ${text}`,
      });
      return response.text?.trim() || text;
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  },

  async draftEscalationEmail(reportTitle: string, reportDescription: string, authorityName: string, authorityDept: string, language: string = "English") {
    if (!process.env.GEMINI_API_KEY) return "AI Escalation requires a Gemini API Key.";
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `
          Draft a professional and persuasive formal email to a local authority regarding a community issue.
          
          Authority Name: ${authorityName}
          Department: ${authorityDept}
          Issue Title: ${reportTitle}
          Description: ${reportDescription}
          Target Language: ${language}
          
          The email should:
          1. State the problem clearly.
          2. Mention that it has gained significant community support.
          3. Request an immediate inspection or resolution.
          4. Maintain a respectful but firm civic tone.
          
          Return ONLY the email content.
        `,
      });
      return response.text?.trim();
    } catch (error) {
      console.error("Escalation draft error:", error);
      return "Failed to draft escalation email.";
    }
  },

  async analyzeVoterID(input: string) {
    if (!process.env.GEMINI_API_KEY) return { roadmap: "Voter ID Assistant requires API key." };
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              roadmap: { type: Type.ARRAY, items: { type: Type.STRING } },
              isEligible: { type: Type.BOOLEAN },
              nextStep: { type: Type.STRING }
            },
            required: ["roadmap", "isEligible", "nextStep"]
          }
        },
        contents: `Analyze this user's situation regarding getting a Voter ID: "${input}". 
        Provide a step-by-step roadmap for them to get their Voter ID in India. 
        Determine their eligibility based on the input. 
        Specify the immediate next step.`,
      });
      return JSON.parse(response.text || "{}");
    } catch (error) {
      console.error("Voter ID analysis error:", error);
      return { roadmap: ["Consult your local election office."], isEligible: true, nextStep: "Visit NVSP portal." };
    }
  }
};
