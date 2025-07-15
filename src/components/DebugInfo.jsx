import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

// Only include debug in non-production
const isDev = process.env.NODE_ENV !== 'production';

// Animation variants for fade in/out
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 0.8, y: 0, transition: { duration: 0.2 } }
};

const DebugInfo = ({ currentScreen, currentFish, points, shortcutKey = '`' }) => {
  const [visible, setVisible] = useState(false);

  // Toggle visibility on key press
  const handleKey = useCallback(
    (e) => {
      if (e.key === shortcutKey) {
        setVisible((v) => !v);
      }
    },
    [shortcutKey]
  );

  useEffect(() => {
    if (!isDev) return;
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const entries = useMemo(
    () => [
      ['Screen', currentScreen],
      ['Fish', currentFish?.name || 'None'],
      ['Points', Array.isArray(points) ? points.join(', ') : 'None']
    ],
    [currentScreen, currentFish, points]
  );

  if (!isDev) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          variants={variants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-md font-mono text-xs z-[9999] pointer-events-none select-none max-w-xs"
        >
          <div className="font-bold mb-1">Debug Info (press {shortcutKey}):</div>
          {entries.map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <span className="opacity-75">{label}:</span>
              <span className="font-medium break-words">{value}</span>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

DebugInfo.propTypes = {
  currentScreen: PropTypes.string.isRequired,
  currentFish: PropTypes.shape({ name: PropTypes.string }),
  points: PropTypes.arrayOf(PropTypes.number),
  shortcutKey: PropTypes.string
};

DebugInfo.defaultProps = {
  currentFish: null,
  points: [],
  shortcutKey: '`'
};

export default DebugInfo;
