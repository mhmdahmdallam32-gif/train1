import React, { useState } from 'react';
import { motion } from 'motion/react';
import { AVATARS } from '../data/avatars';
import { AvatarId } from '../types';
import { Sparkles, Train, ArrowLeft, Check, Compass } from 'lucide-react';
import { soundManager } from '../services/soundManager';

interface ProfileSetupScreenProps {
  initialName?: string;
  initialAvatarId?: AvatarId;
  onSaveProfile: (name: string, avatarId: AvatarId) => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
}

export const ProfileSetupScreen: React.FC<ProfileSetupScreenProps> = ({
  initialName = '',
  initialAvatarId = 'boy_hero',
  onSaveProfile,
  isEditing = false,
  onCancelEdit,
}) => {
  const [name, setName] = useState<string>(initialName);
  const [selectedAvatarId, setSelectedAvatarId] = useState<AvatarId>(initialAvatarId);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسمك يا بطل للانطلاق في الرحلة!');
      soundManager.playWrong();
      return;
    }
    setError('');
    soundManager.playTrainWhistle();
    onSaveProfile(name.trim(), selectedAvatarId);
  };

  return (
    <div
      className="min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6"
      dir="rtl"
      id="profile-setup-screen"
    >
      {/* Background Decorative Trains & Lights */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md flex flex-col items-center"
      >
        {/* Header Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-xl shadow-amber-500/20 mb-4 flex items-center justify-center text-slate-950"
        >
          <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-[22px] flex items-center justify-center">
            <span className="text-4xl">🚂</span>
          </div>
        </motion.div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 mb-1">
          {isEditing ? 'تعديل ملف البطل' : 'أهلاً بك في قطار الأعداد!'}
        </h1>
        <p className="text-sm text-slate-400 text-center mb-6 max-w-sm">
          {isEditing
            ? 'قم بتحديث اسمك وشخصيتك المفضلة'
            : 'رحلة تعليمية ممتعة عبر 7 محطات لاكتشاف أسرار الأرقام والقيم المكانية'}
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Avatar Selection Grid */}
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-3 text-right">
              اختر شخصيتك المفضلة:
            </label>
            <div className="grid grid-cols-3 gap-3">
              {AVATARS.map((avatar) => {
                const isSelected = selectedAvatarId === avatar.id;
                return (
                  <motion.button
                    type="button"
                    key={avatar.id}
                    id={`avatar-select-${avatar.id}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAvatarId(avatar.id);
                    }}
                    className={`relative p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-amber-400 ring-4 ring-amber-400/30 shadow-lg shadow-amber-500/20 scale-102'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <span className="text-3xl">{avatar.emoji}</span>
                    <span className={`text-[11px] font-bold truncate max-w-full ${isSelected ? 'text-amber-300' : 'text-slate-400'}`}>
                      {avatar.name}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="child-name-input" className="block text-sm font-bold text-slate-300 mb-2 text-right">
              ما اسمك يا بطل؟
            </label>
            <div className="relative">
              <input
                id="child-name-input"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="اكتب اسمك هنا (مثال: أحمد، سارة...)"
                maxLength={25}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-950/80 border-2 border-slate-700 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 text-white font-bold text-base outline-none transition-all placeholder:text-slate-600 text-right"
              />
            </div>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-rose-400 font-bold mt-1.5 text-right">
                {error}
              </motion.p>
            )}
          </div>

          {/* Submit Action */}
          <div className="space-y-2.5 pt-2">
            <motion.button
              type="submit"
              id="start-adventure-btn"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 border border-yellow-200 cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{isEditing ? 'حفظ التعديلات' : 'انطلق بالقطار 🚂'}</span>
              <ArrowLeft className="w-5 h-5 text-slate-950" />
            </motion.button>

            {isEditing && onCancelEdit && (
              <button
                type="button"
                id="cancel-edit-btn"
                onClick={onCancelEdit}
                className="w-full py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                إلغاء والعودة للخريطة
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
