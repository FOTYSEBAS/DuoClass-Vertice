# Rediseño Espacial y Simplificación Visual del Árbol de Matemáticas

Este plan reorganiza la pestaña **Aprender** y los paneles laterales para eliminar la saturación visual, dando protagonismo al árbol de nodos al mostrar un único módulo activo a la vez, integrar acciones secundarias en cabeceras limpias y reubicar el gráfico comparativo **Resumen de Módulos** al panel derecho (con acceso colapsable en móvil).

## Decisiones Confirmadas con el Usuario

> [!IMPORTANT]
> Las siguientes decisiones fueron confirmadas directamente por el usuario y guían la reestructuración visual:

- **Ubicación de «Resumen de Módulos»**: Se traslada al **panel lateral derecho en escritorio** y se ofrece como un **panel colapsable compacto** en la parte superior para pantallas móviles/tablets, despejando el inicio del árbol de aprendizaje.
- **Organización de las 20 Secciones**: Se muestra **un único módulo activo a la vez** (`Módulo 1`, `Módulo 2` o `Módulo 3`), seleccionando automáticamente el módulo donde se encuentra el progreso actual del estudiante.
- **Simplificación Visual y Espaciado**: Mayor aire vertical entre secciones y entre los nodos de la curva en S, cabeceras de sección limpias sin exceso de etiquetas y fusión del aviso de «Examen de salto» dentro de la propia cabecera de cada sección bloqueada.

---

## 1. Visión General y Concepto Central

- **Qué hace**: Transforma una vista vertical sobrecargada de 20 secciones y múltiples tarjetas apiladas en una experiencia enfocada estilo Duolingo donde cada módulo respira con claridad, los nodos tienen mayor separación táctil y las métricas (Meta diaria y Resumen de Módulos) acompañan desde el panel lateral sin estorbar el camino de estudio.
- **Audiencia y Contexto**: Estudiantes de matemáticas en PC y móvil que navegan tanto con ratón/táctil como exclusivamente con teclado.
- **Valor Principal**: Elimina la fatiga visual al reducir más del 65% de los elementos simultáneos en pantalla, manteniendo intactas las 20 secciones, los 79 nodos, los exámenes de salto y el gráfico comparativo de Recharts.

---

## 2. Experiencia de Usuario y Diseño Visual

### Flujos Principales
1. **Selector de Módulo Enfocado (1 Módulo a la vez)**:
   - Al entrar en **Aprender**, el usuario ve un selector limpio de 3 pestañas (**Módulo 1 · Fundamentos**, **Módulo 2 · Funciones y Geometría**, **Módulo 3 · Cálculo y EDOs**).
   - Solo se renderizan las secciones del módulo seleccionado (6 o 7 secciones en lugar de las 20 juntas). Presionar la tecla `M` alterna cíclicamente entre el Módulo 1, 2 y 3.
2. **Cabeceras de Sección Limpias con Salto Integrado**:
   - Se elimina la caja punteada adicional que aparecía debajo de cada cabecera bloqueada.
   - Ahora cada cabecera de sección muestra una sola línea de identificación (`Sección X`), el título principal, una descripción breve y, a la derecha, los botones de **Guía** y **Saltar aquí** (cuando la sección está bloqueada) integrados limpiamente en la misma franja.
3. **Más Aire en el Árbol de Nodos**:
   - Se amplía la separación vertical entre secciones (`64px`) y entre cada nodo circular (`40px`), con conectores visuales sutiles para que el recorrido en S y la mascota tengan espacio libre alrededor.
4. **Tarjeta «Resumen de Módulos» (Recharts) Reubicada y Estilizada**:
   - En **escritorio (`xl+`)**, la tarjeta **Resumen de Módulos** vive en la barra lateral derecha junto a **Meta diaria**, reemplazando la lista larga de 19 botones de salto que saturaba esa columna.
   - En **móvil y tablet**, un botón compacto en la barra superior del módulo permite desplegar u ocultar bajo demanda las tarjetas de **Resumen de Módulos** y **Meta diaria**.

### Identidad Visual y Tema
- **Dirección Estética**: Modo oscuro gamificado de alto contraste, limpio y espacioso, manteniendo el inicio de sesión en negro puro (`#000000`) y el entorno de estudio en pizarra nocturna (`#0A0E11`).
- **Paleta de Colores (Regla 60-30-10)**:
  - **60% Lienzo Dominante**: Fondo principal `#0A0E11` con amplios márgenes laterales.
  - **30% Superficies Estructurales**: Tarjetas `#131F24` con bordes `#26353D` y texto secundario `#9CA3AF`.
  - **10% Acentos Semánticos**: Verde activo `#58CC02`, Oro completado `#FFC800`, Azul Módulo 1 `#1CB0F6`, Violeta Módulo 2 `#CE82FF` y Naranja Módulo 3 `#FF9600`.
