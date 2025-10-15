import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { ProjectCard } from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";
import { getProjects, deleteProject } from "@/services/projects";
import { getTasks } from "@/services/tasks";
import { Project } from "@/types";
import { useProjectStore } from "@/store/projectStore";
import { Plus, FolderOpen, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * MY TASKS PAGE
 * 
 * Purpose: Project dashboard - shows all user's projects as cards
 * This page displays an overview of ALL projects created by the user.
 * Clicking a project card will navigate to its Kanban board.
 * 
 * Features:
 * ✅ Fetch all projects from Supabase
 * ✅ Display projects as a responsive grid of cards
 * ✅ Loading skeletons for better UX
 * ✅ Empty state with "Create Project" CTA
 * ✅ Click handler to navigate to project Kanban board
 * ✅ Show task counts and completion status
 * ✅ Display creation dates
 */

interface ProjectWithStats extends Project {
  taskCount: number;
  completedCount: number;
}

const MyTasks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<ProjectWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectToDelete, setProjectToDelete] = useState<ProjectWithStats | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get Zustand store functions
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch projects and their task counts
  async function loadProjects() {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      
      // For each project, get its task count and completion status
      const projectsWithStats = await Promise.all(
        fetchedProjects.map(async (project) => {
          try {
            const tasks = await getTasks(project.id);
            const completedTasks = tasks.filter(task => task.status === 'done');
            
            return {
              ...project,
              taskCount: tasks.length,
              completedCount: completedTasks.length,
            };
          } catch (error) {
            console.error(`Error loading tasks for project ${project.id}:`, error);
            return {
              ...project,
              taskCount: 0,
              completedCount: 0,
            };
          }
        })
      );
      
      setProjects(projectsWithStats);
    } catch (error) {
      console.error("Error loading projects:", error);
      toast({
        title: "Error loading projects",
        description: "Failed to load your projects. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // Handle project card click
  function handleProjectClick(project: Project) {
    setSelectedProject(project);
    navigate(`/my-tasks/${project.id}`);
  }

  // Handle create project button click
  function handleCreateProject() {
    navigate('/projects');
  }

  // Handle delete button click - opens confirmation dialog
  function handleDeleteClick(project: ProjectWithStats) {
    // Prevent deleting the currently active project
    if (selectedProject?.id === project.id) {
      toast({
        title: "Cannot delete active project",
        description: "Please close this project's Kanban board before deleting it.",
        variant: "destructive",
      });
      return;
    }
    
    setProjectToDelete(project);
  }

  // Handle confirmed deletion
  async function handleConfirmDelete() {
    if (!projectToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Delete from Supabase (cascade deletes tasks automatically)
      await deleteProject(projectToDelete.id);
      
      // Optimistically remove from UI
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      
      // Show success message
      toast({
        title: "Project deleted",
        description: `"${projectToDelete.name}" and all its tasks have been deleted.`,
      });
      
      // Close dialog
      setProjectToDelete(null);
      
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error deleting project",
        description: error instanceof Error ? error.message : "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  // Handle dialog cancel
  function handleCancelDelete() {
    setProjectToDelete(null);
  }
  return (
    <div className="min-h-screen flex animate-fade-in">
      <AppSidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                My Projects
              </h1>
              <p className="text-muted-foreground text-lg">
                View and manage all your AI-generated projects
              </p>
            </div>
            <Button
              onClick={handleCreateProject}
              size="lg"
              variant="gradient"
              className="gap-2"
            >
              <Plus className="w-5 h-5" />
              New Project
            </Button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="glass rounded-2xl p-6 border border-border/50 animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted/30" />
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-muted/30 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-muted/30 rounded w-full" />
                    <div className="h-4 bg-muted/30 rounded w-5/6" />
                  </div>
                  <div className="flex gap-4 mb-4">
                    <div className="h-4 bg-muted/30 rounded w-20" />
                    <div className="h-4 bg-muted/30 rounded w-24" />
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade-in">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                <FolderOpen className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-bold">No Projects Yet</h2>
                <p className="text-muted-foreground text-lg">
                  Start your journey by creating your first AI-powered project. Describe your idea, and let AI generate a complete task list for you!
                </p>
              </div>
              <Button
                onClick={handleCreateProject}
                size="lg"
                variant="gradient"
                className="gap-2 h-14 px-8 text-base"
              >
                <Plus className="w-5 h-5" />
                Create Your First Project
              </Button>
            </div>
          )}

          {/* Project Cards Grid */}
          {!loading && projects.length > 0 && (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProjectCard
                    project={project}
                    taskCount={project.taskCount}
                    completedCount={project.completedCount}
                    onClick={() => handleProjectClick(project)}
                    onDelete={() => handleDeleteClick(project)}
                    isDeleting={isDeleting && projectToDelete?.id === project.id}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && handleCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Delete Project?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to delete <span className="font-semibold text-foreground">"{projectToDelete?.name}"</span>?
              </p>
              <p className="text-sm">
                This will permanently delete:
              </p>
              <ul className="text-sm list-disc list-inside space-y-1 text-muted-foreground">
                <li>The project</li>
                <li>All {projectToDelete?.taskCount || 0} tasks in this project</li>
                <li>All project data and history</li>
              </ul>
              <p className="text-destructive font-semibold text-sm mt-4">
                This action cannot be undone!
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete Project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyTasks;

