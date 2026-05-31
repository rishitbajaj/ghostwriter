'use client';
import React, { useEffect, useRef, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import { io, Socket } from 'socket.io-client';

interface EditorProps {
  roomId: string;
}

export default function Editor({ roomId }: EditorProps) {
  const [code, setCode] = useState<string>('// Start coding your masterpiece here...\n');
  const socketRef = useRef<Socket | null>(null);
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const isRespondingToSocket = useRef<boolean>(false);

  // --- FORCE INJECT GHOST CURSOR CSS ---
  useEffect(() => {
    const styleId = 'ghost-cursor-styles';
    if (!document.getElementById(styleId)) {
      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.innerHTML = `
        /* Highlights the entire line the AI is on */
        .ghost-cursor-line {
          background: rgba(239, 68, 68, 0.08) !important; /* Subtle red laser tint */
          border-bottom: 1px dashed rgba(239, 68, 68, 0.4) !important;
        }
        
        /* Puts a bright red marker next to the line number */
        .ghost-cursor-gutter {
          background: #ef4444 !important;
          width: 5px !important;
          margin-left: 2px;
          box-shadow: 0 0 8px #ef4444 !important;
          animation: blink 0.8s infinite;
        }

        @keyframes blink {
          50% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, []);

  // --- WEBSOCKET HANDSHAKE AND STATE ENGINE ---
  useEffect(() => {
    // Connect to the verified running backend port
    socketRef.current = io('http://127.0.0.1:4000');
    socketRef.current.emit('join-room', roomId);

    // Force update code text
    socketRef.current.on('code-update', (updatedCode: string) => {
      isRespondingToSocket.current = true;
      setCode(updatedCode);
    });

    // Handle Ghost Cursor coordinates
    socketRef.current.on('ghost-cursor-move', (position: { line: number; column: number }) => {
      if (!editorRef.current) return;

      // Force the editor to scroll to follow the AI's typing footprint
      editorRef.current.revealLineInCenterIfOutsideViewport(position.line);

      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        [
          {
            range: {
              startLineNumber: position.line,
              startColumn: 1,
              endLineNumber: position.line,
              endColumn: position.column
            },
            options: {
              className: 'ghost-cursor-line',
              isWholeLine: true,
              linesDecorationsClassName: 'ghost-cursor-gutter'
            }
          }
        ]
      );
    });

    socketRef.current.on('ghost-typing-complete', () => {
      if (editorRef.current) {
        decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      }
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomId]);

  const handleEditorChange = (value: string | undefined) => {
    if (!value) return;
    if (isRespondingToSocket.current) {
      isRespondingToSocket.current = false;
      return;
    }
    setCode(value);
    socketRef.current?.emit('code-change', { roomId, code: value });
  };

  return (
    <div className="w-full h-full border border-zinc-800 rounded-lg overflow-hidden bg-[#1e1e1e]">
      <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex justify-between items-center">
        <span className="text-xs font-mono text-zinc-400">ROOM: {roomId}</span>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
          Live Sync Active
        </span>
      </div>
      <MonacoEditor
        height="85vh"
        language="javascript"
        theme="vs-dark"
        value={code}
        onChange={handleEditorChange}
        onMount={(editor) => { 
          editorRef.current = editor; 
          console.log("Monaco Editor successfully mounted to DOM.");
        }}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          cursorBlinking: "smooth",
          smoothScrolling: true
        }}
      />
    </div>
  );
}