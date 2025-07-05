import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FishCard from './components/FishCard';
import MoodQuiz from './components/MoodQuiz';
import StartScreen from './components/StartScreen';
import BubbleBackground from './components/BubbleBackground';
import ShareButton from './components/ShareButton';
import DebugInfo from './components/DebugInfo';
import { getRandomFish } from './data/fishData';

function Confetti({ show }) {
  if (!show) return null;
  // Generate 30 confetti pieces with random color and position
  const colors = ['#FFD700', '#8B4513', '#87CEEB', '#FF69B4', '#2F4F4F', '#DDA0DD', '#FF6347', '#98FB98'];
  return (
    <div className="confetti">
      {Array.from({ length: 30 }).map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className="confetti-piece"
            style={{ left: `${left}vw`, background: color, animationDelay: `${delay}s` }}
          />
        );
      })}
    </div>
  );
}

function App() {
  const [currentFish, setCurrentFish] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'quiz', 'result'
  const [isLoading, setIsLoading] = useState(true);
  const [debugPoints, setDebugPoints] = useState(Array(8).fill(0));

  useEffect(() => {
    // Show initial screen after a brief loading animation
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleStartQuiz = useCallback(() => {
    console.log('Starting quiz...');
    setCurrentScreen('quiz');
  }, []);

  const handleRandomFish = useCallback(() => {
    try {
      console.log('Getting random fish...');
      const randomFish = getRandomFish();
      console.log('Random fish:', randomFish);
      setCurrentFish(randomFish);
      setCurrentScreen('result');
    } catch (error) {
      console.error('Error revealing random fish:', error);
    }
  }, []);

  const handleQuizComplete = useCallback((fish) => {
    console.log('Quiz completed, fish:', fish);
    setCurrentFish(fish);
    setCurrentScreen('result');
  }, []);

  const handleBackFromQuiz = useCallback(() => {
    console.log('Going back from quiz...');
    setCurrentScreen('start');
  }, []);

  const handleRevealAnother = useCallback(() => {
    try {
      console.log('Revealing another fish...');
      const randomFish = getRandomFish();
      console.log('New random fish:', randomFish);
      setCurrentFish(randomFish);
    } catch (error) {
      console.error('Error revealing another fish:', error);
    }
  }, []);

  const handleTakeQuiz = useCallback(() => {
    console.log('Taking quiz from result screen...');
    setCurrentScreen('quiz');
  }, []);

  const handleRetakeQuiz = useCallback(() => {
    console.log('Retaking quiz...');
    setCurrentScreen('start');
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative overflow-hidden">
        <BubbleBackground />
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center z-10"
        >
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-9xl mb-8 drop-shadow-2xl"
          >
            🐠
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold text-white mb-6 text-glow"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            FishMood
          </motion.h1>
          <motion.p 
            className="text-2xl text-white/90 font-medium"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Discovering your mood fish...
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="w-16 h-1 bg-white/50 rounded-full mx-auto overflow-hidden">
              <motion.div
                className="h-full bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
      <BubbleBackground />
      <div className="absolute inset-0 bg-black/5"></div>
      
      {/* Debug Info */}
      <DebugInfo 
        currentScreen={currentScreen}
        currentFish={currentFish}
        points={debugPoints}
      />
      
      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.header 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-2 text-glow flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <span role="img" aria-label="fish">🐟</span> deepseafeels <span role="img" aria-label="fish">🐟</span>
          </motion.h1>
          <div className="glass rounded-2xl p-3 max-w-2xl mx-auto mt-2 border border-white/10">
            <p className="text-base text-white/90 font-normal">
              Discover which deep-sea fish represents your current mood with our quirky mood quiz! Each fish has its own personality and story to tell.
            </p>
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="flex flex-col items-center">
          <AnimatePresence mode="wait">
            {currentScreen === 'start' && (
              <StartScreen 
                key="start"
                onStartQuiz={handleStartQuiz}
                onRandomFish={handleRandomFish}
              />
            )}
            
            {currentScreen === 'quiz' && (
              <MoodQuiz 
                key="quiz"
                onComplete={handleQuizComplete}
                onBack={handleBackFromQuiz}
              />
            )}
            
            {currentScreen === 'result' && currentFish && (
              <div key="result" className="w-full flex flex-col items-center relative">
                <Confetti show={true} />
                <FishCard fish={currentFish} />
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    className="quiz-button bg-gradient-to-r from-blue-400 to-blue-600 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 shadow-md"
                    onClick={handleRevealAnother}
                  >
                    🐟 Discover Another Fish
                  </button>
                  <button
                    className="quiz-button bg-gradient-to-r from-pink-400 to-pink-600 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 shadow-md"
                    onClick={handleTakeQuiz}
                  >
                    🎯 Take the Quiz Again
                  </button>
                  <button
                    className="quiz-button bg-gradient-to-r from-green-400 to-green-600 text-white py-3 px-6 rounded-full font-semibold text-base transition-all duration-300 shadow-md"
                    onClick={handleRetakeQuiz}
                  >
                    🔄 Retake Quiz
                  </button>
                </div>
                {/* Share Button */}
                <motion.div
                  className="mt-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <ShareButton fish={currentFish} />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer 
          className="flex flex-col items-center justify-center mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg"
            style={{
              background: 'linear-gradient(90deg, rgba(56,182,255,0.18) 0%, rgba(255,255,255,0.55) 100%)',
              border: '2px solid #7EE8FA',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              fontSize: '1.15rem',
              fontWeight: 600,
              color: '#234E70',
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              minWidth: 260,
            }}
          >
            {/* Animated fish SVG */}
            <motion.span
              className="inline-block mr-2"
              animate={{ x: [0, 8, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              style={{ display: 'inline-block', width: 32, height: 22 }}
            >
              <svg width="32" height="22" viewBox="0 0 90 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="45" cy="30" rx="18" ry="10" fill="#38B6FF"/>
                <ellipse cx="30" cy="30" rx="5" ry="3" fill="#38B6FF"/>
                <ellipse cx="60" cy="30" rx="5" ry="3" fill="#38B6FF"/>
                <circle cx="40" cy="27" r="2" fill="#fff"/>
                <circle cx="40" cy="27" r="1" fill="#234E70"/>
                <circle cx="50" cy="27" r="2" fill="#fff"/>
                <circle cx="50" cy="27" r="1" fill="#234E70"/>
                <path d="M43 35 Q45 38 47 35" stroke="#234E70" strokeWidth="1.5" fill="none"/>
                <polygon points="18,30 6,22 6,38" fill="#7EE8FA"/>
                <polygon points="72,30 84,22 84,38" fill="#7EE8FA"/>
              </svg>
            </motion.span>
            <span className="inline-block">
              Made with
              <motion.span
                className="mx-1"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                style={{ display: 'inline-block' }}
                role="img"
                aria-label="love"
              >
                💙
              </motion.span>
              and lots of fish puns
            </span>
          </div>
        </motion.footer>
      </div>
    </div>
  );
}

export default App;
