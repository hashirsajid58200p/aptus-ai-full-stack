/**
 * One-shot repair:
 * 1) Restore shared demo passwords to AptusAI2026!
 * 2) Replace corrupted Aptus AI knowledgeMarkdown (E2E leftover) with proper KB
 */
require("dotenv").config({ path: require("path").join(__dirname, "../config/.env") });
const mongoose = require("mongoose");
const User = require("../models/userModel");
const Admin = require("../models/adminModel");

const SHARED_PASSWORD = "AptusAI2026!";

const APTUS_KNOWLEDGE_MARKDOWN = `# Aptus AI — Product Knowledge Base & Support Manual

---

## 1. What Aptus AI Is

Aptus AI is a multi-tenant SaaS chatbot platform. Businesses train a custom AI assistant on their own FAQs and Markdown knowledge, choose an LLM provider in the dashboard, then embed the same bot on any website with the official npm package \`aptus-ai-chatbot-widget\` and a single chatbot token.

**Live platform:** https://aptus-ai.vercel.app  
**npm widget:** https://www.npmjs.com/package/aptus-ai-chatbot-widget  
**Full-stack repo:** https://github.com/hashirsajid58200p/aptus-ai-full-stack  
**Widget repo:** https://github.com/hashirsajid58200p/aptus-ai-chatbot-widget

---

## 2. How It Works

1. Create a business account on the Aptus AI dashboard (\`/start\`).
2. Add Business Details / FAQs and optional Markdown knowledge to train the bot.
3. Configure appearance (theme, colors, avatar) and AI Model & Keys.
4. Copy the unique chatbot token.
5. Install \`aptus-ai-chatbot-widget\` and pass \`token\` + \`apiUrl\`.

Training updates in the dashboard apply to the live widget in real time — no redeploy required for knowledge changes.

---

## 3. Hosting & Backend

You do **not** need to host your own AI backend. Aptus AI runs the API, sessions, multi-model inference gateway, and (optional) live-agent sockets. The website only embeds the lightweight React widget.

---

## 4. Widget Integration

\`\`\`bash
npm install aptus-ai-chatbot-widget
\`\`\`

\`\`\`jsx
import { ChatBot } from 'aptus-ai-chatbot-widget';

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ChatBot
        token="YOUR_BUSINESS_TOKEN"
        apiUrl="https://aptus-ai.vercel.app/api/v1"
        theme="aptus"
        wantToShowSuggestions={true}
      />
    </>
  );
}
\`\`\`

Supported on React 17+ / Next.js (App or Pages Router; load client-side), Vite + React, and CRA. Peer dependency: \`styled-components\`.

---

## 5. Themes & Appearance

The widget ships with 14 theme presets (including Aptus neo-brutalist, ChatGPT-style, Nord, Dracula, Cyberpunk, and more). Dashboard colors, border radius, launcher position (left/right), avatar, and animations can override the preset.

Set \`wantToShowSuggestions={true}\` to show dynamic follow-up suggestion chips.

---

## 6. AI Models

Businesses connect provider API keys in **AI Model & Keys**. Aptus supports multiple providers (Groq, OpenAI, Anthropic, Gemini, and others). The platform lists models dynamically when keys are present and falls back to curated defaults if a provider catalog is unreachable. Deprecated models auto-recover to a safe default when possible.

---

## 7. Security & Privacy

- Every widget request is validated with the business chatbot token.
- Optional domain allowlists restrict which origins can use a token.
- Session data and chat history go only to the Aptus backend configured for that business.
- API keys stored for custom providers are never returned in full to the client (masked in profile JSON).

---

## 8. Performance & Mobile

The npm package is lightweight (bundle under ~100KB class) with vector icons and minimal load impact. The chat UI is fully responsive for mobile and desktop.

---

## 9. Pricing

Aptus AI is free to use for the documented demo / open offering described on the platform.

---

## 10. Support & Creator

- Bugs / features: GitHub Issues on \`aptus-ai-chatbot-widget\`
- Built by Hashir Sajid — https://www.linkedin.com/in/hashirsajid

---

## 11. Quick FAQ Snapshot

| Question | Answer |
| --- | --- |
| What is Aptus AI? | SaaS to train a custom AI chatbot on your FAQs/Markdown and embed it with an npm widget + token. |
| Do I need my own server? | No — Aptus hosts the AI backend. |
| How do answers get generated? | Via the LLM provider you configure, grounded in your FAQs and knowledge Markdown. |
| Redeploy after training? | No — dashboard updates apply live. |
| Frameworks? | React / Next.js / Vite React / CRA with styled-components. |
`;

async function main() {
  await mongoose.connect(process.env.DB_URI);
  console.log("Connected");

  // Restore shared passwords
  const admin = await Admin.findOne({ email: "aptusai@example.com" }).select("+password");
  if (admin) {
    admin.password = SHARED_PASSWORD;
    await admin.save();
    console.log("admin password restored:", await admin.comparePassword(SHARED_PASSWORD));
  }

  const emails = [
    "business-aptus@example.com",
    "nexuscloud@example.com",
    "velovitawellness@example.com",
    "fitlifepro@example.com",
  ];

  for (const email of emails) {
    const user = await User.findOne({ email }).select("+password knowledgeMarkdown");
    if (!user) {
      console.warn("missing", email);
      continue;
    }
    user.password = SHARED_PASSWORD;
    if (email === "business-aptus@example.com") {
      user.knowledgeMarkdown = APTUS_KNOWLEDGE_MARKDOWN;
    }
    await user.save();
    const ok = await user.comparePassword(SHARED_PASSWORD);
    const mdStart = (user.knowledgeMarkdown || "").slice(0, 60).replace(/\n/g, "\\n");
    console.log(email, "password", ok ? "OK" : "FAIL", "md:", JSON.stringify(mdStart));
  }

  await mongoose.disconnect();
  console.log("Done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
