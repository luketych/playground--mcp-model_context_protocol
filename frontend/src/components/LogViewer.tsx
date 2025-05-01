"use client";

import React from 'react';
import { useLogStore } from '../stores/logs';
import { LogEntry } from '../types/mcp';

const LogViewer: React.FC = () => {
  const logs = useLogStore(state => state.logs);

  return (
    <div className="relative w-full h-full bg-gray-900 text-gray-100 font-mono text-sm overflow-hidden">
      <div className="absolute inset-0 overflow-y-auto p-4">
        {logs.map((log: LogEntry, index: number) => {
          // Determine log level color
          let levelColor = 'text-gray-400'; // default
          switch (log.level) {
            case 'ERROR':
              levelColor = 'text-red-400';
              break;
            case 'WARN':
              levelColor = 'text-yellow-400';
              break;
            case 'INFO':
              levelColor = 'text-blue-400';
              break;
            case 'DEBUG':
              levelColor = 'text-green-400';
              break;
          }

          return (
            <div key={index} className="whitespace-pre-wrap mb-1">
              <span className="text-gray-500">[{log.timestamp}]</span>{' '}
              <span className={levelColor}>[{log.level}]</span>{' '}
              <span className="text-gray-300">[{log.source}]</span>{' '}
              <span className="text-gray-100">{log.message}</span>
              {log.data && (
                <pre className="text-gray-400 ml-4 mt-1">
                  {JSON.stringify(log.data, null, 2)}
                </pre>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LogViewer;
