import React from 'react';

export type CourseKey = 'sociales' | 'quimica' | 'fisica' | 'matematicas';

export interface ZoneMascotProps {
  course: CourseKey;
  sectionId: number;
  moduleId: number;
  nodeLocalIndex: number;
  isCurrentNode?: boolean;
  className?: string;
  lang?: 'es' | 'en';
}

/**
 * 1. BÚHO DE MATEMÁTICAS — Pose 1: Saludando (Original)
 */
export function MathOwlWaveSvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="108" rx="28" ry="6" fill="#000000" fillOpacity="0.45" />
      {/* Left waving wing */}
      <path
        d="M22 62C12 50 14 34 24 30C30 28 34 38 34 48L22 62Z"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="3"
      />
      {/* Body */}
      <rect
        x="26"
        y="30"
        width="68"
        height="66"
        rx="30"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="4"
      />
      {/* Belly feather markings */}
      <path
        d="M46 76C49 79 53 79 56 76M64 76C67 79 71 79 74 76M55 84C58 87 62 87 65 84"
        stroke="#78E026"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Right wing */}
      <path
        d="M94 54C104 58 106 74 96 82C90 86 86 78 88 66L94 54Z"
        fill="#46A302"
      />
      {/* Eyes mask */}
      <circle cx="46" cy="52" r="13" fill="#FFFFFF" />
      <circle cx="74" cy="52" r="13" fill="#FFFFFF" />
      {/* Pupils */}
      <circle cx="48" cy="52" r="6.5" fill="#131F24" />
      <circle cx="72" cy="52" r="6.5" fill="#131F24" />
      <circle cx="50" cy="49" r="2.2" fill="#FFFFFF" />
      <circle cx="74" cy="49" r="2.2" fill="#FFFFFF" />
      {/* Beak */}
      <path
        d="M55 58H65L60 66L55 58Z"
        fill="#FFC800"
        stroke="#E59000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Feet */}
      <rect x="42" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      <rect x="66" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      {/* Floating arithmetic symbols */}
      <text x="10" y="24" fill="#FFC800" fontSize="16" fontWeight="bold" fontFamily="monospace">
        +
      </text>
      <text x="96" y="28" fill="#1CB0F6" fontSize="16" fontWeight="bold" fontFamily="monospace">
        ÷
      </text>
    </svg>
  );
}

/**
 * 2. BÚHO DE MATEMÁTICAS — Pose 2: Geómetra con Escuadra y Compás
 */
export function MathOwlGeometrySvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="109" rx="29" ry="6" fill="#000000" fillOpacity="0.45" />
      {/* Body slightly tilted */}
      <rect
        x="26"
        y="31"
        width="66"
        height="65"
        rx="29"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="4"
      />
      {/* Ear tufts */}
      <path d="M34 33L26 22L42 29Z" fill="#58CC02" stroke="#46A302" strokeWidth="2.5" />
      <path d="M84 33L92 22L76 29Z" fill="#58CC02" stroke="#46A302" strokeWidth="2.5" />
      {/* Belly patch */}
      <ellipse cx="59" cy="77" rx="20" ry="13" fill="#78E026" fillOpacity="0.45" />
      {/* Left wing holding cyan geometry set-square (escuadra) */}
      <path
        d="M26 56C15 56 12 68 20 76C26 81 32 74 31 64L26 56Z"
        fill="#46A302"
      />
      {/* Cyan Geometry Triangle (Escuadra) */}
      <path
        d="M8 46L38 76H8V46Z"
        fill="#1CB0F6"
        stroke="#0B84C4"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M14 58L24 68H14V58Z" fill="#0A0E11" />
      {/* Right wing raised holding golden compass */}
      <path
        d="M90 56C102 48 106 34 97 29C91 26 86 36 86 47L90 56Z"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="3"
      />
      {/* Golden Compass */}
      <path d="M100 18L93 38M100 18L109 38" stroke="#FFC800" strokeWidth="3" strokeLinecap="round" />
      <circle cx="100" cy="17" r="3.5" fill="#FF9600" />
      {/* Focused Eyes */}
      <circle cx="46" cy="52" r="12.5" fill="#FFFFFF" />
      <circle cx="72" cy="52" r="12.5" fill="#FFFFFF" />
      <circle cx="47" cy="53" r="6" fill="#131F24" />
      <circle cx="71" cy="53" r="6" fill="#131F24" />
      <circle cx="49" cy="50" r="2" fill="#FFFFFF" />
      <circle cx="73" cy="50" r="2" fill="#FFFFFF" />
      {/* Wise Eyebrows */}
      <path d="M35 40L54 44" stroke="#2E6B00" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M83 40L64 44" stroke="#2E6B00" strokeWidth="3.5" strokeLinecap="round" />
      {/* Beak */}
      <path
        d="M54 58H64L59 66L54 58Z"
        fill="#FFC800"
        stroke="#E59000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Feet */}
      <rect x="42" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      <rect x="65" y="94" width="12" height="7" rx="3.5" fill="#FF9600" />
      {/* Floating Pi symbol */}
      <text x="12" y="26" fill="#CE82FF" fontSize="16" fontWeight="bold" fontFamily="monospace">
        π
      </text>
    </svg>
  );
}

