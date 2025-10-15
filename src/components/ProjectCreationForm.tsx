import { Sparkles, FolderPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { useState } from "react";

/**
 * PROJECT CREATION FORM
 * 
 * Purpose: Allows users to create a new project with AI-generated tasks
 * 
 * Inputs:
 * 1. Project Name - What to call this project (e.g., "Portfolio Website")
 * 2. Project Description - Detailed explanation of what to build (used by AI)
 * 
 * Flow:
 * - User fills in name and description
 * - Clicks "Create Project with AI"
 * - Parent component (Projects.tsx) handles:
 *   - Creating project in Supabase
 *   - Calling Gemini AI to generate tasks
 *   - Saving tasks linked to project
 */

interface ProjectCreationFormProps {
  onCreateProject: (projectName: string, projectDescription: string) => void;
  isLoading?: boolean;
}

export function ProjectCreationForm({ onCreateProject, isLoading = false }: ProjectCreationFormProps) {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (projectName.trim() && projectDescription.trim()) {
      onCreateProject(projectName.trim(), projectDescription.trim());
      // Clear form after submission
      setProjectName("");
      setProjectDescription("");
    }
  };

  return (
    <div className="glass-3d rounded-2xl p-8 glow-hover animate-fade-in shadow-3d-strong floating">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Name Input */}
        <div className="space-y-2">
          <Label htmlFor="project-name" className="text-base font-medium flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-primary" />
            Project Name
          </Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g., Portfolio Website, E-commerce Store, Blog Platform"
            className="h-12 px-4 text-base bg-input/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 shadow-3d transition-all duration-300 focus:shadow-3d-strong focus:scale-[1.01]"
            disabled={isLoading}
            required
          />
          <p className="text-xs text-muted-foreground">
            Give your project a clear, memorable name
          </p>
        </div>

        {/* Project Description Textarea */}
        <div className="space-y-2">
          <Label htmlFor="project-description" className="text-base font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary animate-glow-pulse" />
            Project Description
          </Label>
          <Textarea
            id="project-description"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your project in detail... What features do you want? What's the goal? Be specific for better AI-generated tasks!

Example: 'Build a modern portfolio website with a hero section, project showcase with filters, blog with markdown support, contact form, and dark mode toggle. Should be responsive and SEO-friendly.'"
            className="min-h-[200px] px-4 py-3 text-base bg-input/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 shadow-3d transition-all duration-300 focus:shadow-3d-strong resize-none"
            disabled={isLoading}
            required
          />
          <p className="text-xs text-muted-foreground">
            The more detail you provide, the better AI can generate relevant tasks
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="w-full h-14 rounded-xl font-semibold text-base"
          disabled={isLoading || !projectName.trim() || !projectDescription.trim()}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Creating Project & Generating Tasks...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create Project with AI
            </>
          )}
        </Button>

        {/* Helper Text */}
        {!isLoading && (
          <p className="text-xs text-center text-muted-foreground">
            AI will analyze your description and create a structured task list automatically
          </p>
        )}
      </form>
    </div>
  );
}

