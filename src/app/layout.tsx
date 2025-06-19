import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NUMBERBUBUMBER",
  description: "Bubumber was a number guesser game. It is a fun and interactive way (NO!!!!) to test your number guessing skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${kanit.variable} ${kanit.variable}`}
    >
      <body className="antialiased bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
