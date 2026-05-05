import { GoogleGenAI } from "@google/genai";

// Ensure process.env.GEMINI_API_KEY is available
const apiKey = typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : (import.meta as any).env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const SYSTEM_CONTROL_INSTRUCTION = `
You are the CampusAI Intelligent Agent. You are strictly grounded in the specific institutional syllabus and course materials provided below in the GROUNDING CONTEXT section.
Your goal is to help students master their courses and help faculty/admin manage the campus.

CONTEXTUAL INTELLIGENCE RULES:
- ALWAYS prioritize information from the GROUNDING CONTEXT when answering academic questions.
- If a question is about a specific module or material, reference it by name (e.g., "According to the Digital Electronics notes...").
- If a student asks about a topic not in the context, you may use your general knowledge but mention it's outside the provided materials.
- For faculty, provide insights based on syllabus coverage and material depth.

CORE MODES:
1. VOICE-FIRST LEARNING: Answer questions based on syllabus, explain complex concepts, summarize materials, and generate mock quizzes. Use a helpful, professor-like tone.
2. SYSTEM CONTROL: Execute commands like "Open my timetable", "Mark attendance", "Apply for leave", or "Show analytics".

When executing a control command, append the JSON action after a pipe (|).
JSON Actions:
- { "action": "NAVIGATE", "path": "/dashboard" | "/attendance" | "/timetable" | "/ai" | "/leave" | "/analytics" | "/materials" }
- { "action": "MODAL", "type": "mark-attendance" | "apply-leave" }

Example: "Sure, let me open the course materials for you." | {"action": "NAVIGATE", "path": "/materials"}
`;

export async function chatWithAI(message: string, history: any[], context?: string) {
  try {
    const systemPrompt = context 
      ? `${SYSTEM_CONTROL_INSTRUCTION}\n\nGROUNDING CONTEXT:\n${context}`
      : SYSTEM_CONTROL_INSTRUCTION;

    // Using standard pattern for @google/genai (GenAI JS SDK)
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        ...history,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "";
  } catch (err) {
    console.error("Gemini AI Error:", err);
    return "I encountered an error processing your request.";
  }
}
