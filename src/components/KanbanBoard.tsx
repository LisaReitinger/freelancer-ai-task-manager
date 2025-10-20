import { useState } from "react";
import { TaskCard } from "./TaskCard";
import { Task } from "@/types";

export type { Task };

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void;
  onTaskClick?: (task: Task) => void;
}

const columns: { id: Task["status"]; title: string; color: string }[] = [
  { id: "todo", title: "To-Do", color: "from-blue-500 to-cyan-500" },
  { id: "in-progress", title: "In Progress", color: "from-purple-500 to-pink-500" },
  { id: "done", title: "Done", color: "from-green-500 to-emerald-500" },
];

export function KanbanBoard({ tasks, onTaskMove, onTaskClick }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: Task["status"]) => {
    if (draggedTask) {
      onTaskMove(draggedTask, status);
      setDraggedTask(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in parallax-container">
      {columns.map((column, index) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
          className="glass-3d rounded-xl p-4 min-h-[500px] space-y-4 shadow-3d-strong glow-hover parallax-item animate-float-slow"
          style={{ animationDelay: `${index * 0.2}s` }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color} glow animate-glow-pulse`} />
            <h3 className="font-semibold text-lg bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text">{column.title}</h3>
            <span className="ml-auto text-sm text-muted-foreground glass px-2 py-1 rounded-full">
              {tasks.filter((t) => t.status === column.id).length}
            </span>
          </div>
          
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task, taskIndex) => (
                <div
                  key={task.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${taskIndex * 0.1}s` }}
                >
                  <TaskCard
                    task={task}
                    onDragStart={() => handleDragStart(task.id)}
                    onClick={() => onTaskClick?.(task)}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
