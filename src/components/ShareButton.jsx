import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

// Animation variants
const variants = {
  button: {
    hover: { scale: 1.05, y: -2 },
    tap: { scale: 0.95 }
  },
  icon: {
    rotate: { rotate: [0, 10, -10, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }
  },
  toast: {
    initial: { opacity: 0, y: 20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.8 }
  }
};

const ShareButton = ({ fish }) => {
  const [showCopied, setShowCopied] = useState(false);
  let timeoutId;

  // Cleanup on unmount
  useEffect(() => () => clearTimeout(timeoutId), []);

  const copyToClipboard = useCallback(async (text) => {
    await navigator.clipboard.writeText(text);
    setShowCopied(true);
    timeoutId = setTimeout(() => setShowCopied(false), 3000);
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'FishMood - My Mood Fish',
      text: `I'm feeling like ${fish.name} today! ${fish.mood} - ${fish.description}`,
      url: window.location.href
    };

    const fallbackText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }

    // Fallback if Web Share API unavailable or failed
    await copyToClipboard(fallbackText);
  }, [fish, copyToClipboard]);

  return (
    <motion.div className="relative" aria-live="polite">
      <motion.button
        type="button"
        onClick={handleShare}
        className="glass px-6 py-3 rounded-full shadow-2xl border border-white/30 group flex items-center gap-2"
        whileHover="hover"
        whileTap="tap"
        variants={variants.button}
        aria-label="Share your mood fish"
      >
        <motion.span variants={variants.icon} animate="rotate" aria-hidden>
          📤
        </motion.span>
        <span className="text-white font-semibold text-lg">Share My Fish</span>
        <motion.span
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-hidden
        >
          ✨
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            variants={variants.toast}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute -top-12 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-xl text-white font-medium text-sm whitespace-nowrap z-20"
          >
            <div className="flex items-center gap-2">
              <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5, repeat: 2 }}>
                ✅
              </motion.span>
              Copied to clipboard!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

ShareButton.propTypes = {
  fish: PropTypes.shape({
    name: PropTypes.string.isRequired,
    mood: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

export default ShareButton;
