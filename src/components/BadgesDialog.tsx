import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BADGE_REGISTRY } from '../data/badgeRegistry';
import {
  Award,
  X,
  Lock,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Target,
  Compass,
  Zap,
  Crown,
  Cpu,
  Gem,
} from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface BadgesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  train: <Trophy className="w-6 h-6" />,
  compass: <Compass className="w-6 h-6" />,
  sparkles: <Sparkles className="w-6 h-6" />,
  cpu: <Cpu className="w-6 h-6" />,
  trophy: <Trophy className="w-6 h-6" />,
  target: <Target className="w-6 h-6" />,
  zap: <Zap className="w-6 h-6" />,
  crown: <Crown className="w-6 h-6" />,
  flame: <Flame className="w-6 h-6" />,
  gem: <Gem className="w-6 h-6" />,
  star: <Star className="w-6 h-6" />,
};

export const BadgesDialog: React.FC<BadgesDialogProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  const totalCount = BADGE_REGISTRY.length;
  const unlockedCount = unlockedBadgeIds.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <AnimatePresence>
      <motion.div
        id="badges-dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md"
        onClick={onClose}
        dir="rtl"
      >
        <motion.div
          initial={{ scale: 0.85, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 220 }}
          className="relative max-w-2xl w-full max-h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-lg text-slate-950">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>لوحة الأوسمة والإنجازات</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {unlockedCount} / {totalCount}
                  </span>
                </h2>
                <p className="text-xs text-slate-400">اجمع جميع الأوسمة لتصبح قائد القطار الأسطوري!</p>
              </div>
            </div>

            <button
              id="close-badges-btn"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="py-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
              <span>نسبة جمع الأوسمة</span>
              <span className="text-amber-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full shadow"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Badges Grid */}
          <div className="overflow-y-auto flex-1 pr-1 space-y-3 pb-2 custom-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BADGE_REGISTRY.map((badge) => {
                const isUnlocked = unlockedBadgeIds.includes(badge.id);
                const icon = BADGE_ICONS[badge.iconName] || <Award className="w-6 h-6" />;

                return (
                  <motion.div
                    key={badge.id}
                    id={`badge-card-${badge.id}`}
                    whileHover={isUnlocked ? { scale: 1.02 } : {}}
                    className={`relative p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-slate-800 to-slate-850 border-amber-400/50 shadow-md shadow-amber-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div
                      className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center shadow-inner ${
                        isUnlocked
                          ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 ring-2 ring-yellow-300/60'
                          : 'bg-slate-800 text-slate-600 border border-slate-700'
                      }`}
                    >
                      {isUnlocked ? icon : <Lock className="w-5 h-5 text-slate-500" />}
                    </div>

                    {/* Badge Texts */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4
                          className={`text-sm font-bold truncate ${
                            isUnlocked ? 'text-amber-300' : 'text-slate-400'
                          }`}
                        >
                          {badge.title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold shrink-0">
                            مُكتسب ✨
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed mt-1">{badge.description}</p>
                      <div className="mt-1 text-[10px] text-slate-400 font-medium">
                        <span className="text-amber-400/80">المطلوب: </span>
                        {badge.requirementText}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
