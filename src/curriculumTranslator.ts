/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArithmeticNode, ArithmeticSection, MathQuestion } from './mathCurriculum';
import { Language } from './translations';

/**
 * Multi-pass comprehensive Spanish-to-English translator for STEM and Social Sciences curriculum.
 */
export function translateText(text: string | undefined, lang: Language): string {
  if (!text || lang === 'es') return text || '';

  let t = text;

  // Exact whole-sentence / whole-phrase matches first
  const exactPhrases: Record<string, string> = {
    // Navigation / Headers / General
    'Sección de Lectura I': 'Reading Section I',
    'Sección de Lectura II': 'Reading Section II',
    'Sección de Lectura III': 'Reading Section III',
    'Sección de Lectura IV': 'Reading Section IV',
    'Responder Lecciones': 'Answer Lessons',
    'Selecciona una lección para abrir el cuestionario y responder:': 'Select a lesson to open the quiz and answer:',
    'Ver lectura focalizada': 'View focused reading',
    'Ver las 4 subsecciones': 'View all 4 sub-sections',
    'Lectura clave para esta pregunta': 'Key reading for this question',
    'Instrucciones de la Lección': 'Lesson Instructions',
    'Texto de Lectura': 'Reading Text',
    'Lecturas de Estudio · 4 Subsecciones Documentales': 'Study Readings · 4 Documentary Sub-sections',
    'Texto de lectura analítica en letra pequeña para estudio detallado antes de responder': 'Small-print analytical reading text for detailed study before answering',

    // Specific Question Answers & Terms
    'Liberal': 'Liberal',
    'Conservador': 'Conservative',
    'Radical': 'Radical',
    'Federal': 'Federal',
    'Republicano': 'Republican',
    'Verdadero': 'True',
    'Falso': 'False',
    'Sí': 'Yes',
    'No': 'No',
    'Sólido': 'Solid',
    'Líquido': 'Liquid',
    'Gaseoso': 'Gas',
    'Masa': 'Mass',
    'Volumen': 'Volume',
    'Densidad': 'Density',
    'Velocidad': 'Velocity',
    'Aceleración': 'Acceleration',
    'Fuerza': 'Force',
    'Trabajo': 'Work',
    'Energía': 'Energy',
    'Presión': 'Pressure',
    'Exotérmica': 'Exothermic',
    'Endotérmica': 'Endothermic',
    'Cambio Físico': 'Physical Change',
    'Cambio Químico': 'Chemical Change',
  };

  if (exactPhrases[t]) {
    return exactPhrases[t];
  }

  // Regex patterns and phrase replacements
  const replacements: [RegExp | string, string][] = [
    // Section & Module prefixes
    [/^Sección\s+(\d+)\s*·\s*/i, 'Section $1 · '],
    [/^Módulo\s+(\d+)\s*·\s*/i, 'Module $1 · '],
    [/^Guía M(\d+)\s*·\s*Sección\s+(\d+):\s*/i, 'M$1 Guide · Section $2: '],
    [/^Guía M(\d+)·S(\d+):\s*/i, 'M$1·S$2 Guide: '],
    [/^Guía de la Sección\s+(\d+):\s*/i, 'Section $1 Guide: '],
    [/^Examen de Salto\s*\(M(\d+)\s*·\s*S(\d+)\):\s*/i, 'Skip Exam (M$1 · S$2): '],
    [/^Examen de Salto\s*·\s*/i, 'Skip Exam · '],
    [/^Nivel\s+(\d+):\s*/i, 'Level $1: '],
    [/^Lección\s+(\d+):\s*/i, 'Lesson $1: '],
    [/^Pregunta\s+(\d+)\s+de\s+(\d+)/i, 'Question $1 of $2'],
    [/^Evalúa tema anterior:\s*/i, 'Tests previous topic: '],
    [/^Evalúa:\s*/i, 'Tests: '],
    [/^Ejemplo:\s*/i, 'Example: '],
    [/^Explicación:\s*/i, 'Explanation: '],
    [/^Año histórico\s*=\s*/i, 'Historical year = '],
    [/^Respuesta\s*=\s*/i, 'Answer = '],
    [/^Incógnita\s*=\s*/i, 'Unknown = '],
    [/^Resultado\s*=\s*/i, 'Result = '],

    // Specific Question Prompts
    ['¿En qué año ocurrió "El Bogotazo" tras el magnicidio de Jorge Eliécer Gaitán?', 'In which year did "El Bogotazo" occur following the assassination of Jorge Eliécer Gaitán?'],
    ['Completa los dos partidos tradicionales del bipartidismo colombiano del siglo XX.', 'Complete the two traditional political parties of 20th century Colombian bipartisanship.'],
    ['El 9 de abril de 1948 ocurrió el magnicidio de Jorge Eliécer Gaitán en Bogotá.', 'On April 9, 1948, the assassination of Jorge Eliécer Gaitán occurred in Bogotá.'],
    ['El bipartidismo colombiano estuvo conformado por el Partido Liberal y el Partido Conservador.', 'Colombian bipartisanship was formed by the Liberal Party and the Conservative Party.'],

    // Mathematics Titles & Phrases
    ['Fundamentos de Aritmética', 'Arithmetic Fundamentals'],
    ['Domina sumas, restas, cálculo mental y propiedades conmutativas', 'Master addition, subtraction, mental math, and commutative properties'],
    ['Sumas y Restas', 'Addition & Subtraction'],
    ['Multiplicación y División', 'Multiplication & Division'],
    ['Grupos iguales, tablas ágiles, división exacta y jerarquía de operaciones', 'Equal groups, agile tables, exact division, and order of operations'],
    ['Fracciones y Decimales', 'Fractions & Decimals'],
    ['Partes de un todo, números mixtos, porcentajes y conversión directa', 'Parts of a whole, mixed numbers, percentages, and direct conversion'],
    ['Ecuaciones y Despejes', 'Equations & Solving'],
    ['Ecuaciones lineales, aislamiento de la variable e igualdades algebraicas', 'Linear equations, variable isolation, and algebraic equalities'],
    ['Geometría y Perímetros', 'Geometry & Perimeters'],
    ['Figuras planas, cálculo de áreas, volúmenes y teoremas fundamentales', 'Flat figures, area calculation, volumes, and fundamental theorems'],
    ['Estadística y Probabilidad', 'Statistics & Probability'],
    ['Promedios, medianas, modas, gráficos de barras y eventos aleatorios', 'Averages, medians, modes, bar charts, and random events'],
    ['Álgebra de Polinomios', 'Polynomial Algebra'],
    ['Operaciones con monomios, productos notables y factorización ágil', 'Monomial operations, special products, and factoring'],
    ['Funciones y Gráficas', 'Functions & Graphs'],
    ['Dominio, rango, función lineal, cuadrática e interpretación gráfica', 'Domain, range, linear/quadratic function, and graphical interpretation'],
    ['Trigonometría Básica', 'Basic Trigonometry'],
    ['Razones trigonométricas, sen, cos, tan y triángulo rectángulo', 'Trigonometric ratios, sin, cos, tan, and right triangle'],
    ['Cálculo Diferencial', 'Differential Calculus'],
    ['Límites, continuidad, derivadas algebraicas y tasas de cambio', 'Limits, continuity, algebraic derivatives, and rates of change'],

    // Chemistry Titles & Phrases
    ['Materia y Energía', 'Matter & Energy'],
    ['Estados de la materia, propiedades físicas, químicas y transformaciones', 'States of matter, physical/chemical properties, and transformations'],
    ['Estructura Atómica', 'Atomic Structure'],
    ['Protones, neutrones, electrones, número atómico y configuración', 'Protons, neutrons, electrons, atomic number, and configuration'],
    ['Tabla Periódica y Enlaces', 'Periodic Table & Chemical Bonds'],
    ['Grupos, periodos, electronegatividad, enlaces iónicos y covalentes', 'Groups, periods, electronegativity, ionic and covalent bonds'],
    ['Nomenclatura Química', 'Chemical Nomenclature'],
    ['Óxidos, hidróxidos, ácidos y sales inorgánicas', 'Oxides, hydroxides, acids, and inorganic salts'],
    ['Estequiometría y Balanceo', 'Stoichiometry & Reaction Balancing'],
    ['Masa molar, mol, ley de conservación de la materia y balanceo', 'Molar mass, mole, law of conservation of mass, and balancing'],
    ['Termoquímica y Soluciones', 'Thermochemistry & Solutions'],
    ['Molaridad, solubilidad, reacciones exotérmicas y endotérmicas', 'Molarity, solubility, exothermic and endothermic reactions'],

    // Physics Titles & Phrases
    ['Cinemática y Movimiento', 'Kinematics & Motion'],
    ['Movimiento rectilíneo uniforme (MRU) y acelerado (MRUA)', 'Uniform linear motion (MRU) and accelerated motion (MRUA)'],
    ['Leyes de Newton y Fuerzas', 'Newton\'s Laws & Forces'],
    ['Fuerza, masa, aceleración, fricción y diagramas de cuerpo libre', 'Force, mass, acceleration, friction, and free body diagrams'],
    ['Trabajo, Potencia y Energía', 'Work, Power & Energy'],
    ['Energía cinética, potencial gravitatoria y conservación mecánica', 'Kinetic energy, gravitational potential, and mechanical conservation'],
    ['Fluidos y Presión', 'Fluids & Pressure'],
    ['Densidad, presión hidrostática, principio de Arquímedes y Pascal', 'Density, hydrostatic pressure, Archimedes and Pascal principles'],
    ['Termodinámica y Calor', 'Thermodynamics & Heat'],
    ['Temperatura, calor específico, conducción, convección y radiación', 'Temperature, specific heat, conduction, convection, and radiation'],
    ['Ondas y Electromagnetismo', 'Waves & Electromagnetism'],
    ['Longitud de onda, frecuencia, ley de Ohm, voltaje y circuitos', 'Wavelength, frequency, Ohm\'s law, voltage, and circuits'],

    // Social Sciences Titles & Phrases
    ['Bipartidismo y La Violencia (Años 50)', 'Bipartisanship & The Violence (1950s)'],
    ['Polarización liberal-conservadora, El Bogotazo (1948) y crisis institucional', 'Liberal-conservative polarization, El Bogotazo (1948) and institutional crisis'],
    ['El Frente Nacional (1958–1974)', 'The National Front (1958–1974)'],
    ['Pacto de alternancia presidencial y paridad burocrática entre liberales y conservadores', 'Presidential alternation pact and bureaucratic parity between liberals and conservatives'],
    ['Exclusión Política y Urbanización (Años 60)', 'Political Exclusion & Urbanization (1960s)'],
    ['Restricción a terceras fuerzas políticas, migración del campo a la ciudad y crecimiento urbano', 'Restrictions on third political parties, rural-to-urban migration and urban growth'],
    ['Surgimiento Histórico del ELN (1964–1965)', 'Historical Emergence of the ELN (1964–1965)'],
    ['Influencia de la Revolución Cubana, el movimiento estudiantil y el contexto agrario', 'Influence of the Cuban Revolution, student movement and agrarian context'],
    ['Transformaciones Territoriales y Comunidades', 'Territorial Transformations & Communities'],
    ['Efectos en comunidades campesinas, afrodescendientes e indígenas', 'Impacts on peasant, Afro-descendant and indigenous communities'],
    ['Derechos Humanos, No Repetición y Paz', 'Human Rights, Non-Repetition & Peace'],
    ['Memoria histórica, reparación a víctimas y construcción de convivencia pacífica', 'Historical memory, victim reparation and peaceful coexistence'],

    // Common Question & Sentence Vocabulary
    ['¿Cuál es el resultado de', 'What is the result of'],
    ['¿Cuánto es', 'How much is'],
    ['Calcula el valor de', 'Calculate the value of'],
    ['Calcula', 'Calculate'],
    ['Resuelve para x en', 'Solve for x in'],
    ['Resuelve para', 'Solve for'],
    ['¿En qué año ocurrió', 'In which year did'],
    ['¿En qué año', 'In which year'],
    ['¿Cuál de los siguientes', 'Which of the following'],
    ['¿Qué principio', 'Which principle'],
    ['¿Qué tipo de', 'What type of'],
    ['¿Cómo se denomina', 'What is called'],
    ['¿Quién fue', 'Who was'],
    ['¿Cuál fue', 'What was'],
    ['¿Por qué', 'Why'],
    ['¿Dónde', 'Where'],
    ['es la unidad de', 'is the unit of'],
    ['es un cambio', 'is a change'],
    ['se define como', 'is defined as'],
    ['se caracteriza por', 'is characterized by'],
    ['debido a', 'due to'],
    ['por lo tanto', 'therefore'],
    ['en consecuencia', 'as a consequence'],
    ['es decir', 'that is to say'],
    ['por ejemplo', 'for example'],
    ['mientras que', 'while'],
    ['sin embargo', 'however'],
    ['además', 'furthermore'],
    ['para encontrar', 'to find'],
    ['para calcular', 'to calculate'],
    ['se aplica la fórmula', 'the formula is applied'],
    ['se utiliza', 'is used'],
    ['se obtiene', 'is obtained'],
    ['es igual a', 'is equal to'],
    ['mayor que', 'greater than'],
    ['menor que', 'less than'],
    ['proporcional a', 'proportional to'],
    ['inversamente proporcional', 'inversely proportional'],
    ['físico', 'physical'],
    ['químico', 'chemical'],
    ['exotérmico', 'exothermic'],
    ['endotérmico', 'endothermic'],
    ['fuerza', 'force'],
    ['trabajo', 'work'],
    ['potencia', 'power'],
    ['energía', 'energy'],
    ['masa', 'mass'],
    ['velocidad', 'velocity'],
    ['aceleración', 'acceleration'],
    ['distancia', 'distance'],
    ['tiempo', 'time'],
    ['temperatura', 'temperature'],
    ['presión', 'pressure'],
    ['volumen', 'volume'],
    ['densidad', 'density'],
    ['reactivos', 'reactants'],
    ['productos', 'products'],
  ];

  replacements.forEach(([pattern, replacement]) => {
    if (typeof pattern === 'string') {
      t = t.split(pattern).join(replacement);
    } else {
      t = t.replace(pattern, replacement);
    }
  });

  return t;
}

