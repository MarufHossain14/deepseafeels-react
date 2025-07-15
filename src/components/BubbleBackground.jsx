import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

// Centralized animation variants
const bubbleAnimate = {
  y: ['-50px', '100vh'],
  opacity: [0, 1, 1, 0],
  scale: [0, 1, 1, 0],
  rotate: [0, 360]
};

const particleAnimate = {
  y: [0, -20, 0],
  opacity: [0.3, 0.8, 0.3],
  scale: [1, 1.5, 1]
};

const BubbleBackground = ({ bubbleCount, particleCount, regenInterval }) => {
  const [bubbles, setBubbles] = useState([]);

  // Generate random bubble data
  const generateBubbles = useCallback(() => {
    const newBubbles = Array.from({ length: bubbleCount }).map((_, i) => ({
      id: `bubble-${i}-${Date.now()}`,
      x: Math.random() * 100,
      size: Math.random() * 30 + 8,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4,
      opacity: Math.random() * 0.4 + 0.2
    }));
    setBubbles(newBubbles);
  }, [bubbleCount]);

  // Regenerate bubbles on mount and at intervals
  useEffect(() => {
    generateBubbles();
    const id = setInterval(generateBubbles, regenInterval);
    return () => clearInterval(id);
  }, [generateBubbles, regenInterval]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map(({ id, x, size, delay, duration, opacity }) => (
        <motion.div
          key={id}
          className="absolute rounded-full bg-white/50"
          style={{
            left: `${x}%`,
            width: `${size}px`,
            height: `${size}px`,
            opacity
          }}
          animate={bubbleAnimate}
          transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      {Array.from({ length: particleCount }).map((_, i) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{ left: `${left}%`, top: `${top}%` }}
            animate={particleAnimate}
            transition={{ duration: 3 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        );
      })}
    </div>
  );
};

BubbleBackground.propTypes = {
  bubbleCount: PropTypes.number,
  particleCount: PropTypes.number,
  regenInterval: PropTypes.number
};

BubbleBackground.defaultProps = {
  bubbleCount: 25,
  particleCount: 10,
  regenInterval: 30000
};

export default BubbleBackground;
