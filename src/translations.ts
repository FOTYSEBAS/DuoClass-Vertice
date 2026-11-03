/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'es' | 'en';

export const TRANSLATIONS = {
  es: {
    // Navigation tabs
    tabLearn: 'Aprender',
    tabPractice: 'Práctica',
    tabGuide: 'Guía',
    tabAchievements: 'Logros',
    tabSources: 'Fuentes',
    tabProfile: 'Perfil',

    // Courses
    courseSociales: 'Ciencias Sociales',
    courseQuimica: 'Química',
    courseFisica: 'Física',
    courseMatematicas: 'Matemáticas',
    myCourses: 'MIS CURSOS',
    addNewCourse: '+ Agrega un nuevo curso',
    modulesCount: 'módulos',
    sectionsCount: 'secciones',

    // Top Stats Strip
    streakDays: 'Días de racha',
    gems: 'Gemas',
    hearts: 'Vidas',
    studyFocusMode: 'Modo Enfoque de Estudio',
    focusModeDesc: 'Oculta el árbol y widgets para evitar distracciones en PC',

    // Tree / Main Learn View
    sectionsHeader: 'SECCIONES DE APRENDIZAJE',
    section: 'Sección',
    module: 'Módulo',
    skipSectionExam: 'Saltar con un examen a esta sección',
    startLessonBtn: '¡EMPEZAR LECCIÓN! (ENTER)',
    reviewLessonBtn: 'REPASAR LECCIÓN (ENTER)',
    lessonLocked: 'Lección bloqueada. Completa las lecciones anteriores.',
    nextLesson: 'Siguiente lección',
    goldCompleted: 'Completado en oro',
    inProgress: 'En progreso',
    locked: 'Bloqueado',

    // Daily Goal Ring
    dailyGoal: 'Meta diaria',
    goalCompleted: '¡Objetivo de hoy completado!',
    xpLeftForGoal: 'Faltan {xp} XP para tu meta',
    totalAccumulated: 'Total acumulado',
    status: 'Estado',
    goalExceeded: 'Meta superada',

    // Daily Challenges
    dailyChallenges: 'Desafíos del día',
    randomizeToday: 'Aleatorios hoy',
    challenge1Title: 'Gana 50 EXP',
    challenge2Title: 'Obtén un puntaje de 90 % o más en 3 lecciones',
    challenge3Title: 'Responde correctamente 5 veces seguidas en 5 lecciones',

    // Streak Freeze / Powerups
    powerups: 'Potenciadores',
    streakFreeze: 'Protector de racha',
    equipped: 'EQUIPADOS',
    streakFreezeDesc: 'Te permite mantener tu racha cuando no usas la app por un día.',

    // Module Summary
    moduleSummary: 'Resumen de Módulos',
    moduleGoalXp: 'Meta del Módulo (XP)',
    xpEarned: 'XP Alcanzado',

    // Spaced Repetition
    spacedToastTitle: 'Sugerencia de Repaso Espaciado',
    spacedDaysAgo: 'Hace {days} {unit}',
    day: 'día',
    days: 'días',
    retention: 'retención',
    reviewPlusXp: 'Repasar +5 XP',
    simulatePlus3d: 'Simular +3 días',
    resetSimulation: 'Hoy',
    spacedPanelTitle: 'Memoria y Repetición Espaciada',
    spacedPanelDesc: 'Intervalos Leitner (2d · 4d · 7d · 14d · 30d) al iniciar sesión',
    simulatePlus4d: 'Simular +4 días',
    memoryUpToDate: '¡Tu memoria está al día! Usa «Simular +4 días» para probar la alerta de regreso tras varios días.',
    restoreToastBtn: 'Mostrar notificación de repaso en el árbol',

    // Recent History Card
    recentHistoryTitle: 'Historial Reciente (Datos Reales)',
    recentHistorySub: 'Últimas 5 lecciones completadas por ti · Fecha exacta y puntaje real obtenido',
    noRecentLessons: 'Aún no hay lecciones completadas en tu historial reciente',
    noRecentLessonsDesc: 'Este registro muestra únicamente las lecciones que completes de forma real durante tus sesiones de estudio.',
    averageScore: 'Prom.',
    pts: 'pts',
    hits: 'aciertos',
    replay: 'Repasar',

    // Profile Tab
    verifiedStudent: 'Estudiante Verificado',
    heartStation: 'Estación de Vidas',
    heartsAvailable: 'Tienes {count} de 5 vidas disponibles',
    fullHeartsBtn: 'VIDAS AL MÁXIMO (5/5)',
    refillHeartsBtn: 'RECARGAR 5 VIDAS (20 GEMAS)',
    appLanguage: 'Idioma de la Aplicación',
    selectLanguageDesc: 'Selecciona tu idioma preferido (Español o Inglés)',
    soundEffects: 'Efectos de Sonido',
    soundMutedDesc: 'Silenciado · Sin sonidos en lecciones',
    soundActiveDesc: 'Activo · Volumen al {vol}%',
    soundVolume: 'Volumen de efectos',
    soundOn: 'Sonido ON',
    soundMuted: 'Silenciado',
    testSubtleSounds: 'Probar efectos sutiles',
    answerSound: '✓ Respuesta',
    levelUpSound: '★ Nuevo nivel',
    lessonSound: '🏆 Lección',
    resetProgressBtn: 'Reiniciar progreso',
    signOutBtn: 'CERRAR SESIÓN',

    // Active Lesson Screen
    textInstructionsGuide: 'Texto, Instrucciones y Guía',
    answerPanelTitle: 'Responder',
    questionCount: 'Pregunta {current} de {total}',
    sectionSkipBadge: 'SALTO SECCIÓN {id}',
    keyboardHint: 'Elige con 1–4 / ← → o escribe tu respuesta y pulsa Enter',
    optionsHeader: 'Opciones de respuesta (clic o teclas 1–N):',
    checkAnswerBtn: 'COMPROBAR RESPUESTA (ENTER)',
    correctAnswerTitle: '¡Respuesta correcta!',
    incorrectTitle: '¡Incorrecto!',
    correctIs: 'La respuesta correcta es:',
    explanation: 'Explicación:',
    continueBtn: 'CONTINUAR (ENTER)',
    lessonCompletedTitle: '¡Lección completada!',
    sectionSkipPassedTitle: '¡Salto de sección superado!',
    masteredSubtitle: 'Has dominado',
    unlockedSubtitle: 'Has desbloqueado directamente',
    totalExpLabel: 'EXP Total',
    accuracyLabel: 'Precisión',
    gemsLabel: 'Gemas',
    returnTreeHint: 'Presiona Enter o Esc para volver al árbol',

    // Quick Practice (Tab 2)
    mentalCalcTitle: 'Práctica de Cálculo Mental',
    mentalCalcSub: 'Responde la operación rápidamente para ganar XP extra',
    consecutiveCorrect: 'Aciertos seguidos:',

    // Guidebook (Tab 3)
    guideTitle: 'Guía de Estudio y Lectura',
    guideSub: 'Revisa explicaciones teóricas y responde lecciones por sección',
    formulasRulesEx: 'Fórmulas, Reglas y Ejemplos',
    answerSectionLessons: 'Responder Lecciones',
    selectLessonToQuiz: 'Selecciona una lección para abrir el cuestionario y responder:',

    // Achievements (Tab 4)
    masteryOf: 'Dominio de',
    nodesCompletedGold: 'nodos completados en oro',
    nodesStatusHeader: 'Estado de los Nodos del Curso',

    // Auth Login Screen
    loginTitle: 'Iniciar sesión',
    loginSub: 'Cursos de Química, Física, Matemáticas y Ciencias Sociales',
    googleSignInBtn: 'CONTINUAR CON GOOGLE (ENTER)',
    connecting: 'Conectando...',
  },
  en: {
    // Navigation tabs
    tabLearn: 'Learn',
    tabPractice: 'Practice',
    tabGuide: 'Guide',
    tabAchievements: 'Achievements',
    tabSources: 'Sources',
    tabProfile: 'Profile',

    // Courses
    courseSociales: 'Social Sciences',
    courseQuimica: 'Chemistry',
    courseFisica: 'Physics',
    courseMatematicas: 'Mathematics',
    myCourses: 'MY COURSES',
    addNewCourse: '+ Add a new course',
    modulesCount: 'modules',
    sectionsCount: 'sections',

    // Top Stats Strip
    streakDays: 'Streak Days',
    gems: 'Gems',
    hearts: 'Hearts',
    studyFocusMode: 'Study Focus Mode',
    focusModeDesc: 'Hide tree and widgets for a distraction-free experience on PC',

    // Tree / Main Learn View
    sectionsHeader: 'LEARNING SECTIONS',
    section: 'Section',
    module: 'Module',
    skipSectionExam: 'Jump to this section with an exam',
    startLessonBtn: 'START LESSON! (ENTER)',
    reviewLessonBtn: 'REVIEW LESSON (ENTER)',
    lessonLocked: 'Lesson locked. Complete previous lessons first.',
    nextLesson: 'Next lesson',
    goldCompleted: 'Completed in gold',
    inProgress: 'In progress',
    locked: 'Locked',

    // Daily Goal Ring
    dailyGoal: 'Daily Goal',
    goalCompleted: "Today's goal completed!",
    xpLeftForGoal: '{xp} XP left for your goal',
    totalAccumulated: 'Total accumulated',
    status: 'Status',
    goalExceeded: 'Goal exceeded',

    // Daily Challenges
    dailyChallenges: 'Daily Challenges',
    randomizeToday: 'Randomize today',
    challenge1Title: 'Earn 50 XP',
    challenge2Title: 'Score 90% or higher in 3 lessons',
    challenge3Title: 'Answer correctly 5 times in a row in 5 lessons',

    // Streak Freeze / Powerups
    powerups: 'Power-ups',
    streakFreeze: 'Streak Freeze',
    equipped: 'EQUIPPED',
    streakFreezeDesc: 'Keeps your streak intact when you do not use the app for a day.',

    // Module Summary
    moduleSummary: 'Module Summary',
    moduleGoalXp: 'Module Goal (XP)',
    xpEarned: 'XP Earned',

    // Spaced Repetition
    spacedToastTitle: 'Spaced Repetition Suggestion',
    spacedDaysAgo: '{days} {unit} ago',
    day: 'day',
    days: 'days',
    retention: 'retention',
    reviewPlusXp: 'Review +5 XP',
    simulatePlus3d: 'Simulate +3 days',
    resetSimulation: 'Today',
    spacedPanelTitle: 'Memory & Spaced Repetition',
    spacedPanelDesc: 'Leitner intervals (2d · 4d · 7d · 14d · 30d) upon sign-in',
    simulatePlus4d: 'Simulate +4 days',
    memoryUpToDate: 'Your memory is up to date! Use "Simulate +4 days" to test return reminders.',
    restoreToastBtn: 'Show review notification in skill tree',

    // Recent History Card
    recentHistoryTitle: 'Recent History (Real Data)',
    recentHistorySub: 'Last 5 lessons completed by you · Exact date and real score obtained',
    noRecentLessons: 'No completed lessons in your recent history yet',
    noRecentLessonsDesc: 'This log exclusively shows lessons you genuinely complete during your study sessions.',
    averageScore: 'Avg.',
    pts: 'pts',
    hits: 'hits',
    replay: 'Review',

    // Profile Tab
    verifiedStudent: 'Verified Student',
    heartStation: 'Heart Refill Station',
    heartsAvailable: 'You have {count} of 5 hearts available',
    fullHeartsBtn: 'FULL HEARTS (5/5)',
    refillHeartsBtn: 'REFILL 5 HEARTS (20 GEMS)',
    appLanguage: 'Application Language',
    selectLanguageDesc: 'Select your preferred language (Spanish or English)',
    soundEffects: 'Sound Effects',
    soundMutedDesc: 'Muted · No sounds during lessons',
    soundActiveDesc: 'Active · Volume at {vol}%',
    soundVolume: 'Effects Volume',
    soundOn: 'Sound ON',
    soundMuted: 'Muted',
    testSubtleSounds: 'Test subtle effects',
    answerSound: '✓ Answer',
    levelUpSound: '★ Level Up',
    lessonSound: '🏆 Lesson',
    resetProgressBtn: 'Reset progress',
    signOutBtn: 'SIGN OUT',

    // Active Lesson Screen
    textInstructionsGuide: 'Text, Instructions & Guide',
    answerPanelTitle: 'Answer',
    questionCount: 'Question {current} of {total}',
    sectionSkipBadge: 'SECTION {id} SKIP',
    keyboardHint: 'Choose with 1–4 / ← → or type your answer and press Enter',
    optionsHeader: 'Answer options (click or keys 1–N):',
    checkAnswerBtn: 'CHECK ANSWER (ENTER)',
    correctAnswerTitle: 'Correct answer!',
    incorrectTitle: 'Incorrect!',
    correctIs: 'The correct answer is:',
    explanation: 'Explanation:',
    continueBtn: 'CONTINUE (ENTER)',
    lessonCompletedTitle: 'Lesson completed!',
    sectionSkipPassedTitle: 'Section skip passed!',
    masteredSubtitle: 'You have mastered',
    unlockedSubtitle: 'You have directly unlocked',
    totalExpLabel: 'Total XP',
    accuracyLabel: 'Accuracy',
    gemsLabel: 'Gems',
    returnTreeHint: 'Press Enter or Esc to return to tree',

    // Quick Practice (Tab 2)
    mentalCalcTitle: 'Mental Calculation Practice',
    mentalCalcSub: 'Answer the operation quickly to earn extra XP',
    consecutiveCorrect: 'Consecutive hits:',

    // Guidebook (Tab 3)
    guideTitle: 'Study & Reading Guide',
    guideSub: 'Review theoretical explanations and answer section lessons',
    formulasRulesEx: 'Formulas, Rules & Examples',
    answerSectionLessons: 'Answer Lessons',
    selectLessonToQuiz: 'Select a lesson to open the quiz and answer:',

    // Achievements (Tab 4)
    masteryOf: 'Mastery of',
    nodesCompletedGold: 'gold nodes completed',
    nodesStatusHeader: 'Course Nodes Status',

    // Auth Login Screen
    loginTitle: 'Sign in',
    loginSub: 'Chemistry, Physics, Mathematics & Social Sciences Courses',
    googleSignInBtn: 'CONTINUE WITH GOOGLE (ENTER)',
    connecting: 'Connecting...',
  },
};

export function getTranslation(lang: Language, key: keyof typeof TRANSLATIONS['es'], params?: Record<string, string | number>): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.es;
  let text = dict[key] || TRANSLATIONS.es[key] || '';
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}