/**
 * 3. BÚHO DE MATEMÁTICAS — Pose 3: Leyendo Libro de Álgebra y Cálculo
 */
export function MathOwlBookSvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="109" rx="28" ry="6" fill="#000000" fillOpacity="0.45" />
      {/* Body */}
      <rect
        x="27"
        y="28"
        width="66"
        height="66"
        rx="29"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="4"
      />
      {/* Eyes */}
      <circle cx="46" cy="49" r="12.5" fill="#FFFFFF" />
      <circle cx="74" cy="49" r="12.5" fill="#FFFFFF" />
      {/* Reading spectacles on the Owl */}
      <circle cx="46" cy="49" r="13.5" stroke="#FFC800" strokeWidth="2.5" />
      <circle cx="74" cy="49" r="13.5" stroke="#FFC800" strokeWidth="2.5" />
      <path d="M59.5 49H60.5" stroke="#FFC800" strokeWidth="3" />
      {/* Pupils looking down at the math book */}
      <circle cx="47" cy="53" r="6" fill="#131F24" />
      <circle cx="73" cy="53" r="6" fill="#131F24" />
      <circle cx="49" cy="51" r="2" fill="#FFFFFF" />
      <circle cx="75" cy="51" r="2" fill="#FFFFFF" />
      {/* Beak */}
      <path d="M55 56H65L60 63L55 56Z" fill="#FFC800" stroke="#E59000" strokeWidth="2" />
      {/* Open Math Book held in front */}
      <path
        d="M28 70L60 76L92 70V92L60 98L28 92V70Z"
        fill="#1CB0F6"
        stroke="#0B84C4"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 67L60 74L88 67V88L60 94L32 88V67Z" fill="#FFFDF7" />
      <path d="M60 74V94" stroke="#CBD5E1" strokeWidth="2" />
      {/* Wing tips holding book sides */}
      <ellipse cx="28" cy="79" rx="6" ry="9" fill="#46A302" />
      <ellipse cx="92" cy="79" rx="6" ry="9" fill="#46A302" />
      {/* Feet */}
      <rect x="42" y="95" width="12" height="7" rx="3.5" fill="#FF9600" />
      <rect x="66" y="95" width="12" height="7" rx="3.5" fill="#FF9600" />
      {/* Floating Integral & Sigma */}
      <text x="12" y="26" fill="#FFC800" fontSize="15" fontWeight="bold" fontFamily="monospace">
        ∑
      </text>
      <text x="96" y="26" fill="#CE82FF" fontSize="16" fontWeight="bold" fontFamily="monospace">
        ∫
      </text>
    </svg>
  );
}

/**
 * 4. BÚHO DE MATEMÁTICAS — Pose 4: Celebrando con Trofeo / Estrella
 */
