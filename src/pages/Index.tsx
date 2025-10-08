import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TaskInput } from "@/components/TaskInput";
import { KanbanBoard, Task } from "@/components/KanbanBoard";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design landing page",
      description: "Create wireframes and mockups for the new landing page",
      status: "in-progress",
      priority: "high",
    },
    {
      id: "2",
      title: "Set up database",
      description: "Configure PostgreSQL and create initial schema",
      status: "todo",
      priority: "high",
    },
    {
      id: "3",
      title: "Write documentation",
      description: "Document API endpoints and usage examples",
      status: "todo",
      priority: "medium",
    },
    {
      id: "4",
      title: "Deploy to production",
      description: "Configure CI/CD pipeline and deploy app",
      status: "done",
      priority: "low",
    },
  ]);

  const handleGenerateTasks = (projectIdea: string) => {
    toast({
      title: "AI is thinking...",
      description: "Generating tasks from your project idea",
    });

    // Simulate AI task generation
    setTimeout(() => {
      const newTasks: Task[] = [
        {
          id: Date.now().toString(),
          title: `Research for ${projectIdea}`,
          description: "Gather requirements and analyze project scope",
          status: "todo",
          priority: "high",
        },
        {
          id: (Date.now() + 1).toString(),
          title: "Create project structure",
          description: "Set up folders, dependencies, and initial files",
          status: "todo",
          priority: "medium",
        },
        {
          id: (Date.now() + 2).toString(),
          title: "Implement core features",
          description: "Build the main functionality based on requirements",
          status: "todo",
          priority: "high",
        },
      ];

      setTasks([...tasks, ...newTasks]);
      
      toast({
        title: "Tasks generated!",
        description: `Created ${newTasks.length} new tasks for your project`,
      });
    }, 1500);
  };

  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

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
