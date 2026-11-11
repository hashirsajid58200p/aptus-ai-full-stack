# VeloVita Wellness Hub — Demo Integration Site

> Premier Athletic Performance & Recovery Sanctuary showcasing the official `aptus-ai-chatbot-widget` (v1.0.16) integration.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3006](http://localhost:3006) in your browser.

---

## 🔑 Portal Access & Business Credentials

Manage this chatbot, update themes, view chat sessions, or adjust knowledge base documents from the Aptus AI Business Dashboard:

| Property | Value |
| --- | --- |
| **Login Portal** | `http://localhost:3000/start` |
| **Email** | `velovitawellness@example.com` |
| **Password** | `VeloVita2026!` |
| **Chatbot Token** | `A1ED-EEB2866D-48C86113` |
| **Default Theme** | `boty` (Earthy Nature) |
| **Primary Color** | `#10B981` (Emerald Green) |
| **Knowledge Base Mode** | **Markdown Documentation (1,000+ words)** |

---

## 📚 Business Knowledge Documentation (Markdown)

This chatbot is grounded in the sanctuary operations manual below:

```markdown
# VeloVita Wellness Hub — Sanctuary Guide & Member Operations Manual

## 1. Welcome to VeloVita Wellness Sanctuary
VeloVita Wellness Hub is New York's premier athletic performance and holistic recovery sanctuary. Located at 100 Fitness Boulevard, Suite A, New York, NY 10001, we provide Italian Technogym bio-drive equipment, Olympic lifting platforms, sub-zero cryotherapy chambers, and Clearlight full-spectrum infrared saunas.

## 2. Operating Hours & Keyless Access
- Open 24 Hours / 7 Days a Week / 365 Days a Year.
- 24/7 Keyless Mobile Bluetooth access for all active members.
- Concierge staff on-site Mon-Fri 6AM-9PM, Sat-Sun 8AM-6PM.

## 3. Recovery Spa Therapies
- **Cryotherapy Chambers (-110°C)**: Accelerates DOMS recovery and reduces muscle inflammation in 3-minute sessions.
- **Infrared Saunas & Steam Rooms**: Deep thermal penetration for cellular detox and cardiovascular recovery.
- **Normatec 3 Pneumatic Compression**: Lymphatic drainage boots and sleeves.

## 4. Membership Tiers & Pricing
- **Standard Access ($49 / month)**: 24/7 keyless access, gym floor & showers, free garage parking.
- **Pro Athlete Tier ($99 / month)**: Unlimited group fitness classes (HIIT, Hypertrophy, Boxing, Yoga), infrared saunas & steam rooms, towel service.
- **Elite Coaching Tier ($199 / month)**: 4 private CSCS coaching sessions, custom nutrition planning, unlimited cryotherapy, monthly InBody scans.
```

---

## 🧩 Widget Embedding Code (`src/App.jsx`)

```jsx
import { ChatBot } from 'aptus-ai-chatbot-widget';

<ChatBot
  token="A1ED-EEB2866D-48C86113"
  apiUrl={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3100/api/v1' : 'https://aptus-ai.vercel.app/api/v1'}
  wantToShowSuggestions={true}
/>
```
