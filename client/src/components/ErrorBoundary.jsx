import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center bg-white rounded-3xl border border-rose-100 shadow-sm m-6">
          <div className="h-16 w-16 bg-rose-100 text-rose-500 rounded-2xl grid place-items-center mb-6">
            <ShieldAlert size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Component Failure</h2>
          <p className="text-slate-500 max-w-md mb-8">
            An unexpected error occurred while rendering this module. You can reload this specific section without restarting the entire platform.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RefreshCw size={18} />
            Reload Component
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
