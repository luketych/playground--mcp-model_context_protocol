'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 backdrop-blur">
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-500"
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
              </div>
              <h2 className="text-lg font-semibold text-red-400 mb-2">
                Something went wrong
              </h2>
              <div className="mb-4">
                <p className="text-gray-400">
                  An error occurred while rendering this component.
                </p>
                {this.state.error && (
                  <div className="mt-2 p-2 bg-gray-900/50 rounded text-left">
                    <p className="text-sm font-mono text-red-400">
                      {this.state.error.toString()}
                    </p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <button
                  onClick={this.handleRetry}
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
            </div>
            {this.state.errorInfo && (
              <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700 text-left overflow-auto max-h-48">
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer hover:text-gray-400 mb-2">
                    Error Details
                  </summary>
                  <pre className="whitespace-pre-wrap font-mono text-gray-400">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
