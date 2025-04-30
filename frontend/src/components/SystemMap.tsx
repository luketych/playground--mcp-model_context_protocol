'use client';

import React, { useRef, useEffect } from 'react';
import { useSystemStore } from '@/stores/system';
import { SystemNode, AppId } from '@/types/mcp';

const NODE_POSITIONS: Record<AppId, { x: number; y: number }> = {
  'AppA': { x: 25, y: 25 },
  'AppB': { x: 75, y: 25 },
  'AppC': { x: 75, y: 75 },
  'MCP': { x: 25, y: 75 }
};

const TEST_NODES: SystemNode[] = [
  {
    id: 'AppA',
    type: 'app',
    name: 'App A',
    status: 'active',
    port: 5001,
    description: 'Email Processing Service',
    queue: []
  },
  {
    id: 'AppB',
    type: 'app',
    name: 'App B',
    status: 'active',
    port: 5002,
    description: 'Task Execution Engine',
    queue: []
  },
  {
    id: 'AppC',
    type: 'app',
    name: 'App C',
    status: 'inactive',
    port: 5003,
    description: 'System Monitor',
    queue: []
  },
  {
    id: 'MCP',
    type: 'mcp',
    name: 'MCP',
    status: 'active',
    port: 8765,
    description: 'Message Control Protocol',
    queue: []
  }
];

const SystemMap: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { nodes, addNode } = useSystemStore();

  useEffect(() => {
    // Initialize test nodes if no nodes exist
    if (nodes.size === 0) {
      TEST_NODES.forEach(node => addNode(node));
    }
  }, [nodes.size, addNode]);

  const getNodeColor = (nodeId: AppId) => {
    const colorMap: Record<AppId, string> = {
      'AppA': 'appa',
      'AppB': 'appb',
      'AppC': 'appc',
      'MCP': 'mcp'
    };
    return colorMap[nodeId] || 'gray';
  };

  const normalizePosition = (pos: { x: number; y: number }, containerWidth: number, containerHeight: number) => ({
    x: (pos.x * containerWidth) / 100,
    y: (pos.y * containerHeight) / 100
  });

  const renderNodes = () => {
    if (!containerRef.current) return null;
    const { clientWidth, clientHeight } = containerRef.current;

    return Array.from(nodes.values()).map((node) => {
      const pos = NODE_POSITIONS[node.id];
      if (!pos) return null;

      const { x, y } = normalizePosition(pos, clientWidth, clientHeight);
      const statusColor = node.status === 'active' ? 'bg-green-500' : node.status === 'error' ? 'bg-red-500' : 'bg-yellow-500';
      const nodeColor = getNodeColor(node.id);

      return (
        <div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: x, top: y }}
        >
          <div className={`w-24 h-24 relative group`}>
            <div className={`absolute inset-0 rounded-full bg-${nodeColor}/10 animate-pulse-slow`} />
            <div className={`absolute inset-2 rounded-full border-2 border-${nodeColor} bg-background flex items-center justify-center`}>
              <div className="text-center">
                <div className={`font-mono text-sm text-${nodeColor}`}>{node.id}</div>
                <div className="text-xs text-gray-400">{node.status}</div>
              </div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${statusColor} ring-2 ring-background`} />
            </div>
            {/* Node details on hover */}
            <div className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 transform opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <div className="node-card">
                <div className="text-xs space-y-1">
                  <div>Port: {node.port}</div>
                  <div>Queue: {node.queue.length} items</div>
                  <div className="truncate">{node.description}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  const renderConnections = () => {
    if (!containerRef.current) return null;
    const { clientWidth, clientHeight } = containerRef.current;

    const connections = [
      { from: 'AppA', to: 'MCP' },
      { from: 'AppB', to: 'MCP' },
      { from: 'AppC', to: 'MCP' }
    ];

    return (
      <svg className="absolute inset-0 pointer-events-none">
        {connections.map(({ from, to }) => {
          const fromPos = NODE_POSITIONS[from as AppId];
          const toPos = NODE_POSITIONS[to as AppId];
          if (!fromPos || !toPos) return null;

          const start = normalizePosition(fromPos, clientWidth, clientHeight);
          const end = normalizePosition(toPos, clientWidth, clientHeight);

          return (
            <line
              key={`${from}-${to}`}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              className="connection-line"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gray-900/30 rounded-lg">
      {renderConnections()}
      {renderNodes()}
    </div>
  );
};

export default SystemMap;
