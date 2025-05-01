'use client';

import React from 'react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">
                Application Error
              </h2>
              <p className="text-gray-400 mb-4">
                An unexpected error occurred while loading the application.
              </p>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded p-4 text-left mb-6">
            <p className="font-mono text-sm text-red-400 break-words">
              {error.message}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="btn-primary w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary w-full"
            >
              Reload Page
            </button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            If the problem persists, please check the server status or contact support.
          </p>
        </div>
      </div>

      {/* Background Effect */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}
