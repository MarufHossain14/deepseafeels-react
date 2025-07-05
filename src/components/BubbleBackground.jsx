import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  const generateBubbles = useCallback(() => {
    const newBubbles = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 30 + 8,
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 6,
      opacity: Math.random() * 0.4 + 0.2
    }));
    setBubbles(newBubbles);
  }, []);

  useEffect(() => {
    generateBubbles();
    
    // Regenerate bubbles every 30 seconds to keep it fresh
    const interval = setInterval(generateBubbles, 30000);
    
    return () => {
      clearInterval(interval);
    };
  }, [generateBubbles]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="bubble absolute"
          style={{
            left: `${bubble.x}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            opacity: bubble.opacity,
          }}
          animate={{
            y: [-100, window.innerHeight + 100],
            opacity: [0, bubble.opacity, bubble.opacity, 0],
            scale: [0, 1, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: bubble.duration,
            delay: bubble.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Additional floating particles */}
      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default BubbleBackground; 