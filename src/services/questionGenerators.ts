import { Question } from '../types';

// Arabic place value names from Units (right) upwards
const PLACE_VALUES_AR = [
  'الآحاد',
  'العشرات',
  'المئات',
  'الألوف',
  'عشرات الألوف',
  'مئات الألوف',
  'الملايين',
];

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatEnglishNumber(num: number | string): string {
  if (typeof num === 'number') {
    return num.toLocaleString('en-US');
  }
  return num;
}

function numberToArabicWords(num: number): string {
  const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const teens = ['عشرة', 'أحد عشر', 'اثنا عشر', 'ثلاثة عشر', 'أربعة عشر', 'خمسة عشر', 'ستة عشر', 'سبعة عشر', 'ثمانية عشر', 'تسعة عشر'];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = ['', 'مائة', 'مائتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
  const thousands = ['', 'ألف', 'ألفان', 'ثلاثة آلاف', 'أربعة آلاف', 'خمسة آلاف', 'ستة آلاف', 'سبعة آلاف', 'ثمانية آلاف', 'تسعة آلاف'];

  if (num === 0) return 'صفر';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  if (num < 100) {
    const rem = num % 10;
    const t = Math.floor(num / 10);
    return rem === 0 ? tens[t] : `${ones[rem]} و${tens[t]}`;
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    if (rem === 0) return hundreds[h];
    return `${hundreds[h]} و${numberToArabicWords(rem)}`;
  }
  if (num < 10000) {
    const th = Math.floor(num / 1000);
    const rem = num % 1000;
    if (rem === 0) return thousands[th];
    return `${thousands[th]} و${numberToArabicWords(rem)}`;
  }
  return formatEnglishNumber(num);
}

/**
 * Generate Questions for Station 1: Place Value & Digit Value
 * Arab math: Wagons ordered with Units (الآحاد) directly behind the locomotive.
 * wagons[0] = الآحاد (Units)
 * wagons[1] = العشرات (Tens)
 * wagons[2] = المئات (Hundreds)
 * wagons[3] = الألوف (Thousands)
 */
export function generateStation1Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const isPlaceName = i % 2 === 0;
    const numDigits = getRandomInt(3, 5); // 3 to 5 digits (e.g. 4,528 or 38,419)
    const num = getRandomInt(Math.pow(10, numDigits - 1) + 1, Math.pow(10, numDigits) - 1);
    const strNum = num.toString();

    // Place from right: 0 is Units (الآحاد), 1 is Tens (العشرات), 2 is Hundreds (المئات), etc.
    const placeFromRight = getRandomInt(0, strNum.length - 1);
    const strIdx = strNum.length - 1 - placeFromRight; // string index (0 is leftmost)
    const digitChar = strNum[strIdx];
    const digitVal = parseInt(digitChar, 10);
    const placeName = PLACE_VALUES_AR[placeFromRight] || 'الآحاد';
    const actualDigitValue = digitVal * Math.pow(10, placeFromRight);

    // Build wagons: index 0 is الآحاد (units, directly behind locomotive), index 1 is العشرات, etc.
    const wagonsData = [];
    for (let p = 0; p < strNum.length; p++) {
      const charAtPlace = strNum[strNum.length - 1 - p];
      const isTarget = p === placeFromRight;
      wagonsData.push({
        id: `w_p_${p}`,
        label: PLACE_VALUES_AR[p] || `خانة ${p + 1}`,
        value: charAtPlace,
        color: isTarget ? '#f59e0b' : '#38bdf8',
      });
    }

    if (isPlaceName) {
      // Question: What is the place value name?
      const wrongPlaces = PLACE_VALUES_AR.filter((p) => p !== placeName);
      const shuffledWrong = shuffleArray(wrongPlaces).slice(0, 3);
      const options = shuffleArray([
        { id: 'opt_1', text: placeName, value: placeName, isCorrect: true },
        ...shuffledWrong.map((w, idx) => ({ id: `opt_w_${idx}`, text: w, value: w, isCorrect: false })),
      ]);

      questions.push({
        id: `s1_q_${i}_${Date.now()}`,
        stationId: 1,
        type: 'place_value_identify',
        title: 'ما هي القيمة المكانية؟',
        instruction: `ما هي القيمة المكانية للرقم (${digitVal}) الملون في عربة العدد (${formatEnglishNumber(num)}):`,
        targetNumber: num,
        highlightedDigitIndex: placeFromRight,
        highlightedDigitValue: actualDigitValue,
        wagonsData,
        options,
        correctAnswer: placeName,
        hint: `ترتيب الخانات من اليمين خلف القاطرة: (الآحاد ثم العشرات ثم المئات ثم الألوف...).`,
        points: 100,
        format: 'multiple_choice',
      });
    } else {
      // Question: What is the numerical value of the digit?
      const wrongValues = [
        digitVal * Math.pow(10, (placeFromRight + 1) % 5),
        digitVal * Math.pow(10, Math.max(0, placeFromRight - 1)),
        digitVal === 0 ? 10 : digitVal,
      ].filter((v) => v !== actualDigitValue);

      const uniqueWrongs = Array.from(new Set(wrongValues)).slice(0, 3);
      while (uniqueWrongs.length < 3) {
        uniqueWrongs.push(actualDigitValue + (uniqueWrongs.length + 1) * 10);
      }

      const options = shuffleArray([
        { id: 'opt_c', text: formatEnglishNumber(actualDigitValue), value: actualDigitValue, isCorrect: true },
        ...uniqueWrongs.map((w, idx) => ({
          id: `opt_w_${idx}`,
          text: formatEnglishNumber(w),
          value: w,
          isCorrect: false,
        })),
      ]);

      questions.push({
        id: `s1_q_${i}_${Date.now()}`,
        stationId: 1,
        type: 'digit_value_identify',
        title: 'ما هي القيمة العددية؟',
        instruction: `ما هي القيمة العددية للرقم (${digitVal}) في العدد (${formatEnglishNumber(num)}):`,
        targetNumber: num,
        highlightedDigitIndex: placeFromRight,
        highlightedDigitValue: actualDigitValue,
        wagonsData,
        options,
        correctAnswer: actualDigitValue,
        hint: `الرقم ${digitVal} في خانة ${placeName} قيمته تساوي ${formatEnglishNumber(actualDigitValue)}.`,
        points: 100,
        format: 'multiple_choice',
      });
    }
  }

  return questions;
}

