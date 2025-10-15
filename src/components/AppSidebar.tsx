import { LayoutDashboard, Sparkles, Settings, ChevronLeft, ChevronRight, LogOut, FolderOpen, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getProjects } from "@/services/projects";
import { Project } from "@/types";
import { useProjectStore } from "@/store/projectStore";

const navItems = [
  { title: "Create Project", icon: Plus, url: "/projects" },
  { title: "My Tasks", icon: LayoutDashboard, url: "/my-tasks" },
  { title: "AI Assistant", icon: Sparkles, url: "/ai-assistant" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [collapsed, setCollapsed] = useState(false);
  
  // STATE: Store projects and loading state
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  // ZUSTAND: Get selected project and the function to update it
  const selectedProject = useProjectStore((state) => state.selectedProject);
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
  
  // FUNCTION: Fetch projects from Supabase
  async function fetchProjects() {
    try {
      setLoadingProjects(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error: unknown) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error loading projects",
        description: "Could not load your projects. Please refresh.",
        variant: "destructive",
      });
    } finally {
      setLoadingProjects(false);
    }
  }
  
  // EFFECT: Fetch all projects when component mounts
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  // FUNCTION: Handle project selection
  function handleProjectClick(project: Project) {
    setSelectedProject(project);
    // Navigate to the project's Kanban board
    navigate(`/my-tasks/${project.id}`);
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
      navigate('/auth');
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <aside
      className={cn(
        "glass-strong h-screen sticky top-0 transition-all duration-300 ease-in-out flex flex-col border-r border-border/50",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                TaskAI
              </h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 border-b border-border/50">
        {navItems.map((item, index) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              cn(
                "group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300",
                "hover:bg-muted/50 hover:scale-[1.02]",
                "glass hover:shadow-3d",
                isActive && "bg-primary/10 text-primary border border-primary/20 glow-strong shadow-3d-strong"
              )
            }
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-all duration-300",
              "group-hover:animate-icon-bounce group-hover:text-primary"
            )} />
            {!collapsed && (
              <span className="font-medium transition-all duration-300 group-hover:text-primary">
                {item.title}
                {/* Show project count next to "My Tasks" */}
                {item.title === "My Tasks" && !loadingProjects && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({projects.length})
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Projects List Section */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!collapsed && (
          <div className="space-y-3">
            <div className="px-2 pt-2">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Your Projects
              </h2>
              <div className="h-px bg-gradient-to-r from-primary/50 to-transparent mt-2" />
            </div>
            
            {/* Loading State */}
            {loadingProjects && (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-10 rounded-lg bg-muted/20 animate-pulse" />
                ))}
              </div>
            )}
            
            {/* Empty State */}
            {!loadingProjects && projects.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No projects yet</p>
                <p className="text-xs mt-1">Create one to get started!</p>
              </div>
            )}
            
            {/* Project List */}
            {!loadingProjects && projects.length > 0 && (
              <div className="space-y-1 px-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectClick(project)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-md transition-all duration-200",
                      "hover:bg-muted/30 group relative",
                      "border border-transparent",
                      selectedProject?.id === project.id 
                        ? "bg-primary/5 border-primary/30 shadow-sm" 
                        : "hover:border-border/30"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all duration-200",
                        selectedProject?.id === project.id 
                          ? "bg-primary scale-125" 
                          : "bg-muted-foreground/30 group-hover:bg-primary/50"
                      )} />
                      <FolderOpen className={cn(
                        "w-3.5 h-3.5 flex-shrink-0 transition-all duration-200",
                        selectedProject?.id === project.id 
                          ? "text-primary" 
                          : "text-muted-foreground/60 group-hover:text-primary/70"
                      )} />
                      <span className={cn(
                        "font-medium text-sm truncate transition-colors duration-200",
                        selectedProject?.id === project.id 
                          ? "text-primary" 
                          : "text-foreground group-hover:text-primary/90"
                      )}>
                        {project.name}
                      </span>
                    </div>
                    {project.description && (
                      <p className="text-xs text-muted-foreground/70 mt-1 truncate ml-7">
                        {project.description}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Collapsed State - Show only icons */}
        {collapsed && !loadingProjects && projects.length > 0 && (
          <div className="space-y-1.5">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={cn(
                  "w-full p-2 rounded-md transition-all duration-200",
                  "hover:bg-muted/30 relative group",
                  "border border-transparent",
                  selectedProject?.id === project.id 
                    ? "bg-primary/5 border-primary/30" 
                    : "hover:border-border/30"
                )}
                title={project.name}
              >
                <div className={cn(
                  "absolute left-1 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full",
                  selectedProject?.id === project.id ? "bg-primary" : "bg-transparent"
                )} />
                <FolderOpen className={cn(
                  "w-4 h-4 mx-auto transition-colors duration-200",
                  selectedProject?.id === project.id 
                    ? "text-primary" 
                    : "text-muted-foreground/60 group-hover:text-primary/70"
                )} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 space-y-3">
        {!collapsed && (
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              AI-powered task management
            </p>
            <p className="text-xs text-primary mt-1">Beta v1.0</p>
          </div>
        )}
        
        <Button
          onClick={handleSignOut}
          variant="outline"
          className={cn(
            "w-full h-10 border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50",
            collapsed ? "p-2" : ""
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span className="ml-2">Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}
