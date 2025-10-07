import { useState } from "react";
import { TaskCard } from "./TaskCard";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Task["status"]) => void;
}

const columns: { id: Task["status"]; title: string; color: string }[] = [
  { id: "todo", title: "To-Do", color: "from-blue-500 to-cyan-500" },
  { id: "in-progress", title: "In Progress", color: "from-purple-500 to-pink-500" },
  { id: "done", title: "Done", color: "from-green-500 to-emerald-500" },
];

export function KanbanBoard({ tasks, onTaskMove }: KanbanBoardProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      {columns.map((column) => (
        <div
          key={column.id}
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
          className="glass rounded-xl p-4 min-h-[500px] space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${column.color}`} />
            <h3 className="font-semibold text-lg">{column.title}</h3>
            <span className="ml-auto text-sm text-muted-foreground">
              {tasks.filter((t) => t.status === column.id).length}
            </span>
          </div>
          
          <div className="space-y-3">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={() => handleDragStart(task.id)}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
