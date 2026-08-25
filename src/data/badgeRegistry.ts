import { Badge } from '../types';

export const BADGE_REGISTRY: Badge[] = [
  {
    id: 'first_journey',
    title: 'وسام الانطلاق',
    description: 'بدء الرحلة الأولى على متن قطار الأعداد وتخطي السؤال الأول.',
    iconName: 'train',
    category: 'special',
    requirementText: 'إكمال أول سؤال بنجاح'
  },
  {
    id: 'place_value_master',
    title: 'خبير القيمة المكانية',
    description: 'إتقان تحديد خانات الآحاد والعشرات والمئات والآلاف والملايين.',
    iconName: 'compass',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 1'
  },
  {
    id: 'forms_wizard',
    title: 'ساحر صيغ الأعداد',
    description: 'التحويل السلس بين الصيغة القياسية، الممتدة، واللفظية.',
    iconName: 'sparkles',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 2'
  },
  {
    id: 'number_architect',
    title: 'مهندس تكوين الأعداد',
    description: 'القدرة على تكوين أكبر وأصغر عدد وتحليل الأعداد ببراعة.',
    iconName: 'cpu',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 3'
  },
  {
    id: 'comparison_champion',
    title: 'بطل المقارنة والترتيب',
    description: 'الترتيب التصاعدي والتنازلي واستخدام إشارات المقارنة بدقة.',
    iconName: 'trophy',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 4'
  },
  {
    id: 'rounding_expert',
    title: 'خبير تقريب الأعداد',
    description: 'إتقان تقريب الأعداد لأقرب 10 و 100 و 1000 بكفاءة.',
    iconName: 'target',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 5'
  },
  {
    id: 'math_conductor',
    title: 'قائد العمليات الحسابية',
    description: 'الجمع والطرح الذهني بمهارة على مسار القطار.',
    iconName: 'zap',
    category: 'stations',
    requirementText: 'الحصول على 3 نجوم في المحطة 6'
  },
  {
    id: 'ultimate_legend',
    title: 'أسطورة قطار الأعداد الذهبي',
    description: 'اجتياز التحدي النهائي الشامل والحصول على الدرجة الكاملة!',
    iconName: 'crown',
    category: 'special',
    requirementText: 'إكمال المحطة 7 بثلاث نجوم ذهبية'
  },
  {
    id: 'streak_master',
    title: 'وسام شعلة التوالي 🔥',
    description: 'الإجابة على 5 أسئلة صحيحة متتالية بدون أي خطأ.',
    iconName: 'flame',
    category: 'streak',
    requirementText: 'تحقيق تتابع صحيح لـ 5 إجابات'
  },
  {
    id: 'score_1000',
    title: 'نادي الألف نقطة 💎',
    description: 'تجميع 1000 نقطة أو أكثر في رحلتك التعليمية.',
    iconName: 'gem',
    category: 'score',
    requirementText: 'بلوغ 1000 نقطة إجمالية'
  },
  {
    id: 'full_stars',
    title: 'مستكشف النجوم الكاملة ⭐',
    description: 'جمع 21 نجمة ذهبية عبر جميع محطات القطار السبع.',
    iconName: 'star',
    category: 'special',
    requirementText: 'جمع 21 نجمة في جميع المحطات'
  }
];
