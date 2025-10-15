import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectCreationForm } from "@/components/ProjectCreationForm";
import { useToast } from "@/hooks/use-toast";

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
 * 
 * What will be connected in Task 3:
 * - Supabase project creation
 * - Gemini AI task generation
 * - Task persistence to database
 */

const Projects = () => {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

  // Handler for form submission (Task 3 will implement the actual logic)
  const handleCreateProject = async (projectName: string, projectDescription: string) => {
    setIsCreating(true);
    
    try {
      // TODO (Task 3): Implement actual project creation logic
      // 1. Create project in Supabase
      // 2. Call Gemini AI to generate tasks
      // 3. Save generated tasks linked to project
      
      console.log("Creating project:", { projectName, projectDescription });
      
      // Temporary success message
      toast({
        title: "Coming soon!",
        description: "Project creation will be implemented in Task 3",
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
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