- **Tipografía y Jerarquía**: Títulos limpios sin prefijos repetitivos, números tabulares (`tabular-nums`) para contadores de XP y controles de una sola línea (`whitespace-nowrap`).

---

## 3. Decisiones de Producto y Compromisos (Trade-Offs)

- **Decisión 1: Mostrar un módulo activo a la vez en lugar de la opción «Todos»**
  - *Enfoque elegido*: El estado del filtro de módulo pasa a ser estrictamente `1 | 2 | 3`, inicializado dinámicamente según el `currentNodeIndex` del usuario.
  - *Por qué*: Renderizar 79 nodos y 20 cabeceras simultáneamente generaba un scroll excesivo y sensación de saturación. Dividirlo en 3 capítulos claros permite concentrarse en las 6–7 secciones del módulo actual.
- **Decisión 2: Integrar el botón de «Examen de Salto» dentro de la cabecera de sección y limpiar el panel derecho**
  - *Enfoque elegido*: Fusionar el botón de salto dentro de la cabecera de cada sección bloqueada y retirar la lista de 19 botones del panel lateral derecho.
  - *Por qué*: Antes había duplicación de avisos de examen tanto entre secciones como en la barra derecha. Integrarlo en la cabecera ahorra más de 120px verticales por cada sección bloqueada y deja espacio limpio en el panel derecho para el gráfico Recharts de **Resumen de Módulos**.

---

## 4. Arquitectura Técnica y Estrategia de Datos

### Diagrama de Arquitectura y Disposición Espacial

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        SHELL PRINCIPAL (MODO OSCURO)                         │
├──────────────────┬───────────────────────────────────┬───────────────────────┤
│  SIDEBAR IZQ.    │      COLUMNA CENTRAL (ÁRBOL)      │   SIDEBAR DERECHO     │
│  (Navegación)    │      (Amplia y Despejada)         │   (Métricas y XP)     │
│                  │                                   │                       │
│  [1] Aprender    │  ┌─────────────────────────────┐  │  ┌─────────────────┐  │
│  [2] Práctica    │  │ Selector: Mód 1 | Mód 2 | 3 │  │  │  Meta Diaria    │  │
│  [3] Guía        │  └─────────────────────────────┘  │  │  (Anillo SVG)   │  │
│  [4] Logros      │  ┌─────────────────────────────┐  │  └─────────────────┘  │
│  [5] Perfil      │  │ Acordeón Móvil (Opcional):  │  │  ┌─────────────────┐  │
│                  │  │ Ver Progreso y Módulos (XP) │  │  │ Resumen Módulos │  │
│  Atajos Teclado  │  └─────────────────────────────┘  │  │ (Recharts Bar)  │  │
│  compactos       │                                   │  └─────────────────┘  │
│                  │  ┌─────────────────────────────┐  │  ┌─────────────────┐  │
│                  │  │ Cabecera Limpia Sección N   │  │  │ Siguiente Nivel │  │
│                  │  │ [Título]  [Saltar] [Guía]   │  │  │ (Acceso Rápido) │  │
│                  │  └─────────────────────────────┘  │  └─────────────────┘  │
│                  │                 │                 │                       │
│                  │           (Espacio 40px)          │                       │
│                  │                 ▼                 │                       │
│                  │            ( Nodo 1 )             │                       │
│                  │                 │                 │                       │
│                  │           (Espacio 40px)          │                       │
│                  │                 ▼                 │                       │
│                  │               ( Nodo 2 )          │                       │
└──────────────────┴───────────────────────────────────┴───────────────────────┘
```

### Mapeo de Estado e Interacciones
- **`selectedModuleFilter` (`1 | 2 | 3`)**:
  - Se sincroniza automáticamente con el módulo donde se ubica `progress.currentNodeIndex` al cargar los datos de Firestore, y cambia manualmente al hacer clic en las 3 pestañas superiores, al hacer clic en una barra del gráfico **Resumen de Módulos**, o al pulsar la tecla `M`.
- **`showMobileStats` (`boolean`)**:
  - Controla la apertura/cierre del panel desplegable de estadísticas (**Meta diaria** + **Resumen de Módulos**) en pantallas móviles/tablets (`< xl`) para que permanezca recogido por defecto y no empuje el árbol hacia abajo.
- **Acción de Examen de Salto (`startSkipExam`)**:
  - Accesible directamente desde el botón compacto **Saltar** integrado en la cabecera de cualquier sección bloqueada, desde el popover de un nodo bloqueado, o presionando la tecla `S`.
