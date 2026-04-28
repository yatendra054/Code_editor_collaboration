import { ChatGroq } from "@langchain/groq";
import dotenv from "dotenv";

dotenv.config();

/**
 * AI Service for matching code and handling AI queries.
 */
class AIService {
  constructor() {
    this.model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
    });
  }

  /**
   * Generates a response from the AI based on user prompt and code context.
   * @param {string} prompt - User query.
   * @param {string} code - Current code in the editor.
   * @param {string} language - Current programming language.
   * @returns {Promise<{message: string, suggestedCode?: string}>}
   */
  async generateResponse(prompt, code, language) {
    if (!process.env.GROQ_API_KEY) {
      return { message: "Error: GROQ_API_KEY is not configured in the backend." };
    }

    try {
      const systemPrompt = `
You are an expert AI coding assistant for the "CodeSync" collaborative editor.
Your goal is to help users write, debug, and understand their code.

CURRENT CONTEXT:
Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

INSTRUCTIONS:
1. Provide clear, concise explanations.
2. If you suggest code changes, wrap the code in Triple Backticks with the language name.
3. Be helpful and professional.
4. If you are asked to "auto-generate" or "fix" code, provide the full relevant snippet.
      `;

      const response = await this.model.invoke([
        ["system", systemPrompt],
        ["human", prompt],
      ]);

      const content = response.content;
      const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
      const match = content.match(codeBlockRegex);
      const suggestedCode = match ? match[1].trim() : null;

      return {
        message: content.toString(),
        suggestedCode: suggestedCode,
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      return { message: "Error generating response from AI. Please try again later." };
    }
  }
}

export default new AIService();
