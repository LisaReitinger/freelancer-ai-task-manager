import { supabase } from '@/lib/supabase';
import { Task } from '@/types';

// Create a new task
export async function createTask(task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Create multiple tasks at once
export async function createTasks(tasks: Omit<Task, 'id' | 'created_at' | 'updated_at'>[]) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(tasks)
    .select();

  if (error) throw error;
  return data;
}

// Get all tasks for a project
export async function getTasks(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('order', { ascending: true });

  if (error) throw error;
  return data as Task[];
}

// Update task status (for drag-and-drop)
export async function updateTaskStatus(taskId: string, status: Task['status']) {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update entire task
export async function updateTask(taskId: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a task
export async function deleteTask(taskId: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
}