export function MathOwlCelebrateSvg({ className = 'w-24 h-24' }: { className?: string }) {
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="110" rx="25" ry="5" fill="#000000" fillOpacity="0.4" />
      {/* Both wings raised high cheering */}
      <path
        d="M26 56C12 44 12 26 22 22C28 20 34 30 34 42L26 56Z"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="3"
      />
      <path
        d="M94 56C108 44 108 26 98 22C92 20 86 30 86 42L94 56Z"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="3"
      />
      {/* Body jumping slightly up */}
      <rect
        x="27"
        y="26"
        width="66"
        height="64"
        rx="30"
        fill="#58CC02"
        stroke="#46A302"
        strokeWidth="4"
      />
      {/* Golden Crown / Star on head */}
      <path
        d="M48 26L52 14L60 21L68 14L72 26H48Z"
        fill="#FFC800"
        stroke="#E59000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Eyes mask */}
      <circle cx="46" cy="48" r="12.5" fill="#FFFFFF" />
      <circle cx="74" cy="48" r="12.5" fill="#FFFFFF" />
      {/* Happy cheering arc eyes */}
      <path
        d="M40 49C42 43 50 43 52 49"
        stroke="#131F24"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M68 49C70 43 78 43 80 49"
        stroke="#131F24"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Open cheering beak */}
      <path
        d="M54 54H66L60 65L54 54Z"
        fill="#FF9600"
        stroke="#E59000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Golden Medal on chest */}
      <path d="M52 66L60 76L68 66" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="78" r="7" fill="#FFC800" stroke="#E59000" strokeWidth="2" />
      {/* Feet jumping */}
      <rect x="40" y="89" width="12" height="7" rx="3.5" rx-transform="rotate(-10)" fill="#FF9600" />
      <rect x="68" y="89" width="12" height="7" rx="3.5" fill="#FF9600" />
      {/* Sparkles */}
      <text x="10" y="20" fill="#FFC800" fontSize="15" fontWeight="bold">
        ★
      </text>
      <text x="98" y="20" fill="#58CC02" fontSize="15" fontWeight="bold" fontFamily="monospace">
        ∞
      </text>
    </svg>
  );
}

/**
 * 5. PROFESOR CON GAFAS DE QUÍMICA — Pose 1: Sosteniendo Modelo Molecular
 */
