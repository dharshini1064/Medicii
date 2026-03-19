import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

let openai: OpenAI | null = null;

const getOpenAI = () => {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

export class AIService {
  async generateSchedule(prompt: string) {
    // If no API key, use fallback / mock
    if (!process.env.OPENAI_API_KEY) {
      return this.mockGenerateSchedule(prompt);
    }

    const agent = getOpenAI();
    if (!agent) {
      return this.mockGenerateSchedule(prompt);
    }

    const response = await agent.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI Medication Schedule Assistant. 
          Goal: Parse user input about medicines and suggest a structured schedule.
          Rule 1: Never change user-specified dosage.
          Rule 2: Never give medical advice.
          Rule 3: Always append "Ask doctor/pharmacist before acting on this"
          Rule 4: Suggest common times (e.g. 08:00 for morning, 20:00 for evening).
          Output format: JSON { draftSchedule: [{ medicine, dosage, timeOfDay, frequency, daysOfWeek }], explanation, warnings }`
        },
        { role: "user", content: prompt }
      ]
    });

    try {
      const content = response.choices[0].message.content;
      return JSON.parse(content as string);
    } catch (error) {
       return { error: "Failed to parse AI response" };
    }
  }

  private mockGenerateSchedule(prompt: string) {
    // A simple mock for demonstration when no key is present
    return {
      draftSchedule: [
        {
          name: "Sample Med",
          dosage: "10mg",
          timeOfDay: "08:00",
          frequency: "Daily",
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          mealTiming: "After breakfast"
        }
      ],
      explanation: "Suggestion based on typical morning routine.",
      warnings: ["No interactions detected in sample."],
      requiresApproval: true,
      disclaimer: "Ask doctor/pharmacist before acting on this"
    };
  }
}
