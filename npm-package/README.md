# Aptus AI Chatbot Widget (`aptus-ai-chatbot`)

A customizable, secure React chatbot widget component (`aptus-ai-chatbot`). It enables business owners to easily integrate a custom AI-driven chatbot widget on their website by passing a token and their API endpoint.

## Installation

```bash
npm install aptus-ai-chatbot
```

## Usage

```jsx
import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot';

function App() {
  return (
    <div>
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN" 
        apiUrl="https://aptus-ai-backend.vercel.app/api/v1"
        theme="aptus"
        wantToShowSuggestions={true}
      />
    </div>
  );
}

export default App;
```

## Available Built-in Themes (`theme` prop)

Pass any of the following 10 theme names into the `theme` prop:

| Theme Name | Style Description | Target Industry |
|------------|-------------------|-----------------|
| `"aptus"` | **Aptus Official Signature**: Burnt Orange (`#FF4D00`), Cream (`#FDF9F0`), 3px dark borders & hard shadows. | Modern AI SaaS / Neo-Brutalist websites |
| `"boty"` | **Natural E-Commerce**: Warm Beige, Olive Green (`#4F5B3A`), Sand, soft 16px rounded corners. | E-Commerce, Skincare, Organic Products |
| `"chatgpt"` | **Minimalist Dark Mode**: Dark Slate (`#212121`), Emerald Green (`#10A37F`), 12px clean corners. | Developer Tools, AI Platforms |
| `"compute"` | **Cyber Terminal AI**: Pitch Black (`#0C0E12`), Cyber Blue (`#38BDF8`), JetBrains Mono monospace font. | Cloud Infrastructure, Developer Tools |
| `"crosshaven"` | **Corporate Slate Navy**: Slate Navy (`#0F172A`), Cobalt Blue (`#2563EB`), 10px rounded corporate layout. | Agencies, Financial & Legal Services |
| `"studio"` | **Modern Design Studio**: Pitch Dark (`#0A0A0A`), Electric Yellow (`#FFD600`), 6px sharp borders. | Creative Agencies, Design Tools |
| `"energy"` | **Gen-Z Neon Energy**: Acid Lime (`#A3E635`), Magenta (`#EC4899`), Deep Purple, 20px bubble corners. | Youth Brands, Media, Fitness & Drinks |
| `"smarthome"` | **Clean Soft Cyan**: Ice Blue (`#F0F9FF`), Sky Cyan (`#0EA5E9`), 14px smooth rounded corners. | Smart Home, IoT, Health & Wellness |
| `"superdesign"` | **Creative Purple Violet**: Deep Violet (`#4C1D95`), Purple (`#8B5CF6`), 12px vibrant layout. | SaaS Products, Creative Software |
| `"professional"` | **Classic Business Light**: Royal Blue (`#1D4ED8`), Crisp White (`#FFFFFF`), 8px standard business UI. | General Corporate & Customer Support |

## Props Customization

| Prop Name | Type | Description |
|-----------|------|-------------|
| `token` | string | **(Required)** The unique integration token key for your registered business. |
| `apiUrl` | string | **(Required)** The API backend endpoint where chat session and messages are processed. |
| `theme` | string | Select one of the 10 themes listed above (default: `"aptus"`). |
| `toggleBtncolor` | string | Custom icon color of the floating chatbot button (e.g., `white` or `#ffffff`). |
| `toggleBtnBgColor` | string | Custom background color of the floating chatbot button. |
| `icon` | ReactNode | Custom icon for the closed state button (defaults to `TbMessageChatbot`). |
| `position` | 'left' \| 'right' | The position of the chatbot button on the screen (default: `right`). |
| `animate` | boolean | Enables subtle bounce animation on the closed toggle button (default: `true`). |
| `wantToShowSuggestions` | boolean | Displays dynamic suggestion questions when the chatbot cannot fully answer (default: `false`). |

---

## 🔒 Security & Privacy Transparency

This library acts strictly as a UI wrapper client for your backend chatbot service.
* **PII Collection**: When a user starts a chat, they are prompted for their name and email. This information is used solely to generate a session ID for backend context management.
* **Data Transmission**: All submitted names, emails, and chat messages are sent exclusively to the endpoint configured in `apiUrl`. No telemetry is sent to third parties.
* **Authentication**: All API requests are verified using the business-specific `token` prop.
