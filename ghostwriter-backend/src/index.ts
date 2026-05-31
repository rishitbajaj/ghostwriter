import * as dotenv from 'dotenv';
dotenv.config(); // Must run first to register your Gemini API key

import Fastify from 'fastify';
import { Server } from 'socket.io';
import { GoogleGenAI } from '@google/genai';

const fastify = Fastify({ logger: false });

// Initialize the Gemini AI SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Execution state tracking for different rooms
const roomStates: Record<string, string> = {};

// Helper utility to introduce a slight pause between socket emits
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Status check endpoint
fastify.get('/', async () => {
  return { status: "GhostWriter Backend Running" };
});

const start = async () => {
  try {
    // Read the port assigned by the provider, fallback to 4000 for local testing
    const port = Number(process.env.PORT) || 4000;
    
    // Change host to '0.0.0.0' to listen on all public network interfaces
    await fastify.listen({ port: port, host: '0.0.0.0' });
    console.log(`Server listening on port ${port}`);

    const io = new Server(fastify.server, {
      cors: {
        // Replace this with your actual frontend URL once Vercel deploys it!
        origin: process.env.FRONTEND_URL || "http://localhost:3000", 
        methods: ["GET", "POST"],
        credentials: true
      }
    });

    io.on('connection', (socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
        // Feed existing code to user if they join late
        if (roomStates[roomId]) {
          socket.emit('code-update', roomStates[roomId]);
        }
      });

      socket.on('code-change', ({ roomId, code }) => {
        roomStates[roomId] = code;
        socket.to(roomId).emit('code-update', code);
      });

      socket.on('provoke-adversary', async (roomId: string) => {
        const currentCode = roomStates[roomId] || '// No code written yet.';
        console.log(`AI Adversary provoked in room: ${roomId}`);

        try {
          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: `You are an adversarial, slightly chaotic AI pair programmer. 
            Look at this user's current code, and rewrite/refactor it. 
            You can either optimize it beautifully, add a subtle funny comment, or rewrite it in a wildly alternative way.
            
            CRITICAL RULES:
            1. Return ONLY valid executable code. Do NOT wrap your answer in markdown code blocks like \`\`\`javascript.
            2. Do not offer any prose, conversational explanations, or pleasantries. Just code.

            Here is the current code:
            ${currentCode}`,
          });

          let accumulatedCode = '';

          for await (const chunk of responseStream) {
            const chunkText = chunk.text;
            if (chunkText) {
              // Throttle loop: Slice the chunk text character-by-character for human-like speed
              for (let i = 0; i < chunkText.length; i++) {
                accumulatedCode += chunkText[i];
                roomStates[roomId] = accumulatedCode;
                
                // Blast the updated stream back to the room
                io.to(roomId).emit('code-update', accumulatedCode);

                // Calculate fresh cursor lines and character length arrays
                const lines = accumulatedCode.split('\n');
                const lastLineNumber = lines.length;
                const lastColumnNumber = lines[lines.length - 1].length + 1;

                io.to(roomId).emit('ghost-cursor-move', {
                  line: lastLineNumber,
                  column: lastColumnNumber
                });

                // Typing cadence check (15ms delay per individual character element)
                await sleep(15);
              }
            }
          }

          // Complete transmission trigger
          io.to(roomId).emit('ghost-typing-complete');
          console.log(`AI finished writing for room: ${roomId}`);

        } catch (error) {
          console.error("AI Generation failed:", error);
          socket.emit('error', 'The adversary is temporarily unconscious.');
        }
      });

      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
      });
    });

  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();