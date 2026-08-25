import React from 'react';
import { Volume2, VolumeX, Mic, MicOff } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface AudioSettingsBarProps {
  soundEnabled: boolean;
  speechEnabled: boolean;
  onToggleSound: () => void;
  onToggleSpeech: () => void;
}

export const AudioSettingsBar: React.FC<AudioSettingsBarProps> = ({
  soundEnabled,
  speechEnabled,
  onToggleSound,
  onToggleSpeech,
}) => {
  return (
    <div className="flex items-center gap-2" dir="rtl" id="audio-settings-bar">
      {/* Sound FX Toggle */}
      <button
        id="toggle-sound-fx-btn"
        onClick={() => {
          onToggleSound();
          if (!soundEnabled) {
            setTimeout(() => soundManager.playClick(), 50);
          }
        }}
        title={soundEnabled ? 'كتم المؤثرات الصوتية' : 'تشغيل المؤثرات الصوتية'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
          soundEnabled
            ? 'bg-slate-800 border-amber-500/40 text-amber-400 hover:bg-slate-700 shadow-sm'
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
        }`}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Voice / Speech Narration Toggle */}
      <button
        id="toggle-speech-narration-btn"
        onClick={() => {
          onToggleSpeech();
          soundManager.playClick();
        }}
        title={speechEnabled ? 'إيقاف القراءة الصوتية' : 'تفعيل القراءة الصوتية للأطفال'}
        className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
          speechEnabled
            ? 'bg-slate-800 border-sky-500/40 text-sky-400 hover:bg-slate-700 shadow-sm'
            : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
        }`}
      >
        {speechEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </button>
    </div>
  );
};
