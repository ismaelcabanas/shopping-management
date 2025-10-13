import React from 'react';

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
};

type State = {
  hasError: boolean;
  error?: Error | null;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // You can log the error to an external service here
    // For now we just keep it on console for debugging during development
    console.error('Uncaught error in component tree:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) this.props.onReset();
  };

  render() {
    const { hasError, error } = this.state;

    if (!hasError) {
      return this.props.children as React.ReactElement | null;
    }

    // Fallback UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-xl w-full bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-2xl font-semibold mb-2">Ha ocurrido un error</h2>
          <p className="text-gray-600 mb-4">Lo sentimos, algo falló en la aplicación.</p>
          {error && (
            <pre className="text-xs text-left bg-gray-100 p-3 rounded mb-4 overflow-auto">
              {String(error?.message)}
            </pre>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reintentar
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Recargar página
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
