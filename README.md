# GHOSTWRITER_// Real-Time Collaborative AI Adversary

A dark, cyberpunk-themed real-time collaborative code workspace featuring an adversarial AI pair programmer. Paste your unoptimized, messy JavaScript code, provoke the adversary, and watch as a streaming AI engine hijacks your workspace line-by-line with human-like typing speeds, rendering its presence via a custom glowing neon tracker layout.

## 🚀 Features

* **Monaco Editor Environment:** A fully featured VS-Code style code canvas utilizing modern dark-mode layouts.
* **Real-Time WebSocket Sync:** Fastify and Socket.IO pipeline powering instant, low-latency communication hooks between frontend and backend.
* **The Ghost Cursor:** Dynamic Monaco Delta Decorations tracking the AI's exact typing footprint with custom CSS line highlights and red margin gutter indicators.
* **Token Throttle Queue:** Custom character-throttled backend streaming loop that mimics realistic human typing cadences instead of sudden text dumps.
* **Gemini LLM Integration:** Powered by the cutting-edge Google Gemini API stream parsing valid executable code and sarcastic developer commentary.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14+, TypeScript, Tailwind CSS, Monaco Editor (`@monaco-editor/react`) |
| **Backend** | Node.js, Fastify, TypeScript, Socket.IO |
| **AI Engine** | Google Gemini 2.5 Flash SDK (`@google/genai`) |

---

## 📂 Architecture Layout

```text
├── ghostwriter-frontend/     # Next.js Application Core
│   └── src/app/
│       ├── components/Editor.tsx   # Custom Monaco layout & style injection tracking
│       └── page.tsx                # Cyberpunk layout dashboard & provoke configuration
│
└── ghostwriter-backend/      # Fastify Socket Server
    ├── src/index.ts          # Socket orchestration, calculation maps, & token-throttling
    └── .env                  # Protected Gemini API Credentials