/**
 * Generate Questions for Station 2: Number Forms (Expanded, Standard, Word)
 * Wagons ordered with Units directly behind locomotive.
 */
export function generateStation2Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const mode = i % 3; // 0: Standard to Expanded, 1: Expanded to Standard, 2: Word to Standard
    const num = getRandomInt(1250, 9870);
    const strNum = num.toString();

    // Generate expanded parts from thousands down to units
    const partsHighToLow: number[] = [];
    for (let c = 0; c < strNum.length; c++) {
      const val = parseInt(strNum[c], 10);
      if (val > 0) {
        partsHighToLow.push(val * Math.pow(10, strNum.length - 1 - c));
      }
    }
    const expandedStr = partsHighToLow.map((p) => formatEnglishNumber(p)).join(' + ');

    // Wagons ordered units first (behind locomotive)
    const wagonsData = [];
    for (let p = 0; p < strNum.length; p++) {
      const charAtPlace = strNum[strNum.length - 1 - p];
      wagonsData.push({
        id: `w_p_${p}`,
        label: PLACE_VALUES_AR[p] || '',
        value: charAtPlace,
        color: '#06b6d4',
      });
    }

    if (mode === 0) {
      // Standard to Expanded
      const wrong1 = partsHighToLow
        .map((p, idx) => (idx === 0 ? Math.floor(p / 10) : p))
        .map((p) => formatEnglishNumber(p))
        .join(' + ');
      const wrong2 = partsHighToLow
        .map((p, idx) => (idx === partsHighToLow.length - 1 ? p * 10 : p))
        .map((p) => formatEnglishNumber(p))
        .join(' + ');
      const wrong3 = strNum.split('').join(' + ');

      const options = shuffleArray([
        { id: 'opt_1', text: expandedStr, value: expandedStr, isCorrect: true },
        { id: 'opt_2', text: wrong1, value: wrong1, isCorrect: false },
        { id: 'opt_3', text: wrong2, value: wrong2, isCorrect: false },
        { id: 'opt_4', text: wrong3, value: wrong3, isCorrect: false },
      ]);

      questions.push({
        id: `s2_q_${i}_${Date.now()}`,
        stationId: 2,
        type: 'standard_to_expanded',
        title: 'الصيغة الممتدة',
        instruction: `اختر الصيغة الممتدة الصحيحة للعدد (${formatEnglishNumber(num)}) الذي يحمله القطار:`,
        targetNumber: num,
        wagonsData,
        options,
        correctAnswer: expandedStr,
        hint: `الصيغة الممتدة هي مجموع قيم الأرقام: (آحاد + عشرات + مئات + ألوف).`,
        points: 100,
        format: 'multiple_choice',
      });
    } else if (mode === 1) {
      // Expanded to Standard
      const options = shuffleArray([
        { id: 'opt_1', text: formatEnglishNumber(num), value: num, isCorrect: true },
        { id: 'opt_2', text: formatEnglishNumber(num + 100), value: num + 100, isCorrect: false },
        { id: 'opt_3', text: formatEnglishNumber(num - 10), value: num - 10, isCorrect: false },
        { id: 'opt_4', text: formatEnglishNumber(num + 1000), value: num + 1000, isCorrect: false },
      ]);

      // Wagons for expanded: units behind locomotive
      const expandedWagons = [];
      for (let p = 0; p < strNum.length; p++) {
        const val = parseInt(strNum[strNum.length - 1 - p], 10);
        if (val > 0) {
          const partVal = val * Math.pow(10, p);
          expandedWagons.push({
            id: `w_exp_${p}`,
            label: PLACE_VALUES_AR[p] || `خانة ${p + 1}`,
            value: formatEnglishNumber(partVal),
            color: '#38bdf8',
          });
        }
      }

      questions.push({
        id: `s2_q_${i}_${Date.now()}`,
        stationId: 2,
        type: 'expanded_to_standard',
        title: 'تجميع الصيغة الممتدة',
        instruction: `اجمع قيم عربات الصيغة الممتدة لتكوين العدد القياسي:`,
        targetNumber: expandedStr,
        wagonsData: expandedWagons,
        options,
        correctAnswer: num,
        hint: `اجمع كل قيمة في خانتها المناسبة للحصول على العدد القياسي.`,
        points: 100,
        format: 'multiple_choice',
      });
    } else {
      // Word Form to Standard
      const words = numberToArabicWords(num);
      const options = shuffleArray([
        { id: 'opt_1', text: formatEnglishNumber(num), value: num, isCorrect: true },
        { id: 'opt_2', text: formatEnglishNumber(num + 20), value: num + 20, isCorrect: false },
        { id: 'opt_3', text: formatEnglishNumber(num - 200), value: num - 200, isCorrect: false },
        { id: 'opt_4', text: formatEnglishNumber(num + 100), value: num + 100, isCorrect: false },
      ]);

      questions.push({
        id: `s2_q_${i}_${Date.now()}`,
        stationId: 2,
        type: 'word_to_standard',
        title: 'الصيغة اللفظية',
        instruction: `اختر العدد القياسي الذي يمثل الصيغة اللفظية: "${words}"`,
        targetNumber: words,
        wagonsData,
        options,
        correctAnswer: num,
        hint: `اقرأ الألوف أولاً ثم المئات ثم الآحاد والعشرات.`,
        points: 100,
        format: 'multiple_choice',
      });
    }
  }

  return questions;
}

