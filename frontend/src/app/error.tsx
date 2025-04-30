'use client';

import React from 'react';

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  React.useEffect(() => {
    // Log the error to your error reporting service
    console.error('Page level error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold text-red-500">Something went wrong!</h1>
            <p className="text-gray-400">
              We've encountered an unexpected error. Our team has been notified.
            </p>
          </div>

          <div className="bg-gray-900 rounded p-4">
            <p className="text-sm font-mono text-gray-400 break-words">
              {error.message}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => window.location.href = '/'}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Go Home
            </button>
            <button
              onClick={() => reset()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
