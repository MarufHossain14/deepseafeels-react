import { motion } from 'framer-motion';
import { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fishData } from '../data/fishData';

// Define animation variants for reusability
const variants = {
  hero: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } }
  },
  text: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  },
  button: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  },
  card: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  },
  fish: {
    animate: { y: [0, -8, 0, 8, 0], rotate: [0, 2, 0, -2, 0], transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' } }
  }
};

// Featured fish preview cards
const FishPreviewCard = ({ fish }) => (
  <motion.div 
    variants={variants.card}
    className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300"
  >
    <motion.div
      className="w-20 h-16 mx-auto mb-4 bg-white/20 rounded-full p-2"
      variants={variants.fish}
      animate="animate"
      dangerouslySetInnerHTML={{ __html: fish.svg }}
    />
    <h3 className="text-lg font-bold text-white mb-2">{fish.name}</h3>
    <p className="text-sm text-white/80 mb-2">{fish.mood}</p>
    <p className="text-xs text-white/70 leading-relaxed">{fish.description.slice(0, 80)}...</p>
  </motion.div>
);

const StartScreen = ({ onStartQuiz, onRandomFish }) => {
  // Select featured fish for preview
  const featuredFish = useMemo(() => {
    const indices = [0, 1, 2]; // Bubbles, Grumpus, Zenith
    return indices.map(i => fishData[i]);
  }, []);

  // Memoize callbacks for performance
  const handleStart = useCallback(() => onStartQuiz(), [onStartQuiz]);
  const handleRandom = useCallback(() => onRandomFish(), [onRandomFish]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Hero Section */}
      <motion.div
        variants={variants.hero}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <motion.h1 
          variants={variants.text}
          className="text-5xl md:text-6xl font-black text-white mb-6 text-glow"
        >
          Discover Your Deep Sea Mood Match
        </motion.h1>
        
        <motion.p 
          variants={variants.text}
          className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
        >
          Dive into the depths and uncover which deep-sea fish mirrors your current mood. 
          Are you a cheerful Bubbles, a grumpy Grumpus, or a zen Zenith? Take our quiz or get a random match to find out!
        </motion.p>

        <motion.div 
          variants={variants.button}
          className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto"
        >
          <motion.button
            type="button"
            onClick={handleStart}
            className="quiz-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🎯 Start Quiz
          </motion.button>

          <motion.button
            type="button"
            onClick={handleRandom}
            className="quiz-button bg-white/20 hover:bg-white/30 text-white py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 shadow-lg border border-white/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            🎲 Get Random Match
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Featured Fish Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mb-16"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4 text-glow">
            Meet Some of Our Mood Matches
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Explore a few of the fascinating fish personalities you might match with
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
          initial="hidden"
          animate="visible"
        >
          {featuredFish.map((fish, index) => (
            <FishPreviewCard key={fish.id} fish={fish} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

StartScreen.propTypes = {
  onStartQuiz: PropTypes.func.isRequired,
  onRandomFish: PropTypes.func.isRequired
};

export default StartScreen;
