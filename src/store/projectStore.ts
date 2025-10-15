import { create } from 'zustand';
import { Project } from '@/types';

/**
 * PROJECT STORE - Global State for Selected Project
 * 
 * Why we need this:
 * - We want to know which project is active across the entire app
 * - Instead of passing projectId through props, we access it from anywhere
 * - When we switch projects, all components update automatically
 */

// Define the shape of our store
interface ProjectStore {
  // STATE: The currently selected project (or null if none)
  selectedProject: Project | null;
  
  // ACTION: Function to change the selected project
  setSelectedProject: (project: Project | null) => void;
  
  // ACTION: Function to clear selection (optional, for logout)
  clearSelection: () => void;
}

/**
 * Create the Zustand store
 * 
 * How Zustand works:
 * 1. 'create' function makes a React hook (useProjectStore)
 * 2. 'set' function updates the state
 * 3. Components using this hook re-render when state changes
 */
export const useProjectStore = create<ProjectStore>((set) => ({
  // INITIAL STATE
  selectedProject: null,  // No project selected at start
  
  // ACTION: Update selected project
  setSelectedProject: (project) => set({ selectedProject: project }),
  
  // ACTION: Clear selection (useful when signing out)
  clearSelection: () => set({ selectedProject: null }),
}));

/**
 * HOW TO USE THIS STORE IN COMPONENTS:
 * 
 * 1. Import the hook:
 *    import { useProjectStore } from '@/store/projectStore';
 * 
 * 2. Read from the store:
 *    const selectedProject = useProjectStore((state) => state.selectedProject);
 * 
 * 3. Write to the store:
 *    const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
 *    setSelectedProject(myProject);
 * 
 * 4. Component automatically re-renders when selectedProject changes!
 */

