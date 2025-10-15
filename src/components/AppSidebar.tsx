import { LayoutDashboard, Sparkles, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getProjects } from "@/services/projects";
import { Project } from "@/types";

const navItems = [
  { title: "Projects", icon: LayoutDashboard, url: "/" },
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
      <nav className="flex-1 p-4 space-y-2">
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
                {/* Show project count next to "Projects" */}
                {item.title === "Projects" && !loadingProjects && (
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({projects.length})
                  </span>
                )}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

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
