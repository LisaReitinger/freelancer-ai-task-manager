import { AppSidebar } from "@/components/AppSidebar";

/**
 * MY TASKS PAGE
 * 
 * Purpose: Project dashboard - shows all user's projects as cards
 * This page displays an overview of ALL projects created by the user.
 * Clicking a project card will navigate to its Kanban board.
 * 
 * What will be added later:
 * - Fetch all projects from Supabase
 * - Display projects as a grid of cards
 * - Loading skeletons
 * - Empty state ("No projects yet")
 * - Click handler to navigate to project Kanban board
 */

const MyTasks = () => {
  return (
    <div className="min-h-screen flex animate-fade-in">
      <AppSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
              My Projects
            </h1>
            <p className="text-muted-foreground text-lg">
              View and manage all your AI-generated projects
            </p>
          </div>

          {/* Placeholder for Project Cards Grid */}
          <div className="glass rounded-2xl p-8 border border-border/50">
            <p className="text-muted-foreground text-center py-12">
              Project cards grid coming soon...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyTasks;

