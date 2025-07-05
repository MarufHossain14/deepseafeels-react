import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { fishData } from '../data/fishData';

const getRandomFishSVG = () => {
  const fish = fishData[Math.floor(Math.random() * fishData.length)];
  return fish.svg;
};

const StartScreen = ({ onStartQuiz, onRandomFish }) => {
  // Pick a mascot fish SVG only once per mount
  const mascotSVG = useMemo(() => getRandomFishSVG(), []);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-3xl p-8 shadow-2xl w-full max-w-xl mx-auto text-center flex flex-col items-center"
    >
      <div className="mb-6 flex flex-col items-center">
        <motion.div
          className="mx-auto w-28 h-20 mb-4 swimming bg-white/30 rounded-full object-contain shadow"
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0, 8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          dangerouslySetInnerHTML={{ __html: mascotSVG }}
          aria-label="Mascot Fish"
        />
        <motion.h2 
          className="text-2xl md:text-3xl font-bold text-white mb-2 text-glow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Find Your Fish Mood Match
        </motion.h2>
        <motion.p 
          className="text-white/90 text-base mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Take our quick quiz or discover a random fish personality!
        </motion.p>
      </div>
      <motion.div 
        className="flex flex-col sm:flex-row justify-center gap-4 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.button
          onClick={onStartQuiz}
          className="quiz-button bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 flex-1 shadow-md"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          🎯 Take the Quiz
        </motion.button>
        <motion.button
          onClick={onRandomFish}
          className="quiz-button bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 flex-1 shadow-md"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          🎲 Random Fish
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default StartScreen; 