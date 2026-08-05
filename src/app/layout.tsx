import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aditya Desai | Software Engineer & Data Engineer",
    template: "%s | Aditya Desai",
  },
  description:
    "Explore Aditya Desai's software engineering, data engineering, and full-stack projects through an accessible interactive terminal portfolio.",
  authors: [{ name: "Aditya Desai" }],
  creator: "Aditya Desai",
  keywords: [
    "Aditya Desai",
    "software engineer",
    "data engineer",
    "full-stack developer",
    "Monash University",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    title: "Aditya Desai | Software Engineer & Data Engineer",
    description:
      "Software engineering, data engineering, and full-stack projects in an accessible interactive terminal portfolio.",
    siteName: "Aditya Desai Portfolio",
  },
  twitter: {
    card: "summary",
    title: "Aditya Desai | Software Engineer & Data Engineer",
    description:
      "Software engineering, data engineering, and full-stack projects.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jetbrainsMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
