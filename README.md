# ⚡ Aptus AI — Grounded AI Chatbot Platform

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js%204-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange?style=flat-square)](https://groq.com/)
[![npm](https://img.shields.io/npm/v/aptus-ai-chatbot-widget?style=flat-square&color=FF4D00&logo=npm)](https://www.npmjs.com/package/aptus-ai-chatbot-widget)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)

Aptus AI is an enterprise-grade customer support automation and conversational AI SaaS platform. Train on verified business FAQs and Markdown documentation, select from 11+ leading AI inference providers, and deploy across any website or application via an ultra-lightweight npm package or a single HTML script tag.

---

## 📸 Platform Previews

### 🏠 Landing Page (Neo-Brutalist Architecture)
![Aptus AI Home Page](previews/home_page.png)

---

### 📖 Setup Guide & Developer Documentation
![Setup Guide](previews/setup_guide.png)

---

### 🧠 Business Dashboard & Live Chat Sandbox
![Business Dashboard](previews/business_dashboard.png)

---

### 🔐 Authentication & Token Access
![Login Page](previews/login_page.png)

---

### 📊 Super Admin Dashboard
![Admin Dashboard](previews/admin_dashboard.png)

---

### 🎨 Live Widget Integrations on Real Sites
| FitLife Pro (Dark Mode) | VeloVita Wellness (Light Theme) | NexusCloud (Tech Dark) |
|---|---|---|
| ![FitLife Pro](previews/fitlifepro_preview.png) | ![VeloVita Wellness](previews/velovita_preview.png) | ![NexusCloud](previews/nexuscloud_preview.png) |

---

## ✨ Key Features & Capabilities

- **Strict Knowledge Grounding & Zero Hallucinations**: Responses are strictly derived from verified FAQs and business documentation. The AI never fabricates rates or false pricing.
- **Knowledge Base Safety Gate**: Chatbot requires at least 10 FAQs or 1,000 words of Markdown (up to 5,000 words) before activating, ensuring thorough grounding.
- **Universal GitHub Flavored Markdown (GFM)**: Full GFM rendering across bot messages, test sandbox, and documentation preview with support for headings, multi-column tables, syntax code blocks, checklists, and blockquotes.
- **11+ LLM Providers & Custom APIs**: Native out-of-the-box Groq LPU inference, plus direct support for OpenAI (GPT-4o), Google Gemini, DeepSeek (V3/R1), Anthropic Claude, Mistral, Perplexity, Cohere, xAI, OpenRouter, and custom OpenAI-compatible endpoints (Ollama / vLLM).
- **Live Human Agent Takeover**: Business owners can monitor visitor sessions live in the dashboard inbox and take over any chat with direct responses, pausing AI auto-replies until handed back.
- **Real-Time Voice AI (Streaming STT)**: Browser-native Web Speech streaming with instant word-by-word interim results paired with Groq Whisper Large v3 Turbo server-side audio fallback.
- **Unified Visitor Sessions**: Intelligently consolidates repeat chats from the same visitor ID into a single chronological timeline (earliest chats at top, newly sent below).
- **Domain Whitelisting & Origin Security**: Token authentication paired with strict domain restrictions protects API token allowances against unauthorized scraping or hotlinking.
- **Zero-Config Remote Synchronization**: Widget avatar, theme presets, colors, and welcome greetings update immediately from the dashboard without redeploying website code.

---

## 🛠️ Architecture & Tech Stack

### Frontend Application
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, NextUI, Custom Neo-Brutalist design tokens
- **Markdown**: Custom Full-Spec GitHub Flavored Markdown Renderer
- **State Management**: Redux Toolkit & React Redux
- **Animations & Icons**: Framer Motion, Lucide React, React Icons

### Backend Server & Microservices
- **Runtime**: Node.js & Express.js 4 with clustering & compression
- **Database**: MongoDB Atlas with direct resilient replica set failover
- **AI Engine**: Multi-Model Provider Gateway with Groq LPU, OpenAI, Gemini, Claude, Ollama
- **Speech Engine**: Web Speech API + Groq Whisper Large v3 Turbo
- **Real-Time Layer**: Socket.IO & WebSocket event streaming
- **Security**: JWT authentication, HTTP-only cookies, Rate Limiting, Domain CORS validation

### NPM Widget (`aptus-ai-chatbot-widget`)
- **Package**: `aptus-ai-chatbot-widget` v1.0.12
- **Bundler**: `tsup` (Dual output: ESM + CommonJS + TypeScript declarations)
- **Zero Heavy Dependencies**: Inline vector SVGs, standalone GFM parser, zero CSS framework conflicts

---

## 🚀 Quick Start Guide

### 1. Install Widget via NPM

```bash
npm install aptus-ai-chatbot-widget
```

### 2. Embed In React / Next.js

```jsx
import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <ChatBot 
          token="YOUR_BUSINESS_TOKEN"
          apiUrl="https://your-api.domain.com/api/v1"
        />
      </body>
    </html>
  );
}
```

### 3. Embed In HTML / Shopify / WordPress

```html
<script
  src="https://unpkg.com/aptus-ai-chatbot-widget@1.0.12/dist/index.js"
  data-token="YOUR_BUSINESS_TOKEN"
  data-api-url="https://your-api.domain.com/api/v1"
  defer>
</script>
```

---

## 💻 Local Development Setup

### 1. Backend

```bash
cd aptus-ai-full-stack/backend
npm install
npm run server
```

Create `backend/config/.env`:
```env
PORT=3100
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=10d
COOKIE_EXPIRE=10
GROQ_API_KEY=your_groq_api_key
ADMIN_EMAIL=aptusai@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_JWT_SECRET=your_admin_jwt_secret
```

### 2. Frontend

```bash
cd aptus-ai-full-stack/frontend
npm install
npm run dev
```

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3100/api/v1
```

---

## 🧪 Comprehensive Verification Suite

Run the full end-to-end automated verification test suite:

```bash
cd aptus-ai-full-stack/backend
node test-suite.js
```

---

## 📄 License

Distributed under the **MIT License**.
