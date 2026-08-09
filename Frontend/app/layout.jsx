import "./globals.css";
import { Providers } from "./providers";

import { ReduxProvider } from "./redux-provider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Quickstart",
  description: "Chat Support Saas.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* add favicon here */}
        <link rel="icon" href="/favicon-32x32.png"/>       

      </head>
      <body >
        <ReduxProvider>
        <Providers>
        <Toaster position="top-center" />
          {children}</Providers>
        </ReduxProvider>
      </body>
    </html>
  );
}
