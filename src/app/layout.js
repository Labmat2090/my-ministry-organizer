// src/app/layout.js
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My Ministry Organizer',
  description: 'Field service organizer for pioneers - track hours, bible studies, and return visits',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-primary-600">
                    My Ministry Organizer
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your field service activity
                  </p>
                </div>
                <nav className="flex gap-4">
                  <a 
                    href="/"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Calendar
                  </a>
                  <a 
                    href="/settings"
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    Settings
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto no-print">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                  Your data is stored locally on your device
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>🔒 Privacy First</span>
                  <span>•</span>
                  <span>📴 Offline Ready</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
