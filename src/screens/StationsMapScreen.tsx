import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserProfile, StationData, StationProgress } from '../types';
import { STATIONS_DATA } from '../data/stations';
import { AVATARS } from '../data/avatars';
import { BADGE_REGISTRY } from '../data/badgeRegistry';
import {
  Star,
  Trophy,
  Award,
  Lock,
  Play,
  RotateCcw,
  Sparkles,
  User,
  Settings,
  ChevronLeft,
  Flame,
  Volume2,
} from 'lucide-react';
import { soundManager } from '../services/soundManager';
import { AudioSettingsBar } from '../components/AudioSettingsBar';
import { BadgesDialog } from '../components/BadgesDialog';
import { InstallPwaPrompt } from '../components/InstallPwaPrompt';

interface StationsMapScreenProps {
  profile: UserProfile;
  onSelectStation: (stationId: number) => void;
  onEditProfile: () => void;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
  onResetProgress: () => void;
}

export const StationsMapScreen: React.FC<StationsMapScreenProps> = ({
  profile,
  onSelectStation,
  onEditProfile,
  onToggleSound,
  onToggleSpeech,
  onResetProgress,
}) => {
  const [showBadges, setShowBadges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentAvatar = AVATARS.find((a) => a.id === profile.avatarId) || AVATARS[0];

  const totalStars = (Object.values(profile.stationProgress) as StationProgress[]).reduce(
    (sum, p) => sum + (p?.stars || 0),
    0
  );

  const completedStationsCount = (Object.values(profile.stationProgress) as StationProgress[]).filter(
    (p) => p?.isCompleted
  ).length;

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col"
      dir="rtl"
      id="stations-map-screen"
    >
      {/* Top Navigation HUD */}
      <header className="sticky top-0 z-30 w-full bg-slate-900/90 border-b border-slate-800 backdrop-blur-md px-4 py-3 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
          {/* User Profile Capsule */}
          <div
            id="user-profile-header-btn"
            onClick={() => {
              soundManager.playClick();
              onEditProfile();
            }}
            className="flex items-center gap-2.5 p-1.5 pr-2 rounded-2xl bg-slate-800/90 border border-slate-700 hover:border-amber-400/50 hover:bg-slate-800 transition-all cursor-pointer group"
            title="تعديل اسم وشخصية البطل"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${currentAvatar.iconBg} flex items-center justify-center text-xl shadow-md`}
            >
              <span>{currentAvatar.emoji}</span>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <span className="text-sm font-black text-white group-hover:text-amber-300 transition-colors truncate max-w-[110px] sm:max-w-[160px]">
                  {profile.name}
                </span>
                <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
              </div>
              <span className="text-[10px] font-semibold text-slate-400 block truncate">
                {currentAvatar.titleAr}
              </span>
            </div>
          </div>

          {/* Stats Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Stars Counter */}
            <div
              id="stars-counter-badge"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300"
            >
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow" />
              <span className="text-sm font-black font-mono">{totalStars} / 21</span>
            </div>

            {/* Score Counter */}
            <div
              id="total-score-badge"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300"
            >
              <Trophy className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-black font-mono">{profile.totalScore}</span>
            </div>

            {/* Badges Dialog Trigger */}
            <button
              id="open-badges-btn"
              onClick={() => {
                soundManager.playClick();
                setShowBadges(true);
              }}
              className="relative p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-400 text-amber-400 hover:bg-slate-750 transition-all cursor-pointer"
              title="عرض الأوسمة والإنجازات"
            >
              <Award className="w-5 h-5" />
              {profile.unlockedBadgeIds.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-black text-[9px] flex items-center justify-center shadow">
                  {profile.unlockedBadgeIds.length}
                </span>
              )}
            </button>

            {/* Audio Settings */}
            <AudioSettingsBar
              soundEnabled={profile.soundEnabled}
              speechEnabled={profile.speechEnabled}
              onToggleSound={onToggleSound}
              onToggleSpeech={onToggleSpeech}
            />
          </div>
        </div>
      </header>

      {/* Main Map Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 flex flex-col items-center">
        {/* Banner Hero */}
        <div className="w-full relative rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-slate-900/40 border border-blue-500/20 p-5 sm:p-6 mb-8 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
            <div className="text-center sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                رحلة التعلم عبر المحطات
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-1">
                خريطة قطار الأعداد
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md">
                اختر المحطة المتاحة وابدأ في حل ألغاز الأعداد لكسب النجوم والأوسمة!
              </p>
            </div>

            {/* Quick Train Whistle Sound Fun */}
            <motion.button
              id="whistle-banner-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => soundManager.playTrainWhistle()}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer border border-yellow-200"
            >
              <span>صافرة القطار 🚂</span>
              <Volume2 className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* Stations Rail Track List */}
        <div className="w-full relative flex flex-col gap-6 items-center">
          {/* Vertical Rail Line Connector */}
          <div className="absolute top-12 bottom-12 w-3 bg-gradient-to-b from-amber-500/40 via-sky-500/40 to-yellow-500/40 rounded-full hidden md:block" />

          {STATIONS_DATA.map((station, index) => {
            const progress = profile.stationProgress[station.id] || {
              stationId: station.id,
              stars: 0,
              highestScore: 0,
              isUnlocked: true,
              isCompleted: false,
              timesPlayed: 0,
            };

            const isLocked = !progress.isUnlocked;
            const isCompleted = progress.isCompleted;
            const isCurrent = profile.currentStationId === station.id && !isCompleted;

            return (
              <motion.div
                key={station.id}
                id={`station-card-${station.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={!isLocked ? { scale: 1.015 } : {}}
                className={`relative w-full max-w-2xl rounded-3xl border-2 p-5 sm:p-6 transition-all ${
                  isLocked
                    ? 'bg-slate-900/50 border-slate-800/80 text-slate-500 opacity-65'
                    : isCurrent
                    ? 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border-amber-400 ring-4 ring-amber-400/20 shadow-2xl shadow-amber-500/10'
                    : isCompleted
                    ? 'bg-gradient-to-br from-slate-900 to-slate-850 border-emerald-500/50 shadow-lg'
                    : 'bg-slate-900/90 border-slate-700 hover:border-slate-600 shadow-md'
                }`}
              >
                {/* Station Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Station Icon & Title */}
                  <div className="flex items-start gap-4">
                    {/* Station Number Badge */}
                    <div
                      className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-xl font-black shadow-lg ${
                        isLocked
                          ? 'bg-slate-800 text-slate-600 border border-slate-700'
                          : `bg-gradient-to-tr ${station.themeColor} text-slate-950 ring-2 ring-white/20`
                      }`}
                    >
                      {isLocked ? <Lock className="w-6 h-6 text-slate-500" /> : station.number}
                    </div>

                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3
                          className={`text-lg sm:text-xl font-black ${
                            isLocked ? 'text-slate-400' : 'text-white'
                          }`}
                        >
                          {station.title}
                        </h3>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            isLocked
                              ? 'bg-slate-800 text-slate-500'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {station.topicAr}
                        </span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">
                        {station.description}
                      </p>
                    </div>
                  </div>

                  {/* Stars & Launch Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {/* 3 Stars Status */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= progress.stars
                              ? 'text-yellow-400 fill-yellow-400 drop-shadow'
                              : 'text-slate-700 fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Launch / Play Button */}
                    <button
                      id={`play-station-${station.id}-btn`}
                      disabled={isLocked}
                      onClick={() => {
                        if (!isLocked) {
                          soundManager.playClick();
                          soundManager.playTrainChug();
                          onSelectStation(station.id);
                        }
                      }}
                      className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-emerald-500/40 hover:border-emerald-400 shadow'
                          : 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-500/20 border border-yellow-200'
                      }`}
                    >
                      {isLocked ? (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>مغلقة</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <RotateCcw className="w-4 h-4 text-emerald-400" />
                          <span>إعادة المحطة</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                          <span>ابدأ الرحلة</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info & Reset button */}
        <div className="w-full max-w-2xl mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>قطار الأعداد © {new Date().getFullYear()} - تطبيق ويب تقدمي تفاعلي</span>

          <button
            id="reset-progress-btn"
            onClick={() => setShowResetConfirm(true)}
            className="text-rose-400/80 hover:text-rose-300 hover:underline transition-colors cursor-pointer"
          >
            إعادة تعيين نقاط التقدم والبدء من جديد
          </button>
        </div>
      </main>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div
          id="reset-confirm-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
          dir="rtl"
        >
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-black text-white mb-2">هل تريد إعادة ضبط التقدم؟</h3>
            <p className="text-xs text-slate-400 mb-6">
              سيتم إعادة تعيين النجوم والنقاط للمحطات والبدء من المحطة الأولى مجدداً.
            </p>
            <div className="flex gap-3">
              <button
                id="confirm-reset-btn"
                onClick={() => {
                  soundManager.playClick();
                  onResetProgress();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs cursor-pointer"
              >
                نعم، ابدأ من جديد
              </button>
              <button
                id="cancel-reset-btn"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Badges Modal */}
      <BadgesDialog
        isOpen={showBadges}
        onClose={() => setShowBadges(false)}
        unlockedBadgeIds={profile.unlockedBadgeIds}
      />

      {/* PWA Install Banner */}
      <InstallPwaPrompt />
    </div>
  );
};
