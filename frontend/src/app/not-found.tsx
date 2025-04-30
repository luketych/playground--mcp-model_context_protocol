'use client';

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-4xl font-bold text-gray-200">404</h1>
            <h2 className="text-2xl font-semibold text-gray-300">Page Not Found</h2>
            <p className="text-gray-400">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return Home
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Lost? Check the documentation for help navigating the MCP system.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
