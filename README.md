# 🚀 QuickStart AI

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js%204-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange?style=flat-square)](https://groq.com/)

QuickStart AI is a premium, full-stack SaaS platform designed to empower businesses with custom, AI-powered chatbots. It allows businesses to easily train a chatbot on their specific information, test it in an interactive playground, and deploy it to automate customer service.

---

## 📸 Platform Previews & Screenshots

<details>
  <summary>🔍 Click to view previews</summary>

  ### 🏠 Landing Page
  ![QuickStart AI Home](previews/home.png)

  ### 🧠 Chatbot Training & FAQ Setup
  Easily train your chatbot by adding custom Business Details and FAQs.
  ![Training and FAQ Generator](previews/training%20tab.png)

  ### 💬 Playground / Testing Chatbot
  Test your trained chatbot directly in the dashboard interactive playground.
  ![Testing Chatbot Playground](previews/testingchatbot.png)

  ### 🤖 Chatbot Widget Interface
  The elegant customer-facing floating chatbot widget.
  ![QuickStart Chatbot Widget](previews/quickstart-chatbot.png)

  ### 🔗 Live Platform Integration
  An example of the chatbot widget seamlessly integrated and tested on another platform (FitLife Pro).
  ![Chatbot Live Integration on FitLife Pro](previews/fitlife_testingonaplatform.png)

</details>

---

## ✨ Features

- **Instant Chatbot Setup**: Set up and train your chatbot in minutes using simple business information (Name, Description, FAQs).
- **Free, High-Performance AI Generation**: Powered by the **Groq API** (`llama-3.3-70b-versatile`), offering high-speed, cost-free completions with robust system instructions.
- **Interactive Training Dashboard**: Train the chatbot with dynamically generated questions or manually inputted custom Q&As.
- **Embedded Chat Widget**: Integrate a floating conversational widget onto external websites.
- **Interactive Playground**: Chatbot playground allowing real-time testing of system prompt behaviors, business detail context, and user input.
- **Token Management**: Integrated Token Tracker panel to manage usage limits.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Next.js App)
- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit (with React Redux)
- **Styling**: Tailwind CSS & NextUI
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons

### Backend (Node.js & Express)
- **Server**: Express.js
- **Database**: MongoDB with Mongoose (configured with custom DNS resolution to prevent SRV lookup failures)
- **AI Core**: Groq SDK (Llama 3.3 Llama-70b model)
- **Security & Performance**: Express Rate Limit, Cookie Parser, Compression, Cors, and Morgan logging.

---

## 🔌 Chatbot Widget Integration

To integrate the QuickStart AI chatbot widget onto any React / Next.js website, use the new widget package:

### 1. Install the Widget
```bash
npm install quickstart-ai-chatbot-widget
```

### 2. Import and Use the Widget
```jsx
import React from 'react';
import { ChatBot } from 'quickstart-ai-chatbot-widget';

function App() {
  return (
    <div>
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN" 
        apiUrl="https://quick-start-ai-backend.vercel.app/api/v1" // Your quickstart-ai backend URL
        theme="primary"
        wantToShowSuggestions={true}
      />
    </div>
  );
}

export default App;
```

---

## ⚙️ Installation & Getting Started (Local Development)
# 🚀 QuickStart AI

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Express](https://img.shields.io/badge/Backend-Express.js%204-lightgrey?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Llama%203.3-orange?style=flat-square)](https://groq.com/)

QuickStart AI is a premium, full-stack SaaS platform designed to empower businesses with custom, AI-powered chatbots. It allows businesses to easily train a chatbot on their specific information, test it in an interactive playground, and deploy it to automate customer service.

---

## 📸 Platform Previews & Screenshots

<details>
  <summary>🔍 Click to view previews</summary>

  ### 🏠 Landing Page
  ![QuickStart AI Home](previews/home.png)

  ### 🧠 Chatbot Training & FAQ Setup
  Easily train your chatbot by adding custom Business Details and FAQs.
  ![Training and FAQ Generator](previews/training%20tab.png)

  ### 💬 Playground / Testing Chatbot
  Test your trained chatbot directly in the dashboard interactive playground.
  ![Testing Chatbot Playground](previews/testingchatbot.png)

  ### 🤖 Chatbot Widget Interface
  The elegant customer-facing floating chatbot widget.
  ![QuickStart Chatbot Widget](previews/quickstart-chatbot.png)

  ### 🔗 Live Platform Integration
  An example of the chatbot widget seamlessly integrated and tested on another platform (FitLife Pro).
  ![Chatbot Live Integration on FitLife Pro](previews/fitlife_testingonaplatform.png)

</details>

---

## ✨ Features

- **Instant Chatbot Setup**: Set up and train your chatbot in minutes using simple business information (Name, Description, FAQs).
- **Free, High-Performance AI Generation**: Powered by the **Groq API** (`llama-3.3-70b-versatile`), offering high-speed, cost-free completions with robust system instructions.
- **Interactive Training Dashboard**: Train the chatbot with dynamically generated questions or manually inputted custom Q&As.
- **Embedded Chat Widget**: Integrate a floating conversational widget onto external websites.
- **Interactive Playground**: Chatbot playground allowing real-time testing of system prompt behaviors, business detail context, and user input.
- **Token Management**: Integrated Token Tracker panel to manage usage limits.

---

## 🛠️ Tech Stack & Architecture

### Frontend (Next.js App)
- **Framework**: Next.js (App Router)
- **State Management**: Redux Toolkit (with React Redux)
- **Styling**: Tailwind CSS & NextUI
- **Animations**: Framer Motion
- **Icons**: Lucide React & React Icons

### Backend (Node.js & Express)
- **Server**: Express.js
- **Database**: MongoDB with Mongoose (configured with custom DNS resolution to prevent SRV lookup failures)
- **AI Core**: Groq SDK (Llama 3.3 Llama-70b model)
- **Security & Performance**: Express Rate Limit, Cookie Parser, Compression, Cors, and Morgan logging.

---

## 🔌 Chatbot Widget Integration

To integrate the QuickStart AI chatbot widget onto any React / Next.js website, use the new widget package:

### 1. Install the Widget
```bash
npm install quickstart-ai-chatbot-widget
```

### 2. Import and Use the Widget
```jsx
import React from 'react';
import { ChatBot } from 'quickstart-ai-chatbot-widget';

function App() {
  return (
    <div>
      <ChatBot 
        token="YOUR_BUSINESS_TOKEN" 
        apiUrl="https://quick-start-ai-backend.vercel.app/api/v1" // Your quickstart-ai backend URL
        theme="primary"
        wantToShowSuggestions={true}
      />
    </div>
  );
}

export default App;
```

---

## ⚙️ Installation & Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance
- Groq API Key

### Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a configuration file in `backend/config/.env` and add the following environment variables:
   ```env
   PORT=3000
   DB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COOKIE_EXPIRE=10
   JWT_EXPIRE=10d
   CRYPTO_SECRET_KEY=your_crypto_secret
   GROQ_API_KEY=your_groq_api_key
   ```
4. Start the backend server:
   ```bash
   npm run server
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

### Concurrent Development (Recommended)
You can start both the Backend server and Frontend Next.js app concurrently from the `backend` directory:
```bash
cd backend
npm run dev
```
