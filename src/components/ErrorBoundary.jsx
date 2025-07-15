import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Animation variants
const variants = {
  container: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3 } }
  },
  icon: {
    animate: { rotate: [0, 10, -10, 0] },
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
  button: {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  }
};

/**
 * Default fallback UI displayed when an error is caught.
 * Accepts an error object and a reset callback.
 */
export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4"
    >
      <motion.div
        variants={variants.container}
        initial="initial"
        animate="animate"
        exit="exit"
        className="glass rounded-3xl p-10 text-center max-w-md"
      >
        <motion.div
          variants={variants.icon}
          animate="animate"
          className="text-6xl mb-6"
          aria-hidden
        >
          🐠
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-white/80 mb-2 break-words">
          {error?.message || 'An unexpected error occurred.'}
        </p>
        <motion.button
          type="button"
          onClick={resetErrorBoundary}
          className="mt-4 px-6 py-2 bg-white/20 text-white font-semibold rounded-full shadow-lg"
          whileHover="hover"
          whileTap="tap"
          variants={variants.button}
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );
}

ErrorFallback.propTypes = {
  error: PropTypes.instanceOf(Error),
  resetErrorBoundary: PropTypes.func.isRequired
};

/**
 * ErrorBoundary component catches JS errors in its child component tree.
 * Props:
 *  - onError: callback invoked with (error, errorInfo) for logging
 *  - FallbackComponent: custom UI to render on error
 *  - resetKeys: array of values that will reset the error boundary when changed
 */
export class ErrorBoundary extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    onError: PropTypes.func,
    FallbackComponent: PropTypes.elementType,
    resetKeys: PropTypes.array
  };

  static defaultProps = {
    onError: () => {},
    FallbackComponent: ErrorFallback,
    resetKeys: []
  };

  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Forward to provided error handler
    this.props.onError(error, errorInfo);
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  componentDidUpdate(prevProps) {
    // Reset boundary if resetKeys array identity changes
    if (prevProps.resetKeys !== this.props.resetKeys) {
      this.setState({ hasError: false, error: null });
    }
  }

  // Handler to manually reset the boundary
  resetErrorBoundary = () => this.setState({ hasError: false, error: null });

  render() {
    const { hasError, error } = this.state;
    const { FallbackComponent, children } = this.props;

    if (hasError) {
      return (
        <FallbackComponent
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}
export default ErrorBoundary;
