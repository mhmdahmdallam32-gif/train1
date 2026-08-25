import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Trophy, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface LevelCompleteDialogProps {
  isOpen: boolean;
  stationNumber: number;
  stationTitle: string;
  starsEarned: number; // 1, 2, 3
  scoreEarned: number;
  accuracy: number; // percentage e.g. 100%
  isNewHighScore?: boolean;
  unlockedBadgeTitles?: string[];
  hasNextStation: boolean;
  onNextStation: () => void;
  onReplayStation: () => void;
  onGoToMap: () => void;
}

export const LevelCompleteDialog: React.FC<LevelCompleteDialogProps> = ({
  isOpen,
  stationNumber,
  stationTitle,
  starsEarned,
  scoreEarned,
  accuracy,
  isNewHighScore = false,
  unlockedBadgeTitles = [],
  hasNextStation,
  onNextStation,
  onReplayStation,
  onGoToMap,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="level-complete-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.8, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 18, stiffness: 220 }}
          className="relative max-w-md w-full bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 border-2 border-amber-400/80 rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col items-center text-center overflow-hidden"
        >
          {/* Background Rays / Glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-yellow-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Trophy Crest */}
          <div className="relative mb-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 16, ease: 'linear' }}
              className="absolute -inset-2 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full blur-sm opacity-50"
            />
            <div className="relative w-20 h-20 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg border-4 border-yellow-200 text-slate-950">
              <Trophy className="w-10 h-10" />
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-1">
            المحطة {stationNumber} مكتملة! 🎉
          </span>

          <h2 className="text-2xl font-black text-white mb-3">
            {stationTitle}
          </h2>

          {/* 3 Animated Stars */}
          <div className="flex justify-center gap-3 my-3">
            {[1, 2, 3].map((starIdx) => {
              const isEarned = starIdx <= starsEarned;
              return (
                <motion.div
                  key={starIdx}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2 + starIdx * 0.2, type: 'spring', damping: 12 }}
                >
                  <Star
                    className={`w-11 h-11 ${
                      isEarned
                        ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_12px_#facc15]'
                        : 'text-slate-700 fill-slate-800/80'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 w-full my-4">
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400">النقاط المكتسبة</span>
              <span className="text-xl font-black text-amber-400 font-mono">+{scoreEarned}</span>
              {isNewHighScore && (
                <span className="text-[10px] text-emerald-400 font-bold">رقم قياسي جديد! ⭐</span>
              )}
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 flex flex-col items-center">
              <span className="text-xs font-semibold text-slate-400">نسبة الدقة</span>
              <span className="text-xl font-black text-sky-400 font-mono">{accuracy}%</span>
              <span className="text-[10px] text-slate-400 font-bold">
                {accuracy === 100 ? 'إتقان تام 🎯' : 'ممتاز جداً 🌟'}
              </span>
            </div>
          </div>

          {/* Unlocked Badges Notice */}
          {unlockedBadgeTitles.length > 0 && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 border border-amber-400/40 rounded-2xl p-2.5 mb-4 flex items-center justify-center gap-2 text-amber-300 text-xs font-bold shadow-inner"
            >
              <Award className="w-5 h-5 text-amber-400" />
              <span>أوسمة جديدة: {unlockedBadgeTitles.join(' ، ')}</span>
              <Sparkles className="w-4 h-4 text-yellow-300" />
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="w-full space-y-2.5">
            {hasNextStation ? (
              <motion.button
                id="next-station-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundManager.playClick();
                  onNextStation();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer border border-emerald-300"
              >
                <span>الانطلاق للمحطة التالية</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            ) : (
              <motion.button
                id="final-challenge-complete-btn"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  soundManager.playClick();
                  onGoToMap();
                }}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer border border-yellow-200"
              >
                <span>أنت بطل قطار الأعداد الأسطوري! 🏆</span>
              </motion.button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <motion.button
                id="replay-level-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.playClick();
                  onReplayStation();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>إعادة المحطة</span>
              </motion.button>

              <motion.button
                id="map-level-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundManager.playClick();
                  onGoToMap();
                }}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <span>خريطة المحطات</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
