import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full bg-gray-900" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-200">
            Loading MCP System
          </h2>
          <p className="text-sm text-gray-400">
            Initializing system components...
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
