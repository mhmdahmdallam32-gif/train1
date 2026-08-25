export type AvatarId = 'boy_hero' | 'girl_princess' | 'captain' | 'astronaut' | 'inventor' | 'explorer';

export interface AvatarInfo {
  id: AvatarId;
  name: string;
  titleAr: string;
  iconBg: string;
  emoji: string;
  description: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarId: AvatarId;
  totalScore: number;
  unlockedBadgeIds: string[];
  soundEnabled: boolean;
  speechEnabled: boolean;
  currentStationId: number;
  stationProgress: Record<number, StationProgress>;
  createdAt: number;
  lastPlayedAt: number;
}

export interface StationProgress {
  stationId: number;
  stars: number; // 0 to 3
  highestScore: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  timesPlayed: number;
}

export type QuestionType =
  | 'place_value_identify' // تحديد القيمة المكانية (آحاد، عشرات، مئات، ألوف...)
  | 'digit_value_identify' // تحديد القيمة العددية للرقم (مثل 5 في العشرات = 50)
  | 'standard_to_expanded' // تحويل من الصيغة القياسية إلى الممتدة
  | 'expanded_to_standard' // تجميع الصيغة الممتدة إلى قياسية
  | 'word_to_standard'     // من الصيغة اللفظية إلى القياسية
  | 'standard_to_word'     // من القياسية إلى اللفظية
  | 'form_greatest_smallest' // تكوين أكبر وأصغر عدد من أرقام معينة
  | 'decompose_number'     // تحليل العدد إلى مكوناته
  | 'compare_numbers'      // مقارنة الأعداد (> أو < أو =)
  | 'order_numbers'        // ترتيب الأعداد تصاعدياً أو تنازلياً
  | 'round_number'         // تقريب لأقرب 10 أو 100 أو 1000
  | 'train_addition'       // جمع الأعداد بالقطار
  | 'train_subtraction'    // طرح الأعداد بالقطار
  | 'final_challenge';     // أسئلة منوعة للتحدي الشامل

export interface Question {
  id: string;
  stationId: number;
  type: QuestionType;
  title: string;
  instruction: string;
  hint?: string;
  targetNumber?: number | string;
  highlightedDigitIndex?: number; // 0-indexed from right or specific
  highlightedDigitValue?: number;
  digitsPool?: number[]; // for number builder or ordering
  wagonsData?: {
    id: string;
    label: string;
    value: string | number;
    color?: string;
  }[];
  options: {
    id: string;
    text: string;
    value: string | number;
    isCorrect: boolean;
    explanation?: string;
  }[];
  correctAnswer: string | number;
  format?: 'multiple_choice' | 'drag_order' | 'digit_builder' | 'compare_signs';
  points: number;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'stations' | 'score' | 'accuracy' | 'streak' | 'special';
  requirementText: string;
  isUnlocked?: boolean;
  unlockedAt?: number;
}

export interface StationData {
  id: number;
  number: number;
  title: string;
  subtitle: string;
  topicAr: string;
  description: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  iconName: string;
  questionsCount: number;
  passingScore: number;
  unlockThresholdScore: number;
}
