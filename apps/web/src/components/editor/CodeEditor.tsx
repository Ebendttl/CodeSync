import React, { useRef, useCallback, useEffect } from 'react';
import Editor, { type Monaco } from '@monaco-editor/react';
import * as Y from 'yjs';
import { MonacoBinding } from 'y-monaco';
// @ts-ignore
import { useYjs } from '../../hooks/useYjs';

interface Props {
  roomId: string;
}

export function CodeEditor({ roomId }: Props) {
  const editorRef = useRef<any>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const { doc, awareness } = useYjs(roomId);

  const handleEditorMount = useCallback((editor: any, monaco: Monaco) => {
    editorRef.current = editor;

    // Define theme
    monaco.editor.defineTheme('codesync-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '3d4166', fontStyle: 'italic' },
        { token: 'keyword', foreground: '00d4ff' },
        { token: 'string', foreground: '00e676' },
        { token: 'number', foreground: 'ffb800' },
        { token: 'function', foreground: '82aaff' },
        { token: 'variable', foreground: 'e8eaf6' },
        { token: 'type', foreground: 'c3e88d' },
      ],
      colors: {
        'editor.background': '#0a0a0f',
        'editor.foreground': '#e8eaf6',
        'editorLineNumber.foreground': '#3d4166',
        'editorCursor.foreground': '#00d4ff',
        'editor.selectionBackground': 'rgba(0,212,255,0.15)',
        'editorGutter.background': '#0a0a0f',
        'editor.lineHighlightBackground': 'rgba(255,255,255,0.03)',
      },
    });

    monaco.editor.setTheme('codesync-dark');

    const yText = doc.getText('code');

    bindingRef.current = new MonacoBinding(
      yText,
      editor.getModel()!,
      new Set([editor]),
      awareness
    );
  }, [doc, awareness]);

  useEffect(() => {
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
    };
  }, []);

  return (
    <Editor
      height="100%"
      defaultLanguage="javascript"
      theme="codesync-dark"
      onMount={handleEditorMount}
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        smoothScrolling: true,
        cursorBlinking: 'smooth',
        cursorSmoothCaretAnimation: 'on',
        renderLineHighlight: 'gutter',
        padding: { top: 16 },
      }}
    />
  );
}
