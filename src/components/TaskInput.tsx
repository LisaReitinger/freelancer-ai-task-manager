import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface TaskInputProps {
  onGenerate: (projectIdea: string) => void;
}

export function TaskInput({ onGenerate }: TaskInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onGenerate(input);
      setInput("");
    }
  };

  return (
    <div className="glass-3d rounded-2xl p-8 glow-hover animate-fade-in shadow-3d-strong floating">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your project idea…"
            className="h-14 px-6 text-lg bg-input/50 border-border/50 rounded-xl focus:ring-2 focus:ring-primary/50 glow-pulse shadow-3d transition-all duration-300 focus:shadow-3d-strong focus:scale-[1.01]"
          />
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary animate-glow-pulse" />
        </div>
        <Button
          type="submit"
          size="lg"
          variant="gradient"
          className="w-full h-12 rounded-xl font-semibold"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Generate Tasks
        </Button>
      </form>
    </div>
  );
}
