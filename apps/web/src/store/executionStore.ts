import { create } from 'zustand';

interface ExecutionState {
  isRunning: boolean;
  output: string;
  exitCode: number | null;
  setIsRunning: (running: boolean) => void;
  appendOutput: (chunk: string) => void;
  clearOutput: () => void;
  setExitCode: (code: number | null) => void;
}

export const useExecutionStore = create<ExecutionState>((set) => ({
  isRunning: false,
  output: '',
  exitCode: null,
  setIsRunning: (isRunning) => set({ isRunning }),
  appendOutput: (chunk) => set((state) => ({ output: state.output + chunk })),
  clearOutput: () => set({ output: '', exitCode: null }),
  setExitCode: (exitCode) => set({ exitCode }),
}));
