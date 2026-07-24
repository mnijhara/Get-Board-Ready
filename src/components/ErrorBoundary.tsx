import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 font-sans">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center space-y-4">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
            <p className="text-sm text-slate-500">
              We hit an unexpected error. Your progress is safe in the cloud.
            </p>
            {this.state.error && (
              <p className="text-xs font-mono bg-slate-50 p-3 rounded-lg text-slate-400 text-left">
                {this.state.error.message}
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reload App</span>
            </button>
            <a
              href="mailto:support@getboardready.online"
              className="block text-xs text-slate-400 hover:text-indigo-600 transition-colors"
            >
              Contact support if this keeps happening
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
