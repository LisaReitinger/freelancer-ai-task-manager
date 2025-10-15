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
import { useProjectStore } from "@/store/projectStore";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ZUSTAND: Get selected project from global store
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);

  // Initialize: Check auth and set up default project
  useEffect(() => {
    initializeApp();
  }, []);
  
  // Load tasks whenever selected project changes
  useEffect(() => {
    if (selectedProject) {
      loadTasksForProject(selectedProject.id);
    } else {
      setTasks([]); // Clear tasks if no project selected
    }
  }, [selectedProject]);

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
      
      // Set project in Zustand store (this triggers task loading via useEffect)
      setSelectedProject(currentProject);
      console.log('Project set in store:', currentProject.name);
      
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
  
  // Load tasks for a specific project
  async function loadTasksForProject(projectId: string) {
    try {
      console.log('Loading tasks for project:', projectId);
      const loadedTasks = await getTasks(projectId);
      console.log('Loaded tasks:', loadedTasks);
      setTasks(loadedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks for this project.",
        variant: "destructive",
      });
    }
  }

  const handleGenerateTasks = async (projectIdea: string) => {
    if (!selectedProject) {
      toast({
        title: "No project selected",
        description: "Please select a project from the sidebar first.",
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
        project_id: selectedProject.id,
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
            {selectedProject && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.15s" }}>
                <span>Currently viewing:</span>
                <span className="font-semibold text-primary">{selectedProject.name}</span>
              </div>
            )}
          </div>

          {/* No Project Selected State */}
          {!selectedProject ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">No Project Selected</h2>
                <p className="text-muted-foreground max-w-md">
                  Select a project from the sidebar to view its tasks, or create a new project to get started.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Task Input */}
              <div style={{ animationDelay: "0.2s" }}>
                <TaskInput onGenerate={handleGenerateTasks} />
              </div>

              {/* Kanban Board */}
              <div style={{ animationDelay: "0.3s" }}>
                <KanbanBoard tasks={tasks} onTaskMove={handleTaskMove} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
