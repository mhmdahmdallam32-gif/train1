import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Star, Trophy, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface CelebrationOverlayProps {
  show: boolean;
  starsCount?: number;
  message?: string;
  subMessage?: string;
  onClose?: () => void;
}

export const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({
  show,
  starsCount = 3,
  message = 'أحسنت يا بطل!',
  subMessage = 'إجابة رائعة وصحيحة!',
  onClose,
}) => {
  useEffect(() => {
    if (show) {
      // Fire celebratory confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
        });

        const timer = setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#fbbf24', '#38bdf8', '#34d399'],
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#f472b6', '#a78bfa', '#fbbf24'],
          });
        }, 300);

        return () => clearTimeout(timer);
      } catch (err) {
        console.log('Confetti error', err);
      }
    }
  }, [show]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="celebration-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm pointer-events-auto select-none"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.5, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="relative max-w-sm w-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy / Star Header */}
          <motion.div
            animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-100 mb-3"
          >
            <Trophy className="w-10 h-10 text-amber-950 drop-shadow" />
          </motion.div>

          {/* Star Badges */}
          <div className="flex gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, i) => {
              const isEarned = i < starsCount;
              return (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.15 + i * 0.15, type: 'spring' }}
                >
                  <Star
                    className={`w-8 h-8 ${
                      isEarned
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_#facc15]'
                        : 'text-slate-600 fill-slate-700'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Title & Subtitle */}
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 mb-2">
            {message}
          </h2>
          <p className="text-sm font-medium text-slate-300 leading-relaxed mb-6">
            {subMessage}
          </p>

          {/* Action Button */}
          <motion.button
            id="celebration-continue-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              soundManager.playClick();
              if (onClose) onClose();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 border border-yellow-200 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>متابعة الرحلة 🚀</span>
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
