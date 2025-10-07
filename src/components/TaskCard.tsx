import { GripVertical } from "lucide-react";
import { Task } from "./KanbanBoard";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onDragStart: () => void;
}

const priorityColors = {
  low: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
  medium: "from-yellow-500/20 to-orange-500/20 border-yellow-500/30",
  high: "from-red-500/20 to-pink-500/20 border-red-500/30",
};

export function TaskCard({ task, onDragStart }: TaskCardProps) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "glass-strong rounded-lg p-4 cursor-move hover:scale-[1.02] transition-transform",
        "border bg-gradient-to-br",
        priorityColors[task.priority]
      )}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="w-4 h-4 text-muted-foreground mt-1 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <h4 className="font-semibold text-sm">{task.title}</h4>
          <p className="text-xs text-muted-foreground">{task.description}</p>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs px-2 py-1 rounded-full",
                task.priority === "high" && "bg-red-500/20 text-red-400",
                task.priority === "medium" && "bg-yellow-500/20 text-yellow-400",
                task.priority === "low" && "bg-blue-500/20 text-blue-400"
              )}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
