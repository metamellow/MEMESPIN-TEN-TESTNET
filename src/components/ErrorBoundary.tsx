import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="game-container">
          <div className="game-wrapper">
            {/* Slot machine background */}
            <div className="game-machine" />
            
            {/* Error popup - styled like result popup */}
            <div className="game-result error show">
              <div className="error-title">⚠️ Error</div>
              <div className="error-message">
                {this.state.error?.message || 'Something went wrong'}
              </div>
              <button 
                className="error-retry-button"
                onClick={() => this.setState({ hasError: false })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