/**
 * Generate Questions for Station 3: Number Formation (Greatest & Smallest Number)
 */
export function generateStation3Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const isGreatest = i % 2 === 0;
    // 4 unique digits
    const digitsPool = shuffleArray([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);

    // Calculate correct greatest and smallest
    const sortedDesc = [...digitsPool].sort((a, b) => b - a);
    const greatestNum = parseInt(sortedDesc.join(''), 10);

    const sortedAsc = [...digitsPool].sort((a, b) => a - b);
    if (sortedAsc[0] === 0 && sortedAsc.length > 1) {
      const nonZeroIdx = sortedAsc.findIndex((d) => d > 0);
      if (nonZeroIdx > 0) {
        const temp = sortedAsc[0];
        sortedAsc[0] = sortedAsc[nonZeroIdx];
        sortedAsc[nonZeroIdx] = temp;
      }
    }
    const smallestNum = parseInt(sortedAsc.join(''), 10);

    const targetCorrect = isGreatest ? greatestNum : smallestNum;
    const targetType = isGreatest ? 'أكبر' : 'أصغر';

    // Generate smart distractors
    const wrongOptions = [
      isGreatest ? smallestNum : greatestNum,
      parseInt(shuffleArray([...digitsPool]).join(''), 10),
      parseInt(shuffleArray([...digitsPool]).join(''), 10),
    ].filter((w) => w !== targetCorrect);

    const uniqueWrongs = Array.from(new Set(wrongOptions)).slice(0, 3);
    while (uniqueWrongs.length < 3) {
      uniqueWrongs.push(targetCorrect + (uniqueWrongs.length + 1) * 9);
    }

    const options = shuffleArray([
      { id: 'opt_c', text: formatEnglishNumber(targetCorrect), value: targetCorrect, isCorrect: true },
      ...uniqueWrongs.map((w, idx) => ({
        id: `opt_w_${idx}`,
        text: formatEnglishNumber(w),
        value: w,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `s3_q_${i}_${Date.now()}`,
      stationId: 3,
      type: 'form_greatest_smallest',
      title: `تكوين ${targetType} عدد`,
      instruction: `استخدم أرقام عربات القطار [ ${digitsPool.join(' , ')} ] لتكوين **${targetType} عدد** ممكن:`,
      digitsPool,
      wagonsData: digitsPool.map((d, idx) => ({
        id: `d_${idx}`,
        label: `رقم ${idx + 1}`,
        value: d,
        color: '#10b981',
      })),
      options,
      correctAnswer: targetCorrect,
      hint: isGreatest
        ? 'لتكوين أكبر عدد، ضع الأرقام الكبرى في الخانات الكبرى من اليسار إلى اليمين.'
        : 'لتكوين أصغر عدد، ضع الأرقام الصغرى في الخانات الكبرى (مع تجنب الصفر في أول خانة من اليسار).',
      points: 100,
      format: 'multiple_choice',
    });
  }

  return questions;
}

/**
 * Generate Questions for Station 4: Comparison & Ordering
 */
export function generateStation4Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const isComparison = i % 2 === 0;

    if (isComparison) {
      const numA = getRandomInt(1000, 9999);
      const makeEqual = Math.random() < 0.3;
      const numB = makeEqual
        ? numA
        : Math.random() < 0.5
        ? numA + getRandomInt(1, 150)
        : numA - getRandomInt(1, 150);

      let correctSign = '=';
      if (numA > numB) correctSign = '>';
      else if (numA < numB) correctSign = '<';

      const options = [
        { id: 'opt_gt', text: 'أكبر من ( > )', value: '>', isCorrect: correctSign === '>' },
        { id: 'opt_lt', text: 'أصغر من ( < )', value: '<', isCorrect: correctSign === '<' },
        { id: 'opt_eq', text: 'يساوي ( = )', value: '=', isCorrect: correctSign === '=' },
      ];

      questions.push({
        id: `s4_q_${i}_${Date.now()}`,
        stationId: 4,
        type: 'compare_numbers',
        title: 'مقارنة قطاري الأعداد',
        instruction: `قارن بين عدد القطار الأول (${formatEnglishNumber(numA)}) وعدد القطار الثاني (${formatEnglishNumber(numB)}):`,
        wagonsData: [
          { id: 'w_a', label: 'القطار 1', value: formatEnglishNumber(numA), color: '#38bdf8' },
          { id: 'w_sign', label: 'المقارنة', value: '؟', color: '#f59e0b' },
          { id: 'w_b', label: 'القطار 2', value: formatEnglishNumber(numB), color: '#ec4899' },
        ],
        options,
        correctAnswer: correctSign,
        hint: `قارن الخانات من اليسار (الآلاف)، إذا تساوت قارن المئات ثم العشرات ثم الآحاد.`,
        points: 100,
        format: 'compare_signs',
      });
    } else {
      // Ordering 3 numbers (Ascending or Descending)
      const isAscending = Math.random() > 0.5;
      const baseNumbers = shuffleArray([
        getRandomInt(1100, 3500),
        getRandomInt(3600, 6500),
        getRandomInt(6600, 9900),
      ]);

      const correctOrder = [...baseNumbers].sort((a, b) => (isAscending ? a - b : b - a));
      const correctStr = correctOrder.map((n) => formatEnglishNumber(n)).join('  ➔  ');

      const wrong1 = [...baseNumbers]
        .sort((a, b) => (isAscending ? b - a : a - b))
        .map((n) => formatEnglishNumber(n))
        .join('  ➔  ');
      const wrong2 = shuffleArray([...baseNumbers])
        .map((n) => formatEnglishNumber(n))
        .join('  ➔  ');

      const options = shuffleArray([
        { id: 'opt_c', text: correctStr, value: correctStr, isCorrect: true },
        { id: 'opt_w1', text: wrong1, value: wrong1, isCorrect: false },
        { id: 'opt_w2', text: wrong2, value: wrong2, isCorrect: false },
      ]);

      const orderTypeAr = isAscending
        ? 'تصاعدياً (من الأصغر إلى الأكبر)'
        : 'تنازلياً (من الأكبر إلى الأصغر)';

      questions.push({
        id: `s4_q_${i}_${Date.now()}`,
        stationId: 4,
        type: 'order_numbers',
        title: `ترتيب الأعداد ${isAscending ? 'تصاعدياً' : 'تنازلياً'}`,
        instruction: `رتّب الأعداد التالية ${orderTypeAr}:`,
        wagonsData: baseNumbers.map((n, idx) => ({
          id: `w_${idx}`,
          label: `عربة ${idx + 1}`,
          value: formatEnglishNumber(n),
          color: '#8b5cf6',
        })),
        options,
        correctAnswer: correctStr,
        hint: isAscending
          ? 'الترتيب التصاعدي يبدأ من أصغر عدد وينتهي بأكبر عدد.'
          : 'الترتيب التنازلي يبدأ من أكبر عدد وينتهي بأصغر عدد.',
        points: 100,
        format: 'multiple_choice',
      });
    }
  }

  return questions;
}

