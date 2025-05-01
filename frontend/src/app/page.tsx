import React from 'react';
import dynamic from 'next/dynamic';
import ClientLayout from '../components/ClientLayout';
import LogViewer from '../components/LogViewer';
import MessageSender from '../components/MessageSender';

// Dynamically import SystemMap to avoid SSR issues with Canvas
const SystemMap = dynamic(() => import('../components/SystemMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-800">
      <span className="text-gray-400">Loading visualization...</span>
    </div>
  ),
});

export default function Home() {
  return (
    <ClientLayout>
      <main className="flex flex-col h-full bg-gray-900 text-white">
        {/* Top section - System visualization */}
        <div className="w-full h-1/2 p-4 flex">
          <div className="w-1/2 h-full rounded-lg border border-gray-700 overflow-hidden">
            <SystemMap />
          </div>
          
          {/* Message sender */}
          <div className="w-1/2 h-full p-4">
            <MessageSender />
          </div>
        </div>

        {/* Bottom section - Logs */}
        <div className="w-full h-1/2 p-4">
          <div className="w-full h-full rounded-lg border border-gray-700 overflow-hidden">
            <LogViewer />
          </div>
        </div>
      </main>
    </ClientLayout>
  );
}
