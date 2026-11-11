# NexusCloud Solutions — Demo Integration Site

> Next-Generation Enterprise Cloud Infrastructure & Hosting Platform showcasing the official `aptus-ai-chatbot-widget` (v1.0.16) integration.

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
Open [http://localhost:3005](http://localhost:3005) in your browser.

---

## 🔑 Portal Access & Business Credentials

Manage this chatbot, update themes, view chat sessions, or adjust knowledge base documents from the Aptus AI Business Dashboard:

| Property | Value |
| --- | --- |
| **Login Portal** | `http://localhost:3000/start` |
| **Email** | `nexuscloud@example.com` |
| **Password** | `NexusCloud2026!` |
| **Chatbot Token** | `A1ED-CD70379B-E72B6C6D` |
| **Default Theme** | `compute` (Retro CRT Terminal) |
| **Primary Color** | `#6366F1` (Indigo) |
| **Knowledge Base Mode** | **Markdown Documentation (1,000+ words)** |

---

## 📚 Business Knowledge Documentation (Markdown)

This chatbot is trained on the comprehensive technical architecture documentation below:

```markdown
# NexusCloud Solutions — Infrastructure Technical Documentation

## 1. Company Mission & Enterprise Architecture
NexusCloud Solutions is an enterprise-grade cloud hosting and DevOps acceleration platform engineered for SaaS founders, developer teams, and modern software enterprises. We provide high-speed bare-metal cloud compute, serverless microservice deployments, geo-redundant database backups, and 24/7 dedicated DevOps monitoring with a guaranteed 99.99% Service Level Agreement (SLA) uptime.

## 2. Global Data Center Nodes
- US-East (N. Virginia, us-east-1)
- US-West (Oregon, us-west-1)
- EU-Central (Frankfurt, eu-central-1)
- APAC-South (Singapore, apac-south-1)

## 3. Hosting Plans & Pricing Tiers
- **Starter Plan ($49 / month)**: 2 vCPU, 4 GB RAM, 80 GB NVMe, 2 TB Egress, Daily Backups (7-day retention), Automated SSL.
- **Professional Plan ($149 / month)**: 8 vCPU, 16 GB RAM, 250 GB NVMe, 8 TB Egress, Daily Geo-redundant Backups (30-day retention), Serverless deployments, 24/7 Priority Live Chat.
- **Enterprise Plan ($499 / month)**: Dedicated Bare-Metal AMD EPYC 32-Core, 1 TB+ NVMe, 99.999% SLA, Dedicated TAM, 24/7 Emergency Phone Hotline.

## 4. Backups & Disaster Recovery
- Daily snapshots at 00:00 UTC.
- Instant restore in < 3 minutes via Web Console or REST API.
```

---

## 🧩 Widget Embedding Code (`src/App.jsx`)

```jsx
import { ChatBot } from 'aptus-ai-chatbot-widget';

<ChatBot
  token="A1ED-CD70379B-E72B6C6D"
  apiUrl={typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:3100/api/v1' : 'https://aptus-ai.vercel.app/api/v1'}
  wantToShowSuggestions={true}
/>
```
