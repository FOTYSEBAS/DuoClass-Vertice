/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ArithmeticNode, ArithmeticSection, MathQuestion } from './mathCurriculum';
import { PHRASE_TRANSLATIONS, WORD_TRANSLATIONS } from './curriculumDictionary';
import { Language } from './translations';

// Ensure no dictionary entry contains a " / " dual-gloss
for (const key of Object.keys(WORD_TRANSLATIONS)) {
  if (WORD_TRANSLATIONS[key].includes(' / ')) {
    WORD_TRANSLATIONS[key] = WORD_TRANSLATIONS[key].split(' / ')[0];
  }
}

// Pre-sort multi-word phrases from longest to shortest so longer phrases always match first
const SORTED_PHRASES: [RegExp, string][] = [...PHRASE_TRANSLATIONS]
  .sort((a, b) => b[0].length - a[0].length)
  .map(([es, en]) => {
    const escaped = es.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startsWithLetter = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]/.test(es);
    const endsWithLetter = /[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]$/.test(es);
    const prefix = startsWithLetter ? '(?<![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ])' : '';
    const suffix = endsWithLetter ? '(?![a-zA-ZáéíóúüñÁÉÍÓÚÜÑ])' : '';
    return [new RegExp(`${prefix}${escaped}${suffix}`, 'gi'), en];
  });

function matchCapitalization(source: string, target: string): string {
  if (!source || !target) return target;
  if (
    source.length > 1 &&
    source === source.toUpperCase() &&
    source !== source.toLowerCase()
  ) {
    return target.toUpperCase();
  }
  const firstChar = source[0];
  if (
    firstChar === firstChar.toUpperCase() &&
    firstChar !== firstChar.toLowerCase()
  ) {
    return target[0].toUpperCase() + target.slice(1);
  }
  return target;
}

/**
 * Translates an individual Spanish word using WORD_TRANSLATIONS + morphological rules.
 */
function translateSpanishWord(word: string): string {
  const lower = word.toLowerCase();

  // Single-letter words are handled separately by context-aware regex
  if (lower.length <= 1) {
    return word;
  }

  // 1. Direct dictionary lookup
  if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, lower)) {
    return matchCapitalization(word, WORD_TRANSLATIONS[lower]);
  }

  // 2. Plural stripping (-es, -s, -ces -> -z) to match singular in dictionary
  if (lower.endsWith('ces') && lower.length > 4) {
    const singZ = lower.slice(0, -3) + 'z';
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, singZ)) {
      const baseEn = WORD_TRANSLATIONS[singZ];
      const pluralEn =
        baseEn.endsWith('y') && !/[aeiou]y$/i.test(baseEn)
          ? baseEn.slice(0, -1) + 'ies'
          : baseEn.endsWith('s') || baseEn.endsWith('x') || baseEn.endsWith('ch')
          ? baseEn + 'es'
          : baseEn + 's';
      return matchCapitalization(word, pluralEn);
    }
  }
  if (lower.endsWith('ciones') && lower.length > 6) {
    const stem = lower.slice(0, -6) + 'ción';
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, stem)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[stem] + 's');
    }
    return matchCapitalization(word, lower.slice(0, -6) + 'tions');
  }
  if (lower.endsWith('siones') && lower.length > 6) {
    const stem = lower.slice(0, -6) + 'sión';
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, stem)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[stem] + 's');
    }
    return matchCapitalization(word, lower.slice(0, -6) + 'sions');
  }
  if (lower.endsWith('s') && lower.length > 3) {
    const withoutS = lower.slice(0, -1);
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, withoutS)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[withoutS]);
    }
    if (withoutS.endsWith('a')) {
      const masc = withoutS.slice(0, -1) + 'o';
      if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, masc)) {
        return matchCapitalization(word, WORD_TRANSLATIONS[masc]);
      }
    }
  }
  if (lower.endsWith('a') && lower.length > 3) {
    const masc = lower.slice(0, -1) + 'o';
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, masc)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[masc]);
    }
  }
  if (lower.endsWith('es') && lower.length > 4) {
    const withoutEs = lower.slice(0, -2);
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, withoutEs)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[withoutEs]);
    }
    const accented = withoutEs
      .replace(/o([^o]*)$/, 'ó$1')
      .replace(/i([^i]*)$/, 'í$1');
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, accented)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[accented] + 's');
    }
  }

  // 3. Productive Spanish-to-English academic cognate suffixes
  if (lower.endsWith('mente') && lower.length > 6) {
    const adjFem = lower.slice(0, -5);
    if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, adjFem)) {
      return matchCapitalization(word, WORD_TRANSLATIONS[adjFem] + 'ly');
    }
    if (adjFem.endsWith('a')) {
      const adjMasc = adjFem.slice(0, -1) + 'o';
      if (Object.prototype.hasOwnProperty.call(WORD_TRANSLATIONS, adjMasc)) {
        return matchCapitalization(word, WORD_TRANSLATIONS[adjMasc] + 'ly');
      }
    }
  }
  if (lower.endsWith('ción') && lower.length > 5) {
    const base = lower
      .slice(0, -4)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'tion');
  }
  if (lower.endsWith('sión') && lower.length > 5) {
    const base = lower
      .slice(0, -4)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'sion');
  }
  if (lower.endsWith('dades') && lower.length > 6) {
    const base = lower
      .slice(0, -5)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'ties');
  }
  if (lower.endsWith('dad') && lower.length > 5) {
    const base = lower
      .slice(0, -3)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'ty');
  }
  if (lower.endsWith('ismo') && lower.length > 5) {
    const base = lower
      .slice(0, -4)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'ism');
  }
  if (lower.endsWith('ista') && lower.length > 5) {
    const base = lower
      .slice(0, -4)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'ist');
  }
  if (lower.endsWith('istas') && lower.length > 6) {
    const base = lower
      .slice(0, -5)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return matchCapitalization(word, base + 'ists');
  }

  return word;
}