/**
 * Generate Questions for Station 5: Rounding (10, 100, 1000)
 */
export function generateStation5Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const roundType = i % 3; // 0: nearest 10, 1: nearest 100, 2: nearest 1000
    let num = getRandomInt(125, 8760);
    let roundTarget = 10;
    let targetText = 'أقرب 10';

    if (roundType === 1) {
      roundTarget = 100;
      targetText = 'أقرب 100';
    } else if (roundType === 2) {
      roundTarget = 1000;
      targetText = 'أقرب 1,000';
      num = getRandomInt(1500, 9400);
    }

    const roundedVal = Math.round(num / roundTarget) * roundTarget;

    // Distractors
    const floorVal = Math.floor(num / roundTarget) * roundTarget;
    const ceilVal = Math.ceil(num / roundTarget) * roundTarget;
    const wrongOpt1 = roundedVal === floorVal ? ceilVal : floorVal;
    const wrongOpt2 = roundedVal + roundTarget * 2;
    const wrongOpt3 = Math.max(0, roundedVal - roundTarget * 2);

    const uniqueWrongs = Array.from(
      new Set([wrongOpt1, wrongOpt2, wrongOpt3].filter((w) => w !== roundedVal))
    ).slice(0, 3);
    while (uniqueWrongs.length < 3) {
      uniqueWrongs.push(roundedVal + (uniqueWrongs.length + 1) * roundTarget);
    }

    const options = shuffleArray([
      { id: 'opt_c', text: formatEnglishNumber(roundedVal), value: roundedVal, isCorrect: true },
      ...uniqueWrongs.map((w, idx) => ({
        id: `opt_w_${idx}`,
        text: formatEnglishNumber(w),
        value: w,
        isCorrect: false,
      })),
    ]);

    questions.push({
      id: `s5_q_${i}_${Date.now()}`,
      stationId: 5,
      type: 'round_number',
      title: `التقريب لـ ${targetText}`,
      instruction: `قرّب العدد الذي يحمله القطار (${formatEnglishNumber(num)}) إلى **${targetText}**:`,
      targetNumber: num,
      wagonsData: [
        { id: 'w_train', label: 'العدد الأصلي', value: formatEnglishNumber(num), color: '#f43f5e' },
        { id: 'w_round', label: 'المطلوب', value: targetText, color: '#fb7185' },
      ],
      options,
      correctAnswer: roundedVal,
      hint: `انظر إلى الرقم الذي يسبق خانة التقريب: إذا كان (0, 1, 2, 3, 4) نحافظ على الرقم، وإذا كان (5, 6, 7, 8, 9) نضيف 1.`,
      points: 100,
      format: 'multiple_choice',
    });
  }

  return questions;
}

