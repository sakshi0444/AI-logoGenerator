import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./provider";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "AI Logo Generator",
  description: "Create unique, professional logos with the power of AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning>
        <div className="min-h-screen bg-gray-50">
          <Provider>
            {children}
          </Provider>
        </div>
      </body>
    </html>
  );
}
