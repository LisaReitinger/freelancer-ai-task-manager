import { AppSidebar } from "@/components/AppSidebar";

/**
 * PROJECTS PAGE
 * 
 * Purpose: AI-powered project creation interface
 * This page is focused entirely on creating NEW projects using AI.
 * Users will enter a project name and description, then AI generates tasks.
 * 
 * What will be added later:
 * - Project name input field
 * - AI description textarea
 * - "+ New Project" button
 * - Loading states during AI generation
 */

const Projects = () => {
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

          {/* Placeholder for Project Creation Form */}
          <div className="glass rounded-2xl p-8 border border-border/50">
            <p className="text-muted-foreground text-center py-12">
              Project creation form coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Projects;

