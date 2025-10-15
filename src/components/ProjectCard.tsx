import { FolderOpen, Calendar, CheckCircle2, Clock } from "lucide-react";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

/**
 * PROJECT CARD COMPONENT
 * 
 * Purpose: Reusable card to display project information in a grid
 * Shows: name, description, creation date, and task count
 * 
 * Features:
 * - Click to navigate to project's Kanban board
 * - Hover effects for better UX
 * - Responsive design
 * - Visual indicators for project metadata
 */

interface ProjectCardProps {
  project: Project;
  taskCount?: number;
  completedCount?: number;
  onClick: () => void;
}

export function ProjectCard({ 
  project, 
  taskCount = 0, 
  completedCount = 0,
  onClick 
}: ProjectCardProps) {
  // Calculate completion percentage
  const completionPercentage = taskCount > 0 
    ? Math.round((completedCount / taskCount) * 100) 
    : 0;

  // Format date
  const createdDate = new Date(project.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={onClick}
      className={cn(
        "group relative cursor-pointer",
        "glass-3d rounded-2xl p-6",
        "border border-border/50",
        "hover:shadow-3d-strong hover:scale-[1.02]",
        "transition-all duration-300",
        "animate-fade-in floating"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <FolderOpen className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {project.name}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
          {project.description}
        </p>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-4 text-sm">
        {/* Task Count */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {completedCount}/{taskCount} tasks
          </span>
        </div>

        {/* Creation Date */}
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{createdDate}</span>
        </div>
      </div>

      {/* Progress Bar */}
      {taskCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{completionPercentage}%</span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500 rounded-full",
                completionPercentage === 100 
                  ? "bg-gradient-to-r from-green-500 to-green-600" 
                  : "bg-gradient-to-r from-primary to-secondary"
              )}
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Empty State for No Tasks */}
      {taskCount === 0 && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground/70 italic">
          <Clock className="w-3.5 h-3.5" />
          <span>No tasks yet</span>
        </div>
      )}

      {/* Hover Indicator */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

