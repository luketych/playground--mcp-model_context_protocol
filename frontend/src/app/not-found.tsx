import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur space-y-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg
                className="h-16 w-16 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500/50 rounded-full animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-blue-400 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-400 mb-4">
                The requested page does not exist in the MCP system.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-900/50 rounded py-2 px-4">
              <p className="font-mono text-sm text-gray-500">
                Error 404: Resource not found
              </p>
            </div>

            <Link 
              href="/"
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Dashboard
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Navigate to the home page to view available system resources.
          </p>
        </div>
      </div>

      {/* Background Effect */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}
