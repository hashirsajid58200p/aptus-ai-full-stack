import "./globals.css";
import { Providers } from "./providers";
import { ReduxProvider } from "./redux-provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Aptus — Drop-in AI Chatbot Widget",
  description: "Drop-in AI chatbot component for React & Next.js — install via npm and go live in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/aptus-logo.png" />
        <link rel="alternate icon" href="/favicon-32x32.png" />
      </head>
      <body className="bg-[#FDF9F0] text-[#1A1A1A]">
        <ReduxProvider>
          <Providers>
            <Toaster position="top-center" />
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
