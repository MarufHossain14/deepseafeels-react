import { motion } from 'framer-motion';

const DebugInfo = ({ currentScreen, currentFish, points }) => {
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.7 }}
      className="fixed bottom-4 right-4 bg-black/60 text-white p-2 rounded-md text-[10px] z-50 max-w-xs pointer-events-none select-none hidden sm:block"
      style={{ fontFamily: 'monospace', minWidth: 120 }}
    >
      <div className="font-bold mb-1">Debug Info:</div>
      <div>Screen: <span className="font-normal">{currentScreen}</span></div>
      <div>Fish: <span className="font-normal">{currentFish?.name || 'None'}</span></div>
      <div>Points: <span className="font-normal">{points?.join(', ') || 'None'}</span></div>
    </motion.div>
  );
};

export default DebugInfo; 