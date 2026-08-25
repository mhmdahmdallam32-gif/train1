import React, { useState, useEffect } from 'react';
import { UserProfile, AvatarId } from './types';
import {
  loadUserProfile,
  saveUserProfile,
  createNewUserProfile,
  resetProgress,
} from './services/storage';
import { soundManager } from './services/soundManager';
import { ProfileSetupScreen } from './screens/ProfileSetupScreen';
import { StationsMapScreen } from './screens/StationsMapScreen';
import { GameScreen } from './screens/GameScreen';

type ScreenMode = 'profile_setup' | 'stations_map' | 'game_screen';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenMode>('profile_setup');
  const [activeStationId, setActiveStationId] = useState<number>(1);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);

  // Load profile on initial mount
  useEffect(() => {
    const existing = loadUserProfile();
    if (existing && existing.name) {
      setProfile(existing);
      soundManager.setSoundEnabled(existing.soundEnabled ?? true);
      soundManager.setSpeechEnabled(existing.speechEnabled ?? true);
      setCurrentScreen('stations_map');
    } else {
      setCurrentScreen('profile_setup');
    }
    setIsLoading(false);

    // Register Service Worker for PWA if available
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.log('SW registration note:', err);
        });
      });
    }
  }, []);

  const handleSaveProfile = (name: string, avatarId: AvatarId) => {
    if (profile && isEditingProfile) {
      const updated: UserProfile = {
        ...profile,
        name,
        avatarId,
      };
      saveUserProfile(updated);
      setProfile(updated);
      setIsEditingProfile(false);
      setCurrentScreen('stations_map');
    } else {
      const newProf = createNewUserProfile(name, avatarId);
      setProfile(newProf);
      soundManager.setSoundEnabled(newProf.soundEnabled);
      soundManager.setSpeechEnabled(newProf.speechEnabled);
      setCurrentScreen('stations_map');
    }
  };

  const handleSelectStation = (stationId: number) => {
    setActiveStationId(stationId);
    setCurrentScreen('game_screen');
  };

  const handleGoToMap = () => {
    setCurrentScreen('stations_map');
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setCurrentScreen('profile_setup');
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    setCurrentScreen('stations_map');
  };

  const handleToggleSound = () => {
    if (!profile) return;
    const newSoundState = !profile.soundEnabled;
    soundManager.setSoundEnabled(newSoundState);
    const updated = { ...profile, soundEnabled: newSoundState };
    saveUserProfile(updated);
    setProfile(updated);
  };

  const handleToggleSpeech = () => {
    if (!profile) return;
    const newSpeechState = !profile.speechEnabled;
    soundManager.setSpeechEnabled(newSpeechState);
    const updated = { ...profile, speechEnabled: newSpeechState };
    saveUserProfile(updated);
    setProfile(updated);
  };

  const handleResetProgress = () => {
    if (!profile) return;
    const reset = resetProgress(profile);
    setProfile(reset);
    setActiveStationId(1);
    setCurrentScreen('stations_map');
  };

  const handleUpdateProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-amber-400 gap-3">
        <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-black font-mono">جاري تشغيل قطار الأعداد...</span>
      </div>
    );
  }

  if (currentScreen === 'profile_setup') {
    return (
      <ProfileSetupScreen
        initialName={profile?.name || ''}
        initialAvatarId={profile?.avatarId || 'boy_hero'}
        onSaveProfile={handleSaveProfile}
        isEditing={isEditingProfile}
        onCancelEdit={handleCancelEditProfile}
      />
    );
  }

  if (currentScreen === 'game_screen' && profile) {
    return (
      <GameScreen
        stationId={activeStationId}
        profile={profile}
        onGoToMap={handleGoToMap}
        onUpdateProfile={handleUpdateProfile}
        onToggleSound={handleToggleSound}
        onToggleSpeech={handleToggleSpeech}
      />
    );
  }

  if (profile) {
    return (
      <StationsMapScreen
        profile={profile}
        onSelectStation={handleSelectStation}
        onEditProfile={handleEditProfile}
        onToggleSound={handleToggleSound}
        onToggleSpeech={handleToggleSpeech}
        onResetProgress={handleResetProgress}
      />
    );
  }

  return null;
}
