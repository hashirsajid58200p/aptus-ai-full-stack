import "./globals.css";
import { Providers } from "./providers";
import { ReduxProvider } from "./redux-provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Aptus AI — NPM Chatbot Widget",
  description: "NPM AI chatbot component for React & Next.js — install via npm and go live in seconds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/aptus-logo.png" />
        <link rel="alternate icon" href="/favicon-32x32.png" />
      </head>
      <body className="bg-[#FDF9F0] text-[#1A1A1A] overflow-x-hidden w-full">
        <ReduxProvider>
          <Providers>
            <Toaster
              position="top-right"
              toastOptions={{
                className: "border-3 border-[#1a1a1a] shadow-neo font-bold text-sm text-[#1a1a1a] bg-white rounded-none",
                style: {
                  border: "3px solid #1a1a1a",
                  boxShadow: "4px 4px 0px #1a1a1a",
                  borderRadius: "0px",
                  background: "#ffffff",
                  color: "#1a1a1a",
                  fontWeight: "700",
                  fontFamily: "'Space Grotesk', sans-serif",
                  padding: "12px 16px",
                },
                success: {
                  style: {
                    border: "3px solid #1a1a1a",
                    boxShadow: "4px 4px 0px #1a1a1a",
                    borderRadius: "0px",
                    background: "#ffffff",
                    color: "#1a1a1a",
                  },
                  iconTheme: {
                    primary: "#1a1a1a",
                    secondary: "#BFF000",
                  },
                },
                error: {
                  style: {
                    border: "3px solid #1a1a1a",
                    boxShadow: "4px 4px 0px #1a1a1a",
                    borderRadius: "0px",
                    background: "#ffffff",
                    color: "#1a1a1a",
                  },
                  iconTheme: {
                    primary: "#FF4D00",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
            {children}
          </Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
