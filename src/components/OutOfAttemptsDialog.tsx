import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, MapPin, HeartCrack } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface OutOfAttemptsDialogProps {
  isOpen: boolean;
  onRetry: () => void;
  onGoToMap: () => void;
}

export const OutOfAttemptsDialog: React.FC<OutOfAttemptsDialogProps> = ({
  isOpen,
  onRetry,
  onGoToMap,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="out-of-attempts-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.75, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.75, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 200 }}
          className="relative max-w-sm w-full bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-2 border-rose-500/50 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Heart broken Icon */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-18 h-18 rounded-full bg-rose-500/20 border-2 border-rose-500/50 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/20"
          >
            <HeartCrack className="w-10 h-10" />
          </motion.div>

          <h3 className="text-2xl font-black text-white mb-2">انتهت المحاولات!</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6">
            لا بأس يا بطل! التعلم يحتاج إلى تكرار وتدريب. أعد المحاولة لتتغلب على التحدي!
          </p>

          <div className="w-full space-y-3">
            {/* Retry Button */}
            <motion.button
              id="retry-station-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                soundManager.playClick();
                onRetry();
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-base shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>إعادة المحاولة الآن 🔄</span>
            </motion.button>

            {/* Back to Map Button */}
            <motion.button
              id="return-map-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                soundManager.playClick();
                onGoToMap();
              }}
              className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <MapPin className="w-4 h-4 text-sky-400" />
              <span>العودة إلى خريطة المحطات</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
