import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiTaskResponse } from '@/types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export async function generateTasks(projectDescription: string): Promise<GeminiTaskResponse[]> {
  try {
    const prompt = `You are a project planning assistant. Given a project description, generate 5-8 actionable tasks.

Project Description: "${projectDescription}"

Return ONLY a valid JSON array of tasks with this exact structure:
[
  {
    "title": "Task title (short, clear)",
    "description": "Detailed description of what needs to be done",
    "priority": "high" | "medium" | "low",
    "estimated_hours": number (optional, can be null)
  }
]

Requirements:
- Tasks should be specific and actionable
- Order tasks logically (foundational tasks first)
- Include realistic time estimates
- Priorities: "high" for critical/blocking, "medium" for important, "low" for nice-to-have
- Return ONLY the JSON array, no markdown formatting, no explanation`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up response (remove markdown code blocks if present)
    const cleanedText = text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const tasks = JSON.parse(cleanedText);
    
    // Validate response structure
    if (!Array.isArray(tasks)) {
      throw new Error('AI response is not an array');
    }
    
    return tasks;
  } catch (error) {
    console.error('Error generating tasks with Gemini:', error);
    
    // Fallback: return manual tasks if AI fails
    return [
      {
        title: `Research for ${projectDescription}`,
        description: 'Gather requirements and analyze project scope',
        priority: 'high',
        estimated_hours: 4
      },
      {
        title: 'Create project structure',
        description: 'Set up folders, dependencies, and initial files',
        priority: 'medium',
        estimated_hours: 2
      },
      {
        title: 'Implement core features',
        description: 'Build the main functionality based on requirements',
        priority: 'high',
        estimated_hours: 8
      }
    ];
  }
}

