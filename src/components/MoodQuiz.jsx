import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { quizQuestions, calculateFishFromPoints } from '../data/fishData';

// In CardBubbles, update bubble colors to use new accent palette
const bubbleColors = [
  '#38B6FF', '#FFD166', '#FF6F61', '#B388FF', '#7EE8FA', '#234E70', '#FFF', '#FFD1DC'
];

// Animated bubbles for the card background
function CardBubbles() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${18 + Math.random() * 32}px`,
            height: `${18 + Math.random() * 32}px`,
            left: `${Math.random() * 90}%`,
            bottom: `${Math.random() * 60}%`,
            background: bubbleColors[i % bubbleColors.length],
            opacity: 0.13 + Math.random() * 0.12,
            filter: 'blur(1.5px)',
          }}
          animate={{
            y: [0, -30 - Math.random() * 40, 0],
            opacity: [0.13, 0.22, 0.13],
          }}
          transition={{
            duration: 5 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Light rays overlay SVG
function LightRays() {
  return (
    <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
      <defs>
        <linearGradient id="rays" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="260" fill="url(#rays)" />
      <g opacity="0.18">
        <path d="M40 0 L80 260" stroke="#fff" strokeWidth="8" />
        <path d="M120 0 L160 260" stroke="#fff" strokeWidth="6" />
        <path d="M200 0 L220 260" stroke="#fff" strokeWidth="5" />
        <path d="M300 0 L320 260" stroke="#fff" strokeWidth="7" />
        <path d="M370 0 L390 260" stroke="#fff" strokeWidth="4" />
      </g>
    </svg>
  );
}

const ProgressBar = ({ progress }) => (
  <div className="w-full max-w-xl mx-auto mt-2 mb-6 relative h-5">
    <div className="absolute left-0 top-0 h-5 w-full bg-gradient-to-r from-blue-100 via-cyan-100 to-yellow-100 rounded-full" />
    <motion.div
      className="h-5 rounded-full bg-gradient-to-r from-[#234E70] via-[#38B6FF] to-[#FFD166] shadow-md"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ minWidth: 16 }}
    />
    {/* Bubbles */}
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `${progress / 5 * i}%` }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: bubbleColors[i % bubbleColors.length], opacity: 0.8 }}
        />
      </motion.div>
    ))}
  </div>
);

// In optionVariants, update gradients and border colors
const optionVariants = {
  initial: { scale: 1, background: 'rgba(255,255,255,0.97)', color: '#234E70', border: '2px solid #38B6FF', boxShadow: '0 2px 8px 0 rgba(35,78,112,0.04)' },
  hover: { scale: 1.04, background: 'linear-gradient(90deg, #7EE8FA 0%, #B388FF 100%)', color: '#234E70', border: '2.5px solid #FFD166', boxShadow: '0 4px 16px 0 rgba(56,182,255,0.10)' },
  selected: { scale: 1.08, background: 'linear-gradient(90deg, #FF6F61 0%, #FFD166 50%, #38B6FF 100%)', color: '#fff', border: '3px solid #38B6FF', boxShadow: '0 0 0 6px #7EE8FA, 0 8px 32px 0 rgba(56,182,255,0.12)' },
};

const MoodQuiz = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState(Array(8).fill(0));
  const [selectedOption, setSelectedOption] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [splash, setSplash] = useState(false);

  const handleOptionSelect = (optionIndex, optionPoints) => {
    setSelectedOption(optionIndex);
    setSplash(true);
    setTimeout(() => setSplash(false), 350);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    // Add points for the selected option
    const selectedPoints = quizQuestions[currentQuestion].options[selectedOption].points;
    const newPoints = points.map((p, i) => p + selectedPoints[i]);
    setPoints(newPoints);
    setSelectedOption(null);
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz complete
      setIsComplete(true);
      setTimeout(() => {
        const finalFish = calculateFishFromPoints(newPoints);
        onComplete(finalFish);
      }, 1200);
    }
  };

  const handleBack = () => {
    if (currentQuestion === 0) {
      onBack();
    } else {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const q = quizQuestions[currentQuestion];

  return (
    <div className="w-full flex flex-col items-center min-h-[60vh]">
      <ProgressBar progress={progress} />
      <AnimatePresence mode="wait">
        {!isComplete && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-xl mx-auto text-center overflow-visible"
            style={{ minHeight: 320 }}
          >
            {/* Immersive underwater card background */}
            <div
              className="absolute inset-0 z-0 rounded-3xl"
              style={{
                background:
                  'linear-gradient(135deg, #b2ebf2 0%, #e0f7fa 60%, #a1c4fd 100%)',
                boxShadow: '0 12px 48px 0 rgba(33,150,243,0.13)',
                border: '2.5px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                filter: 'drop-shadow(0 8px 32px rgba(33,150,243,0.10))',
              }}
            />
            <CardBubbles />
            <LightRays />
            {/* Mascot fish will go here next */}
            <div className="relative z-10 p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 z-10" style={{ color: '#234E70', textShadow: '0 2px 8px #b2ebf2' }}>
                {q.question}
              </h2>
              <div className="flex flex-col gap-4 z-10">
                {q.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    className="quiz-button w-full py-3 px-6 rounded-full font-semibold text-base transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    variants={optionVariants}
                    initial="initial"
                    whileHover="hover"
                    animate={selectedOption === i ? 'selected' : 'initial'}
                    onClick={() => handleOptionSelect(i, opt.points)}
                    style={{
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                    disabled={splash}
                  >
                    {opt.text}
                    {/* Splash/bubble pop animation */}
                    {selectedOption === i && splash && (
                      <motion.span
                        className="absolute left-1/2 top-1/2"
                        style={{ transform: 'translate(-50%, -50%)' }}
                        initial={{ scale: 0, opacity: 0.7 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <svg width="32" height="32" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="12" fill="#b2ebf2" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between items-center mt-8 z-10">
                <button
                  className="quiz-button bg-gradient-to-r from-purple-200 via-blue-100 to-cyan-100 text-blue-900 py-2 px-6 rounded-full font-semibold text-base transition-all duration-200 shadow-md"
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button
                  className={`quiz-button bg-gradient-to-r from-blue-400 via-cyan-400 to-pink-400 text-white py-2 px-6 rounded-full font-semibold text-base transition-all duration-200 shadow-md ml-4 ${selectedOption === null ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={handleNext}
                  disabled={selectedOption === null}
                >
                  {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
        {isComplete && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center justify-center min-h-[200px]"
          >
            <motion.div
              className="text-4xl mb-4"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1.2, rotate: 10 }}
              transition={{ yoyo: Infinity, duration: 0.7 }}
            >
              🎉
            </motion.div>
            <div className="text-xl font-bold text-blue-800 mb-2">Quiz Complete!</div>
            <div className="text-base text-blue-700 mb-4">Calculating your mood fish...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodQuiz; 