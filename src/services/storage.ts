import { UserProfile, StationProgress } from '../types';
import { BADGE_REGISTRY } from '../data/badgeRegistry';
import { STATIONS_DATA } from '../data/stations';

const STORAGE_KEY = 'number_train_user_profile_v1';

export function getInitialStationProgress(): Record<number, StationProgress> {
  const progress: Record<number, StationProgress> = {};
  STATIONS_DATA.forEach((station) => {
    progress[station.id] = {
      stationId: station.id,
      stars: 0,
      highestScore: 0,
      isUnlocked: true, // All levels/stations unlocked
      isCompleted: false,
      timesPlayed: 0,
    };
  });
  return progress;
}

export function loadUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    
    // Ensure all stations exist in progress and are unlocked
    if (!parsed.stationProgress) {
      parsed.stationProgress = getInitialStationProgress();
    } else {
      STATIONS_DATA.forEach((st) => {
        if (!parsed.stationProgress[st.id]) {
          parsed.stationProgress[st.id] = {
            stationId: st.id,
            stars: 0,
            highestScore: 0,
            isUnlocked: true,
            isCompleted: false,
            timesPlayed: 0,
          };
        } else {
          // Ensure all stations are unlocked as requested
          parsed.stationProgress[st.id].isUnlocked = true;
        }
      });
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load user profile from storage', err);
    return null;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    profile.lastPlayedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save user profile', err);
  }
}

export function createNewUserProfile(name: string, avatarId: UserProfile['avatarId']): UserProfile {
  const newProfile: UserProfile = {
    id: 'user_' + Math.random().toString(36).substring(2, 9),
    name: name.trim() || 'البطل الصغير',
    avatarId: avatarId || 'boy_hero',
    totalScore: 0,
    unlockedBadgeIds: ['first_journey'], // Initial starter badge
    soundEnabled: true,
    speechEnabled: true,
    currentStationId: 1,
    stationProgress: getInitialStationProgress(),
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
  saveUserProfile(newProfile);
  return newProfile;
}

export function updateStationResults(
  profile: UserProfile,
  stationId: number,
  scoreGained: number,
  starsGained: number
): { profile: UserProfile; newlyUnlockedBadges: string[]; nextStationUnlocked: boolean } {
  const newlyUnlockedBadges: string[] = [];
  let nextStationUnlocked = false;

  const currentProg = profile.stationProgress[stationId] || {
    stationId,
    stars: 0,
    highestScore: 0,
    isUnlocked: true,
    isCompleted: false,
    timesPlayed: 0,
  };

  const isFirstCompletion = !currentProg.isCompleted;
  currentProg.isCompleted = true;
  currentProg.timesPlayed += 1;
  currentProg.stars = Math.max(currentProg.stars, starsGained);
  currentProg.highestScore = Math.max(currentProg.highestScore, scoreGained);

  // Add score
  profile.totalScore += scoreGained;
  profile.stationProgress[stationId] = currentProg;

  // Unlock next station if eligible
  const nextStationId = stationId + 1;
  if (nextStationId <= 7) {
    const nextProg = profile.stationProgress[nextStationId];
    if (nextProg && !nextProg.isUnlocked) {
      nextProg.isUnlocked = true;
      nextStationUnlocked = true;
      profile.currentStationId = nextStationId;
    }
  }

  // Check Badge conditions
  const checkBadge = (badgeId: string, condition: boolean) => {
    if (condition && !profile.unlockedBadgeIds.includes(badgeId)) {
      profile.unlockedBadgeIds.push(badgeId);
      newlyUnlockedBadges.push(badgeId);
    }
  };

  // Station specific 3-star badges
  if (stationId === 1 && currentProg.stars >= 3) checkBadge('place_value_master', true);
  if (stationId === 2 && currentProg.stars >= 3) checkBadge('forms_wizard', true);
  if (stationId === 3 && currentProg.stars >= 3) checkBadge('number_architect', true);
  if (stationId === 4 && currentProg.stars >= 3) checkBadge('comparison_champion', true);
  if (stationId === 5 && currentProg.stars >= 3) checkBadge('rounding_expert', true);
  if (stationId === 6 && currentProg.stars >= 3) checkBadge('math_conductor', true);
  if (stationId === 7 && currentProg.stars >= 3) checkBadge('ultimate_legend', true);

  // Score badge
  if (profile.totalScore >= 1000) checkBadge('score_1000', true);

  // Total stars badge
  const totalStars = (Object.values(profile.stationProgress) as StationProgress[]).reduce((acc, curr) => acc + (curr?.stars || 0), 0);
  if (totalStars >= 21) checkBadge('full_stars', true);

  saveUserProfile(profile);

  return {
    profile: { ...profile },
    newlyUnlockedBadges,
    nextStationUnlocked,
  };
}

export function resetProgress(profile: UserProfile): UserProfile {
  const resetProfile: UserProfile = {
    ...profile,
    totalScore: 0,
    unlockedBadgeIds: ['first_journey'],
    currentStationId: 1,
    stationProgress: getInitialStationProgress(),
    lastPlayedAt: Date.now(),
  };
  saveUserProfile(resetProfile);
  return resetProfile;
}