export function ChemProfessorGlassesSvg({
  className = 'w-24 h-24',
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const isPeriodicVariant = variant % 2 === 1;
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="110" rx="28" ry="6" fill="#000000" fillOpacity="0.45" />

      {/* Torso: Academic Sweater Vest + Shirt + Tie */}
      <rect
        x="32"
        y="62"
        width="56"
        height="40"
        rx="16"
        fill="#1CB0F6"
        stroke="#0B84C4"
        strokeWidth="3.5"
      />
      {/* White Shirt V-neck */}
      <path d="M48 62H72L60 78L48 62Z" fill="#FFFFFF" />
      {/* Red Chemistry Tie */}
      <path d="M57 64H63L64 84L60 89L56 84L57 64Z" fill="#FF4B4B" />

      {/* Head */}
      <rect
        x="34"
        y="24"
        width="52"
        height="44"
        rx="20"
        fill="#FDBA74"
        stroke="#EA580C"
        strokeWidth="2.5"
      />

      {/* Professor Hair (Neat Brown/Silver with side temples) */}
      <path
        d="M32 38C32 22 44 16 60 16C76 16 88 22 88 38C84 30 76 26 60 26C44 26 36 30 32 38Z"
        fill="#475569"
      />
      <rect x="31" y="34" width="6" height="12" rx="3" fill="#94A3B8" />
      <rect x="83" y="34" width="6" height="12" rx="3" fill="#94A3B8" />

      {/* Prominent Professor Glasses (Gafas icónicas) */}
      <rect
        x="37"
        y="37"
        width="20"
        height="15"
        rx="5"
        fill="#E0F2FE"
        fillOpacity="0.85"
        stroke="#0F172A"
        strokeWidth="3.5"
      />
      <rect
        x="63"
        y="37"
        width="20"
        height="15"
        rx="5"
        fill="#E0F2FE"
        fillOpacity="0.85"
        stroke="#0F172A"
        strokeWidth="3.5"
      />
      {/* Glasses Bridge & Side Arms */}
      <path d="M57 44H63" stroke="#0F172A" strokeWidth="3.5" />
      <path d="M33 43H37M83 43H87" stroke="#0F172A" strokeWidth="3" />

      {/* Eyes behind glasses */}
      <circle cx="47" cy="44.5" r="3.2" fill="#0F172A" />
      <circle cx="73" cy="44.5" r="3.2" fill="#0F172A" />
      <circle cx="48" cy="43.5" r="1.2" fill="#FFFFFF" />
      <circle cx="74" cy="43.5" r="1.2" fill="#FFFFFF" />

      {/* Friendly Mustache & Smile */}
      <path
        d="M49 57C53 54 67 54 71 57"
        stroke="#475569"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M54 60C57 63 63 63 66 60"
        stroke="#7C2D12"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {isPeriodicVariant ? (
        /* Pose B: Holding Periodic Table Clipboard (Au / H2O) */
        <g>
          <rect
            x="10"
            y="58"
            width="26"
            height="32"
            rx="4"
            fill="#FFC800"
            stroke="#D9A300"
            strokeWidth="2.5"
          />
          <rect x="14" y="64" width="18" height="22" rx="2" fill="#0A0E11" />
          <text
            x="16"
            y="78"
            fill="#58CC02"
            fontSize="10"
            fontWeight="bold"
            fontFamily="monospace"
          >
            Au
          </text>
          <circle cx="101" cy="52" r="11" fill="#202F36" stroke="#00CD9C" strokeWidth="2.5" />
          <text
            x="94"
            y="56"
            fill="#00CD9C"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            ΔH
          </text>
        </g>
      ) : (
        /* Pose A: Holding 3D Molecule Atom Model */
        <g>
          <line x1="94" y1="54" x2="108" y2="42" stroke="#94A3B8" strokeWidth="2.5" />
          <line x1="94" y1="54" x2="108" y2="66" stroke="#94A3B8" strokeWidth="2.5" />
          <circle cx="94" cy="54" r="7" fill="#FF4B4B" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="108" cy="42" r="5" fill="#1CB0F6" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="108" cy="66" r="5" fill="#58CC02" stroke="#FFFFFF" strokeWidth="1.5" />
          <text
            x="8"
            y="30"
            fill="#00CD9C"
            fontSize="12"
            fontWeight="bold"
            fontFamily="monospace"
          >
            H₂O
          </text>
        </g>
      )}

      {/* Shoes */}
      <rect x="41" y="100" width="14" height="7" rx="3.5" fill="#334155" />
      <rect x="65" y="100" width="14" height="7" rx="3.5" fill="#334155" />
    </svg>
  );
}

/**
 * 6. CIENTÍFICO LOCO CON BATA PARA QUÍMICA — Bata blanca, pelo electrizado y matraz burbujeante
 */
