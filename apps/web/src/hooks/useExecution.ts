import { useEffect } from 'react';
// @ts-ignore
import { useExecutionStore } from '../store/executionStore';
// @ts-ignore
import { socket } from '../lib/api';
// @ts-ignore
import type { Language } from '@codesync/shared-types';

export function useExecution() {
  const { appendOutput, setExitCode, setIsRunning, clearOutput } = useExecutionStore();

  useEffect(() => {
    const onStarted = () => {
      clearOutput();
      setIsRunning(true);
    };

    const onOutput = (chunk: { text: string, type: string }) => {
      appendOutput(chunk.text);
    };

    const onComplete = (result: { exitCode: number }) => {
      setExitCode(result.exitCode);
      setIsRunning(false);
    };

    socket.on('execution:started', onStarted);
    socket.on('execution:output', onOutput);
    socket.on('execution:complete', onComplete);

    return () => {
      socket.off('execution:started', onStarted);
      socket.off('execution:output', onOutput);
      socket.off('execution:complete', onComplete);
    };
  }, [appendOutput, setExitCode, setIsRunning, clearOutput]);

  const runCode = (code: string, language: Language) => {
    socket.emit('execution:run', { code, language });
  };

  return { runCode };
}
