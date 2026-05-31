'use client';
import { useState, useEffect, useRef } from 'react';
import Editor from './components/Editor';
import { io, Socket } from 'socket.io-client';

export default function Home() {
  const [currentRoom] = useState("sandbox-session-1");
  const [adversaryState, setAdversaryState] = useState<"LURKING" | "THINKING...">("LURKING");
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Shared socket connection for dashboard triggers
    socketRef.current = io('http://localhost:4000');
    socketRef.current.emit('join-room', currentRoom);

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentRoom]);

  const handleProvoke = () => {
    setAdversaryState("THINKING...");
    // Tell the backend to unleash the AI on this specific room
    socketRef.current?.emit('provoke-adversary', currentRoom);
    
    // Simulate cooling down back to lurking after a short delay
    setTimeout(() => {
      setAdversaryState("LURKING");
    }, 7000);
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-900 bg-zinc-900/50 backdrop-blur px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <h1 className="text-lg font-bold font-mono tracking-wider text-white">
            GHOSTWRITER_//
          </h1>
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          System Status: <span className="text-emerald-400">Nominal</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-4 p-6 gap-6">
        <div className="col-span-3 flex flex-col justify-stretch">
          <Editor roomId={currentRoom} />
        </div>

        {/* Dashboard Control Panel */}
        <div className="col-span-1 bg-zinc-900/40 border border-zinc-900 rounded-lg p-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold font-mono text-zinc-300 mb-4 border-b border-zinc-800 pb-2">
              SESSION METRICS
            </h2>
            <div className="space-y-3 font-mono text-xs text-zinc-400">
              <p>Active Users: <span className="text-white">1</span></p>
              <p>
                Adversary State:{' '}
                <span className={`${adversaryState === 'THINKING...' ? 'text-red-500 font-bold' : 'text-amber-400'} animate-pulse`}>
                  {adversaryState}
                </span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleProvoke}
            disabled={adversaryState === "THINKING..."}
            className="w-full bg-red-600/10 hover:bg-red-600 disabled:bg-zinc-800 text-red-400 hover:text-white disabled:text-zinc-600 transition border border-red-500/20 disabled:border-zinc-700 py-2.5 rounded text-xs font-mono font-bold tracking-widest"
          >
            {adversaryState === "THINKING..." ? "ATTACKING..." : "PROVOKE ADVERSARY"}
          </button>
        </div>
      </div>
    </main>
  );
}