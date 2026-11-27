# Handoff: SOLFIT — App de la alumna + Panel de la entrenadora

## Overview
SOLFIT es un gimnasio de entrenamiento personalizado. El diseño cubre dos productos que comparten datos:

- **App de la alumna** (móvil, 390 × 844): rutina del día, armado del mes, agua, respiración, nutrición con macros, progreso / evaluaciones, cursos, chat con la entrenadora y perfil.
- **Panel de Sol** (escritorio / tablet): alumnos y fichas, constructor de rutinas del mes, evaluación (Omron), calculadora de macros, mensajes, asistencia y planes.

Todo el texto de la interfaz está en español (Chile).

## About the Design Files
Los archivos de este paquete son **referencias de diseño hechas en HTML**: prototipos que muestran el aspecto y el comportamiento esperados, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno del código de destino** (React Native, SwiftUI, Flutter, React, etc.) usando sus patrones y librerías. Si aún no existe un entorno, elegir el framework más adecuado (la app es móvil; el panel es web) e implementarlos ahí.

Los prototipos usan un runtime propio (`support.js`, archivos `.dc.html`): plantilla con huecos `{{ }}` + una clase `Component` con `renderVals()`. Para entender la lógica, leer la clase `Component` al final de cada archivo; para medidas y colores, leer los estilos en línea de la plantilla. No portar ese runtime.

## Fidelity
**Alta fidelidad.** Colores, tipografía, espaciados, radios, animaciones e interacciones son finales. Recrear la UI con precisión.

## Cómo abrirlos
Servir la carpeta con cualquier servidor estático y abrir `SOLFIT App v2.dc.html` y `SOLFIT Panel.dc.html` en el mismo origen (comparten `localStorage`).

## Screens / Views

### App de la alumna (`SOLFIT App v2.dc.html`)
- **Login** y **Consentimientos** (datos de salud, fotos) en el primer ingreso.
- **Isla superior** (fija, tarjeta con esquinas inferiores de 34 px): 4 páginas deslizables — Calendario, Agua, Respiración, Nutrición. Una barrita central (44 × 5 px) la abre y cierra; al deslizar, la página saliente y la entrante se desenfocan (blur 12 px, opacidad 0,35, 0,45 s) y un destello cruza la barrita en el sentido del gesto (0,75 s). La barrita parpadea en el color de acento cuando el mes está listo para armar.
  - *Calendario*: mes con rutinas agendadas; "Arma tu mes" arrastrando las rutinas de Sol a los días; columna de racha.
  - *Agua*: meta en ml (de los macros o 2.000), tomas de 150 / 250 / 350 / 500 ml.
  - *Respiración*: Inhala 4 s · Sostén 4 s · Exhala 6 s, 4 ciclos, halo animado.
  - *Nutrición*: kcal y gramos de proteína / grasa / carbohidratos consumidos vs meta; un botón por comida.
- **Hoja "Registrar comida"** (sube desde abajo): por macro, cápsulas Poco (0,5) · Normal (1) · Mucho (1,5) · Manual (campo de gramos); kcal de la comida; foto opcional; Guardar / Quitar.
- **Inicio**: portada con la rutina de hoy y control deslizante para empezar; dashboard "Tu resumen" (medidor circular de entrenamientos del mes; Agua, Nutrición, Racha; gráfico "Tu semana" por día; Evaluación y mensajes de Sol); carrusel "Esta semana".
- **Rutina**: día seleccionado, plan de ejercicios, pantalla de ejercicio (series con peso / reps, descanso con temporizador, comentario para Sol), cierre con carita y nota. Una rutina completada no se puede repetir; una futura está bloqueada.
- **Progreso**, **Cursos**, **Chat**, **Perfil**.

### Panel de Sol (`SOLFIT Panel.dc.html`)
- **Inicio**: agenda, estadísticas, avisos de mensajes.
- **Alumnos**: lista con buscador en el menú lateral; ficha con bloques desplegables y "Rutinas del mes" (constructor: frecuencia × 4 rutinas, biblioteca de ejercicios, calendario, "Enviado a …").
- **Nuevo alumno** (2 pasos).
- **Mensajes**: chat por alumno, respuesta sobre un ejercicio específico.
- **Evaluación** (5 pasos; el 5.º clasifica según tablas Omron).
- **Macros**: calculadora por alumno y botón "Enviar a …".
- **Asistencia** y **Planes**.

## Interactions & Behavior
El detalle de reglas de negocio, fórmulas y estados está en **`NOTAS_PROYECTO.md`** (leerlo completo). Puntos clave:

- **Frecuencia**: 1, 2 (por defecto) o 3 veces por semana → 4, 8 o 12 rutinas al mes.
- **Macros**: calorías = peso × kcal por kg; gramos = kcal del macro ÷ 4 (proteína) / 9 (grasa) / 4 (carbohidratos); agua = peso × 35 ml redondeado a 250. 8 planes predefinidos.
- **Registro de comidas**: cada comida guarda un factor por macro sobre su porción (meta ÷ n comidas).
- **Comentarios y chat**: el comentario de un ejercicio y el cierre de rutina se envían al chat; el envío está protegido contra doble toque.
- Curva de animación habitual: `cubic-bezier(0.32, 0.72, 0, 1)`, 0,42–0,45 s. Respetar "reducir movimiento".

## State Management
En el prototipo, App y Panel se sincronizan con una sola clave de `localStorage`, **`solfit_sync`** (Camila Rojas es un personaje inventado y la única alumna conectada entre App y Panel; el resto son datos de ejemplo de `demo()` en el Panel. Ningún nombre ni dato de salud del prototipo es de una persona real). En producción esto debe ser un backend con cuentas reales. Campos del objeto:

- `frec`, `rutinasMes`, `plan` {día: índice}, `hechas` {índice: {dia, falt, tot, no}}
- `macros` {kcal, p, g, c, n, agua}, `comidasHoy` [{p, g, c, foto?, man?} | null]
- `chat` [{de: 'a'|'s', txt, h, ej?, fin?, cara?, re?}], `chatVA`, `chatVS`
- `notas`, `proxEval`, `clasesQuedan`

## Design Tokens
**Tipografía**: Oswald (títulos y números, 500–600) y Montserrat (todo lo demás, 400–700). Iconos: Material Symbols Rounded. Texto base 16 px; mínimo 13–14 px.

**App — paleta Celeste (por defecto)**
- Acento `#62C6CB`; texto sobre acento `#06181D`
- Oscuro: fondo `#0B1A1F`, fondo 2 `#07141A`, tarjeta `#11262D`, línea `#1C363E`, línea 2 `#2F515B`, texto `#EEF6F7`, texto secundario `#8FAEB5`, celeste claro `#9FD6D8`
- Claro: fondo `#EEF6F7`, tarjeta `#FFFFFF`, línea `#D9E8EA`, texto `#0F2F38`, secundario `#4A6A72`, acento de texto `#0F7C85`
- Contraste: ámbar `#F5B94A` (grasa, nutrición, agendado), coral `#F27D72` (carbohidratos, racha), azul `#5AA9F2` (agua); en claro `#A86A00`, `#C4473A`, `#1E78C8`

**App — paleta Naranjo (alternativa) y Panel**
- Acento `#F39200`; texto sobre acento `#10140F`
- Oscuro: fondo `#0E1311`, tarjeta `#161D1A`, línea `#232D28`, texto `#F2F5F0`, secundario `#8FA39A`, salvia `#A9CDA7`
- Claro: fondo `#F7F3EA`, tarjeta `#FFFFFF`, línea `#E4DDCC`, texto `#1C3A32`, verde `#25574A`

Los valores exactos por tema están en las reglas `body{…}`, `body.claro{…}` y `body.naranjo{…}` al inicio de cada archivo.

**Radios**: tarjetas 24–30 px; isla y hojas 34 px; botones y cápsulas 999 px; campos 18 px.
**Objetivos táctiles**: mínimo 44 px; botones principales 56–60 px.
**Sombras**: isla `0 10px 24px rgba(0,0,0,0.22)`; hojas `0 -10px 40px rgba(0,0,0,0.3)`.

## Assets
- `assets/logo-solfit.jpg`: logo del gimnasio.
- `assets/fotos/*`: fotos de ejercicios usadas como referencia; **confirmar derechos de uso o reemplazarlas** antes de publicar.
- Iconos: Material Symbols Rounded (Google Fonts).

## Files
- `SOLFIT App v2.dc.html` — app de la alumna
- `SOLFIT Panel.dc.html` — panel de la entrenadora
- `NOTAS_PROYECTO.md` — reglas de negocio, estado de cada función y pendientes
- `support.js`, `ios-frame.jsx`, `image-slot.js` — solo para que los prototipos abran; no portar
- `assets/` — logo y fotos

## Pendientes conocidos
Listados en `NOTAS_PROYECTO.md` (buscar "Pendiente"): límite semanal al agendar según la frecuencia, comidas y fotos de la alumna en el Panel, comidas frecuentes y racha de registro, plantilla de comidas, macros en la ficha, aviso de comentario nuevo. La racha con rutinas de Sol aún no se calcula (muestra 0).