/**
 * Generate Questions for Station 6: Mental Operations with Train Numbers
 */
export function generateStation6Questions(count: number = 6): Question[] {
  const questions: Question[] = [];

  for (let i = 0; i < count; i++) {
    const isAddition = i % 2 === 0;

    if (isAddition) {
      const a = getRandomInt(12, 65) * 100; // e.g. 3400
      const b = getRandomInt(3, 25) * 100; // e.g. 1200
      const sum = a + b;

      const options = shuffleArray([
        { id: 'opt_c', text: formatEnglishNumber(sum), value: sum, isCorrect: true },
        { id: 'opt_w1', text: formatEnglishNumber(sum + 100), value: sum + 100, isCorrect: false },
        { id: 'opt_w2', text: formatEnglishNumber(sum - 100), value: sum - 100, isCorrect: false },
        { id: 'opt_w3', text: formatEnglishNumber(sum + 1000), value: sum + 1000, isCorrect: false },
      ]);

      questions.push({
        id: `s6_q_${i}_${Date.now()}`,
        stationId: 6,
        type: 'train_addition',
        title: 'جمع عربات الأعداد',
        instruction: `وصلت عربتان إلى المحطة، احسب ناتج الجمع: (${formatEnglishNumber(a)} + ${formatEnglishNumber(b)})`,
        wagonsData: [
          { id: 'w_a', label: 'عربة 1', value: formatEnglishNumber(a), color: '#0ea5e9' },
          { id: 'w_plus', label: 'عملية', value: '+', color: '#10b981' },
          { id: 'w_b', label: 'عربة 2', value: formatEnglishNumber(b), color: '#0ea5e9' },
        ],
        options,
        correctAnswer: sum,
        hint: `اجمع الأصفار ثم اجمع المئات والآلاف ذهنياً.`,
        points: 100,
        format: 'multiple_choice',
      });
    } else {
      const a = getRandomInt(40, 95) * 100;
      const b = getRandomInt(10, 35) * 100;
      const diff = a - b;

      const options = shuffleArray([
        { id: 'opt_c', text: formatEnglishNumber(diff), value: diff, isCorrect: true },
        { id: 'opt_w1', text: formatEnglishNumber(diff + 100), value: diff + 100, isCorrect: false },
        { id: 'opt_w2', text: formatEnglishNumber(diff - 100), value: diff - 100, isCorrect: false },
        { id: 'opt_w3', text: formatEnglishNumber(diff + 200), value: diff + 200, isCorrect: false },
      ]);

      questions.push({
        id: `s6_q_${i}_${Date.now()}`,
        stationId: 6,
        type: 'train_subtraction',
        title: 'طرح عربات الأعداد',
        instruction: `تم تفريغ حمولة من القطار، احسب ناتج الطرح المتبقي: (${formatEnglishNumber(a)} - ${formatEnglishNumber(b)})`,
        wagonsData: [
          { id: 'w_a', label: 'الحمولة', value: formatEnglishNumber(a), color: '#0ea5e9' },
          { id: 'w_minus', label: 'عملية', value: '-', color: '#ef4444' },
          { id: 'w_b', label: 'المفرغ', value: formatEnglishNumber(b), color: '#f59e0b' },
        ],
        options,
        correctAnswer: diff,
        hint: `اطرح المئات والآلاف بذكاء للحصول على الباقي.`,
        points: 100,
        format: 'multiple_choice',
      });
    }
  }

  return questions;
}

