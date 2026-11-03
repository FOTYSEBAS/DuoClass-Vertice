import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText, Layers, Sparkles } from 'lucide-react';
import { ArithmeticNode, ArithmeticSection } from '../mathCurriculum';
import { RecentCourseId } from './RecentHistoryCard';
import { translateText } from '../curriculumTranslator';

export interface ReadingSubSection {
  id: string;
  badge: string;
  heading: string;
  body: string;
  keyNote: string;
}

/**
 * Generates 4 dense, academic reading sub-sections in small print for any section of any course.
 * Designed specifically for reading-intensive study ("más secciones, que sea más de leer, por eso letra pequeña").
 */
export function getSectionReadingSubSections(
  course: RecentCourseId,
  section: ArithmeticSection,
  sectionNodes: ArithmeticNode[] = [],
  lang: 'es' | 'en' = 'es'
): ReadingSubSection[] {
  const isEn = lang === 'en';
  const cleanTitle = section.title.replace(/^(Sección|Section)\s+\d+\s*·\s*/i, '');
  const tip0 = section.guideTips[0];
  const tip1 = section.guideTips[1] || section.guideTips[0];
  const nodeTitles = sectionNodes.map((n) => n.title).join(', ');
  const firstQuestionExplanations = sectionNodes
    .flatMap((n) => n.questions.map((q) => q.explanation))
    .filter(Boolean)
    .slice(0, 4);

  if (course === 'sociales') {
    return [
      {
        id: 'sec_lectura_1',
        badge: isEn ? 'Reading Section I' : 'Sección de Lectura I',
        heading: isEn ? `Historical Context: ${cleanTitle}` : `Marco Histórico y Contexto: ${cleanTitle}`,
        body: isEn
          ? `The rigorous study of "${cleanTitle}" (${section.subtitle}) requires analyzing the political, social, agrarian, and institutional structures of contemporary Colombia. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } In Colombian historiography, mid-to-late 20th-century events are understood through the interaction of political regimes, democratic demands, rural-urban migration, and territorial land tensions.`
          : `El estudio riguroso de "${cleanTitle}" (${section.subtitle}) exige analizar las estructuras políticas, sociales, agrarias e institucionales de la Colombia contemporánea. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } En la historiografía colombiana, los procesos de mediados y finales del siglo XX no se explican por hechos aislados, sino por la interacción entre el régimen político, las demandas de participación democrática, las transformaciones demográficas campo-ciudad y las tensiones regionales en torno a la tierra y los derechos ciudadanos.`,
        keyNote: tip0 ? `${isEn ? 'Documentary axis' : 'Eje documental'}: ${tip0.formula}` : `${isEn ? 'Module' : 'Módulo'} ${section.moduleId ?? 1} · ${cleanTitle}`,
      },
      {
        id: 'sec_lectura_2',
        badge: isEn ? 'Reading Section II' : 'Sección de Lectura II',
        heading: isEn ? 'Process Analysis, Actors & Territorial Dynamics' : 'Análisis de Procesos, Actores y Dinámicas Territoriales',
        body: isEn
          ? `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }Across the lessons in this section (${nodeTitles || cleanTitle}), we examine the root causes and social consequences impacting the civilian population. Understanding how peasant, student, labor, and community movements evolved helps distinguish peaceful social protest protected by the Constitution from internal armed conflict dynamics.`
          : `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }A lo largo de los nodos de esta unidad (${nodeTitles || cleanTitle}), se examinan las causas profundas y las consecuencias sociales sobre la población civil. Comprender cómo evolucionaron las movilizaciones campesinas, estudiantiles, sindicales y comunitarias permite distinguir con claridad entre la protesta social pacífica amparada por la Constitución y las dinámicas del conflicto armado interno que afectaron severamente a las regiones periféricas.`,
        keyNote: tip1 ? `${isEn ? 'Analytical reference' : 'Referencia analítica'}: ${tip1.formula}` : (isEn ? 'Comparative historical & territorial focus' : 'Enfoque histórico y territorial comparado'),
      },
      {
        id: 'sec_lectura_3',
        badge: isEn ? 'Reading Section III' : 'Sección de Lectura III',
        heading: isEn ? 'Historical Sources & Documentary Evidence' : 'Fuentes Históricas, Evidencia Documental y Casos de Estudio',
        body: isEn
          ? (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} Comparing primary sources (press archives, agrarian laws, study commission reports, constitutional rulings, and regional testimony) is essential for grounded historical judgment.`
              : `Analyzing primary and secondary sources regarding ${cleanTitle} demonstrates that local, peasant, indigenous, and Afro-descendant communities have actively defended life, territory, and collective memory.`)
          : (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} El contraste de fuentes primarias (archivos de prensa, leyes agrarias, informes de comisiones de estudio, sentencias constitucionales y testimonios regionales) es indispensable para evitar generalizaciones y construir un criterio propio fundamentado en la evidencia histórica.`
              : `El análisis de fuentes primarias y secundarias sobre ${cleanTitle} demuestra que las comunidades locales, campesinas, indígenas y afrodescendientes han desempeñado un papel activo en la defensa de la vida, el territorio y la memoria colectiva frente a las adversidades del conflicto.`),
        keyNote: isEn ? 'Methodology: Critical comparison of primary sources and official reports' : 'Metodología: Contraste crítico de fuentes primarias, archivo e informes oficiales',
      },
      {
        id: 'sec_lectura_4',
        badge: isEn ? 'Reading Section IV' : 'Sección de Lectura IV',
        heading: isEn ? 'Critical Synthesis, Human Rights & Peace Culture' : 'Síntesis Crítica, Derechos Humanos y Cultura de Paz',
        body: isEn
          ? `All historical reading on the Colombian conflict holds as its ethical horizon the protection of Human Rights, International Humanitarian Law, dignifying historical memory, and non-repetition guarantees. Thoroughly understanding this background strengthens democratic coexistence under Article 22 of the 1991 Constitution.`
          : `Toda lectura histórica sobre el conflicto colombiano y sus transformaciones tiene como horizonte ético la defensa irrestricta de los Derechos Humanos, el Derecho Internacional Humanitario (principio de distinción y protección de la población civil), la memoria histórica dignificante y las garantías de no repetición. Conocer a fondo estos antecedentes fortalece la convivencia democrática y el mandato del Artículo 22 de la Constitución Política de 1991.`,
        keyNote: isEn ? 'Formative conclusion: Understanding the past to guarantee non-repetition and peace' : 'Conclusión formativa: Comprender el pasado para garantizar la no repetición y la paz',
      },
    ];
  }

  if (course === 'quimica') {
    return [
      {
        id: 'sec_lectura_1',
        badge: isEn ? 'Reading Section I' : 'Sección de Lectura I',
        heading: isEn ? `Chemical & Energetic Fundamentals: ${cleanTitle}` : `Fundamento Químico y Energético: ${cleanTitle}`,
        body: isEn
          ? `In studying "${cleanTitle}" (${section.subtitle}), we analyze how the microscopic structure of matter determines macroscopic energy exchanges. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } Every chemical transformation involves bond breaking and formation adhering strictly to mass-energy conservation.`
          : `En el estudio de "${cleanTitle}" (${section.subtitle}), analizamos cómo la estructura microscópica de la materia determina los intercambios macroscópicos de energía. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } Toda transformación química implica la ruptura y formación de enlaces o la reorganización de partículas subatómicas, cumpliendo estrictamente los principios de conservación de la masa-energía.`,
        keyNote: tip0 ? `${isEn ? 'Fundamental principle' : 'Principio fundamental'}: ${tip0.formula}` : cleanTitle,
      },
      {
        id: 'sec_lectura_2',
        badge: isEn ? 'Reading Section II' : 'Sección de Lectura II',
        heading: isEn ? 'Transfer Mechanisms & Atomic Structure' : 'Mecanismos de Transferencia, Termoquímica y Estructura Atómica',
        body: isEn
          ? `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }The topics covered in this unit (${nodeTitles || cleanTitle}) examine quantitative relations between enthalpy change, activation energy, periodic configuration, or nuclear stability.`
          : `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }En los temas desarrollados en esta sección (${nodeTitles || cleanTitle}), se examina la relación cuantitativa entre variación de entalpía, energía de activación, configuración periódica o estabilidad nuclear según el módulo correspondiente.`,
        keyNote: tip1 ? `${isEn ? 'Key relation' : 'Relación clave'}: ${tip1.formula}` : (isEn ? 'Thermochemical & subatomic analysis' : 'Análisis termoquímico y subatómico'),
      },
      {
        id: 'sec_lectura_3',
        badge: isEn ? 'Reading Section III' : 'Sección de Lectura III',
        heading: isEn ? 'Experimental Applications & Resolution' : 'Aplicaciones Experimentales y Resolución Paso a Paso',
        body: isEn
          ? (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} In the laboratory and industry, correctly interpreting thermodynamic signs (ΔH < 0 exothermic vs. ΔH > 0 endothermic) predicts real reaction behavior.`
              : `Rigorous interpretation of experimental data regarding ${cleanTitle} connects chemical equations with industrial and natural phenomena.`)
          : (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} En el laboratorio y en la industria, interpretar correctamente los signos termodinámicos (ΔH < 0 exotérmico vs. ΔH > 0 endotérmico) y las tasas de desintegración permite predecir el comportamiento real de las reacciones.`
              : `La interpretación rigurosa de datos experimentales sobre ${cleanTitle} conecta las ecuaciones químicas con fenómenos cotidianos, industriales y astrofísicos.`),
        keyNote: isEn ? 'Experimental reading: Verification of units, signs and energy balance' : 'Lectura experimental: Verificación de unidades, signos y balance energético',
      },
      {
        id: 'sec_lectura_4',
        badge: isEn ? 'Reading Section IV' : 'Sección de Lectura IV',
        heading: isEn ? 'Conceptual Synthesis & Scientific Verification' : 'Síntesis Conceptual y Verificación Científica',
        body: isEn
          ? `To master "${cleanTitle}", read each prompt carefully to identify the system, surroundings, transformation type (physical, chemical, or nuclear), and involved quantities before calculating.`
          : `Para dominar "${cleanTitle}", conviene leer con atención cada enunciado identificando primero el sistema, el entorno, el tipo de transformación (física, química o nuclear) y las magnitudes involucradas antes de efectuar el cálculo o seleccionar la respuesta.`,
        keyNote: isEn ? 'Study criterion: Identify system, surroundings and conservation law' : 'Criterio de estudio: Identificar sistema, entorno y ley de conservación',
      },
    ];
  }

  if (course === 'fisica') {
    return [
      {
        id: 'sec_lectura_1',
        badge: isEn ? 'Reading Section I' : 'Sección de Lectura I',
        heading: isEn ? `Physical Framework & Fundamental Laws: ${cleanTitle}` : `Marco Físico y Leyes Fundamentales: ${cleanTitle}`,
        body: isEn
          ? `Section "${cleanTitle}" (${section.subtitle}) develops physical principles governing motion, forces, and energy transfer. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } In classical and modern physics, mechanical work, kinetic energy, and potential energy form complementary descriptions of physical systems.`
          : `La sección "${cleanTitle}" (${section.subtitle}) desarrolla los principios físicos que gobiernan el movimiento, las fuerzas y la transferencia de energía. ${
              tip0 ? `${tip0.rule} ${tip0.example}` : ''
            } En física clásica y moderna, el trabajo mecánico, la energía cinética y la energía potencial constituyen lenguajes complementarios para describir la evolución de cualquier sistema físico.`,
        keyNote: tip0 ? `${isEn ? 'Governing equation' : 'Ecuación rectora'}: ${tip0.formula}` : cleanTitle,
      },
      {
        id: 'sec_lectura_2',
        badge: isEn ? 'Reading Section II' : 'Sección de Lectura II',
        heading: isEn ? 'Vector Analysis & Energy Conservation' : 'Análisis Vectorial, Conservación y Transformación',
        body: isEn
          ? `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }While advancing through this unit (${nodeTitles || cleanTitle}), pay close attention to International System units (Joules, Newtons, Watts, m/s) and conditions under which mechanical energy is conserved or dissipated as friction heat.`
          : `${
              tip1 ? `${tip1.rule} ${tip1.example} ` : ''
            }Al recorrer los niveles de esta unidad (${nodeTitles || cleanTitle}), presta especial atención a las unidades del Sistema Internacional (Joules, Newtons, Watts, metros por segundo) y a las condiciones bajo las cuales la energía mecánica se conserva o se disipa en calor por fricción.`,
        keyNote: tip1 ? `${isEn ? 'Complementary formula' : 'Fórmula complementaria'}: ${tip1.formula}` : 'International System of Units (SI)',
      },
      {
        id: 'sec_lectura_3',
        badge: isEn ? 'Reading Section III' : 'Sección de Lectura III',
        heading: isEn ? 'Applied Physical Cases & Deduction' : 'Casos Físicos Aplicados y Deducción Analítica',
        body: isEn
          ? (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} Each physical problem becomes clearer when reading and visualizing the physical phenomenon before substituting numerical values.`
              : `Detailed analysis of ${cleanTitle} allows modeling simple machines, vehicles, electric circuits, waves, and thermodynamic systems.`)
          : (firstQuestionExplanations.length > 0
              ? `${firstQuestionExplanations.join(' ')} Cada problema físico se resuelve con mayor claridad cuando primero se lee e interpreta el fenómeno físico antes de sustituir valores numéricos.`
              : `El análisis detallado de ${cleanTitle} permite modelar desde máquinas simples y vehículos hasta circuitos eléctricos, ondas y sistemas termodinámicos.`),
        keyNote: isEn ? 'Method: Data → Physical model → Substitution → Interpretation' : 'Método de resolución: Datos → Modelo físico → Sustitución → Interpretación',
      },
      {
        id: 'sec_lectura_4',
        badge: isEn ? 'Reading Section IV' : 'Sección de Lectura IV',
        heading: isEn ? 'Summary of Physical Properties & Invariants' : 'Resumen de Propiedades e Invariantes Físicos',
        body: isEn
          ? `Always check the dimensional coherence of results: energy variation or work done is expressed in Joules (J), power in Watts (W), and efficiency as a percentage between 0% and 100%.`
          : `Comprueba siempre la coherencia dimensional del resultado: una variación de energía o un trabajo realizado se expresa en Joules (J), una potencia en Watts (W) y un rendimiento o eficiencia energética como porcentaje entre 0% y 100%.`,
        keyNote: isEn ? 'Quality control: Dimensional analysis and physical sign meaning' : 'Control de calidad: Análisis dimensional y sentido físico del signo',
      },
    ];
  }

  return [
    {
      id: 'sec_lectura_1',
      badge: isEn ? 'Reading Section I' : 'Sección de Lectura I',
      heading: isEn ? `Formal Definition & Structure: ${cleanTitle}` : `Definición Formal y Estructura: ${cleanTitle}`,
      body: isEn
        ? `In "${cleanTitle}" (${section.subtitle}), we study the structural and symbolic properties needed to solve problems accurately. ${
            tip0 ? `${tip0.rule} ${tip0.example}` : ''
          } Understanding the reason behind each property prevents mechanical mistakes and speeds up deductive reasoning.`
        : `En "${cleanTitle}" (${section.subtitle}), estudiamos las propiedades estructurales y simbólicas que permiten resolver problemas con exactitud. ${
            tip0 ? `${tip0.rule} ${tip0.example}` : ''
          } Comprender el porqué de cada propiedad evita errores mecánicos y agiliza el razonamiento deductivo.`,
      keyNote: tip0 ? `${isEn ? 'Base property' : 'Propiedad base'}: ${tip0.formula}` : cleanTitle,
    },
    {
      id: 'sec_lectura_2',
      badge: isEn ? 'Reading Section II' : 'Sección de Lectura II',
      heading: isEn ? 'Algebraic, Geometric & Analytical Development' : 'Desarrollo Algebraico, Geométrico y Analítico',
      body: isEn
        ? `${
            tip1 ? `${tip1.rule} ${tip1.example} ` : ''
          }Through the lessons (${nodeTitles || cleanTitle}), numerical, tabular, and symbolic representations integrate to build mathematical fluency.`
        : `${
            tip1 ? `${tip1.rule} ${tip1.example} ` : ''
          }A través de las lecciones (${nodeTitles || cleanTitle}), se integran representaciones numéricas, tabulares y simbólicas para afianzar la fluidez matemática.`,
      keyNote: tip1 ? `${isEn ? 'Operating rule' : 'Regla operativa'}: ${tip1.formula}` : (isEn ? 'Step-by-step deductive reasoning' : 'Razonamiento deductivo paso a paso'),
    },
    {
      id: 'sec_lectura_3',
      badge: isEn ? 'Reading Section III' : 'Sección de Lectura III',
      heading: isEn ? 'Solved Examples & Demonstration' : 'Ejemplos Resueltos y Demostración Práctica',
      body: isEn
        ? (firstQuestionExplanations.length > 0
            ? `${firstQuestionExplanations.join(' ')} Carefully reading each expression structure helps identify patterns and simplify before operating.`
            : `Mastering ${cleanTitle} serves as a direct foundation for advanced modules in linear algebra, geometry, and calculus.`)
        : (firstQuestionExplanations.length > 0
            ? `${firstQuestionExplanations.join(' ')} Leer con detenimiento la estructura de cada expresión permite identificar patrones y simplificar antes de operar.`
            : `El dominio de ${cleanTitle} sirve como base directa para los módulos superiores de álgebra lineal, geometría analítica y cálculo diferencial e integral.`),
      keyNote: isEn ? 'Pattern identification and algebraic simplification' : 'Identificación de patrones y simplificación algebraica',
    },
    {
      id: 'sec_lectura_4',
      badge: isEn ? 'Reading Section IV' : 'Sección de Lectura IV',
      heading: isEn ? 'Summary & Deductive Proofs' : 'Resumen de Propiedades y Demostraciones',
      body: isEn
        ? `Review key formulas and verify each step logically before confirming your choice.`
        : `Repasa las fórmulas fundamentales y verifica cada paso de forma lógica antes de confirmar la respuesta.`,
      keyNote: isEn ? 'Verification: Check units and algebraic signs' : 'Verificación: Comprobar unidades y signos algebraicos',
    },
  ];
}

interface SectionReadingCardProps {
  course: RecentCourseId;
  section: ArithmeticSection;
  sectionNodes: ArithmeticNode[];
  lang?: 'es' | 'en';
}

/**
 * Compact, small-print reading block ("que sea más de leer, por eso letra pequeña")
 * rendered inside each Section on the Aprender tab and in the Guía tab.
 */
export const SectionReadingCard: React.FC<SectionReadingCardProps> = ({
  course,
  section,
  sectionNodes,
  lang = 'es',
}) => {
  const isEn = lang === 'en';
  const subSections = getSectionReadingSubSections(course, section, sectionNodes, lang);
  const [activeSubIdx, setActiveSubIdx] = useState<number>(0);
  const [showAllExpanded, setShowAllExpanded] = useState<boolean>(true);

  return (
    <div className="rounded-2xl bg-[#111B20] border border-[#26353D] p-4 sm:p-5 space-y-3.5 shadow-sm">
      {/* Top Bar: Reading Section Title + Toggle between All 4 Subsections or Tabbed View */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#223139] pb-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${section.colorHex}22`,
              color: section.colorHex,
            }}
          >
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display text-xs font-extrabold text-white tracking-wide uppercase truncate">
              {isEn ? 'Study Readings · 4 Documentary Sub-sections' : 'Lecturas de Estudio · 4 Subsecciones Documentales'}
            </h4>
            <p className="text-[10px] text-neutral-400 truncate">
              {isEn ? 'Small-print analytical reading text for detailed study before answering' : 'Texto de lectura analítica en letra pequeña para estudio detallado antes de responder'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAllExpanded((prev) => !prev)}
          className="px-2.5 py-1 rounded-lg bg-[#0A1114] hover:bg-[#192830] border border-[#26353D] text-[10px] font-mono font-bold text-[#1CB0F6] flex items-center gap-1 cursor-pointer transition-colors shrink-0"
        >
          <Layers className="w-3 h-3" />
          <span>
            {showAllExpanded
              ? (isEn ? 'Tabbed view' : 'Vista por pestañas')
              : (isEn ? 'View all 4 complete readings' : 'Ver las 4 lecturas completas')}
          </span>
          {showAllExpanded ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Selector buttons when in single-tab mode */}
      {!showAllExpanded && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {subSections.map((sub, idx) => {
            const isCurrent = idx === activeSubIdx;
            return (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubIdx(idx)}
                className={`px-2.5 py-1.5 rounded-lg text-left font-mono text-[10px] font-bold transition-colors cursor-pointer border ${
                  isCurrent
                    ? 'bg-[#1CB0F6]/15 border-[#1CB0F6] text-[#1CB0F6]'
                    : 'bg-[#0A1114] border-[#223139] text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="block truncate">{sub.badge}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Reading Content in Small Typography (text-[11px] leading-relaxed) */}
      {showAllExpanded ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subSections.map((sub) => (
            <article
              key={sub.id}
              className="rounded-xl bg-[#0A1114]/90 border border-[#1F2D35] p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="font-mono text-[10px] font-extrabold uppercase tracking-wider"
                  style={{ color: section.colorHex }}
                >
                  {sub.badge}
                </span>
              </div>
              <h5 className="font-display text-xs font-extrabold text-white leading-snug">
                {sub.heading}
              </h5>
              <p className="text-[11px] text-neutral-300 leading-relaxed text-justify">
                {sub.body}
              </p>
              <div className="pt-1 border-t border-[#182329] text-[10px] font-mono text-[#FFC800] flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span className="truncate">{sub.keyNote}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <article className="rounded-xl bg-[#0A1114]/90 border border-[#1F2D35] p-3.5 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span
              className="font-mono text-[10px] font-extrabold uppercase tracking-wider"
              style={{ color: section.colorHex }}
            >
              {subSections[activeSubIdx].badge}
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              {activeSubIdx + 1} / {subSections.length}
            </span>
          </div>
          <h5 className="font-display text-xs font-extrabold text-white leading-snug">
            {subSections[activeSubIdx].heading}
          </h5>
          <p className="text-[11px] text-neutral-300 leading-relaxed text-justify">
            {subSections[activeSubIdx].body}
          </p>
          <div className="pt-1.5 border-t border-[#182329] text-[10px] font-mono text-[#FFC800] flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 shrink-0" />
            <span>{subSections[activeSubIdx].keyNote}</span>
          </div>
        </article>
      )}
    </div>
  );
};

interface LessonReadingContextBoxProps {
  course: RecentCourseId;
  section?: ArithmeticSection;
  node: ArithmeticNode;
  questionIndex: number;
  lang?: 'es' | 'en';
}

/**
 * Small-print reading comprehension passage + instructions + section guide
 * displayed on the left column on PC (and collapsible on mobile) inside active lessons.
 */
export const LessonReadingContextBox: React.FC<LessonReadingContextBoxProps> = ({
  course,
  section,
  node,
  questionIndex,
  lang = 'es',
}) => {
  const isEn = lang === 'en';
  const [expandedMobile, setExpandedMobile] = useState(true);
  const [showAllReadings, setShowAllReadings] = useState(true);

  if (!section) return null;

  const subSections = getSectionReadingSubSections(course, section, [node], lang);
  const primaryIdx = questionIndex % subSections.length;
  const primarySub = subSections[primaryIdx] || subSections[0];
  const secondarySub =
    subSections[(questionIndex + 1) % subSections.length] || subSections[1];

  return (
    <div className="space-y-3.5">
      {/* 1. BLOQUE DE INSTRUCCIONES DE RESOLUCIÓN */}
      <div className="rounded-2xl bg-[#111B20] border border-[#26353D] p-3.5 sm:p-4 space-y-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-display text-[11px] font-extrabold uppercase tracking-wider text-[#58CC02] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{isEn ? 'Lesson Instructions' : 'Instrucciones de la Lección'}</span>
          </span>
          <span className="font-mono text-[10px] text-neutral-400">
            {isEn ? `Module ${section.moduleId ?? 1} · Section ${section.moduleSectionNumber ?? section.id}` : `Módulo ${section.moduleId ?? 1} · Sección ${section.moduleSectionNumber ?? section.id}`}
          </span>
        </div>
        <p className="text-[11px] text-neutral-300 leading-relaxed">
          {isEn ? (
            <>
              1. Carefully read the <strong className="text-white">documentary text</strong> in small print and review the <strong className="text-[#FFC800]">section guide</strong> on this left panel.
              {' '}2. On the right panel (<strong className="text-[#1CB0F6]">Answer</strong>), choose the correct option with keys <strong className="text-white">1–4</strong> / <strong className="text-white">← →</strong> or type your answer and press <strong className="text-[#58CC02]">Enter</strong>.
            </>
          ) : (
            <>
              1. Lee con atención el <strong className="text-white">texto documental</strong> en letra pequeña y consulta la <strong className="text-[#FFC800]">guía de la sección</strong> en este panel izquierdo.
              {' '}2. En el panel derecho (<strong className="text-[#1CB0F6]">Responder</strong>), selecciona la opción correcta con las teclas <strong className="text-white">1–4</strong> / <strong className="text-white">← →</strong> o escribe la respuesta y presiona <strong className="text-[#58CC02]">Enter</strong>.
            </>
          )}
        </p>
      </div>

      {/* 2. BLOQUE DE TEXTO DE LECTURA EN LETRA PEQUEÑA */}
      <div className="rounded-2xl bg-[#111B20] border border-[#26353D] p-3.5 sm:p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#1CB0F6]">
            <FileText className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isEn ? 'Reading Text' : 'Texto de Lectura'} · {node.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAllReadings((prev) => !prev)}
              className="text-[10px] font-mono text-[#1CB0F6] hover:underline cursor-pointer"
            >
              {showAllReadings
                ? (isEn ? 'View focused reading' : 'Ver lectura focalizada')
                : (isEn ? 'View all 4 sub-sections' : 'Ver las 4 subsecciones')}
            </button>
            <button
              type="button"
              onClick={() => setExpandedMobile((prev) => !prev)}
              className="lg:hidden text-[10px] font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <span>{expandedMobile ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Show' : 'Mostrar')}</span>
              {expandedMobile ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
        </div>

        <div className={`${expandedMobile ? 'block' : 'hidden lg:block'} space-y-2.5 pt-1.5 border-t border-[#1F2D35]`}>
          {showAllReadings ? (
            <div className="space-y-2">
              {subSections.map((sub, idx) => {
                const isHighlighted = idx === primaryIdx;
                return (
                  <article
                    key={sub.id}
                    className={`rounded-xl p-3 space-y-1 border transition-colors ${
                      isHighlighted
                        ? 'bg-[#0A1114] border-[#1CB0F6]/50'
                        : 'bg-[#0A1114]/70 border-[#1F2D35]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-mono text-[10px] font-extrabold uppercase tracking-wider"
                        style={{ color: section.colorHex }}
                      >
                        {sub.badge}
                      </span>
                      {isHighlighted && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1CB0F6]/15 text-[#1CB0F6] font-bold">
                          {isEn ? 'Key reading for this question' : 'Lectura clave para esta pregunta'}
                        </span>
                      )}
                    </div>
                    <h4 className="font-display text-xs font-extrabold text-white leading-snug">
                      {sub.heading}
                    </h4>
                    <p className="text-[11px] text-neutral-300 leading-relaxed text-justify">
                      {sub.body}
                    </p>
                    <p className="text-[10px] font-mono text-[#FFC800] pt-0.5">
                      {sub.keyNote}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2 text-[11px] text-neutral-300 leading-relaxed">
              <div className="rounded-xl bg-[#0A1114] border border-[#1CB0F6]/40 p-3 space-y-1">
                <span
                  className="font-mono text-[10px] font-extrabold uppercase tracking-wider block"
                  style={{ color: section.colorHex }}
                >
                  {primarySub.badge}
                </span>
                <p className="text-justify">
                  <strong className="text-white">{primarySub.heading}: </strong>
                  {primarySub.body}
                </p>
              </div>
              {secondarySub && (
                <div className="rounded-xl bg-[#0A1114]/70 border border-[#1F2D35] p-3 space-y-1">
                  <span className="font-mono text-[10px] font-bold text-neutral-400 uppercase block">
                    {secondarySub.badge}
                  </span>
                  <p className="text-[10.5px] text-neutral-400 leading-relaxed text-justify">
                    <strong className="text-neutral-200">{secondarySub.heading}: </strong>
                    {secondarySub.body}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 3. BLOQUE DE GUÍA DE LA SECCIÓN (FÓRMULAS, REGLAS Y EJEMPLOS) */}
      <div className="rounded-2xl bg-[#111B20] border border-[#26353D] overflow-hidden">
        <div
          className="px-4 py-2.5 flex items-center justify-between gap-2 text-white"
          style={{ backgroundColor: section.colorHex }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <BookOpen className="w-4 h-4 shrink-0" />
            <span className="font-display text-xs font-extrabold truncate">
              {isEn ? 'Guide' : 'Guía'} · {section.guideTitle}
            </span>
          </div>
          <span className="font-mono text-[10px] bg-black/25 px-2 py-0.5 rounded shrink-0">
            {isEn ? 'Theoretical Support' : 'Apoyo Teórico'}
          </span>
        </div>

        <div className="p-3.5 sm:p-4 space-y-2.5 divide-y divide-[#1F2D35]">
          {section.guideTips.map((tip, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-2.5 space-y-1' : 'space-y-1'}>
              <p className="font-mono text-[11px] font-extrabold text-[#FFC800]">
                {tip.formula}
              </p>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {tip.rule}
              </p>
              <p className="text-[10.5px] font-mono text-[#58CC02] bg-[#0A1114] px-2.5 py-1.5 rounded-lg leading-relaxed">
                {isEn ? 'Example:' : 'Ejemplo:'} {tip.example}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

