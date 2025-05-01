"use client";

import React, { useEffect, useRef } from 'react';
import { useLogStore } from '../stores/logs';
import { useSystemStore, getNodeByName } from '../stores/system';
import { LogEntry, SystemNode, MessageAnimation } from '../types/mcp';

const SystemMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useSystemStore(state => state.nodes);
  const messages = useLogStore(state => 
    state.logs.filter((log: LogEntry) => log.type === 'message')
  );
  
  // Animation frame management
  const animationFrameRef = useRef<number>();
  const lastRenderRef = useRef<number>(0);
  const messageAnimationsRef = useRef<MessageAnimation[]>([]);

  // Constants
  const NODE_SIZE = 80;
  const ANIMATION_DURATION = 1000; // ms
  const NODE_COLORS: Record<string, string> = {
    mcp: '#4CAF50',
    app_a: '#2196F3',
    app_b: '#9C27B0',
    app_c: '#FF9800',
    'web-ui': '#E91E63',
    default: '#757575'
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = (timestamp: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update canvas size to match container
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      // Draw nodes
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      // Get MCP node
      const mcpNode = getNodeByName(nodes, 'mcp');
      if (mcpNode) {
        drawNode(ctx, centerX, centerY, mcpNode);
      }

      // Draw other nodes in a circle
      const otherNodes = nodes.filter(node => node.name !== 'mcp');
      otherNodes.forEach((node, index) => {
        const angle = (index * 2 * Math.PI) / otherNodes.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        drawNode(ctx, x, y, node);
      });

      // Update and draw message animations
      updateMessageAnimations(timestamp);
      drawMessageAnimations(ctx, centerX, centerY, radius);

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
      lastRenderRef.current = timestamp;
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes]);

  // Update message animations when new messages arrive
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.source || !latestMessage?.target) return;

    messageAnimationsRef.current.push({
      id: Math.random().toString(),
      source: latestMessage.source,
      target: latestMessage.target,
      progress: 0,
      startTime: performance.now()
    });
  }, [messages]);

  const drawNode = (ctx: CanvasRenderingContext2D, x: number, y: number, node: SystemNode) => {
    ctx.save();
    
    // Draw node rectangle
    ctx.fillStyle = NODE_COLORS[node.name] || NODE_COLORS.default;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x - NODE_SIZE/2, y - NODE_SIZE/2, NODE_SIZE, NODE_SIZE, 10);
    ctx.fill();
    ctx.stroke();

    // Draw node label
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.name, x, y);

    // Draw status indicator
    const statusColor = node.status === 'online' ? '#4CAF50' : '#f44336';
    ctx.fillStyle = statusColor;
    ctx.beginPath();
    ctx.arc(x + NODE_SIZE/2 - 6, y - NODE_SIZE/2 + 6, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const updateMessageAnimations = (timestamp: number) => {
    messageAnimationsRef.current = messageAnimationsRef.current.filter(msg => {
      const elapsed = timestamp - msg.startTime;
      msg.progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      return msg.progress < 1;
    });
  };

  const drawMessageAnimations = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number
  ) => {
    messageAnimationsRef.current.forEach(msg => {
      const sourceNode = getNodeByName(nodes, msg.source);
      const targetNode = getNodeByName(nodes, msg.target);
      
      if (!sourceNode || !targetNode) return;

      const sourcePos = getNodePosition(sourceNode.name, centerX, centerY, radius);
      const targetPos = getNodePosition(targetNode.name, centerX, centerY, radius);
      
      if (!sourcePos || !targetPos) return;

      const x = sourcePos.x + (targetPos.x - sourcePos.x) * msg.progress;
      const y = sourcePos.y + (targetPos.y - sourcePos.y) * msg.progress;

      // Draw message dot
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw path line
      ctx.beginPath();
      ctx.strokeStyle = '#ffffff44';
      ctx.setLineDash([4, 4]);
      ctx.moveTo(sourcePos.x, sourcePos.y);
      ctx.lineTo(targetPos.x, targetPos.y);
      ctx.stroke();
    });
  };

  const getNodePosition = (nodeName: string, centerX: number, centerY: number, radius: number) => {
    if (nodeName === 'mcp') {
      return { x: centerX, y: centerY };
    }

    const otherNodes = nodes.filter(node => node.name !== 'mcp');
    const index = otherNodes.findIndex(node => node.name === nodeName);
    if (index === -1) return null;

    const angle = (index * 2 * Math.PI) / otherNodes.length;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  return (
    <div className="w-full h-full bg-gray-900">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
};

export default SystemMap;
