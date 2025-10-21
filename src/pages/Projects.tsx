import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectCreationForm } from "@/components/ProjectCreationForm";
import { useToast } from "@/hooks/use-toast";
import { createProject } from "@/services/projects";
import { generateTasks } from "@/services/gemini";
import { createTasks } from "@/services/tasks";
import { useProjectStore } from "@/store/projectStore";

/**
 * PROJECTS PAGE
 * 
 * Purpose: AI-powered project creation interface
 * This page is focused entirely on creating NEW projects using AI.
 * Users will enter a project name and description, then AI generates tasks.
 * 
 * Features:
 * ✅ Project name input field
 * ✅ AI description textarea
 * ✅ Loading states during AI generation
 * ✅ Supabase project creation
 * ✅ Gemini AI task generation (5-8 actionable tasks)
 * ✅ Automatic task persistence to database
 * ✅ Navigation to new project's Kanban board
 * ✅ Success toast notifications
 * 
 * Flow:
 * 1. User fills in project name and description
 * 2. Form calls handleCreateProject()
 * 3. Creates project record in Supabase
 * 4. Calls Gemini AI to analyze description and generate tasks
 * 5. Saves all generated tasks linked to the project
 * 6. Updates Zustand store with new project
 * 7. Navigates user to the project's Kanban board
 */

const Projects = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  
  // Get Zustand store function to set selected project
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);

  // Handler for form submission - Creates project and generates tasks with AI
  const handleCreateProject = async (projectName: string, projectDescription: string) => {
    setIsCreating(true);
    
   
    try {
      // STEP 1: Create project in Supabase
      console.log("Creating project in Supabase...");
      const newProject = await createProject(projectName, projectDescription);
      console.log("Project created:", newProject);
      
      // STEP 2: Generate tasks using Gemini AI
      console.log("Generating tasks with AI...");
      toast({
        title: "AI is thinking...",
        description: "Generating tasks from your project description",
      });
      
      const aiGeneratedTasks = await generateTasks(projectDescription);
      console.log("AI generated tasks:", aiGeneratedTasks);
      
      // STEP 3: Prepare tasks for database insertion
      const tasksToInsert = aiGeneratedTasks.map((aiTask, index) => ({
        project_id: newProject.id,
        title: aiTask.title,
        description: aiTask.description,
        status: "todo" as const,
        priority: aiTask.priority,
        order: index,
        estimated_hours: aiTask.estimated_hours || null,
      }));
      
      // STEP 4: Save tasks to Supabase
      console.log("Saving tasks to database...");
      await createTasks(tasksToInsert);
      console.log("Tasks saved successfully!");
      
      // STEP 5: Update Zustand store with the new project
      setSelectedProject(newProject);
      
      // STEP 6: Show success message
      toast({
        title: "✨ Project created successfully!",
        description: `Created "${projectName}" with ${aiGeneratedTasks.length} AI-generated tasks`,
      });
      
      // STEP 7: Navigate to the project's Kanban board
      setTimeout(() => {
        navigate(`/my-tasks/${newProject.id}`);
      }, 1000); // Small delay so user sees the success toast
      
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error creating project",
        description: error instanceof Error ? error.message : "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <div className="min-h-screen flex animate-fade-in">
      <AppSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              Create New Project
            </h1>
            <p className="text-muted-foreground text-lg">
              Describe your project idea and let AI generate a complete task list
            </p>
          </div>

          {/* Project Creation Form */}
          <ProjectCreationForm 
            onCreateProject={handleCreateProject}
            isLoading={isCreating}
          />
        </div>
      </main>
    </div>
  );
};

export default Projects;

