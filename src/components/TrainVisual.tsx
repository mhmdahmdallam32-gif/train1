import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface TrainVisualProps {
  wagons?: {
    id: string;
    label: string;
    value: string | number;
    color?: string;
  }[];
  highlightIndex?: number;
  isMoving?: boolean;
  onWhistleClick?: () => void;
  goldenTheme?: boolean;
}

export const TrainVisual: React.FC<TrainVisualProps> = ({
  wagons = [],
  highlightIndex,
  isMoving = false,
  onWhistleClick,
  goldenTheme = false,
}) => {
  return (
    <div className="relative w-full py-1 sm:py-2 overflow-x-auto select-none no-scrollbar" dir="rtl" id="train-visual-container">
      {/* Steam / Smoke puffs from chimney */}
      <div className="relative flex items-end justify-center min-w-max px-3 sm:px-6 gap-2 sm:gap-3 pb-2">
        {/* Locomotive (المحرك) at the front on the right */}
        <motion.div
          id="locomotive-engine"
          className="relative flex flex-col items-center cursor-pointer group shrink-0"
          onClick={onWhistleClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          animate={isMoving ? { y: [0, -3, 0] } : { y: [0, -1.5, 0] }}
          transition={{ repeat: Infinity, duration: isMoving ? 0.4 : 1.6, ease: 'easeInOut' }}
        >
          {/* Animated Steam Clouds */}
          <div className="absolute -top-5 sm:-top-7 right-6 sm:right-8 flex gap-1 pointer-events-none">
            <motion.div
              className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white/70 rounded-full blur-[1px]"
              animate={{ y: [-4, -16], x: [0, 6], opacity: [0.8, 0], scale: [0.6, 1.8] }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeOut' }}
            />
            <motion.div
              className="w-3 h-3 sm:w-4 sm:h-4 bg-white/60 rounded-full blur-[1px]"
              animate={{ y: [-2, -22], x: [0, 10], opacity: [0.7, 0], scale: [0.8, 2.2] }}
              transition={{ repeat: Infinity, duration: 1.4, delay: 0.4, ease: 'easeOut' }}
            />
          </div>

          {/* Engine Body */}
          <div
            className={`relative w-22 sm:w-28 h-16 sm:h-20 rounded-2xl rounded-tr-[24px] sm:rounded-tr-[30px] border-2 shadow-xl flex flex-col justify-between p-1.5 sm:p-2 z-10 transition-colors ${
              goldenTheme
                ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 border-yellow-200 text-slate-900'
                : 'bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-red-400 text-white'
            }`}
          >
            {/* Chimney & Whistle */}
            <div className="absolute -top-3.5 sm:-top-4 right-5 sm:right-6 w-4 sm:w-5 h-3.5 sm:h-4 bg-slate-800 rounded-t-md border border-slate-600">
              <div className="w-6 sm:w-7 -left-1 -top-1 absolute h-1.5 sm:h-2 bg-amber-400 rounded-full" />
            </div>

            {/* Cab Window & Headlight */}
            <div className="flex items-center justify-between">
              <div className="w-5 h-5 sm:w-7 sm:h-7 bg-sky-200 rounded-lg border-2 border-slate-800 flex items-center justify-center shadow-inner">
                <span className="text-[10px] sm:text-xs">🚂</span>
              </div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-yellow-300 border-2 border-amber-500 shadow-[0_0_10px_#fde047] flex items-center justify-center animate-pulse">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>

            {/* Locomotive Plate / Name */}
            <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-bold px-1 bg-black/30 rounded-md py-0.5">
              <span>القاطرة</span>
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
          </div>

          {/* Locomotive Wheels */}
          <div className="flex gap-1.5 sm:gap-2 -mt-2 z-20">
            {[1, 2, 3].map((w) => (
              <motion.div
                key={w}
                className="w-5 h-5 sm:w-7 sm:h-7 rounded-full bg-slate-800 border-2 border-amber-400 flex items-center justify-center shadow-md"
                animate={isMoving ? { rotate: 360 } : { rotate: [0, 10, 0] }}
                transition={isMoving ? { repeat: Infinity, duration: 0.6, ease: 'linear' } : { duration: 2, repeat: Infinity }}
              >
                <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-300 border border-slate-900" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Wagon Coupler & Train Wagons (عربات القطار) */}
        {wagons.map((wagon, index) => {
          const isHighlighted = highlightIndex === index;
          return (
            <React.Fragment key={wagon.id || index}>
              {/* Coupler link between wagons */}
              <div className="w-2.5 sm:w-3 h-1 sm:h-1.5 bg-slate-600 rounded-full self-center mb-3 sm:mb-4 z-0 shrink-0" />

              {/* Individual Wagon */}
              <motion.div
                id={`train-wagon-${index}`}
                className="relative flex flex-col items-center shrink-0"
                animate={isMoving ? { y: [0, -2, 0] } : { y: [0, -1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: isMoving ? 0.4 : 1.8,
                  delay: index * 0.1,
                  ease: 'easeInOut',
                }}
              >
                {/* Wagon Box */}
                <div
                  className={`relative min-w-[62px] sm:min-w-[76px] h-16 sm:h-20 px-2 sm:px-3 rounded-xl border-2 shadow-lg flex flex-col justify-between items-center p-1.5 sm:p-2 z-10 transition-all ${
                    isHighlighted
                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 border-yellow-200 ring-2 sm:ring-4 ring-amber-400/50 scale-105'
                      : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 text-slate-100'
                  }`}
                  style={{
                    backgroundColor: !isHighlighted && wagon.color ? `${wagon.color}15` : undefined,
                    borderColor: !isHighlighted && wagon.color ? wagon.color : undefined,
                  }}
                >
                  {/* Top Label (e.g. Place Name: الآحاد، العشرات، etc.) */}
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-full truncate max-w-[64px] sm:max-w-[74px] ${
                      isHighlighted ? 'bg-amber-900/40 text-amber-950 font-black' : 'bg-slate-700/80 text-sky-300'
                    }`}
                  >
                    {wagon.label || `عربة ${index + 1}`}
                  </span>

                  {/* Main Value Displayed on Wagon */}
                  <span
                    className={`text-lg sm:text-2xl font-black font-mono tracking-wider ${
                      isHighlighted ? 'text-slate-950 scale-110 drop-shadow' : 'text-white'
                    }`}
                  >
                    {wagon.value}
                  </span>

                  {/* Wagon Base Trim */}
                  <div className="w-full h-0.5 sm:h-1 bg-black/30 rounded-full" />
                </div>

                {/* Wagon Wheels */}
                <div className="flex gap-2.5 sm:gap-4 -mt-2 z-20">
                  {[1, 2].map((w) => (
                    <motion.div
                      key={w}
                      className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center shadow"
                      animate={isMoving ? { rotate: 360 } : {}}
                      transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                    >
                      <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-amber-400" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Train Tracks (قضبان السكة الحديدية) */}
      <div className="w-full flex flex-col items-center mt-[-8px] z-0">
        {/* Steel Rails */}
        <div className="w-full h-1 sm:h-1.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-full shadow" />
        {/* Wooden Ties */}
        <div className="w-full flex justify-around -mt-0.5 h-2.5 sm:h-3 overflow-hidden px-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-2 sm:w-2.5 h-full bg-amber-950/70 rounded-sm border-r border-black/40" />
          ))}
        </div>
        {/* Lower Rail */}
        <div className="w-full h-1 sm:h-1.5 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-full shadow -mt-0.5" />
      </div>
    </div>
  );
};
