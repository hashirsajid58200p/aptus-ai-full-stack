# Aptus AI Chatbot Widget (`aptus-ai-chatbot-widget`)

A highly customizable, themeable, secure, and responsive React AI chatbot widget component (`aptus-ai-chatbot-widget`). It enables business owners to easily drop a state-of-the-art AI-driven chatbot widget onto their website by passing a token and API backend endpoint.

---

## 📦 Installation

```bash
npm install aptus-ai-chatbot-widget
```

Or using yarn / pnpm:

```bash
yarn add aptus-ai-chatbot-widget
# or
pnpm add aptus-ai-chatbot-widget
```

---

## 🚀 Quickstart Usage

```jsx
import React from 'react';
import { ChatBot } from 'aptus-ai-chatbot-widget';

function App() {
  return (
    <div>
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN" 
        apiUrl="https://api.yourdomain.com/api/v1"
        theme="aptus"
        wantToShowSuggestions={true}
      />
    </div>
  );
}

export default App;
```

---

## 🎨 14 Built-in Theme Presets (`theme` prop)

Pass any of the following 14 built-in theme presets into the `theme` prop:

| Theme Name | Design Style & Colors | Signature Default Shape | Target Use-Case |
|------------|-----------------------|-------------------------|-----------------|
| `"aptus"` *(Default)* | **Aptus Official Signature**: Burnt Orange (`#FF4D00`), Cream (`#FDF9F0`), 3px dark borders & hard shadows | Sharp 4px Retro Box | AI SaaS, Neo-Brutalist & Retro websites |
| `"boty"` | **Natural E-Commerce**: Warm Beige, Olive Green (`#4F5B3A`), Sand | Soft 20px Organic Bubble | Skincare, E-Commerce, Organic Products |
| `"chatgpt"` | **Minimalist Dark Mode**: Dark Slate (`#212121`), Emerald Green (`#10A37F`) | Clean 12px Rounded Card | AI Platforms, Minimalist Tech Apps |
| `"compute"` | **Cyber Terminal AI**: Pitch Black (`#0C0E12`), Cyber Blue (`#38BDF8`), JetBrains Mono | 4px Tech Code Window | Cloud Infrastructure, Developer Tools |
| `"crosshaven"` | **Corporate Slate Navy**: Slate Navy (`#0F172A`), Cobalt Blue (`#2563EB`) | Corporate 10px Slate Card | Agencies, Financial, Legal & Consulting |
| `"studio"` | **Modern Design Studio**: Pitch Dark (`#0A0A0A`), Electric Yellow (`#FFD600`) | Sharp 6px Studio Window | Creative Agencies, Design Software |
| `"energy"` | **Gen-Z Neon Energy**: Acid Lime (`#A3E635`), Hot Magenta (`#EC4899`), Deep Purple | Ultra 24px Bubble Card | Youth Brands, Media, Fitness & Drinks |
| `"smarthome"` | **Clean Soft Cyan**: Ice Blue (`#F0F9FF`), Sky Cyan (`#0EA5E9`) | Soft 16px Ambient Card | Smart Home, IoT, Health & Wellness |
| `"superdesign"` | **Creative Purple Violet**: Deep Violet (`#4C1D95`), Purple (`#8B5CF6`) | Creative 14px Card | SaaS Apps, Creative Tools |
| `"professional"` | **Classic Business Light**: Royal Blue (`#1D4ED8`), Crisp White | Standard 8px Business UI | Corporate Sites, Customer Support |
| `"github"` | **GitHub Dark Mode**: Dark Slate (`#0D1117`), GitHub Green (`#238636`) | Standard 6px GitHub Card | Open-Source & Developer projects |
| `"dracula"` | **Dracula Theme**: Dracula Dark (`#282A36`), Pink (`#FF79C6`), Purple (`#BD93F9`) | IDE 10px Card | Developer Portfolios, Coding Apps |
| `"nord"` | **Nord Arctic Frost**: Polar Night (`#2E3440`), Frost Cyan (`#88C0D0`), Frost Blue | Nordic 8px Frost Card | Clean Modern SaaS & Technical Tools |
| `"cyberpunk"` | **Cyberpunk 2077 Neon**: Cyber Yellow (`#FCEE09`), Cyan (`#00F0FF`), Neon Pink | 100% Sharp 0px Edges | Gaming, Crypto & Futuristic Brands |

---

## 🛠️ Complete Props Reference

| Prop Name | Type | Default | Description |
|-----------|------|---------|-------------|
| `token` | `string` | **(Required)** | The unique business authentication token. |
| `apiUrl` | `string` | **(Required)** | The backend API endpoint URL for processing chat sessions and messages. |
| `theme` | `string` | `"aptus"` | Select one of the 14 built-in theme presets listed above. |
| `borderRadius` | `string` \| `number` | *Theme Default* | Custom border radius for the window, input boxes, and message bubbles (e.g., `'16px'` or `12`). |
| `toggleBtnRadius` | `string` \| `number` | *Theme Default* | Custom border radius for the floating launcher toggle button (e.g., `'50%'` or `'8px'`). |
| `toggleBtncolor` | `string` | *Theme Default* | Custom icon color of the floating launcher button. |
| `toggleBtnBgColor` | `string` | *Theme Default* | Custom background color of the floating launcher button. |
| `icon` | `ReactNode` | `LauncherIcon` | Custom icon for the closed floating button state. |
| `position` | `'left'` \| `'right'` | `'right'` | Floating widget placement on the viewport. |
| `animate` | `boolean` | `true` | Enables subtle bounce animation on the closed launcher button. |
| `wantToShowSuggestions` | `boolean` | `false` | Displays dynamic AI suggestion chips when the chatbot detects ambiguous queries. |

---

## 🔒 Security & Privacy Compliance

- **No Remote Telemetry**: All session details, customer inputs, and chat history are transmitted exclusively to the specified `apiUrl` endpoint. No telemetry is collected by third parties.
- **Token Verification**: Every API interaction validates the business token.
- **Isolated Package Footprint**: Inlined single-color vector SVGs without loose raster assets for fast loading and zero asset-resolution failures.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