export function MadScientistCoatSvg({
  className = 'w-24 h-24',
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const isPurpleReaction = variant % 2 === 1;
  const potionColor = isPurpleReaction ? '#CE82FF' : '#58CC02';
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="110" rx="29" ry="6" fill="#000000" fillOpacity="0.45" />

      {/* Wild Spiky Mad Scientist Hair (Behind Head) */}
      <path
        d="M22 44L10 34L24 26L16 14L36 20L44 8L58 18L72 6L80 20L98 12L92 26L108 32L96 44Z"
        fill="#E2E8F0"
        stroke="#94A3B8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* White Lab Coat (Bata Blanca de Laboratorio) */}
      <path
        d="M28 62C28 58 34 56 42 56H78C86 56 92 58 92 62L96 102H24L28 62Z"
        fill="#F8FAFC"
        stroke="#CBD5E1"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Dark inner shirt + radioactive green tie/badge */}
      <path d="M50 58H70L60 80L50 58Z" fill="#0F172A" />
      <circle cx="60" cy="68" r="3.5" fill={potionColor} />
      {/* White Lab Coat Lapels (Solapas de la bata) */}
      <path
        d="M44 58L56 80L44 84L38 66Z"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      <path
        d="M76 58L64 80L76 84L82 66Z"
        fill="#FFFFFF"
        stroke="#94A3B8"
        strokeWidth="2"
      />
      {/* Lab Coat Pocket with Pens */}
      <rect x="70" y="82" width="12" height="11" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="73" y1="78" x2="73" y2="82" stroke="#1CB0F6" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="77" y1="77" x2="77" y2="82" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Head */}
      <rect
        x="35"
        y="24"
        width="50"
        height="40"
        rx="18"
        fill="#FDE68A"
        stroke="#D97706"
        strokeWidth="2.2"
      />

      {/* Mad Scientist Lab Goggles (Gafas de laboratorio redondas) */}
      <circle
        cx="47"
        cy="42"
        r="10.5"
        fill="#00CD9C"
        fillOpacity="0.28"
        stroke="#334155"
        strokeWidth="3.5"
      />
      <circle
        cx="73"
        cy="42"
        r="10.5"
        fill="#00CD9C"
        fillOpacity="0.28"
        stroke="#334155"
        strokeWidth="3.5"
      />
      <path d="M57.5 42H62.5" stroke="#334155" strokeWidth="3.5" />
      {/* Asymmetric Mad Scientist Pupils */}
      <circle cx="47" cy="42" r="4.5" fill="#0F172A" />
      <circle cx="73" cy="42" r="3" fill="#0F172A" />
      <circle cx="48.5" cy="40.5" r="1.5" fill="#FFFFFF" />
      <circle cx="74" cy="41" r="1.2" fill="#FFFFFF" />

      {/* Excited Eureka Grin */}
      <path
        d="M48 54C52 60 68 60 72 54Z"
        fill="#FFFFFF"
        stroke="#0F172A"
        strokeWidth="2"
      />

      {/* Bubbling Erlenmeyer Flask held in hand */}
      <path
        d="M95 50H103V60L113 80C114 82 112 85 109 85H89C86 85 84 82 85 80L95 60V50Z"
        fill="#E0F2FE"
        fillOpacity="0.7"
        stroke="#38BDF8"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* Glowing Chemical Liquid Inside Flask */}
      <path
        d="M91 69H107L111 79C112 81 110 83 108 83H90C88 83 86 81 87 79L91 69Z"
        fill={potionColor}
      />
      {/* Rising Chemical Bubbles */}
      <circle cx="99" cy="43" r="3.5" fill={potionColor} />
      <circle cx="106" cy="35" r="2.5" fill={potionColor} />
      <circle cx="95" cy="30" r="2" fill="#FFC800" />

      {/* Dark Lab Boots */}
      <rect x="39" y="101" width="14" height="7" rx="3.5" fill="#1E293B" />
      <rect x="67" y="101" width="14" height="7" rx="3.5" fill="#1E293B" />
    </svg>
  );
}

/**
 * 7. ALUMNO GRADUADO CON SU SOMBRERO DE GRADUACIÓN DE SOCIALES
 *    Birrete académico con borla dorada, toga y diploma / libro de historia
 */
