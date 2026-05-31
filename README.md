<div align="center">

```
 ██████╗ ██╗  ██╗ ██████╗ ███████╗████████╗██╗    ██╗██████╗ ██╗████████╗███████╗██████╗
██╔════╝ ██║  ██║██╔═══██╗██╔════╝╚══██╔══╝██║    ██║██╔══██╗██║╚══██╔══╝██╔════╝██╔══██╗
██║  ███╗███████║██║   ██║███████╗   ██║   ██║ █╗ ██║██████╔╝██║   ██║   █████╗  ██████╔╝
██║   ██║██╔══██║██║   ██║╚════██║   ██║   ██║███╗██║██╔══██╗██║   ██║   ██╔══╝  ██╔══██╗
╚██████╔╝██║  ██║╚██████╔╝███████║   ██║   ╚███╔███╔╝██║  ██║██║   ██║   ███████╗██║  ██║
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝   ╚═╝    ╚══╝╚══╝ ╚═╝  ╚═╝╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝
```

### `adversarial_code_workspace` — Real-Time AI Pair Programmer

<br/>

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-0a0d14?style=for-the-badge&logo=typescript&logoColor=3178c6)](https://www.typescriptlang.org)
[![Fastify](https://img.shields.io/badge/Fastify-0a0d14?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.dev)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-0a0d14?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io)
[![Google Gemini](https://img.shields.io/badge/Gemini_2.5_Flash-0a0d14?style=for-the-badge&logo=google&logoColor=4285f4)](https://deepmind.google/technologies/gemini)

<br/>

![build](https://img.shields.io/badge/build-passing-00e5ff?style=flat-square&labelColor=0a0d14)
![type](https://img.shields.io/badge/type-fullstack-00e5ff?style=flat-square&labelColor=0a0d14)
![realtime](https://img.shields.io/badge/realtime-WebSocket-00e5ff?style=flat-square&labelColor=0a0d14)
![latency](https://img.shields.io/badge/latency-<12ms-00e5ff?style=flat-square&labelColor=0a0d14)

<br/>

> **An adversarial AI that hijacks your code editor in real time.** Paste your messy JavaScript, and watch as a streaming AI rewrites it line-by-line with human-like typing speeds — inside a fully-featured Monaco Editor, with a glowing ghost cursor tracking every character it types.

**Live:** [ghostwriter-ten-mocha.vercel.app](https://ghostwriter-ten-mocha.vercel.app/)

<br/>

---

</div>

## `01` &nbsp; What Is This

Ghostwriter is a **dark, cyberpunk-themed real-time collaborative code workspace** with an adversarial AI pair programmer. Powered by Google Gemini 2.5 Flash, it uses a character-throttled backend streaming loop to mimic realistic human typing cadences — not sudden text dumps. The AI doesn't just rewrite your code. It talks back.

This project explores the intersection of **real-time WebSocket architecture**, **LLM streaming APIs**, and **browser-based code editor manipulation** — all in a monorepo setup with a Next.js frontend and a Fastify + Socket.IO backend.

<br/>

## `02` &nbsp; Architecture

```
ghostwriter/
│
├── ghostwriter-frontend/              # Next.js 14 Application
│   └── src/app/
│       ├── components/
│       │   └── Editor.tsx             # Monaco Editor + Delta Decorations cursor
│       └── page.tsx                   # Cyberpunk UI dashboard + provoke controls
│
└── ghostwriter-backend/               # Fastify + Socket.IO Server
    ├── src/
    │   └── index.ts                   # WebSocket orchestration + token throttle queue
    └── .env                           # Gemini API key (not committed)
```

<br/>

## `03` &nbsp; Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **Frontend** | Next.js 14, TypeScript | App shell, routing, SSR |
| **Editor** | Monaco Editor (`@monaco-editor/react`) | VS Code-grade code canvas |
| **Backend** | Node.js, Fastify, TypeScript | HTTP server + WebSocket host |
| **Real-time** | Socket.IO | Bidirectional event pipeline |
| **AI Engine** | Google Gemini 2.5 Flash (`@google/genai`) | Code rewrite + commentary stream |
| **Styling** | Tailwind CSS | Cyberpunk dark theme |

<br/>

## `04` &nbsp; Key Engineering Decisions

```
✦  Character-throttled streaming      Gemini tokens arrive fast — a custom queue drip-feeds
                                      characters at ~40ms intervals to simulate human typing

✦  Monaco Delta Decorations           The AI's exact cursor position is tracked using Monaco's
                                      delta decoration API + custom CSS for glowing indicators

✦  Socket.IO event model              Frontend emits 'provoke', backend streams 'ghost:char'
                                      events per character — fine-grained control over timing

✦  Fastify over Express               Lower overhead HTTP layer for a server that's mostly
                                      handling long-lived socket connections anyway

✦  Gemini 2.5 Flash                   Chosen for speed + streaming support — the model needs
                                      to generate token-by-token, not batch responses
```

<br/>

## `05` &nbsp; Getting Started

**Prerequisites:** Node.js 18+ · A Google Gemini API key

```bash
# Clone
git clone https://github.com/rishitbajaj/ghostwriter.git
cd ghostwriter
```

**Backend:**
```bash
cd ghostwriter-backend
npm install

# Create .env
echo "GEMINI_API_KEY=your_key_here" > .env

npm run dev
# → WebSocket server on ws://localhost:3001
```

**Frontend:**
```bash
cd ghostwriter-frontend
npm install
npm run dev
# → http://localhost:3000
```

<br/>

## `06` &nbsp; How It Works

```
1.  User pastes code into Monaco Editor
2.  User clicks "Provoke" — frontend emits socket event with code payload
3.  Backend receives payload, constructs Gemini prompt
4.  Gemini 2.5 Flash streams tokens back to backend
5.  Backend throttles tokens → emits 'ghost:char' events per character
6.  Frontend receives each char → inserts into Monaco editor at ghost cursor position
7.  Delta Decorations update in real time → glowing red gutter line tracks AI position
8.  Commentary lines (sarcastic remarks) are injected as code comments mid-stream
```

<br/>

## `07` &nbsp; Environment Variables

```bash
# ghostwriter-backend/.env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3001
```

Get a Gemini API key at [aistudio.google.com](https://aistudio.google.com).

<br/>

---

<div align="center">

```
RISHIT BAJAJ  ·  IIIT RANCHI  ·  github.com/rishitbajaj
```

[![Email](https://img.shields.io/badge/bajrishit@gmail.com-0a0d14?style=for-the-badge&logo=gmail&logoColor=00e5ff)](mailto:bajrishit@gmail.com)
&nbsp;
[![GitHub](https://img.shields.io/badge/GitHub-0a0d14?style=for-the-badge&logo=github&logoColor=00e5ff)](https://github.com/rishitbajaj)
&nbsp;
[![Live Demo](https://img.shields.io/badge/Live_Demo-0a0d14?style=for-the-badge&logo=vercel&logoColor=00e5ff)](https://ghostwriter-ten-mocha.vercel.app/)

*No templates. No boilerplate. Built from scratch.*

</div>