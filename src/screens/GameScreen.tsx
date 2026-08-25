import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, Question, StationData } from '../types';
import { STATIONS_DATA } from '../data/stations';
import { getQuestionsForStation } from '../services/questionGenerators';
import { updateStationResults } from '../services/storage';
import { soundManager } from '../services/soundManager';
import { TrainVisual } from '../components/TrainVisual';
import { AudioSettingsBar } from '../components/AudioSettingsBar';
import { CelebrationOverlay } from '../components/CelebrationOverlay';
import { OutOfAttemptsDialog } from '../components/OutOfAttemptsDialog';
import { LevelCompleteDialog } from '../components/LevelCompleteDialog';
import {
  ArrowRight,
  Heart,
  Trophy,
  Flame,
  Volume2,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
} from 'lucide-react';

interface GameScreenProps {
  stationId: number;
  profile: UserProfile;
  onGoToMap: () => void;
  onUpdateProfile: (updatedProfile: UserProfile) => void;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  stationId,
  profile,
  onGoToMap,
  onUpdateProfile,
  onToggleSound,
  onToggleSpeech,
}) => {
  const station: StationData =
    STATIONS_DATA.find((s) => s.id === stationId) || STATIONS_DATA[0];

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  // Gameplay State
  const [lives, setLives] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isTrainMoving, setIsTrainMoving] = useState<boolean>(false);

  // Dialogs State
  const [showOutOfAttempts, setShowOutOfAttempts] = useState<boolean>(false);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [levelCompleteData, setLevelCompleteData] = useState<{
    stars: number;
    scoreEarned: number;
    accuracy: number;
    isNewHighScore: boolean;
    unlockedBadgeTitles: string[];
  } | null>(null);

  // Mini Celebration
  const [showMiniCelebration, setShowMiniCelebration] = useState<boolean>(false);

  // Initialize questions
  const startStation = useCallback(() => {
    const qList = getQuestionsForStation(stationId, station.questionsCount);
    setQuestions(qList);
    setCurrentQIndex(0);
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setLives(3);
    setScore(0);
    setStreak(0);
    setCorrectAnswersCount(0);
    setShowHint(false);
    setShowOutOfAttempts(false);
    setShowLevelComplete(false);
    setLevelCompleteData(null);
    setIsTrainMoving(true);

    // Initial train whistle
    soundManager.playTrainWhistle();
    setTimeout(() => setIsTrainMoving(false), 800);
  }, [stationId, station.questionsCount]);

  useEffect(() => {
    startStation();
  }, [startStation]);

  const currentQuestion = questions[currentQIndex];

  // Auto-speak question if speech is enabled
  useEffect(() => {
    if (currentQuestion && profile.speechEnabled) {
      soundManager.speakArabic(currentQuestion.instruction);
    }
  }, [currentQIndex, currentQuestion, profile.speechEnabled]);

  const handleOptionSelect = (optionId: string) => {
    if (isAnswerChecked) return;
    soundManager.playClick();
    setSelectedOptionId(optionId);
  };

  const handleCheckAnswer = () => {
    if (!currentQuestion || !selectedOptionId || isAnswerChecked) return;

    const chosenOption = currentQuestion.options.find((o) => o.id === selectedOptionId);
    if (!chosenOption) return;

    setIsAnswerChecked(true);

    if (chosenOption.isCorrect) {
      // Correct Answer!
      setIsCorrect(true);
      soundManager.playCorrect();
      setIsTrainMoving(true);
      setTimeout(() => setIsTrainMoving(false), 900);

      const streakBonus = streak >= 2 ? streak * 25 : 0;
      const pointsEarned = currentQuestion.points + streakBonus;
      setScore((prev) => prev + pointsEarned);
      setStreak((prev) => prev + 1);
      setCorrectAnswersCount((prev) => prev + 1);

      // Random praise speech
      const praises = ['أحسنت يا بطل!', 'إجابة ممتازة!', 'رائع جداً!', 'عبقري!', 'بطل الأرقام!'];
      const praise = praises[Math.floor(Math.random() * praises.length)];
      if (profile.speechEnabled) {
        setTimeout(() => soundManager.speakArabic(praise), 300);
      }

      // If last question, complete station
      if (currentQIndex === questions.length - 1) {
        setTimeout(() => handleFinishLevel(score + pointsEarned, correctAnswersCount + 1), 1200);
      } else {
        // Move to next question after short delay
        setTimeout(() => {
          handleNextQuestion();
        }, 1300);
      }
    } else {
      // Wrong Answer!
      setIsCorrect(false);
      soundManager.playWrong();
      setStreak(0);
      setShowHint(true);

      const nextLives = lives - 1;
      setLives(nextLives);

      if (profile.speechEnabled) {
        soundManager.speakArabic('حاول مرة أخرى!');
      }

      if (nextLives <= 0) {
        setTimeout(() => {
          setShowOutOfAttempts(true);
        }, 800);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOptionId(null);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setCurrentQIndex((prev) => prev + 1);
  };

  const handleFinishLevel = (finalScore: number, finalCorrectCount: number) => {
    const totalQ = questions.length;
    const accuracy = Math.round((finalCorrectCount / totalQ) * 100);

    let starsEarned = 1;
    if (accuracy >= 85 && lives >= 2) starsEarned = 3;
    else if (accuracy >= 65) starsEarned = 2;

    soundManager.playLevelWin();

    // Update persistence
    const prevProg = profile.stationProgress[stationId];
    const isNewHighScore = finalScore > (prevProg?.highestScore || 0);

    const { profile: updatedProfile, newlyUnlockedBadges } = updateStationResults(
      profile,
      stationId,
      finalScore,
      starsEarned
    );

    onUpdateProfile(updatedProfile);

    setLevelCompleteData({
      stars: starsEarned,
      scoreEarned: finalScore,
      accuracy,
      isNewHighScore,
      unlockedBadgeTitles: newlyUnlockedBadges,
    });

    setShowLevelComplete(true);
  };

  const hasNextStation = stationId < 7 && Boolean(profile.stationProgress[stationId + 1]?.isUnlocked);

  return (
    <div
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between select-none"
      dir="rtl"
      id="game-screen-container"
    >
      {/* Top Header HUD */}
      <header className="w-full bg-slate-900/90 border-b border-slate-800 px-4 py-3 backdrop-blur-md sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Back to Map button */}
          <button
            id="game-back-to-map-btn"
            onClick={() => {
              soundManager.playClick();
              onGoToMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span className="hidden sm:inline">الخريطة</span>
          </button>

          {/* Station Title & Progress Indicator */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-xs sm:text-sm font-black text-amber-300 truncate max-w-[140px] sm:max-w-none">
                {station.title}
              </span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 font-mono">
              السؤال {currentQIndex + 1} من {questions.length}
            </span>
          </div>

          {/* Lives (Hearts), Score & Audio Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 3 Hearts */}
            <div className="flex items-center gap-1 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700">
              {[1, 2, 3].map((h) => (
                <motion.div
                  key={h}
                  animate={h === lives + 1 && isAnswerChecked && !isCorrect ? { scale: [1.3, 0.7, 1] } : {}}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      h <= lives
                        ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_6px_#f43f5e]'
                        : 'text-slate-600 fill-slate-700'
                    }`}
                  />
                </motion.div>
              ))}
            </div>

            {/* Score & Streak */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-xl border border-slate-700 text-amber-300 text-xs sm:text-sm font-black font-mono">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{score}</span>
              {streak >= 2 && (
                <span className="text-[10px] text-orange-400 flex items-center font-bold">
                  <Flame className="w-3.5 h-3.5 fill-orange-400" />
                  x{streak}
                </span>
              )}
            </div>

            {/* Audio Controls */}
            <AudioSettingsBar
              soundEnabled={profile.soundEnabled}
              speechEnabled={profile.speechEnabled}
              onToggleSound={onToggleSound}
              onToggleSpeech={onToggleSpeech}
            />
          </div>
        </div>
      </header>

      {/* Main Game Screen Play Area */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-2.5 sm:p-5 flex flex-col justify-between items-center gap-2 sm:gap-4 overflow-y-auto">
        {/* Animated Train Visual Section */}
        <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl sm:rounded-3xl p-1 sm:p-3 shadow-xl overflow-hidden backdrop-blur-sm">
          <TrainVisual
            wagons={currentQuestion?.wagonsData || []}
            highlightIndex={currentQuestion?.highlightedDigitIndex}
            isMoving={isTrainMoving}
            onWhistleClick={() => soundManager.playTrainWhistle()}
            goldenTheme={stationId === 7}
          />
        </div>

        {/* Question Header & Voice Read Button */}
        {currentQuestion && (
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-2.5 sm:p-4 shadow-xl text-center relative"
          >
            <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 sm:py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {currentQuestion.title}
              </span>

              {/* Read Question Voice Button */}
              <button
                id="speak-question-btn"
                onClick={() => soundManager.speakArabic(currentQuestion.instruction, true)}
                className="p-1 sm:p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                title="استمع إلى السؤال"
              >
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            <h3 className="text-sm sm:text-lg font-bold text-white leading-relaxed my-1 sm:my-2">
              {currentQuestion.instruction}
            </h3>

            {/* Target Number Display if standalone */}
            {currentQuestion.targetNumber !== undefined && (
              <div className="my-1 inline-block px-4 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xl sm:text-2xl font-black font-mono text-amber-300 shadow-inner">
                {typeof currentQuestion.targetNumber === 'number'
                  ? currentQuestion.targetNumber.toLocaleString('en-US')
                  : currentQuestion.targetNumber}
              </div>
            )}
          </motion.div>
        )}

        {/* Interactive Answer Options Section */}
        {currentQuestion && (
          <div className="w-full space-y-2 sm:space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectOption = option.isCorrect;

                let cardStyle =
                  'bg-slate-900/90 border-slate-700/80 hover:border-sky-400/80 text-white hover:bg-slate-850';

                if (isAnswerChecked) {
                  if (isCorrectOption) {
                    cardStyle =
                      'bg-emerald-950/80 border-emerald-400 text-emerald-100 ring-2 sm:ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/20';
                  } else if (isSelected && !isCorrectOption) {
                    cardStyle =
                      'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 sm:ring-4 ring-rose-500/30 animate-shake';
                  } else {
                    cardStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-50';
                  }
                } else if (isSelected) {
                  cardStyle =
                    'bg-sky-950 border-sky-400 text-sky-100 ring-2 sm:ring-4 ring-sky-400/30 shadow-lg shadow-sky-500/20 scale-[1.01]';
                }

                return (
                  <motion.button
                    key={option.id}
                    id={`answer-option-${option.id}`}
                    type="button"
                    disabled={isAnswerChecked}
                    whileHover={!isAnswerChecked ? { scale: 1.01 } : {}}
                    whileTap={!isAnswerChecked ? { scale: 0.98 } : {}}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`min-h-[48px] sm:min-h-[58px] p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border-2 font-black text-sm sm:text-base flex items-center justify-between gap-2 transition-all cursor-pointer shadow-md ${cardStyle}`}
                  >
                    <span className="text-right flex-1 font-mono tracking-wide">{option.text}</span>
                    {isAnswerChecked && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerChecked && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Smart Hint Box */}
            <AnimatePresence>
              {showHint && currentQuestion.hint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 flex items-start gap-2 text-amber-200 text-xs sm:text-sm"
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5 text-amber-300">تلميح ذكي:</span>
                    <p className="leading-relaxed">{currentQuestion.hint}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="w-full flex items-center justify-between gap-2 sm:gap-3 pt-1">
          {/* Hint trigger */}
          <button
            id="trigger-hint-btn"
            onClick={() => {
              soundManager.playClick();
              setShowHint(!showHint);
            }}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'إخفاء' : 'تلميح'}</span>
          </button>

          {/* Submit Answer Button */}
          <motion.button
            id="check-answer-btn"
            disabled={!selectedOptionId || isAnswerChecked}
            whileHover={selectedOptionId && !isAnswerChecked ? { scale: 1.02 } : {}}
            whileTap={selectedOptionId && !isAnswerChecked ? { scale: 0.98 } : {}}
            onClick={handleCheckAnswer}
            className={`flex-1 max-w-xs py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              !selectedOptionId || isAnswerChecked
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 border border-yellow-200 shadow-amber-500/20'
            }`}
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>تأكيد الإجابة</span>
          </motion.button>
        </div>
      </main>

      {/* Out of Attempts Modal */}
      <OutOfAttemptsDialog
        isOpen={showOutOfAttempts}
        onRetry={startStation}
        onGoToMap={onGoToMap}
      />

      {/* Level Complete Celebration Modal */}
      {levelCompleteData && (
        <LevelCompleteDialog
          isOpen={showLevelComplete}
          stationNumber={station.number}
          stationTitle={station.title}
          starsEarned={levelCompleteData.stars}
          scoreEarned={levelCompleteData.scoreEarned}
          accuracy={levelCompleteData.accuracy}
          isNewHighScore={levelCompleteData.isNewHighScore}
          unlockedBadgeTitles={levelCompleteData.unlockedBadgeTitles}
          hasNextStation={hasNextStation}
          onNextStation={() => {
            setShowLevelComplete(false);
            if (hasNextStation) {
              onGoToMap();
            }
          }}
          onReplayStation={startStation}
          onGoToMap={onGoToMap}
        />
      )}

      {/* Mini Celebration Overlay */}
      <CelebrationOverlay
        show={showMiniCelebration}
        onClose={() => setShowMiniCelebration(false)}
      />
    </div>
  );
};
