import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Simple M icon as base64
const favicon = `data:image/svg+xml;base64,${Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#000"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="24" fill="#fff">M</text>
</svg>
`).toString('base64')}`;

export const metadata: Metadata = {
  title: 'MCP Development Environment',
  description: 'Model Context Protocol Development Environment',
  icons: {
    icon: favicon,
    shortcut: favicon,
    apple: favicon
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href={favicon} type="image/svg+xml" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
