import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { KanbanBoard, Task } from "@/components/KanbanBoard";
import { useToast } from "@/hooks/use-toast";
import { getTasks, updateTaskStatus, updateTask, deleteTask } from "@/services/tasks";
import { useProjectStore } from "@/store/projectStore";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskDetailModal from "@/components/TaskDetailModal";

/**
 * PROJECT KANBAN PAGE
 * 
 * Purpose: Display Kanban board for a specific project
 * This page shows the drag-and-drop task board for ONE selected project.
 * The project ID comes from the URL parameter (:projectId).
 * 
 * Features:
 * - Loads tasks only for the selected project
 * - Displays existing KanbanBoard component
 * - "Back to My Projects" navigation button
 * - Syncs with Zustand store for consistent state
 */

const ProjectKanban = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Get selected project from Zustand store
  const selectedProject = useProjectStore((state) => state.selectedProject);

  // Load tasks for this project
  useEffect(() => {
    if (projectId) {
      loadTasks(projectId);
    }
  }, [projectId]);

  async function loadTasks(projectId: string) {
    try {
      setLoading(true);
      const loadedTasks = await getTasks(projectId);
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks for this project.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle task status updates (drag & drop)
  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error("Task move error:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
      // Reload tasks to reset to correct state
      if (projectId) loadTasks(projectId);
    }
  };

  // Handle task click to open detail modal
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // Handle task update from modal
  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    // Optimistic update
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );

    try {
      await updateTask(taskId, updates);
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error("Task update error:", error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
      // Reload tasks to reset to correct state
      if (projectId) loadTasks(projectId);
    }
  };

  // Handle task delete from modal
  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      // Remove from local state
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error("Task delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex animate-fade-in">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading project tasks...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex animate-fade-in">
      <AppSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Back Button + Header */}
          <div className="space-y-4 animate-fade-in">
            <Button
              variant="ghost"
              onClick={() => navigate('/my-tasks')}
              className="group gap-2 hover:gap-3 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Projects
            </Button>
            
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                {selectedProject?.name || "Project Tasks"}
              </h1>
              {selectedProject?.description && (
                <p className="text-muted-foreground text-lg">
                  {selectedProject.description}
                </p>
              )}
            </div>
          </div>

          {/* Kanban Board */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <KanbanBoard 
              tasks={tasks} 
              onTaskMove={handleTaskMove}
              onTaskClick={handleTaskClick}
            />
          </div>
        </div>
      </main>

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTask}
        open={isTaskModalOpen}
        onOpenChange={setIsTaskModalOpen}
        onUpdate={handleTaskUpdate}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default ProjectKanban;

