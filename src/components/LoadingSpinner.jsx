import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

// Animation variants
const variants = {
  spinner: {
    animate: { rotate: 360 },
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },
  text: (delay) => ({
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay } }
  })
};

const LoadingSpinner = ({ size, text, color }) => {
  // Map size prop to Tailwind classes
  const sizeClass = useMemo(() => {
    const map = {
      sm: 'w-8 h-8',
      md: 'w-12 h-12',
      lg: 'w-16 h-16',
      xl: 'w-20 h-20'
    };
    return map[size] || map.md;
  }, [size]);

  // Build border color classes
  const borderClass = useMemo(() => {
    return `border-4 border-${color}/30 border-t-${color}`;
  }, [color]);

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center">
      <motion.div
        className={`${sizeClass} ${borderClass} rounded-full`}
        variants={variants.spinner}
        animate="animate"
      />
      {text && (
        <motion.p
          className="text-white/80 mt-4 text-center"
          variants={variants.text(0.3)}
          initial="hidden"
          animate="visible"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  text: PropTypes.string,
  color: PropTypes.string
};

LoadingSpinner.defaultProps = {
  size: 'md',
  text: 'Loading...',
  color: 'white'
};

export default LoadingSpinner;
