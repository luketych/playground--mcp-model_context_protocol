import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ReactNode, Suspense } from 'react';
import ClientLayout from '../components/ClientLayout';
import Loading from './loading';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCP - Model Context Protocol',
  description: 'Visualization and control interface for the Model Context Protocol system',
}

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} h-full`}>
        <Suspense fallback={<Loading />}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  )
}
