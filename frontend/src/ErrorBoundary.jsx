import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-6 text-center">
          <div className="max-w-xl glass-dark rounded-3xl p-8 border border-red-500/20">
            <p className="text-red-400 text-sm uppercase tracking-[0.3em] mb-3">Application error</p>
            <h1 className="text-3xl font-bold text-white mb-3">The app failed to render.</h1>
            <p className="text-slate-400 leading-relaxed">
              The deployment is live, but one of the frontend components is crashing at runtime.
              I have added a fallback so the site will no longer appear blank while I finish isolating the source.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
