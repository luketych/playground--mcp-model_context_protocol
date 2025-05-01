# MCP Frontend

Frontend interface for the Model Context Protocol system. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Real-time system visualization
- Message monitoring and inspection
- System control interface
- WebSocket-based communication
- Dark mode UI with animations
- Responsive design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration settings.

3. Run development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start production server:
   ```bash
   npm start
   ```

## Development

### Project Structure

```
frontend/
├── src/
│   ├── app/             # Next.js app router pages
│   ├── components/      # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── stores/         # Zustand state management
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── styles/            # Global styles and Tailwind config
```

### Key Components

- `SystemMap`: Visualizes the MCP system nodes and their connections
- `MessageInspector`: Displays message history and details
- `SystemControls`: Interface for sending test messages and controlling the system

### State Management

The application uses Zustand for state management with two main stores:
- `useSystemStore`: Manages system nodes and their states
- `useWebSocket`: Handles WebSocket communication

### WebSocket Communication

WebSocket connection is managed through the `useWebSocket` hook, which:
- Establishes connection to the MCP server
- Handles message routing
- Maintains connection state
- Provides message sending capabilities

### Styling

- Tailwind CSS for utility-first styling
- Custom animations for system visualization
- Dark mode optimized interface
- Responsive design for all screen sizes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking:
   ```bash
   npm run type-check
   npm run lint
   ```
5. Submit a pull request

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## Environment Variables

Configure these in your `.env.local`:

- `NEXT_PUBLIC_WS_URL` - WebSocket server URL
- `NODE_ENV` - Environment (development/production)

See `.env.example` for all available options.

## License

MIT License - see LICENSE file for details.
