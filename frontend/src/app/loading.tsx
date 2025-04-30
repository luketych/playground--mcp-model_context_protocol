'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin"></div>
        </div>
        <p className="text-gray-400">Loading MCP System...</p>
      </div>
    </div>
  );
}