/**
 * Translates a MathQuestion into English when lang === 'en'
 */
export function translateQuestion(q: MathQuestion, lang: Language): MathQuestion {
  if (lang === 'es') return q;

  return {
    ...q,
    prompt: translateText(q.prompt, lang),
    equationPrefix: q.equationPrefix ? translateText(q.equationPrefix, lang) : undefined,
    equationSuffix: q.equationSuffix ? translateText(q.equationSuffix, lang) : undefined,
    options: q.options.map((opt) => translateText(opt, lang)),
    correctAnswer: translateText(q.correctAnswer, lang),
    explanation: translateText(q.explanation, lang),
    tableRows: q.tableRows?.map((row) => ({
      ...row,
      prefix: translateText(row.prefix, lang),
      highlight: row.highlight ? translateText(row.highlight, lang) : undefined,
      suffix: row.suffix ? translateText(row.suffix, lang) : undefined,
    })),
  };
}

/**
 * Translates an ArithmeticSection into English when lang === 'en'
 */
export function translateSection(section: ArithmeticSection, lang: Language): ArithmeticSection {
  if (lang === 'es') return section;

  return {
    ...section,
    title: translateText(section.title, lang),
    subtitle: translateText(section.subtitle, lang),
    guideTitle: translateText(section.guideTitle, lang),
    previousSectionLabel: section.previousSectionLabel
      ? translateText(section.previousSectionLabel, lang)
      : undefined,
    guideTips: section.guideTips.map((tip) => ({
      formula: translateText(tip.formula, lang),
      rule: translateText(tip.rule, lang),
      example: translateText(tip.example, lang),
    })),
    skipExamQuestions: section.skipExamQuestions?.map((q) => translateQuestion(q, lang)),
  };
}

/**
 * Translates an ArithmeticNode into English when lang === 'en'
 */
export function translateNode(node: ArithmeticNode, lang: Language): ArithmeticNode {
  if (lang === 'es') return node;

  return {
    ...node,
    title: translateText(node.title, lang),
    subtitle: translateText(node.subtitle, lang),
    questions: node.questions.map((q) => translateQuestion(q, lang)),
  };
}

/**
 * Translates an array of ArithmeticSections
 */
export function translateSections(
  sections: ArithmeticSection[],
  lang: Language
): ArithmeticSection[] {
  return sections.map((sec) => translateSection(sec, lang));
}

/**
 * Translates an array of ArithmeticNodes
 */
export function translateNodes(nodes: ArithmeticNode[], lang: Language): ArithmeticNode[] {
  return nodes.map((node) => translateNode(node, lang));
}
