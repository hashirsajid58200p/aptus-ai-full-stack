# FitLife Pro — Demo Integration Site

> Next.js Athletic Training & Conditioning Facility showcasing the official `aptus-ai-chatbot-widget` (v1.0.19) integration.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Run Development Server
```bash
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🔑 Portal Access & Business Credentials

Manage this chatbot, update themes, view chat sessions, or adjust knowledge base documents from the Aptus AI Business Dashboard:

| Property | Value |
| --- | --- |
| **Login Portal** | `http://localhost:3000/start` |
| **Email** | `fitlifepro@example.com` |
| **Password** | `FitLifePro2026!` |
| **Chatbot Token** | `A1ED-E8E08127-D535E9F7` |
| **Default Theme** | `chatgpt` (Modern Dark / Emerald) |
| **Primary Color** | `#A3E635` (Lime Green) |
| **Knowledge Base Mode** | **Structured Q&A FAQs (12 Configured Pairs)** |

---

## ❓ Configured Q&A Knowledge Base (FAQs)

Unlike NexusCloud and VeloVita which use Markdown, FitLife Pro is configured with structured Question & Answer pairs directly in the dashboard:

1. **Q:** What membership plans are available at FitLife Pro and how much do they cost?
   **A:** Basic Plan ($49/mo or $39/mo billed annually), Pro Athlete ($99/mo or $79/mo billed annually), and Elite Coaching ($199/mo or $159/mo billed annually).
2. **Q:** Can I try out the gym before purchasing a membership?
   **A:** Yes! We offer a complimentary 3-day full-access guest pass for local residents. Claim it in this chat or at the front desk.
3. **Q:** What group fitness classes are included with the Pro Athlete membership?
   **A:** Unlimited access to Power HIIT, Barbell Hypertrophy, Zen Flow Yoga, Championship Boxing, Olympic Weightlifting, and Active Mobility & Stretch.
4. **Q:** What recovery features and wellness amenities are available?
   **A:** Full-spectrum infrared saunas, eucalyptus steam rooms, and pneumatic compression therapy suites.
5. **Q:** How do I book sessions with a personal trainer?
   **A:** Directly through our mobile app, at the front desk, or by requesting an appointment with this digital assistant.
6. **Q:** Where is FitLife Pro located and what are your opening hours?
   **A:** 100 Fitness Boulevard, Suite A, New York, NY 10001. Open 24 Hours / 7 Days a week with 24/7 keyless mobile entry.
7. **Q:** Is there a long-term contract or cancellation fee?
   **A:** No! All memberships are month-to-month with no hidden registration fees or lock-in contracts.

*(+ 5 additional FAQs covering Locker Rooms, Nutrition Plans, Age Policy, Freezing, and Free Garage Parking)*

---

## 🧩 Widget Embedding Code (`src/components/ChatBotWrapper.tsx`)

```tsx
"use client";

import dynamic from "next/dynamic";

const ChatBot = dynamic(
  () => import("aptus-ai-chatbot-widget").then((mod) => mod.ChatBot),
  { ssr: false }
);

export default function ChatBotWrapper() {
  const apiUrl = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3100/api/v1'
    : 'https://aptus-ai.vercel.app/api/v1';

  return (
    <ChatBot
      token="A1ED-E8E08127-D535E9F7"
      apiUrl={apiUrl}
      wantToShowSuggestions={true}
    />
  );
}
```
