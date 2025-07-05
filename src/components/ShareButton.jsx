import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const ShareButton = ({ fish }) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: 'FishMood - My Mood Fish',
      text: `I'm feeling like ${fish.name} today! ${fish.mood} - ${fish.description}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
        await navigator.clipboard.writeText(textToCopy);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 3000);
      }
    } catch (error) {
      console.log('Error sharing:', error);
      // Fallback: copy to clipboard
      const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(textToCopy);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 3000);
    }
  };

  return (
    <motion.div className="relative">
      <motion.button
        onClick={handleShare}
        className="glass px-8 py-4 rounded-full transition-all duration-300 shadow-2xl border border-white/30 group"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-3 text-white font-semibold text-lg">
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            📤
          </motion.span>
          Share My Fish
          <motion.span
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            ✨
          </motion.span>
        </span>
      </motion.button>

      <AnimatePresence>
        {showCopied && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 glass px-4 py-2 rounded-xl text-white font-medium text-sm whitespace-nowrap z-20"
          >
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
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

export default ShareButton; 