/**
 * Multi-pass comprehensive Spanish-to-English translator for STEM and Social Sciences curriculum.
 * Uses placeholder shielding so phrase replacements are never re-mutated by word replacements.
 */
export function translateText(text: string | undefined, lang: Language): string {
  if (!text || lang === 'es') return text || '';

  let t = text;
  const shielded: string[] = [];
  const shield = (str: string): string => {
    const idx = shielded.length;
    shielded.push(str);
    return `\uE000${idx}\uE001`;
  };

  // 1. Remove inverted Spanish punctuation marks
  t = t.replace(/[¿¡]/g, '');

  // 2. Shield chemical formulas and math variables (e.g., H₂O(s), H₂O(l), a + b, f(x))
  t = t.replace(
    /\b(?:H₂O|CO₂|O₂|N₂|H₂|Cl₂|HCl|NaOH|NaCl|AgNO₃|AgCl|CaCO₃|CaO|MgO|MgCl₂|ZnCl₂|HgO|MnO₂|NH₃|CH₄|C₃H₈|LiF)(?:\([slg]\))?/g,
    (m) => shield(m)
  );

  // 3. Structural regex prefixes (shielded)
  t = t
    .replace(/^Guía de la Sección\s+(\d+):\s*/i, (_m, p1) => shield(`Section ${p1} Guide: `))
    .replace(/^Módulo\s+(\d+)\s*·\s*Guía Sección\s+(\d+):\s*/i, (_m, p1, p2) =>
      shield(`Module ${p1} · Section ${p2} Guide: `)
    )
    .replace(/^Guía M(\d+)\s*·\s*Sección\s+(\d+):\s*/i, (_m, p1, p2) =>
      shield(`M${p1} Guide · Section ${p2}: `)
    )
    .replace(/^Guía M(\d+)·S(\d+):\s*/i, (_m, p1, p2) => shield(`M${p1}·S${p2} Guide: `))
    .replace(/^Sección\s+(\d+)\s*·\s*/i, (_m, p1) => shield(`Section ${p1} · `))
    .replace(/^Módulo\s+(\d+)\s*·\s*Sección\s+(\d+)/i, (_m, p1, p2) =>
      shield(`Module ${p1} · Section ${p2}`)
    )
    .replace(/^Módulo\s+(\d+)\s*·\s*/i, (_m, p1) => shield(`Module ${p1} · `))
    .replace(/^Examen de Salto\s*\(M(\d+)\s*·\s*S(\d+)\):\s*/i, (_m, p1, p2) =>
      shield(`Skip Exam (M${p1} · S${p2}): `)
    )
    .replace(/^Examen de Salto\s*·\s*/i, () => shield('Skip Exam · '))
    .replace(/^Nivel\s+(\d+):\s*/i, (_m, p1) => shield(`Level ${p1}: `))
    .replace(/^Lección\s+(\d+):\s*/i, (_m, p1) => shield(`Lesson ${p1}: `))
    .replace(/^Pregunta\s+(\d+)\s+de\s+(\d+)/i, (_m, p1, p2) =>
      shield(`Question ${p1} of ${p2}`)
    );

  // 4. Apply sorted multi-word phrases (longest first) and shield their output
  for (const [regex, replacement] of SORTED_PHRASES) {
    t = t.replace(regex, (match) => shield(matchCapitalization(match, replacement)));
  }

  // 5. Translate single-letter Spanish conjunctions/prepositions only when surrounded by words (not math operators)
  t = t
    .replace(/(?<=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE001\),])\s+y\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE000\("])/g, ' and ')
    .replace(/(?<=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE001\),])\s+e\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE000\("])/g, ' and ')
    .replace(/(?<=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE001\),])\s+o\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE000\("])/g, ' or ')
    .replace(/(?<=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE001\),])\s+u\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE000\("])/g, ' or ')
    .replace(/(?<=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\uE001])\s+a\s+(?=[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]{2,}|\uE000)/g, ' to ');

  // 6. Word-by-word translation for all remaining multi-letter Spanish tokens
  t = t.replace(/[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ]{2,}/g, (word) => translateSpanishWord(word));

  // 7. Restore shielded phrase translations
  t = t.replace(/\uE000(\d+)\uE001/g, (_m, idx) => shielded[Number(idx)] ?? '');

  // 8. Post-processing English grammar & article cleanup
  t = t
    .replace(/\bcentury\s+(XIX|XX|XXI|XVIII)\b/g, '$1 century')
    .replace(/\ba ([aeiouAEIOU])/g, 'an $1')
    .replace(/\bA ([aeiouAEIOU])/g, 'An $1')
    .replace(/\bthe the\b/gi, 'the')
    .replace(/\bof of\b/gi, 'of');

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
    visualData: q.visualData
      ? {
          ...q.visualData,
          leftCount:
            typeof q.visualData.leftCount === 'string'
              ? translateText(q.visualData.leftCount, lang)
              : q.visualData.leftCount,
          rightCount:
            typeof q.visualData.rightCount === 'string'
              ? translateText(q.visualData.rightCount, lang)
              : q.visualData.rightCount,
        }
      : undefined,
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
