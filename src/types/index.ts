// Database Entity Types

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  order: number;
  estimated_hours: number | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  project_id: string;
  user_message: string;
  ai_response: string;
  created_at: string;
}

// API Response Types
export interface GeminiTaskResponse {
  title: string;
  description: string;
  priority: TaskPriority;
  estimated_hours?: number;
}