export function SocialesGraduateSvg({
  className = 'w-24 h-24',
  variant = 0,
}: {
  className?: string;
  variant?: number;
}) {
  const pose = variant % 3;
  return (
    <svg
      className={`${className} drop-shadow-lg select-none`}
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
    >
      <ellipse cx="60" cy="110" rx="28" ry="6" fill="#000000" fillOpacity="0.45" />

      {/* Academic Graduation Gown (Toga de Graduación) */}
      <path
        d="M30 64C30 58 38 56 60 56C82 56 90 58 90 64L94 102H26L30 64Z"
        fill="#1E293B"
        stroke="#0F172A"
        strokeWidth="3"
      />
      {/* Golden & Purple Honor Stole (Estola de Graduado) */}
      <path
        d="M46 57L60 82L74 57"
        stroke="#FFC800"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M46 57L60 82L74 57"
        stroke="#CE82FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head */}
      <rect
        x="36"
        y="28"
        width="48"
        height="38"
        rx="18"
        fill="#FDBA74"
        stroke="#D97706"
        strokeWidth="2.2"
      />

      {/* Eyes & Proud Graduate Smile */}
      <circle cx="48" cy="46" r="3.8" fill="#0F172A" />
      <circle cx="72" cy="46" r="3.8" fill="#0F172A" />
      <circle cx="49.2" cy="44.8" r="1.4" fill="#FFFFFF" />
      <circle cx="73.2" cy="44.8" r="1.4" fill="#FFFFFF" />
      <path
        d="M52 55C55 59 65 59 68 55"
        stroke="#7C2D12"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* SOMBRERO DE GRADUACIÓN (Mortarboard / Birrete Académico) */}
      {/* Skullcap base */}
      <path
        d="M36 31C36 24 46 21 60 21C74 21 84 24 84 31H36Z"
        fill="#1E293B"
        stroke="#0F172A"
        strokeWidth="2.5"
      />
      {/* Diamond Mortarboard Top */}
      <polygon
        points="60,8 102,20 60,32 18,20"
        fill="#0F172A"
        stroke="#334155"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Golden Center Button & Hanging Tassel (Borla Dorada) */}
      <circle cx="60" cy="20" r="3.5" fill="#FFC800" />
      <path
        d="M60 20L88 25V39"
        stroke="#FFC800"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="88" cy="40" r="3" fill="#FFC800" />

      {pose === 0 && (
        /* Pose 1: Holding Rolled Diploma with Red Ribbon */
        <g>
          <rect
            x="86"
            y="58"
            width="26"
            height="10"
            rx="5"
            transform="rotate(-28 86 58)"
            fill="#FFFBEB"
            stroke="#D97706"
            strokeWidth="2"
          />
          <rect
            x="96"
            y="52"
            width="5"
            height="10"
            transform="rotate(-28 96 52)"
            fill="#FF4B4B"
          />
          <text x="12" y="42" fill="#FFC800" fontSize="14" fontWeight="bold">
            ★
          </text>
        </g>
      )}

      {pose === 1 && (
        /* Pose 2: Holding Globe / Territory Map */
        <g>
          <circle
            cx="98"
            cy="68"
            r="12"
            fill="#1CB0F6"
            stroke="#0B84C4"
            strokeWidth="2.5"
          />
          <path
            d="M92 62C95 60 100 63 99 68C98 72 93 74 91 70Z"
            fill="#58CC02"
          />
          <path
            d="M101 64C104 65 106 70 103 74"
            stroke="#58CC02"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      )}

      {pose === 2 && (
        /* Pose 3: Holding History & Peace Book + Diploma Scroll */
        <g>
          <rect
            x="10"
            y="60"
            width="22"
            height="26"
            rx="3"
            fill="#CE82FF"
            stroke="#A552E6"
            strokeWidth="2.2"
          />
          <line x1="15" y1="67" x2="27" y2="67" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="15" y1="73" x2="25" y2="73" stroke="#FFFFFF" strokeWidth="2" />
          <text x="95" y="44" fill="#FFC800" fontSize="14" fontWeight="bold">
            ★
          </text>
        </g>
      )}

      {/* Shoes */}
      <rect x="41" y="101" width="14" height="7" rx="3.5" fill="#0F172A" />
      <rect x="65" y="101" width="14" height="7" rx="3.5" fill="#0F172A" />
    </svg>
  );
}

/**
 * Dispatcher component that selects the right character & pose for a given course and zone/section
 */
