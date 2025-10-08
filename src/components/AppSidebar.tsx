import { LayoutDashboard, Sparkles, Settings, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Projects", icon: LayoutDashboard, url: "/" },
  { title: "AI Assistant", icon: Sparkles, url: "/ai-assistant" },
  { title: "Settings", icon: Settings, url: "/settings" },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

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
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/50">
          <div className="glass rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              AI-powered task management
            </p>
            <p className="text-xs text-primary mt-1">Beta v1.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