/**
 * Generate Questions for Station 7: Final Master Train Challenge
 */
export function generateStation7Questions(count: number = 8): Question[] {
  const gen1 = generateStation1Questions(2);
  const gen2 = generateStation2Questions(2);
  const gen3 = generateStation3Questions(1);
  const gen4 = generateStation4Questions(1);
  const gen5 = generateStation5Questions(1);
  const gen6 = generateStation6Questions(1);

  const all = [...gen1, ...gen2, ...gen3, ...gen4, ...gen5, ...gen6];
  return shuffleArray(all)
    .slice(0, count)
    .map((q, idx) => ({
      ...q,
      id: `s7_final_${idx}_${Date.now()}`,
      stationId: 7,
      points: 150,
    }));
}

/**
 * Master function to generate questions for any station
 */
export function getQuestionsForStation(stationId: number, count?: number): Question[] {
  switch (stationId) {
    case 1:
      return generateStation1Questions(count || 6);
    case 2:
      return generateStation2Questions(count || 6);
    case 3:
      return generateStation3Questions(count || 6);
    case 4:
      return generateStation4Questions(count || 6);
    case 5:
      return generateStation5Questions(count || 6);
    case 6:
      return generateStation6Questions(count || 6);
    case 7:
      return generateStation7Questions(count || 8);
    default:
      return generateStation1Questions(6);
  }
}
