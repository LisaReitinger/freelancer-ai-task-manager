import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskInput } from "@/components/TaskInput";
import { KanbanBoard, Task } from "@/components/KanbanBoard";
import { useToast } from "@/hooks/use-toast";
import { generateTasks } from "@/services/gemini";
import { supabase } from "@/lib/supabase";
import { createProject, getProjects } from "@/services/projects";
import { getTasks, createTasks, updateTaskStatus } from "@/services/tasks";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize: Sign in anonymously and get/create project
  useEffect(() => {
    initializeApp();
  }, []);

  async function initializeApp() {
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Not authenticated, redirect to auth page
        navigate('/auth');
        return;
      }
      
      // Check if user has a project, or create one
      console.log('Fetching projects...');
      const projects = await getProjects();
      console.log('Projects:', projects);
      
      let currentProject;
      if (projects.length === 0) {
        // Create default project
        currentProject = await createProject(
          "My Tasks",
          "Demo project for AI task generation"
        );
        toast({
          title: "Welcome! 👋",
          description: "Your demo project has been created",
        });
      } else {
        currentProject = projects[0];
      }
      
      setProjectId(currentProject.id);
      console.log('Project ID set:', currentProject.id);
      
      // Load tasks for this project
      console.log('Loading tasks...');
      const loadedTasks = await getTasks(currentProject.id);
      console.log('Loaded tasks:', loadedTasks);
      setTasks(loadedTasks);
      
    } catch (error) {
      console.error("Initialization error:", error);
      toast({
        title: "Error",
        description: "Failed to initialize app. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateTasks = async (projectIdea: string) => {
    if (!projectId) {
      toast({
        title: "Error",
        description: "No project found. Please refresh the page.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "AI is thinking...",
      description: "Generating tasks from your project idea",
    });

    try {
      // Call Gemini AI to generate tasks
      const aiTasks = await generateTasks(projectIdea);
      
      // Convert AI response to Task format for database
      const newTasksForDb = aiTasks.map((aiTask, index) => ({
        project_id: projectId,
        title: aiTask.title,
        description: aiTask.description,
        status: "todo" as const,
        priority: aiTask.priority,
        order: tasks.length + index,
        estimated_hours: aiTask.estimated_hours || null,
      }));

      // Save to database
      const savedTasks = await createTasks(newTasksForDb);
      
      // Update local state
      setTasks([...tasks, ...savedTasks]);
      
      toast({
        title: "Tasks generated!",
        description: `Created ${savedTasks.length} new tasks for your project`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate tasks. Please try again.",
        variant: "destructive",
      });
      console.error("Task generation error:", error);
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: Task["status"]) => {
    try {
      // Update in database
      await updateTaskStatus(taskId, newStatus);
      
      // Update local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Task move error:", error);
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex animate-fade-in">
      <AppSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Freelancer AI Task Manager
            </h1>
            <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Let AI transform your ideas into organized tasks
            </p>
          </div>

          {/* Task Input */}
          <div style={{ animationDelay: "0.2s" }}>
            <TaskInput onGenerate={handleGenerateTasks} />
          </div>

          {/* Kanban Board */}
          <div style={{ animationDelay: "0.3s" }}>
            <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
