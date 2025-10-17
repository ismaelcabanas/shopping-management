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

class ErrorBoundary extends React.Component<Props, State> {
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
      return this.props.children;
    }

    // Fallback UI
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '500px', width: '100%', backgroundColor: 'white', borderRadius: '8px', padding: '24px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '8px' }}>Ha ocurrido un error</h2>
          <p style={{ color: '#666', marginBottom: '16px' }}>Lo sentimos, algo falló en la aplicación.</p>
          {error && (
            <pre style={{ fontSize: '12px', textAlign: 'left', backgroundColor: '#f5f5f5', padding: '12px', borderRadius: '4px', marginBottom: '16px', overflow: 'auto' }}>
              {String(error?.message)}
            </pre>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button
              onClick={this.handleReset}
              style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Reintentar
            </button>

            <button
              onClick={() => window.location.reload()}
              style={{ padding: '8px 16px', backgroundColor: '#e5e7eb', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
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
