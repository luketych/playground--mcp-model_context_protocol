import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MCP - Model Context Protocol',
  description: 'Visualization and control interface for the Model Context Protocol system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} h-full bg-gradient-to-br from-background via-gray-900 to-background text-foreground`}>
        <div className="mx-auto max-w-[1600px] min-h-screen flex flex-col">
          <header className="border-b border-gray-800 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">MCP System</h1>
                  <p className="text-sm text-gray-400">Model Context Protocol Management Interface</p>
                </div>
                <nav className="flex items-center space-x-4">
                  <a 
                    href="https://github.com/yourusername/mcp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t border-gray-800 bg-background/50 backdrop-blur-sm">
            <div className="px-6 py-4">
              <div className="text-sm text-gray-500">
                <p>Model Context Protocol &copy; {new Date().getFullYear()}</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
