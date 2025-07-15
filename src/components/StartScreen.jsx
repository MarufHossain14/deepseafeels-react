import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fishData } from '../data/fishData';

// Define animation variants for reusability
const variants = {
  container: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { when: 'beforeChildren' } },
    exit: { opacity: 0, scale: 0.95 }
  },
  fish: {
    animate: { y: [0, -8, 0, 8, 0], transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' } }
  },
  text: (delay) => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay } }
  }),
  buttons: (delay) => ({
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { delay } }
  })
};

const StartScreen = ({ onStartQuiz, onRandomFish }) => {
  // Select a random fish SVG once per mount
  const mascotSVG = useMemo(() => {
    const { svg } = fishData[Math.floor(Math.random() * fishData.length)];
    return svg;
  }, []);

  // Memoize callbacks for performance
  const handleStart = useCallback(() => onStartQuiz(), [onStartQuiz]);
  const handleRandom = useCallback(() => onRandomFish(), [onRandomFish]);

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="glass rounded-3xl p-8 shadow-2xl max-w-xl mx-auto text-center flex flex-col items-center"
    >
      <div className="mb-6 flex flex-col items-center">
        <motion.div
          className="w-28 h-20 mb-4 bg-white/30 rounded-full p-2 shadow swimming"
          variants={variants.fish}
          animate="animate"
          aria-label="Mascot Fish"
          role="img"
          // Safe insertion; consider refactoring to ReactComponent SVGs for better type safety
          dangerouslySetInnerHTML={{ __html: mascotSVG }}
        />

        <motion.h2
          className="text-2xl md:text-3xl font-bold text-white mb-2 text-glow"
          custom={0.2}
          variants={variants.text(0.2)}
        >
          Find Your Fish Mood Match
        </motion.h2>

        <motion.p
          className="text-white/90 text-base mb-4 leading-relaxed"
          custom={0.4}
          variants={variants.text(0.4)}
        >
          Take our quick quiz or discover a random fish personality!
        </motion.p>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row justify-center gap-4 w-full"
        custom={0.6}
        variants={variants.buttons(0.6)}
      >
        <motion.button
          type="button"
          onClick={handleStart}
          className="quiz-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 flex-1 shadow-md"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          title="Start the fish mood quiz"
        >
          🎯 Take the Quiz
        </motion.button>

        <motion.button
          type="button"
          onClick={handleRandom}
          className="quiz-button bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 flex-1 shadow-md"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          title="Discover a random fish personality"
        >
          🎲 Random Fish
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

StartScreen.propTypes = {
  onStartQuiz: PropTypes.func.isRequired,
  onRandomFish: PropTypes.func.isRequired
};

export default StartScreen;