export function ZoneCharacterMascot({
  course,
  sectionId,
  moduleId,
  nodeLocalIndex,
  className = 'w-24 h-24 sm:w-28 sm:h-28',
  lang = 'es',
}: ZoneMascotProps) {
  const isEn = lang === 'en';
  const zoneKey = sectionId + nodeLocalIndex + moduleId;

  if (course === 'matematicas') {
    const poseIndex = (sectionId + (nodeLocalIndex > 1 ? 2 : 0)) % 4;
    const labels = isEn
      ? [
          'Owl · Mental Math',
          'Owl · Geometry',
          'Owl · Algebra',
          'Owl · Champion',
        ]
      : [
          'Búho · Cálculo Mental',
          'Búho · Geometría',
          'Búho · Álgebra',
          'Búho · Campeón',
        ];
    return (
      <div className="flex flex-col items-center group">
        {poseIndex === 0 && <MathOwlWaveSvg className={className} />}
        {poseIndex === 1 && <MathOwlGeometrySvg className={className} />}
        {poseIndex === 2 && <MathOwlBookSvg className={className} />}
        {poseIndex === 3 && <MathOwlCelebrateSvg className={className} />}
        <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#58CC02] whitespace-nowrap shadow-sm">
          {labels[poseIndex]}
        </span>
      </div>
    );
  }

  if (course === 'quimica') {
    // Alternates across zones between the Chemistry Professor with glasses and the Mad Scientist in white lab coat
    const isMadScientist = (sectionId + (nodeLocalIndex > 1 ? 1 : 0)) % 2 === 1;
    return (
      <div className="flex flex-col items-center group">
        {isMadScientist ? (
          <>
            <MadScientistCoatSvg className={className} variant={zoneKey} />
            <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#CE82FF] whitespace-nowrap shadow-sm">
              {isEn ? 'Mad Scientist' : 'Científico Loco'}
            </span>
          </>
        ) : (
          <>
            <ChemProfessorGlassesSvg className={className} variant={zoneKey} />
            <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#00CD9C] whitespace-nowrap shadow-sm">
              {isEn ? 'Chem. Professor' : 'Prof. de Química'}
            </span>
          </>
        )}
      </div>
    );
  }

  if (course === 'sociales') {
    const poseVariant = sectionId + (nodeLocalIndex > 1 ? 1 : 0);
    const labels = isEn
      ? [
          'Graduate · Diploma',
          'Graduate · Territory',
          'Graduate · Memory',
        ]
      : [
          'Graduado · Diploma',
          'Graduado · Territorio',
          'Graduado · Memoria',
        ];
    return (
      <div className="flex flex-col items-center group">
        <SocialesGraduateSvg className={className} variant={poseVariant} />
        <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#FFC800] whitespace-nowrap shadow-sm">
          {labels[poseVariant % 3]}
        </span>
      </div>
    );
  }

  // Course === 'fisica': Mix of Owl poses, Mad Scientist & Professor across Physics zones
  const physicsRole = (sectionId + (nodeLocalIndex > 1 ? 1 : 0)) % 3;
  return (
    <div className="flex flex-col items-center group">
      {physicsRole === 0 && (
        <>
          <MathOwlGeometrySvg className={className} />
          <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#FF9600] whitespace-nowrap shadow-sm">
            {isEn ? 'Owl · Mechanics' : 'Búho · Mecánica'}
          </span>
        </>
      )}
      {physicsRole === 1 && (
        <>
          <MadScientistCoatSvg className={className} variant={zoneKey} />
          <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#1CB0F6] whitespace-nowrap shadow-sm">
            {isEn ? 'Energy Lab' : 'Lab. de Energía'}
          </span>
        </>
      )}
      {physicsRole === 2 && (
        <>
          <ChemProfessorGlassesSvg className={className} variant={zoneKey} />
          <span className="mt-0.5 px-2 py-0.5 rounded-md bg-[#131F24]/90 border border-[#26353D] text-[10px] font-mono font-bold text-[#58CC02] whitespace-nowrap shadow-sm">
            {isEn ? 'Physics Prof.' : 'Prof. de Física'}
          </span>
        </>
      )}
    </div>
  );
}
