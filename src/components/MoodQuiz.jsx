import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { quizQuestions, calculateFishFromPoints } from '../data/fishData';

// Accent palette for bubbles
const bubbleColors = [
  '#60A5FA', '#93C5FD', '#6B7280'
];

// Animation variants
const variants = {
  container: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  },
  card: {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { when: 'beforeChildren' } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.3 } }
  },
  question: { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  option: {
    initial: { scale: 1, background: '#ffffff', border: '1px solid #E5E7EB', color: '#374151' },
    hover: { scale: 1.02 },
    selected: { scale: 1.02, background: '#3B82F6', border: '1px solid #3B82F6', color: '#fff' }
  },
  splash: { initial: { scale: 0, opacity: 0.7 }, animate: { scale: 2.2, opacity: 0 }, exit: {} },
  toast: {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.8 }
  }
};

// Floating bubbles background
const CardBubbles = () => (
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
          filter: 'blur(1.5px)'
        }}
        animate={{ y: [0, -30 - Math.random() * 40, 0], opacity: [0.13, 0.22, 0.13] }}
        transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }}
      />
    ))}
  </div>
);

// Overlay light rays
const LightRays = () => (
  <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
    <defs>
      <linearGradient id="rays" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <rect width="400" height="260" fill="url(#rays)" />
    <g opacity="0.18">
      <path d="M40 0 L80 260" stroke="#fff" strokeWidth="8" />
      <path d="M120 0 L160 260" stroke="#fff" strokeWidth="6" />
      <path d="M200 0 L220 260" stroke="#fff" strokeWidth="5" />
      <path d="M300 0 L320 260" stroke="#fff" strokeWidth="7" />
      <path d="M370 0 L390 260" stroke="#fff" strokeWidth="4" />
    </g>
  </svg>
);

// Progress bar with floating indicators
const ProgressBar = ({ progress }) => (
  <div className="w-full max-w-xl mx-auto mt-2 mb-6 relative h-4" aria-label={`Progress: ${Math.round(progress)}%`}>
    <div className="absolute inset-0 bg-gray-200 rounded-full" />
    <motion.div
      className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, type: 'spring' }}
      style={{ minWidth: 16 }}
    />
    {Array.from({ length: 5 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute top-1/2 -translate-y-1/2"
        style={{ left: `${(progress / 4) * i}%` }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-2 h-2 rounded-full bg-blue-400 opacity-80" />
      </motion.div>
    ))}
  </div>
);

const MoodQuiz = ({ onComplete, onBack }) => {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState(() => Array(8).fill(0));
  const [selected, setSelected] = useState(null);
  const [complete, setComplete] = useState(false);
  const [splash, setSplash] = useState(false);
  const timerRef = useRef(null);

  // Cleanup timers
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const question = useMemo(() => quizQuestions[current], [current]);
  const progress = useMemo(() => ((current + 1) / quizQuestions.length) * 100, [current]);

  const handleSelect = useCallback((idx) => {
    console.log('Option selected:', idx);
    setSelected(idx);
    setSplash(true);
    if (timerRef.current) clearTimeout(timerRef.current); // Clear any existing timer
    timerRef.current = setTimeout(() => {
      setSplash(false);
      console.log('Splash reset to false');
    }, 350);
  }, []);

  const handleNext = useCallback(() => {
    console.log('Next button clicked');
    console.log('Current question index:', current);
    console.log('Selected option:', selected);
    console.log('Splash state:', splash);
    if (selected === null) {
      console.warn('Next button clicked without a valid selection');
      return;
    }
    const pts = question.options[selected].points;
    const updated = scores.map((s, i) => s + pts[i]);
    setScores(updated);

    if (current < quizQuestions.length - 1) {
      setCurrent((c) => c + 1);
      setSelected(null);
    } else {
      setComplete(true);
      setSelected(null);
      timerRef.current = setTimeout(() => {
        onComplete(calculateFishFromPoints(updated));
      }, 1200);
    }
  }, [current, selected, splash, scores, question, onComplete]);

  const handleBack = useCallback(() => {
    if (current === 0) return onBack();
    setCurrent((c) => c - 1);
    setSelected(null);
  }, [current, onBack]);

  return (
    <div className="w-full flex flex-col items-center min-h-[60vh]">
      <ProgressBar progress={progress} />
      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div
            key={current}
            variants={variants.container}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-xl mx-auto text-center overflow-visible"
            style={{ minHeight: 320 }}
          >
            <motion.div variants={variants.card} initial="hidden" animate="visible" exit="exit" className="absolute inset-0 z-0 rounded-2xl bg-white/95 shadow-lg border border-gray-100 backdrop-blur-sm" />
            <CardBubbles />
            <LightRays />
            <div className="relative z-10 p-8">
              <motion.h2 variants={variants.question} className="text-2xl md:text-3xl font-bold mb-6 text-gray-800" aria-label={question.question}>
                {question.question}
              </motion.h2>
              <div className="flex flex-col gap-4">
                {question.options.map((opt, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    className={`quiz-button w-full py-3 px-6 rounded-lg font-medium text-base border focus:outline-none focus:ring-2 focus:ring-blue-300 relative overflow-hidden ${selected === i ? 'ring-2 ring-blue-400' : ''}`}
                    variants={variants.option}
                    initial="initial"
                    whileHover="hover"
                    animate={selected === i ? 'selected' : 'initial'}
                    onClick={() => handleSelect(i)}
                    disabled={splash}
                    style={selected === i ? { background: '#3B82F6', border: '1px solid #3B82F6', color: '#fff' } : {}}
                  >
                    {opt.text}
                    {selected === i && splash && (
                      <motion.span variants={variants.splash} initial="initial" animate="animate" className="absolute inset-0 flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 32 32">
                          <circle cx="16" cy="16" r="12" fill="#b2ebf2" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </div>
              <div className="flex justify-between items-center mt-8">
                <button 
                  type="button" 
                  className="btn-secondary nav-button-large" 
                  onClick={handleBack}
                >
                  ← Back
                </button>
                <button 
                  type="button" 
                  className={`btn-primary nav-button-large ${selected === null ? 'opacity-50 cursor-not-allowed' : ''}`} 
                  onClick={handleNext} 
                  disabled={selected === null}
                >
                  {current === quizQuestions.length - 1 ? 'Finish' : 'Next →'}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="complete" variants={variants.card} initial="hidden" animate="visible" exit="exit" className="flex flex-col items-center justify-center min-h-[200px] text-gray-700">
            <motion.div className="text-4xl mb-4" animate={{ scale: [0.8, 1.2], rotate: [-10, 10] }} transition={{ yoyo: Infinity, duration: 0.7 }}>
              🎉
            </motion.div>
            <div className="text-xl font-bold mb-2">Quiz Complete!</div>
            <div className="text-base mb-4">Calculating your mood fish...</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

MoodQuiz.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired
};

export default MoodQuiz;
