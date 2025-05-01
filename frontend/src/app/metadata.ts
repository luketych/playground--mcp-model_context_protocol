import { Metadata } from 'next';

const appName = 'MCP - Model Context Protocol';
const appDescription = 'A system for efficient communication and context sharing between multiple AI applications.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  applicationName: appName,
  authors: [{ name: 'MCP Team' }],
  keywords: [
    'MCP',
    'AI',
    'Model Context Protocol',
    'Machine Learning',
    'System Monitoring',
    'Real-time Communication'
  ],
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  category: 'technology',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: appName,
    description: appDescription,
    siteName: appName,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: appName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: appName,
    description: appDescription,
    images: ['/twitter-image.png'],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'msapplication-TileColor': '#111827',
  },
};

export const viewportMeta = {
  themeColor: '#111827',
};
